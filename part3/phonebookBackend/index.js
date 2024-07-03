const express = require('express')
const morgan = require('morgan')

require('dotenv').config() // cargar archivo configuracion con variables de entorno
const app = express()

const mongoose = require('mongoose')
const Person = require('./models/person')

// takes static files for deploying front from dist folder
app.use(express.static('dist'))

// Permite Intercambio de Recursos de Origen Cruzado (CORS) 
// - asi codigo JavaScript puede comunicarse con servidores en 
// 2 origenes: 3008 (backend Node) y 3000 (React Dev Server).
const cors = require('cors')
app.use(cors())

app.use(express.json())

morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time :body'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}

// get complete list of persons stored in mongoDB
app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date()

  Person
    .find({})
    .then(persons => {
      response.send(
        `<p>Phonebook has info for ${persons.length} persons</p>
        <p>${date}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person
    .findById(id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))  
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

// PUT, update Note in mongoDB
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // runValidators: true actives Validation for Updates, which are disabled by default
  // 'new: true' returns the object AFTER the update has been applied
  Person.findByIdAndUpdate(
    request.params.id, 
    { name, number }, 
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// controlador de solicitudes con un Endpoint desconocido
app.use(unknownEndpoint)

// Middleware to customize Error Handling in this backend
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // custom handling of error caused by ID object not valid for mongoDB
  // and for validation errors in the else clause
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  // any other error is passed to the predetermined Express error handler
  next(error)
}
// This must be the last middleware loaded, and placed after the
// route definitions in the file
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server is running in port ${PORT}`);