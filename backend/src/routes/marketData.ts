import { Router } from 'express'
import { pool } from '../db/pool.js'
import { fetchCvmFiiYields } from '../db/cvmFii.js'

export const marketDataRouter = Router()

const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function dateTag(): string {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${MONTHS_PT[d.getMonth()]}/${d.getFullYear()}`
}

function formatBRL(value: number): string {
  return value.toFixed(2).replace('.', ',')
}

async function fetchBcbSeries(code: number): Promise<number> {
  const res = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados/ultimos/1?formato=json`)
  if (!res.ok) throw new Error(`BCB série ${code} respondeu ${res.status}`)
  const [row] = (await res.json()) as { data: string; valor: string }[]
  if (!row) throw new Error(`BCB série ${code} sem dados`)
  return Number(row.valor)
}

function formatBcbDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

// CDI acumulado nos últimos 12 meses — composto a partir dos ~252 pregões
// diários reais (não extrapolado a partir do print de um único dia, que fica
// bem abaixo do acumulado real num ciclo de corte de juros, já que ignora
// que a Selic estava mais alta há alguns meses). É essa a taxa que
// corretoras/bancos e o próprio mercado chamam de "a taxa do CDI".
async function fetchCdiAccumulated12m(): Promise<number> {
  const end = new Date()
  const start = new Date(end)
  start.setFullYear(start.getFullYear() - 1)
  const res = await fetch(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados?dataInicial=${formatBcbDate(start)}&dataFinal=${formatBcbDate(end)}&formato=json`,
  )
  if (!res.ok) throw new Error(`BCB CDI (12m) respondeu ${res.status}`)
  const rows = (await res.json()) as { data: string; valor: string }[]
  if (rows.length === 0) throw new Error('BCB CDI (12m) sem dados')
  const accumulated = rows.reduce((product, row) => product * (1 + Number(row.valor) / 100), 1)
  return (accumulated - 1) * 100
}

async function updateMarketInfo(id: string, marketInfo: string) {
  await pool.query('UPDATE investment_options SET market_info = $1 WHERE id = $2', [marketInfo, id])
}

async function updateRateValue(id: string, rateValue: number) {
  await pool.query('UPDATE investment_options SET rate_value = $1 WHERE id = $2', [rateValue, id])
}

marketDataRouter.post('/refresh', async (_req, res) => {
  const updated: string[] = []
  const errors: string[] = []
  const tag = dateTag()

  // Selic, CDI e IPCA via API pública do Banco Central (SGS) — sem necessidade de chave.
  try {
    const [selic, cdiAcumulado12m, ipca12m] = await Promise.all([
      fetchBcbSeries(432), // Meta Selic (% a.a.)
      fetchCdiAccumulated12m(), // CDI acumulado 12 meses (% a.a.), composto dos pregões diários reais
      fetchBcbSeries(13522), // IPCA acumulado 12 meses (% a.a.)
    ])

    await updateMarketInfo('tesouro-selic', `Selic atual: ${formatBRL(selic)}% a.a. (Copom, ${tag}).`)
    await updateRateValue('tesouro-selic', selic)
    await updateMarketInfo(
      'tesouro-ipca',
      `IPCA acumulado 12 meses: ≈ ${formatBRL(ipca12m)}% (${tag}), mais a taxa fixa do título.`,
    )
    await updateRateValue('tesouro-ipca', ipca12m)
    await updateMarketInfo(
      'cdb',
      `CDI acumulado 12 meses ≈ ${formatBRL(cdiAcumulado12m)}% a.a.; CDBs de bancos médios oferecem ≈ 100% a 120% do CDI (${tag}).`,
    )
    await updateRateValue('cdb', cdiAcumulado12m)
    await updateMarketInfo(
      'lci-lca',
      `Costumam pagar 85% a 95% do CDI (≈${formatBRL(cdiAcumulado12m)}% a.a.), mas isentas de IR — rendimento líquido pode superar CDB (${tag}).`,
    )
    updated.push('Renda fixa (Selic/CDI/IPCA via Banco Central)')
  } catch (err) {
    errors.push(`Selic/CDI/IPCA (Banco Central): ${(err as Error).message}`)
  }

  // Criptomoedas via CoinGecko — sem necessidade de chave.
  try {
    const ids = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple']
    const cgRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`)
    if (!cgRes.ok) throw new Error(`CoinGecko respondeu ${cgRes.status}`)
    const prices = (await cgRes.json()) as Record<string, { usd: number }>

    const cryptoIdByOption: Record<string, string> = {
      bitcoin: 'bitcoin',
      ethereum: 'ethereum',
      solana: 'solana',
      bnb: 'binancecoin',
      xrp: 'ripple',
    }
    let okCount = 0
    for (const [optionId, cgId] of Object.entries(cryptoIdByOption)) {
      const usd = prices[cgId]?.usd
      if (typeof usd !== 'number') continue
      await updateMarketInfo(
        optionId,
        `≈ US$ ${usd.toLocaleString('pt-BR', { maximumFractionDigits: usd < 10 ? 2 : 0 })} (${tag}) — alta volatilidade.`,
      )
      okCount++
    }
    if (okCount > 0) updated.push(`Criptomoedas (CoinGecko)`)
  } catch (err) {
    errors.push(`Criptomoedas (CoinGecko): ${(err as Error).message}`)
  }

  // Preço de ações, ETFs e FIIs via brapi.dev — todos negociados por ticker na
  // B3, então a mesma cotação de ações serve para os três. Precisa de um
  // token gratuito (brapi.dev) na env BRAPI_TOKEN.
  const brapiToken = process.env.BRAPI_TOKEN
  if (brapiToken) {
    async function fetchBrapiPrice(ticker: string): Promise<number> {
      const brapiRes = await fetch(`https://brapi.dev/api/v2/stocks/quote?symbols=${ticker}`, {
        headers: { Authorization: `Bearer ${brapiToken}` },
      })
      if (!brapiRes.ok) throw new Error(`status ${brapiRes.status}`)
      const brapiData = (await brapiRes.json()) as { results?: { data?: { regularMarketPrice: number } }[] }
      const price = brapiData.results?.[0]?.data?.regularMarketPrice
      if (typeof price !== 'number') throw new Error('sem preço na resposta')
      return price
    }

    interface CashDividend {
      paymentDate: string
      rate: number
      label: string
    }

    interface DividendInfo {
      dividendYield: number | null
      nextPayment: CashDividend | null
      frequencyLabel: string | null
    }

    // A partir dos intervalos reais entre os pagamentos já anunciados (não um
    // texto digitado à mão), estima se a empresa paga mensal/trimestral/etc.
    function inferFrequencyLabel(cashDividends: CashDividend[]): string | null {
      if (cashDividends.length < 2) return null
      const sortedDates = [...cashDividends]
        .map((d) => new Date(d.paymentDate).getTime())
        .sort((a, b) => a - b)
      const gapsInDays: number[] = []
      for (let i = 1; i < sortedDates.length; i++) {
        gapsInDays.push((sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24))
      }
      gapsInDays.sort((a, b) => a - b)
      const medianGap = gapsInDays[Math.floor(gapsInDays.length / 2)]
      if (medianGap <= 45) return 'Mensal'
      if (medianGap <= 135) return 'Trimestral'
      if (medianGap <= 270) return 'Semestral'
      return 'Anual'
    }

    // Rendimento + calendário de proventos — módulo pago na brapi.dev
    // (plano Startup), então só funciona para os poucos tickers cobertos
    // pela cota de amostra grátis. Chamada separada do preço de propósito:
    // se essa falhar (o normal, no plano gratuito), o preço continua
    // atualizando normalmente para todas as 29 empresas.
    async function fetchDividendInfo(ticker: string): Promise<DividendInfo> {
      const brapiRes = await fetch(
        `https://brapi.dev/api/quote/${ticker}?modules=defaultKeyStatistics&dividends=true&range=1y&interval=1mo&token=${brapiToken}`,
      )
      if (!brapiRes.ok) throw new Error(`status ${brapiRes.status}`)
      const brapiData = (await brapiRes.json()) as {
        results?: {
          defaultKeyStatistics?: { dividendYield?: number }
          dividendsData?: { cashDividends?: CashDividend[] }
        }[]
      }
      const result = brapiData.results?.[0]

      const now = Date.now()
      const cashDividends = result?.dividendsData?.cashDividends ?? []
      // Entre os proventos já anunciados, acha a data mais próxima — futura
      // se houver, senão a mais recente já paga.
      const future = cashDividends.filter((d) => new Date(d.paymentDate).getTime() >= now)
      const targetDate =
        future.length > 0
          ? future.reduce((a, b) => (new Date(a.paymentDate) < new Date(b.paymentDate) ? a : b)).paymentDate
          : cashDividends.length > 0
            ? cashDividends.reduce((a, b) => (new Date(a.paymentDate) > new Date(b.paymentDate) ? a : b)).paymentDate
            : null

      // Empresas costumam pagar dividendo + JCP na mesma data (ex.: Petrobras)
      // — soma todas as tranches daquela data em vez de pegar só uma, senão o
      // valor esperado fica subestimado.
      const nextPayment =
        targetDate != null
          ? (() => {
              const sameDate = cashDividends.filter((d) => d.paymentDate === targetDate)
              return {
                paymentDate: targetDate,
                rate: sameDate.reduce((sum, d) => sum + d.rate, 0),
                label: [...new Set(sameDate.map((d) => d.label))].join(' + '),
              }
            })()
          : null

      return {
        dividendYield: result?.defaultKeyStatistics?.dividendYield ?? null,
        nextPayment,
        frequencyLabel: inferFrequencyLabel(cashDividends),
      }
    }

    try {
      // O plano gratuito do brapi.dev permite só 1 ativo por requisição, então busca uma por vez.
      const { rows: companies } = await pool.query('SELECT id, ticker FROM companies')
      let okCount = 0
      let dividendOkCount = 0
      const stockErrors: string[] = []
      for (const company of companies) {
        try {
          const price = await fetchBrapiPrice(company.ticker)
          await pool.query('UPDATE companies SET price_approx = $1, price_value = $2 WHERE id = $3', [
            `R$ ${formatBRL(price)} (${tag})`,
            price,
            company.id,
          ])
          okCount++
        } catch (err) {
          stockErrors.push(`${company.ticker} (${(err as Error).message})`)
          continue
        }

        try {
          const dividend = await fetchDividendInfo(company.ticker)
          await pool.query(
            `UPDATE companies SET
               dividend_yield_value = $1, next_payment_date = $2, next_payment_amount = $3,
               next_payment_label = $4, payment_frequency = $5
             WHERE id = $6`,
            [
              dividend.dividendYield != null ? dividend.dividendYield * 100 : null,
              dividend.nextPayment ? dividend.nextPayment.paymentDate.slice(0, 10) : null,
              dividend.nextPayment ? dividend.nextPayment.rate : null,
              dividend.nextPayment ? dividend.nextPayment.label : null,
              dividend.frequencyLabel,
              company.id,
            ],
          )
          dividendOkCount++
        } catch {
          // Normal no plano gratuito da brapi.dev para a maioria dos tickers — não é
          // reportado como erro para não poluir a resposta com 25+ mensagens repetidas.
        }
      }
      if (okCount > 0) updated.push(`Preço de ${okCount} ação(ões) (brapi.dev)`)
      if (dividendOkCount > 0) updated.push(`Dividendos/proventos reais de ${dividendOkCount} ação(ões) (brapi.dev)`)
      if (stockErrors.length > 0) errors.push(`Ações não atualizadas: ${stockErrors.join(', ')}.`)
      if (dividendOkCount < companies.length) {
        errors.push(
          `Dividendos/proventos não disponíveis para ${companies.length - dividendOkCount} ação(ões) — esse dado é um módulo pago da brapi.dev (plano Startup), fora do nosso plano gratuito.`,
        )
      }
    } catch (err) {
      errors.push(`Ações (brapi.dev): ${(err as Error).message}`)
    }

    try {
      const { rows: fundOptions } = await pool.query(
        `SELECT id, ticker, asset_class, market_info FROM investment_options
         WHERE asset_class IN ('ETFs', 'FIIs') AND ticker IS NOT NULL`,
      )
      let okCount = 0
      const fundErrors: string[] = []
      for (const opt of fundOptions) {
        try {
          const price = await fetchBrapiPrice(opt.ticker)
          // ETFs/FIIs guardam informação de índice/dividend yield em market_info
          // (texto livre, não vem da brapi) — preserva esse texto, só atualiza o preço.
          await pool.query('UPDATE investment_options SET price_value = $1 WHERE id = $2', [price, opt.id])
          okCount++
        } catch (err) {
          fundErrors.push(`${opt.ticker} (${(err as Error).message})`)
        }
      }
      if (okCount > 0) updated.push(`Preço de ${okCount} ETF(s)/FII(s) (brapi.dev)`)
      if (fundErrors.length > 0) errors.push(`ETFs/FIIs não atualizados: ${fundErrors.join(', ')}.`)
    } catch (err) {
      errors.push(`ETFs/FIIs (brapi.dev): ${(err as Error).message}`)
    }
  } else {
    errors.push('Ações/ETFs/FIIs não atualizados — configure BRAPI_TOKEN no backend/.env (gratuito em brapi.dev) para ativar.')
  }

  // Rendimento mensal real dos FIIs via CVM (dados.cvm.gov.br) — gratuito e
  // oficial, mas só cobre os FIIs mapeados manualmente (ver FII_CNPJ_BY_ID);
  // não tem data exata de pagamento, só o % distribuído no mês de referência.
  try {
    const yields = await fetchCvmFiiYields()
    const entries = Object.entries(yields)
    for (const [id, info] of entries) {
      await pool.query('UPDATE investment_options SET dividend_yield_value = $1, dividend_reference_month = $2 WHERE id = $3', [
        info.yieldPercent,
        info.referenceMonth,
        id,
      ])
    }
    if (entries.length > 0) updated.push(`Rendimento mensal real de ${entries.length} FII(s) (CVM)`)
  } catch (err) {
    errors.push(`Rendimento de FIIs (CVM): ${(err as Error).message}`)
  }

  res.json({ updated, errors, refreshedAt: new Date().toISOString() })
})
