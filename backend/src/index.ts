import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { carteiraRouter } from './routes/carteira.js'
import { progressRouter } from './routes/progress.js'
import { investmentOptionsRouter, companiesRouter } from './routes/investments.js'
import { marketDataRouter } from './routes/marketData.js'

const app = express()
const port = Number(process.env.PORT ?? 3001)

// Frontend roda com Vite, que por padrão tenta 5173 e cai para 5174 se a
// primeira estiver ocupada — então aceitamos as duas em vez de liberar CORS
// para qualquer origem.
const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:5174']
app.use(cors({ origin: ALLOWED_ORIGINS }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/carteira', carteiraRouter)
app.use('/api/progress', progressRouter)
app.use('/api/investment-options', investmentOptionsRouter)
app.use('/api/companies', companiesRouter)
app.use('/api/market-data', marketDataRouter)

const server = app.listen(port, () => {
  // Lê a porta real do servidor em vez de confiar na variável `port`, para
  // a mensagem nunca divergir do que de fato está no ar.
  const address = server.address()
  const actualPort = typeof address === 'object' && address ? address.port : port
  console.log(`Backend rodando em http://localhost:${actualPort}`)
})

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${port} já está em uso. Pare o processo que está nela ou defina outra PORT no .env.`)
    process.exit(1)
  }
  throw err
})
