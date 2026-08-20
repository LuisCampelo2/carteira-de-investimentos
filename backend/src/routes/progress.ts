import { Router } from 'express'
import { pool } from '../db/pool.js'
import type { ProgressStatus } from '../types.js'

export const progressRouter = Router()

progressRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT aula_id, status FROM aula_progress')
  const map: Record<string, ProgressStatus> = {}
  for (const row of rows) map[row.aula_id] = row.status
  res.json(map)
})

progressRouter.put('/:aulaId', async (req, res) => {
  const { status } = req.body as { status: ProgressStatus }
  await pool.query(
    `INSERT INTO aula_progress (aula_id, status, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (aula_id) DO UPDATE SET status = $2, updated_at = now()`,
    [req.params.aulaId, status],
  )
  res.status(204).end()
})
