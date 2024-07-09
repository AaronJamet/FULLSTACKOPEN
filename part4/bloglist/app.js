const express = require('express')
const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const cors = require('cors')
const mongoose = require('mongoose')

// mongoDb connection
mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to bloglistApp mongoDB')
  })
  .catch(error => {
    logger.info('error connecting to bloglistApp mongoDB:', error.message)
  })

app.use(cors())

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

// ENDPOINTS and server actions
app.use('/api/blogs', blogsRouter) // base url defined when calling Router
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)

// This must be the last middleware loaded, and placed after the
// route definitions in the file
app.use(middleware.errorHandler)

module.exports = app