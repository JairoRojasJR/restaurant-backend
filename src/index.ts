/* eslint-disable import/first */
import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config()
import { dbClient } from '@/utils/db'
import { azConnection } from '@/utils/az-blob'
azConnection()

import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import session, { type SessionOptions } from 'express-session'
import passport from 'passport'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'

import { auth } from './routes/auth.routes'
import { company } from '@/routes/company.routes'
import { streaming as stream } from '@/routes/stream.routes'
import { plates } from '@/routes/plate.routes'
import { db } from '@/routes/db.routes'
import { menu } from '@/routes/menu.routes'
import { getVariableEnv } from './utils'
import { isProdMode } from './consts'
/* eslint-enable import/first */

// Main configs
const app = express()

const corsOptions: cors.CorsOptions = {
  origin: [getVariableEnv('FRONTEND')],
  credentials: true,
  optionsSuccessStatus: 204
}

const sessionOptions: SessionOptions = {
  secret: getVariableEnv('SECRET_SESSION'),
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: dbClient,
    dbName: getVariableEnv('DBNAME')
  }),
  cookie: {
    secure: isProdMode,
    sameSite: isProdMode ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12
  }
}

isProdMode && app.set('trust proxy', true)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(session(sessionOptions))

app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
//

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  const recovered = getVariableEnv('ADMIN_USER')
  const deserializer = user === recovered ?? recovered
  done(null, deserializer)
})

app.use('/api/db', db)
app.use('/api/auth', auth)
app.use('/api/streaming', stream)
app.use('/api/company', company)
app.use('/api/plates', plates)
app.use('/api/menu', menu)
app.get('/', (req, res) => {
  return res.send('🥵Mi aplicación de Express con typescript🚀🚀🚀')
})

const PORT = process.env.PORT ?? 6000

app.listen(PORT, () => {
  const launch = `🚀Aplicación escuchando en el puerto ${PORT}🚀 => ${process.env.URL}:${PORT}`
  console.log(launch)
  console.log('😎Conexión a Azure Blob')
})
