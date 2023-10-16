import 'module-alias/register'
import express from 'express'
import dotenvFlow from 'dotenv-flow'
import sayhello from '@/routes/sayhello'

const app = express()
dotenvFlow.config()

app.use('/sayhello', sayhello)
app.get('/', (req, res) => {
  return res.send('🥵Mi aplicación de Express con typescript🥵')
})

const PORT = process.env.PORT ?? 6000

app.listen(PORT, () => {
  console.log(
    `🚀Aplicación escuchando en el puerto ${PORT}🚀 => ${process.env.BACKEND_URL}:${PORT}`
  )
})
