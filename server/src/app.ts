import express from 'express'
import cors from 'cors'
import { empreendimentosRouter } from './routes/empreendimentos'
import { municipiosRouter } from './routes/municipios'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/empreendimentos', empreendimentosRouter)
app.use('/api/municipios', municipiosRouter)

export { app }
