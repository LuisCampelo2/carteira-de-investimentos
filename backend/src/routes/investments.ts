import { Router } from 'express'
import { pool } from '../db/pool.js'

export const investmentOptionsRouter = Router()

investmentOptionsRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM investment_options ORDER BY asset_class, name')
  res.json(
    rows.map((row) => ({
      id: row.id,
      assetClass: row.asset_class,
      name: row.name,
      ticker: row.ticker ?? undefined,
      description: row.description,
      marketInfo: row.market_info ?? undefined,
      payoutFrequency: row.payout_frequency ?? undefined,
      price: row.price_value != null ? Number(row.price_value) : undefined,
      dividendYieldValue: row.dividend_yield_value != null ? Number(row.dividend_yield_value) : undefined,
      dividendReferenceMonth: row.dividend_reference_month ?? undefined,
      rateValue: row.rate_value != null ? Number(row.rate_value) : undefined,
    })),
  )
})

export const companiesRouter = Router()

companiesRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM companies ORDER BY name')
  res.json(
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      ticker: row.ticker,
      sector: row.sector,
      whatItDoes: row.what_it_does,
      howItMakesMoney: row.how_it_makes_money,
      revenue: row.revenue,
      profit: row.profit,
      margin: row.margin,
      roe: row.roe,
      debt: row.debt,
      cashFlow: row.cash_flow,
      pl: row.pl,
      pvp: row.pvp,
      dividendYield: row.dividend_yield,
      growth: row.growth,
      risks: row.risks,
      outlook: row.outlook,
      positives: row.positives,
      attention: row.attention,
      dangers: row.dangers,
      qualitySummary: row.quality_summary,
      priceSummary: row.price_summary,
      priceApprox: row.price_approx ?? undefined,
      priceValue: row.price_value != null ? Number(row.price_value) : undefined,
      payoutFrequency: row.payout_frequency ?? undefined,
      dividendYieldValue: row.dividend_yield_value != null ? Number(row.dividend_yield_value) : undefined,
      dividendReferenceMonth: row.dividend_reference_month ?? undefined,
      nextPaymentDate: row.next_payment_date
        ? new Date(row.next_payment_date).toISOString().slice(0, 10)
        : undefined,
      nextPaymentAmount: row.next_payment_amount != null ? Number(row.next_payment_amount) : undefined,
      nextPaymentLabel: row.next_payment_label ?? undefined,
      realPaymentFrequency: row.payment_frequency ?? undefined,
    })),
  )
})
