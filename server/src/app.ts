import express from 'express'
import cors from 'cors'
import path from 'path'
import { empreendimentosRouter } from './routes/empreendimentos'
import { municipiosRouter } from './routes/municipios'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/empreendimentos', empreendimentosRouter)
app.use('/api/municipios', municipiosRouter)

// Serve React build in production
const clientDist = path.join(__dirname, '../../client/dist')
app.use(express.static(clientDist))
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'))
})

export { app }
