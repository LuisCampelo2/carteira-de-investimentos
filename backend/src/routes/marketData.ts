import { Router } from 'express'
import { pool } from '../db/pool.js'

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

async function updateMarketInfo(id: string, marketInfo: string) {
  await pool.query('UPDATE investment_options SET market_info = $1 WHERE id = $2', [marketInfo, id])
}

marketDataRouter.post('/refresh', async (_req, res) => {
  const updated: string[] = []
  const errors: string[] = []
  const tag = dateTag()

  // Selic, CDI e IPCA via API pública do Banco Central (SGS) — sem necessidade de chave.
  try {
    const [selic, cdiDaily, ipca12m] = await Promise.all([
      fetchBcbSeries(432), // Meta Selic (% a.a.)
      fetchBcbSeries(12), // CDI (% a.d.)
      fetchBcbSeries(13522), // IPCA acumulado 12 meses (% a.a.)
    ])
    const cdiAnual = (Math.pow(1 + cdiDaily / 100, 252) - 1) * 100

    await updateMarketInfo('tesouro-selic', `Selic atual: ${formatBRL(selic)}% a.a. (Copom, ${tag}).`)
    await updateMarketInfo(
      'tesouro-ipca',
      `IPCA acumulado 12 meses: ≈ ${formatBRL(ipca12m)}% (${tag}), mais a taxa fixa do título.`,
    )
    await updateMarketInfo(
      'cdb',
      `CDI atual ≈ ${formatBRL(cdiAnual)}% a.a.; CDBs de bancos médios oferecem ≈ 100% a 120% do CDI (${tag}).`,
    )
    await updateMarketInfo(
      'lci-lca',
      `Costumam pagar 85% a 95% do CDI (≈${formatBRL(cdiAnual)}% a.a.), mas isentas de IR — rendimento líquido pode superar CDB (${tag}).`,
    )
    await updateMarketInfo(
      'debenture-incentivada',
      `Costumam pagar IPCA (${formatBRL(ipca12m)}% a.a. atual) + 6% a 8% a.a. isento de IR (${tag}).`,
    )
    await updateMarketInfo(
      'debenture-comum',
      `Costumam pagar CDI (≈${formatBRL(cdiAnual)}% a.a.) + 1,5% a 3% a.a., com IR regressivo sobre o rendimento (${tag}).`,
    )
    updated.push('Renda fixa e Debêntures (Selic/CDI/IPCA via Banco Central)')
  } catch (err) {
    errors.push(`Selic/CDI/IPCA (Banco Central): ${(err as Error).message}`)
  }

  // Criptomoedas via CoinGecko — sem necessidade de chave.
  try {
    const cgRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
    if (!cgRes.ok) throw new Error(`CoinGecko respondeu ${cgRes.status}`)
    const prices = (await cgRes.json()) as Record<string, { usd: number }>

    await updateMarketInfo(
      'bitcoin',
      `≈ US$ ${prices.bitcoin.usd.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} (${tag}) — alta volatilidade.`,
    )
    await updateMarketInfo(
      'ethereum',
      `≈ US$ ${prices.ethereum.usd.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} (${tag}) — alta volatilidade.`,
    )
    updated.push('Criptomoedas (CoinGecko)')
  } catch (err) {
    errors.push(`Criptomoedas (CoinGecko): ${(err as Error).message}`)
  }

  // Preço das ações via brapi.dev — precisa de um token gratuito (brapi.dev) na env BRAPI_TOKEN.
  const brapiToken = process.env.BRAPI_TOKEN
  if (brapiToken) {
    try {
      // O plano gratuito do brapi.dev permite só 1 ativo por requisição, então busca uma por vez.
      const { rows: companies } = await pool.query('SELECT id, ticker FROM companies')
      let okCount = 0
      const stockErrors: string[] = []
      for (const company of companies) {
        try {
          const brapiRes = await fetch(`https://brapi.dev/api/v2/stocks/quote?symbols=${company.ticker}`, {
            headers: { Authorization: `Bearer ${brapiToken}` },
          })
          if (!brapiRes.ok) throw new Error(`status ${brapiRes.status}`)
          const brapiData = (await brapiRes.json()) as { results?: { data?: { regularMarketPrice: number } }[] }
          const price = brapiData.results?.[0]?.data?.regularMarketPrice
          if (typeof price === 'number') {
            await pool.query('UPDATE companies SET price_approx = $1, price_value = $2 WHERE id = $3', [
              `R$ ${formatBRL(price)} (${tag})`,
              price,
              company.id,
            ])
            okCount++
          }
        } catch (err) {
          stockErrors.push(`${company.ticker} (${(err as Error).message})`)
        }
      }
      if (okCount > 0) updated.push(`Preço de ${okCount} ação(ões) (brapi.dev)`)
      if (stockErrors.length > 0) errors.push(`Ações não atualizadas: ${stockErrors.join(', ')}.`)
    } catch (err) {
      errors.push(`Ações (brapi.dev): ${(err as Error).message}`)
    }
  } else {
    errors.push('Ações não atualizadas — configure BRAPI_TOKEN no backend/.env (gratuito em brapi.dev) para ativar.')
  }

  res.json({ updated, errors, refreshedAt: new Date().toISOString() })
})
