// API de nivel superior que facilita el uso de MongoDB en JS
const mongoose = require('mongoose')

// mongoose Schema and Model for mongodb
// Validation rules can be defined for each field in the Schema
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
})

// transform and toJSON functions, to customize the output of the mongoDb JSON objects
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // delete _id and _v fields from output, and show id as a String
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)