const express = require('express')
require('express-async-errors') // allows to remove try&catch from the endpoint async calls
const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

// mongoDb connection
mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to noteApp mongoDB')
  })
  .catch(error => {
    console.log('error connecting to noteApp mongoDB:', error.message)
  })

// using front app stored in the dist folder
app.use(express.static('dist'))

// Permite Intercambio de Recursos de Origen Cruzado (CORS)
// - asi codigo JavaScript puede comunicarse con servidores en
// 2 origenes: 3008 (backend Node) y 3000 (React Dev Server).
const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(middleware.requestLogger)

// ENDPOINTS and server actions
app.use('/api/notes', notesRouter) // base url defined when calling Router
app.use('/api/users', usersRouter) // users endpoints
app.use('/api/login', loginRouter) // login and authentication endpoints

// Testing endpoint, only if app is started in Test mode
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

// controlador de solicitudes con un Endpoint desconocido
app.use(middleware.unknownEndpoint)

// This must be the last middleware loaded, and placed after the
// route definitions in the file
app.use(middleware.errorHandler)

module.exports = app