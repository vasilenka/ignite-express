export const prodConfig = {
  secrets: {
    jwt: process.env.JWT_ACCESS_TOKEN_SECRET
  },
  dbUrl: process.env.PRODUCTION_MONGO_URL
}
