const express = require('express')
const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

const cors = require('cors')
const mongoose = require('mongoose')

// mongoDb connection
mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to phonebookApp mongoDB')
  })
  .catch(error => {
    logger.info('error connecting to phonebookApp mongoDB:', error.message)
  })

app.use(cors())

app.use(express.json())
app.use(middleware.requestLogger)

// ENDPOINTS and server actions
app.use('/api/blogs', blogsRouter) // base url defined when calling Router

app.use(middleware.unknownEndpoint)

// This must be the last middleware loaded, and placed after the
// route definitions in the file
app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
