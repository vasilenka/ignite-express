import { merge } from 'lodash'
const env = process.env.NODE_ENV || 'development'

import { devConfig } from './dev'
import { prodConfig } from './prod'
import { testConfig } from './testing'

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: process.env.PORT || 5000,

  email: {
    name: process.env.EMAIL_NAME,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    redirect: process.env.EMAIL_REDIRECT
  },

  secrets: {
    accessToken: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExp: '60m',
    refreshToken: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExp: '100d',
    emailToken: process.env.JWT_EMAIL_TOKEN_SECRET,
    emailTokenExp: '30m'
  }
}

let envConfig = {}

switch (env) {
  case 'dev':
  case 'development':
    envConfig = devConfig
    break

  case 'test':
  case 'testing':
    envConfig = testConfig
    break

  case 'prod':
  case 'production':
    envConfig = prodConfig
    break

  default:
    envConfig = devConfig
}

export default merge(baseConfig, envConfig)
