const logger = require('./logger')

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

// Middleware to customize Error Handling in this backend
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  // custom handling of error caused by ID object not valid for mongoDB
  // and handling on Validation errors in the else clause
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  // any other error is passed to the predetermined Express error handler
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}