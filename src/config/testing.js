export const testConfig = {
  secrets: {
    jwt: process.env.JWT_ACCESS_TOKEN_SECRET
  },
  dbUrl: process.env.TESTING_MONGO_URL
}
