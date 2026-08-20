import 'dotenv/config'
import { pool } from './pool.js'
import { investmentOptions, companies } from './seedData.js'

async function seed() {
  for (const opt of investmentOptions) {
    await pool.query(
      `INSERT INTO investment_options (id, asset_class, name, ticker, description, market_info, payout_frequency)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         asset_class = $2, name = $3, ticker = $4, description = $5, market_info = $6, payout_frequency = $7`,
      [opt.id, opt.assetClass, opt.name, opt.ticker ?? null, opt.description, opt.marketInfo ?? null, opt.payoutFrequency ?? null],
    )
  }

  for (const c of companies) {
    await pool.query(
      `INSERT INTO companies (
         id, name, ticker, sector, what_it_does, how_it_makes_money, revenue, profit, margin, roe,
         debt, cash_flow, pl, pvp, dividend_yield, growth, risks, outlook, positives, attention,
         dangers, quality_summary, price_summary, price_approx, payout_frequency, price_value
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
       ON CONFLICT (id) DO UPDATE SET
         name=$2, ticker=$3, sector=$4, what_it_does=$5, how_it_makes_money=$6, revenue=$7, profit=$8,
         margin=$9, roe=$10, debt=$11, cash_flow=$12, pl=$13, pvp=$14, dividend_yield=$15, growth=$16,
         risks=$17, outlook=$18, positives=$19, attention=$20, dangers=$21, quality_summary=$22, price_summary=$23,
         price_approx=$24, payout_frequency=$25, price_value=$26`,
      [
        c.id, c.name, c.ticker, c.sector, c.whatItDoes, c.howItMakesMoney, c.revenue, c.profit, c.margin, c.roe,
        c.debt, c.cashFlow, c.pl, c.pvp, c.dividendYield, c.growth, JSON.stringify(c.risks), c.outlook,
        JSON.stringify(c.positives), JSON.stringify(c.attention), JSON.stringify(c.dangers), c.qualitySummary, c.priceSummary,
        c.priceApprox ?? null, c.payoutFrequency ?? null, c.priceValue ?? null,
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
