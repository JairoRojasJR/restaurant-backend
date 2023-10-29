/* eslint-disable import/first */
import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config()
import '@/utils/db'
import { azConnection } from '@/utils/az-blob'
azConnection()

import express from 'express'
import cors from 'cors'

import { company } from '@/routes/company.routes'
import { streaming as stream } from '@/routes/stream.routes'
import { plates } from '@/routes/plate.routes'
import { db } from '@/routes/db.routes'
import { menu } from '@/routes/menu.routes'
/* eslint-enable import/first */

const fronted = process.env.FRONTEND
if (fronted === undefined) throw new Error('Falta la variable de entorno "FRONTEND"')

// Main configs
const app = express()
const corsOptions: cors.CorsOptions = {
  origin: [fronted],
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))
app.use(express.json())
//

app.use('/api/db', db)
app.use('/api/streaming', stream)
app.use('/api/company', company)
app.use('/api/plates', plates)
app.use('/api/menu', menu)
app.get('/', (req, res) => {
  return res.send('🥵Mi aplicación de Express con typescript🥵')
})

const PORT = process.env.PORT ?? 6000

app.listen(PORT, () => {
  const launch = `🚀Aplicación escuchando en el puerto ${PORT}🚀 => ${process.env.URL}:${PORT}`
  console.log(launch)
  console.log('😎Conexión a Azure Blob')
})
