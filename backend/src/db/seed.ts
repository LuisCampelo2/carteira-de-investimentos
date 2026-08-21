import 'dotenv/config'
import { pool } from './pool.js'
import { investmentOptions, companies } from './seedData.js'

async function seed() {
  for (const opt of investmentOptions) {
    await pool.query(
      `INSERT INTO investment_options (id, asset_class, name, ticker, description, market_info, payout_frequency, price_value)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         asset_class = $2, name = $3, ticker = $4, description = $5, market_info = $6, payout_frequency = $7,
         -- Preserva o preço real já buscado via /refresh; o seed só serve de
         -- valor inicial antes do primeiro refresh, nunca deve sobrescrever
         -- um dado ao vivo.
         price_value = COALESCE(investment_options.price_value, $8)`,
      [
        opt.id, opt.assetClass, opt.name, opt.ticker ?? null, opt.description, opt.marketInfo ?? null,
        opt.payoutFrequency ?? null, opt.priceValue ?? null,
      ],
    )
  }

  for (const c of companies) {
    await pool.query(
      `INSERT INTO companies (
         id, name, ticker, sector, what_it_does, how_it_makes_money, revenue, profit, margin, roe,
         debt, cash_flow, pl, pvp, dividend_yield, growth, risks, outlook, positives, attention,
         dangers, quality_summary, price_summary, price_approx, payout_frequency, price_value,
         dividend_yield_value, dividend_reference_month
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)
       ON CONFLICT (id) DO UPDATE SET
         name=$2, ticker=$3, sector=$4, what_it_does=$5, how_it_makes_money=$6, revenue=$7, profit=$8,
         margin=$9, roe=$10, debt=$11, cash_flow=$12, pl=$13, pvp=$14, dividend_yield=$15, growth=$16,
         risks=$17, outlook=$18, positives=$19, attention=$20, dangers=$21, quality_summary=$22, price_summary=$23,
         payout_frequency=$25,
         -- price_approx/price_value/dividend_yield_value/dividend_reference_month: preserva o
         -- dado real já buscado via /refresh (companies) ou pesquisado manualmente e já presente
         -- no banco; o seed só serve de valor inicial antes do primeiro refresh, nunca deve
         -- sobrescrever um dado ao vivo com o placeholder do seed (ex.: zerar o dividend_yield_value
         -- real da brapi.dev de ITUB4/PETR4/VALE3/MGLU3, que não tem valor correspondente no seed).
         price_approx=COALESCE(companies.price_approx, $24),
         price_value=COALESCE(companies.price_value, $26),
         dividend_yield_value=COALESCE(companies.dividend_yield_value, $27),
         dividend_reference_month=COALESCE(companies.dividend_reference_month, $28)`,
      [
        c.id, c.name, c.ticker, c.sector, c.whatItDoes, c.howItMakesMoney, c.revenue, c.profit, c.margin, c.roe,
        c.debt, c.cashFlow, c.pl, c.pvp, c.dividendYield, c.growth, JSON.stringify(c.risks), c.outlook,
        JSON.stringify(c.positives), JSON.stringify(c.attention), JSON.stringify(c.dangers), c.qualitySummary, c.priceSummary,
        c.priceApprox ?? null, c.payoutFrequency ?? null, c.priceValue ?? null,
        c.dividendYieldValue ?? null, c.dividendReferenceMonth ?? null,
      ],
    )
  }

  console.log(`Seed concluído: ${investmentOptions.length} opções de investimento, ${companies.length} empresas.`)
  await pool.end()
}

seed().catch((err) => {
  console.error('Falha ao popular dados:', err)
  process.exit(1)
})
