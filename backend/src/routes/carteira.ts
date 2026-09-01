import { Router } from 'express'
import { pool } from '../db/pool.js'
import type { CarteiraState } from '../types.js'

export const carteiraRouter = Router()

function rowToCarteira(row: any): CarteiraState {
  return {
    id: row.id,
    name: row.name,
    items: row.items,
    monthlyContribution: Number(row.monthly_contribution),
    initialAmount: Number(row.initial_amount),
    years: row.years,
    objective: row.objective,
    risk: row.risk,
    estimatedAnnualRate: row.estimated_annual_rate != null ? Number(row.estimated_annual_rate) : undefined,
    estimatedAnnualRateCoverage:
      row.estimated_annual_rate_coverage != null ? Number(row.estimated_annual_rate_coverage) : undefined,
    classPercents: row.class_percents ?? undefined,
    updatedAt: row.updated_at,
  }
}

carteiraRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM carteira ORDER BY updated_at DESC')
  res.json(rows.map(rowToCarteira))
})

carteiraRouter.get('/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM carteira WHERE id = $1', [req.params.id])
  if (!rows[0]) {
    res.status(404).json({ error: 'Carteira não encontrada' })
    return
  }
  res.json(rowToCarteira(rows[0]))
})

carteiraRouter.post('/', async (req, res) => {
  const body = req.body as Omit<CarteiraState, 'id'>
  const { rows } = await pool.query(
    `INSERT INTO carteira (
       name, items, monthly_contribution, initial_amount, years, objective, risk,
       estimated_annual_rate, estimated_annual_rate_coverage, class_percents, updated_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      body.name?.trim() || 'Minha Carteira',
      JSON.stringify(body.items ?? []),
      body.monthlyContribution ?? 0,
      body.initialAmount ?? 0,
      body.years ?? 0,
      body.objective ?? '',
      body.risk ?? '',
      body.estimatedAnnualRate ?? null,
      body.estimatedAnnualRateCoverage ?? null,
      body.classPercents ? JSON.stringify(body.classPercents) : null,
      body.updatedAt ?? new Date().toISOString(),
    ],
  )
  res.status(201).json(rowToCarteira(rows[0]))
})

carteiraRouter.put('/:id', async (req, res) => {
  const body = req.body as Omit<CarteiraState, 'id'>
  const { rows } = await pool.query(
    `UPDATE carteira SET
       name = $1, items = $2, monthly_contribution = $3, initial_amount = $4, years = $5,
       objective = $6, risk = $7, estimated_annual_rate = $8, estimated_annual_rate_coverage = $9,
       class_percents = $10, updated_at = $11
     WHERE id = $12
     RETURNING *`,
    [
      body.name?.trim() || 'Minha Carteira',
      JSON.stringify(body.items ?? []),
      body.monthlyContribution ?? 0,
      body.initialAmount ?? 0,
      body.years ?? 0,
      body.objective ?? '',
      body.risk ?? '',
      body.estimatedAnnualRate ?? null,
      body.estimatedAnnualRateCoverage ?? null,
      body.classPercents ? JSON.stringify(body.classPercents) : null,
      body.updatedAt ?? new Date().toISOString(),
      req.params.id,
    ],
  )
  if (!rows[0]) {
    res.status(404).json({ error: 'Carteira não encontrada' })
    return
  }
  res.json(rowToCarteira(rows[0]))
})

carteiraRouter.delete('/:id/items/:itemId', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM carteira WHERE id = $1', [req.params.id])
  if (!rows[0]) {
    res.status(404).json({ error: 'Carteira não encontrada' })
    return
  }
  const nextItems = (rows[0].items as CarteiraState['items']).filter((i) => i.id !== req.params.itemId)
  const { rows: updated } = await pool.query(
    `UPDATE carteira SET items = $1, updated_at = $2 WHERE id = $3 RETURNING *`,
    [JSON.stringify(nextItems), new Date().toISOString(), req.params.id],
  )
  res.json(rowToCarteira(updated[0]))
})

carteiraRouter.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM carteira WHERE id = $1', [req.params.id])
  res.status(204).end()
})
