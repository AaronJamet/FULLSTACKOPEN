const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: Date.now
  }
})

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 4,
    required: true
  },
  author: {
    type: String,
    minLength: 5,
    required: true
  },
  url: {
    type: String,
    minLength: 10,
  },
  likes: {
    type: String,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [commentSchema]
})

// transform and toJSON functions, to customize the output of the mongoDb JSON objects
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // delete _id and _v fields from output, and show id as a String
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)