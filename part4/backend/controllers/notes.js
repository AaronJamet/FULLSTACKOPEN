const notesRouter = require('express').Router()
const Note = require('../models/note')

// asynchronous example in endpoint
notesRouter.get('/', async (request, response) => {
  // obtains all notes asynchronously from the Atlas mongoDB
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  // note objects are created with the constructor function of the Note mongoose Model
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  // save new note in mongoDB
  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
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