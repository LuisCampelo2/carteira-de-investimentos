import { Router } from 'express'
import { pool } from '../db/pool.js'
import type { CarteiraState } from '../types.js'

export const carteiraRouter = Router()

function rowToCarteira(row: any): CarteiraState {
  return {
    items: row.items,
    monthlyContribution: Number(row.monthly_contribution),
    initialAmount: Number(row.initial_amount),
    years: row.years,
    objective: row.objective,
    risk: row.risk,
    estimatedAnnualRate: row.estimated_annual_rate != null ? Number(row.estimated_annual_rate) : undefined,
    estimatedAnnualRateCoverage:
      row.estimated_annual_rate_coverage != null ? Number(row.estimated_annual_rate_coverage) : undefined,
    updatedAt: row.updated_at,
  }
}

carteiraRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM carteira WHERE id = 1')
  res.json(rows[0] ? rowToCarteira(rows[0]) : null)
})

carteiraRouter.put('/', async (req, res) => {
  const body = req.body as CarteiraState
  const { rows } = await pool.query(
    `INSERT INTO carteira (
       id, items, monthly_contribution, initial_amount, years, objective, risk,
       estimated_annual_rate, estimated_annual_rate_coverage, updated_at
     )
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO UPDATE SET
       items = $1, monthly_contribution = $2, initial_amount = $3, years = $4,
       objective = $5, risk = $6, estimated_annual_rate = $7, estimated_annual_rate_coverage = $8,
       updated_at = $9
     RETURNING *`,
    [
      JSON.stringify(body.items ?? []),
      body.monthlyContribution ?? 0,
      body.initialAmount ?? 0,
      body.years ?? 0,
      body.objective ?? '',
      body.risk ?? '',
      body.estimatedAnnualRate ?? null,
      body.estimatedAnnualRateCoverage ?? null,
      body.updatedAt ?? new Date().toISOString(),
    ],
  )
  res.json(rowToCarteira(rows[0]))
})

carteiraRouter.delete('/items/:itemId', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM carteira WHERE id = 1')
  if (!rows[0]) {
    res.status(404).json({ error: 'Carteira não encontrada' })
    return
  }
  const nextItems = (rows[0].items as CarteiraState['items']).filter((i) => i.id !== req.params.itemId)
  const { rows: updated } = await pool.query(
    `UPDATE carteira SET items = $1, updated_at = $2 WHERE id = 1 RETURNING *`,
    [JSON.stringify(nextItems), new Date().toISOString()],
  )
  res.json(rowToCarteira(updated[0]))
})

carteiraRouter.delete('/', async (_req, res) => {
  await pool.query('DELETE FROM carteira WHERE id = 1')
  res.status(204).end()
})
