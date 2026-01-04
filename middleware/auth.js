import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
import crypto from 'crypto'


export function generateAnonymousTokens () {
  try {
    const anonymousID = crypto.randomBytes(10).toString('hex')

    const accessToken = jwt.sign(
      { anonymousID: anonymousID },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '15m'
      }
    )

    const refreshToken = jwt.sign(
      { anonymousID },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    return { accessToken, refreshToken }
  } catch (error) {
    console.log('error in generateAnonymousToken func', error.message)
  }
}
export async function Authenticator (req, res, next) {
  try {
    const userId = req.cookies.userToken || null
    const anonymousToken = req.cookies.anonymousToken
    const refreshToken = req.cookies.refreshToken

    if (userId) {
      console.log('user already exists')
      return res.status(200).json({
        msg: 'user exists'
      })
    
    }

    // if (!anonymousToken) {
    //   console.log('no token here anonymous')
    //   next()
    // }

    try {
      const decoded = jwt.verify(
        anonymousToken,
        process.env.ACCESS_TOKEN_SECRET
      )
      req.user = decoded
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('token expired renewing it')
        try {
          const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
          )

          const newAccessToken = jwt.sign(
            { anonymousID: decoded.anonymousID },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
          )

          res.cookie('anonymousToken', newAccessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 15 * 60 * 1000
          })

          req.user = decoded
          next()
        } catch (refreshError) {
          return res
            .status(401)
            .json({ error: 'Session expired, please login again' })
        }
      } else {
        return res.status(401).json({ error: 'Invalid token' })
      }
    }
  } catch (error) {
    console.log(error.message)
  }
}
