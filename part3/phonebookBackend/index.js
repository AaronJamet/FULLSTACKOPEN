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

// get complete list of persons stored in mongoDB
app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response) => {
  const date = new Date()

  Person
    .find({})
    .then(persons => {
      response.send(
        `<p>Phonebook has info for ${persons.length} persons</p>
        <p>${date}</p>`
      )
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person
    .findById(id)
    .then(person => {
      response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateRandomId = () => Math.round(Math.random() * 10000000)

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name of Person missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number of Person missing'
    })
  }

  /* const nameRepeated = persons.find(p => p.name === body.name)
  if (nameRepeated !== undefined) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  } */

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server is running in port ${PORT}`);