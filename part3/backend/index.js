// EJEMPLO DE UN SERVIDOR WEB EN NODE.JS

// importar dotenv antes que el modelo Note, para que .env este disponible globalmente antes de importar otros modulos
require('dotenv').config() // cargar archivo configuracion con variables de entorno
const express = require('express')
const app = express()

const mongoose = require('mongoose')
const Note = require('./models/note')

app.use(express.static('dist'))

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

// Permite Intercambio de Recursos de Origen Cruzado (CORS) 
// - asi codigo JavaScript puede comunicarse con servidores en 
// 2 origenes: 3008 (backend Node) y 3000 (React Dev Server).
const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(requestLogger)

// ENDPOINTS and server actions
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response, next) => {
  // obtains all notes from the Atlas mongoDB
  Note.find({})
      .then(notes => {
        response.json(notes)
      })
      .catch(error => next(error))
})

// GET individual resources or Notes
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
      .then(note => {
        if (note) {
          response.json(note)
        } else {
          response.status(404).end()
        } 
      })
      .catch(error => {
        // pasar error hacia adelante con next(), como el throw en Java
        // la ejecucion continuara en el middleware de Control de errores
        next(error)
      })
})

// ELIMINAR recursos
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// POST, recibiendo datos en el servidor
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  // note objects are created with the constructor function of the Note mongoose Model
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  // save new note in mongoDB
  note.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
})

// PUT, update Note in mongoDB
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  // runValidators: true actives Validation for Updates, which are disabled by default
  // 'new: true' returns the object AFTER the update has been applied
  Note.findByIdAndUpdate(
    request.params.id, 
    { content, important }, 
    { new: true , runValidators: true, context: 'query'})
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
})

// controlador de solicitudes con un Endpoint desconocido
app.use(unknownEndpoint)

// Middleware to customize Error Handling in this backend
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // custom handling of error caused by ID object not valid for mongoDB
  // and handling on Validation errors in the else clause
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message})
  }

  // any other error is passed to the predetermined Express error handler
  next(error)
}

// This must be the last middleware loaded, and placed after the
// route definitions in the file
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
