const JWT = require('jsonwebtoken')
const createHttpError = require('http-errors')
module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secretKey = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: "30s",
                issuer: "tempPage.com",
                audience: userId
            }
            JWT.sign(payload, secretKey, options, (error, token) => {
                if (error) {
                    return reject(createHttpError.InternalServerError())
                }
                else resolve(token)
            })
        })
    },
    VerifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createHttpError.Unauthorized())
        const authHeader = req.headers['authorization']
        const tokenbearer = authHeader.split(' ')
        const token = tokenbearer[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
            if (error) {
                // if(error.name==='JsonWebTokenError'){
                //     return next(createHttpError.Unauthorized())
                // }
                // else
                // return next(createHttpError.Unauthorized(error.message))

                const message = error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message
                return next(createHttpError.Unauthorized(message))
            }
            else {
                req.payload = payload
                next()
            }
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secretKey = process.env.REFRESH_TOKEN_SECET
            const options = {
                expiresIn: "1y",
                issuer: "tempPage.com",
                audience: userId
            }
            JWT.sign(payload, secretKey, options, (error, token) => {
                if (error) {
                    return reject(createHttpError.InternalServerError())
                }
                else resolve(token)
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECET, (err, payload) => {
                if (err)
                    return reject (createHttpError.Unauthorized())
                const userId = payload.aud
                resolve(userId)
            })
        })
    }
}