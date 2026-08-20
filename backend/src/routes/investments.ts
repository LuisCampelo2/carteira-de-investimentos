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
    })),
  )
})
