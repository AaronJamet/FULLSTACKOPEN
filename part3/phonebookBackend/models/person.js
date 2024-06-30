const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to phonebookApp mongoDB')
  })
  .catch(error => {
    console.log('error connecting to phonebookApp mongoDB:', error.message)
  })

// mongoose Schema and Model for phonebookApp mongoDB
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

// transform and toJSON functions, to customize the output of the mongoDb JSON objects
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // delete _id and _v fields from output, and show id as a String
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
