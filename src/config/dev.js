// require('dotenv').config()

export const devConfig = {
  secrets: {
    jwt: process.env.JWT_ACCESS_TOKEN_SECRET
  },
  dbUrl: process.env.DEVELOPMENT_MONGO_URL
}
