import 'dotenv/config'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// import helmet from 'helmet'

import { connect } from './utils/db'
import config from './config'
import { adminRegister } from './utils/auth'
import { sendRefreshToken } from './utils/refresh-token'

export const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET,POST,DELETE,PUT,OPTIONS',
  allowedHeaders: 'Accept, Origin, Content-Type, Cookie'
}

// TODO: Need more research before enabling helmet
// app.use(helmet())
app.disable('x-powered-by')
app.use(cors(corsOptions))
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

// Routes
app.get('/', async (_, res) =>
  res.status(200).json({
    hey: 'ignition 🔥'
  })
)
app.get('/init-admin', adminRegister)

app.post('/cookies', async (req, res) => {
  sendRefreshToken(res, { hello: 'thisisthevalueofthecookie' })
  res.status(200).json({ hello: 'cookies 🍪' })
})

app.post('/read-cookies', async (req, res) => {
  console.log({ cookies: req.cookies })
  res.status(200).json({ reading: 'cookies 🍪' })
})

app.use('/users', require('./resources/user/user.router'))

export const start = async () => {
  try {
    let connection = await connect()
    if (connection) {
      console.log('CONNECTED TO DATABASE')
      app.listen(config.port, () => {
        console.log(`REST API on http://localhost:${config.port}`)
      })
    }
  } catch (e) {
    console.error('ERROR INITIALIZING APP: ', e)
  }
}
