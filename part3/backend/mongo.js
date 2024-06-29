// API de nivel superior que facilita el uso de MongoDB en JS
const mongoose = require('mongoose')

// obligar a poner password como tercer parametro en la linea de comandos
if (process.argv.length < 3) {
  console.log('give password as third argument')
  process.exit()
}

// take password from third parameter introduced in line of comands
const password = process.argv[2]

// name of database can be assigned from this URL too (noteApp in this case)
const url =
  `mongodb+srv://fullstack:${password}@fullstackopen.ml3uoya.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// 1º parameter is singular name of the model
// the name of Collection created will automatically be
// that name in plural and lowercase ('notes' in this case)
const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

/* note.save().then(result => {
  console.log('note saved')
  mongoose.connection.close()
}) */
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })

  mongoose.connection.close()
})