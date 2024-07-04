const express = require('express')
const morgan = require('morgan')
const createErrors = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongoDB')
const PORT = process.env.PORT || 3000
const { VerifyAccessToken } = require('./helpers/jwt_helper')
const router = require('./Routes/Auth.route')
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', VerifyAccessToken, async (req, res, next) => {
    res.send("This is the home route")
})


app.use('/auth', router)

app.use(async (req, res, next) => {
    next(createErrors.NotFound())
})



app.use((err, req, res, next) => {
    res.status(err.status || 500)

    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
})


app.listen(PORT, () => {
    console.log('Server running on port ', PORT);
})