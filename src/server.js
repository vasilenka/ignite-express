import 'dotenv/config'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
// import helmet from 'helmet'

import { connect } from './utils/db'
import config from './config'
import { adminRegister } from './utils/auth'

export const app = express()

// TODO: Need more research before enabling helmet
// app.use(helmet())

app.disable('x-powered-by')
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

// Routes
app.get('/', async (_, res) =>
  res.status(200).json({
    hey: 'ignition 🔥'
  })
)

app.get('/init-admin', adminRegister)
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
