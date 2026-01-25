import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
import crypto from 'crypto'

export function generateAnonymousTokens () {
  try {
    const anonymousID = crypto.randomBytes(10).toString('hex')
    const randomNumber = crypto.randomBytes(5).toString('hex')

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

    return { accessToken, refreshToken, randomNumber }
  } catch (error) {
    console.log('error in generateAnonymousToken func', error.message)
  }
}

export async function EnsureAnonymous (req, res, next) {
  try {
    const userId = req.cookies.userToken || null
    const anonymousToken = req.cookies.anonymousToken
    const refreshTokenData = req.cookies.refreshToken
    const anonymousCartId = req.cookies.anonymousCartId

    if (userId) {
      return res.status(200).json({
        msg: 'user exists'
      })
    }

    if (anonymousToken) {
      try {
        const decoded = jwt.verify(
          anonymousToken,
          process.env.ACCESS_TOKEN_SECRET
        )
        req.user = decoded
        req.anonymousUserCart = anonymousCartId
        return next()
      } catch (error) {
        console.log(error.message)

        // If token expired, try to refresh
        if (error.name === 'TokenExpiredError' && refreshTokenData) {
          try {
            const decoded = jwt.verify(
              refreshTokenData,
              process.env.REFRESH_TOKEN_SECRET
            )

            const newAccessToken = jwt.sign(
              { anonymousID: decoded.anonymousID },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '15m' }
            )

            res.cookie('anonymousToken', newAccessToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'none',
              maxAge: 1000 * 60 * 15
            })

            req.user = decoded
            req.anonymousUserCart = anonymousCartId
            return next()
          } catch (refreshErr) {
            res.clearCookie('anonymousToken')
            res.clearCookie('refreshToken')
            return res.status(401).json({
              error: 'Session expired, please login again'
            })
          }
        }

        return res.status(401).json({
          msg: 'invalid token'
        })
      }
    }

    const { accessToken, refreshToken, randomNumber } =
      generateAnonymousTokens()

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    res.cookie('anonymousToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 15
    })

    if (!anonymousCartId) {
      res.cookie('anonymousCartId', randomNumber, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.header('Access-Control-Allow-Credentials', 'true')
    req.user = decoded
    req.anonymousUserCart = randomNumber
    next()
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({
      error: error.message
    })
  }
}

export async function Authenticator (req, res, next) {
  try {
    const userId = req.cookies.userToken || null
    const anonymousToken = req.cookies.anonymousToken
    const refreshToken = req.cookies.refreshToken
    const anonymousCartId = req.cookies.anonymousCartId

    if (userId) {
      console.log('user already exists')
      return res.status(200).json({
        msg: 'user exists'
      })
    }


    if (!anonymousToken && anonymousCartId && refreshToken) {
      req.anonymousUserCart = anonymousCartId
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
          secure: true,
          sameSite: 'none',
          maxAge: 15 * 60 * 1000
        })

        req.user = decoded
        req.anonymousUserCart = anonymousCartId
        return next()
      } catch (refreshErr) {
        res.clearCookie('anonymousToken')
        res.clearCookie('refreshToken')
        res.clearCookie('anonymousCartId')
        return res.status(401).json({
          error: 'Session expired, please login again'
        })
      }
    }

    if (!anonymousToken) {
      return res.status(401).json({
        error: 'No user nor anonymous id'
      })
    }

    if (anonymousToken) {
      try {
        const decoded = jwt.verify(
          anonymousToken,
          process.env.ACCESS_TOKEN_SECRET
        )
        req.user = decoded
        req.anonymousUserCart = anonymousCartId
        return next()
      } catch (error) {
        console.log(error.message)

        if (error.name === 'TokenExpiredError' && refreshToken) {
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
              secure: true,
              sameSite: 'none',
              maxAge: 15 * 60 * 1000
            })

            req.user = decoded
            req.anonymousUserCart = anonymousCartId
            return next()
          } catch (refreshErr) {
            res.clearCookie('anonymousToken')
            res.clearCookie('refreshToken')
            res.clearCookie('anonymousCartId')
            return res.status(401).json({
              error: 'Session expired, please login again'
            })
          }
        }

        return res.status(401).json({ error: 'Invalid token' })
      }
    }
  } catch (error) {
    return res.status(401).json({
      error: 'No token provided'
    })
  }
}
