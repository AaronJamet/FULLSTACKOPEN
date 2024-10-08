const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to phonebookApp mongoDB')
  })
  .catch(error => {
    console.log('error connecting to phonebookApp mongoDB:', error.message)
  })

// mongoose Schema and Model for phonebookApp mongoDB
// Validation rules can be defined for each field in the Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'User name is required']
  },
  number: {
    type: String,
    validate: { // custom validator for phone format
      validator: function(v) {
        return /^\d{2,3}-\d{1,}$/.test(v)
      },
      message: props => `${props.value} is NOT a valid phone number format`
    },
    required: [true, 'User phone number is required']
  }
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
