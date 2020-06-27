import 'dotenv/config'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

import { connect } from './utils/db'
import config from './config'

export const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

// Routes
app.get('/', async (_, res) =>
  res.status(200).json({
    hey: 'unoia',
  })
)

// app.post('/register-admin', adminSignup)
// app.post('/register-editor', protect, onlyAdmin, registerEditor)
// app.post('/signup', signup)
// app.post('/signin', signin)
// app.post('/validate', validateToken)

// app.use('/users', require('./resources/user/user.router'))
// app.use('/locations', require('./resources/location/location.router'))
// app.use('/activity', require('./resources/activity/activity.router'))
// app.use('/regulasi', require('./resources/regulasi/regulasi.router'))
// app.use('/comments', require('./resources/comment/comment.router'))
// app.use('/posts', require('./resources/post/post.router'))
// app.use('/geojson', require('./resources/geojson/geojson.router'))

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
