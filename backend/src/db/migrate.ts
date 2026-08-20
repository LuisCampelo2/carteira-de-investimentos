import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import 'dotenv/config'
import { pool } from './pool.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function migrate() {
  const schema = readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
  await pool.query(schema)
  console.log('Schema aplicado com sucesso.')
  await pool.end()
}

migrate().catch((err) => {
  console.error('Falha ao aplicar schema:', err)
  process.exit(1)
})
