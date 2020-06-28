import jwt from 'jsonwebtoken'
import config from '../config'

export const sendRefreshToken = (res, payload) => {
  console.log('SENDING COOKIE 🍪')
  res.cookie('dushi', generateRefreshToken(payload), {
    httpOnly: true
  })
}

export const generateRefreshToken = payload => {
  return jwt.sign(payload, config.secrets.refreshToken, {
    expiresIn: config.secrets.refreshTokenExp
  })
}
