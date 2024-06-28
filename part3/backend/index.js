// EJEMPLO DE UN SERVIDOR WEB EN NODE.JS
const express = require('express')
const app = express()

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]

app.use(express.static('dist'))

// Permite Intercambio de Recursos de Origen Cruzado (CORS) 
// - asi codigo JavaScript puede comunicarse con servidores en 
// 2 origenes: 3008 (backend Node) y 3000 (React Dev Server).
const cors = require('cors')
app.use(cors())

// Ejemplo de MIDDLEWARE: funciones que pueden usarse para 
// manejar objetos de REQUEST y RESPONSE
// Esta función imprime info sobre cada solicitud que se envía al servidor
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:', request.path);
  console.log('Body:', request.body);
  console.log('---');
  next() // cede el control al siguiente Middleware
}

app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.send(notes)
})

// GET individual resources or Notes
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).send('The ID hasnt been found on the server')
  }
})

// ELIMINAR recursos
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

// POST, recibiendo datos en el servidor
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0

    return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId()
  }

  notes = notes.concat(note)

  response.json(note)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3008
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
