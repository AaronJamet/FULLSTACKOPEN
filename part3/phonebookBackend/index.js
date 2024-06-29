const express = require('express')
const morgan = require('morgan')

const app = express()

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

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()

  response.send(
    `<p>Phonebook has info for ${persons.length}</p>
    <p>${date}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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

  const nameRepeated = persons.find(p => p.name === body.name)
  if (nameRepeated !== undefined) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3008
app.listen(PORT)
console.log(`Server is running in port ${PORT}`);