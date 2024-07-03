// API de nivel superior que facilita el uso de MongoDB en JS
const mongoose = require('mongoose')

//Error control
if (process.argv.length < 3) {
  console.log('you must give password as third argument to connect mongoDB')
  process.exit()
}

if (process.argv.length === 4) {
  console.log('you must give name as 4º argument and number as 5 argument to save new Person in DB people')
  process.exit()
}

if (process.argv.length > 5) {
  console.log('you cannot give more than 5 arguments in command line')
  process.exit()
}

// MongoDB connection
const password = process.argv[2]

const url =
`mongodb+srv://fullstack:${password}@fullstackopen.ml3uoya.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Schema and Model for the Person objects stored in mongoDB
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// ADD new persons to mongoDb
if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log('person saved in DB')
    mongoose.connection.close()
  })
}

// GET all persons stored in our mongoDB
if (process.argv.length === 3) {
  Person
    .find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(person.name + ' ' + person.number)
      })

      mongoose.connection.close()
    })
}

