import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { carteiraRouter } from './routes/carteira.js'
import { progressRouter } from './routes/progress.js'
import { investmentOptionsRouter, companiesRouter } from './routes/investments.js'

const app = express()
const port = Number(process.env.PORT ?? 3001)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/carteira', carteiraRouter)
app.use('/api/progress', progressRouter)
app.use('/api/investment-options', investmentOptionsRouter)
app.use('/api/companies', companiesRouter)

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`)
})
