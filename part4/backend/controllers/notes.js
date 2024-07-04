const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response, next) => {
  // obtains all notes from the Atlas mongoDB
  Note.find({})
    .then(notes => {
      response.json(notes)
    })
    .catch(error => next(error))
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  // note objects are created with the constructor function of the Note mongoose Model
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  // save new note in mongoDB
  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  // runValidators: true actives Validation for Updates, which are disabled by default
  // 'new: true' returns the object AFTER the update has been applied
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true , runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter