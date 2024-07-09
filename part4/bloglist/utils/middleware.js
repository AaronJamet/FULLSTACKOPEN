const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Ejemplo de MIDDLEWARE: funciones que pueden usarse para
// manejar objetos de REQUEST y RESPONSE
// Esta función imprime info sobre cada solicitud que se envía al servidor
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('---')
  next() // cede el control al siguiente Middleware
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const tokenValue = authorization.replace('Bearer ', '')
    request.token = tokenValue

  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
  let decodedToken = ''

  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid, doesnt match with any user' })
    }
  } catch {
    return response.status(401).json({ error: 'token invalid, bad formatted' })
  }
  
  // get user id after token validation, from the decoded token
  try {
    const user = await User.findById(decodedToken.id)
    console.log(user);
    request.user = user
  } catch(error) {
    next(error)
  }
  
  next()
}

// Middleware to customize Error Handling in this backend
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  // custom handling of error caused by ID object not valid for mongoDB
  // and handling on Validation errors in the else clause
  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({
      error: 'expected `username` to be unique'
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'token invalid'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  // any other error is passed to the predetermined Express error handler
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}