const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { gql, UserInputError } = require('apollo-server')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

mongoose.set('strictQuery', false)
require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then( async () => {
    console.log('connected to MongoDB')
    
    // insert authors in database if its empty
    const existingAuthors = await Author.find({})
    if (existingAuthors.length === 0) {
      await Author.insertMany(authors)
      console.log('authors inserted')
    }

    // Insert books in database if it's empty
    const existingBooks = await Book.find({})
    if (existingBooks.length === 0) {
      const authorMap = {}
      for (const author of authors) {
        const savedAuthor = await Author.findOne({ name: author.name })
        authorMap[author.name] = savedAuthor._id
      }

      const booksToInsert = books.map(book => ({
        ...book,
        author: authorMap[book.author]
      }))

      await Book.insertMany(booksToInsert)
      console.log('books inserted')
    }  
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!,
    favoriteGenre: String!,
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  } 

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author})
        if (author) {
          query.author = author._id
        }
      }

      if (args.genre) {
        query.genre = { $in: [args.genre] }
      }

      return await Book.find(query).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({})

      const authorsWithBookCount = await Promise.all(
        authors.map(async (author) => {
          const bookCount = await Book.countDocuments({ author: author._id })
        
          return {
            name: author.name,
            born: author.born || null,
            bookCount
          }
        })
      )

      return authorsWithBookCount
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      // allow only to add book if the user is logged in and valid
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (await Book.findOne({ title: args.title })) {
        throw new GraphQLError('Title of book must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      if (args.title < 2) {
        throw new GraphQLError('Book title must be at least 2 characters long', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author
          }
        })
      }

      if (args.author.length < 4) {
        throw new GraphQLError('Author name must be at least 4 characters long', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author
          }
        })
      }

      // find author by name, or create a new one
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      // create and save the new book added
      const book = new Book({
        title: args.title,
        author: author._id,
        published: args.published,
        genres: args.genres
      })
      await book.save()

      return book.populate('author')
    },
    editAuthor: async (root, args) => {
      // allow only to edit author if the user is logged in and valid
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (args.author.length < 4) {
        throw new GraphQLError('Author name must be at least 4 characters long', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'NOT_FOUND',
            invalidArgs: args.name,
          },
        })
      }

      if (args.setBornTo < 1000 || args.setBornTo > new Date().getFullYear()) {
        throw new GraphQLError('Born year must be a valid year', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
          },
        })
      }

      author.born = args.setBornTo
      await author.save()

      return author
    },
    createUser: async (root, args) => {
      if (!args.username) {
        throw new GraphQLError('Username must not be null', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
          },
        });
      }

      if (!args.favoriteGenre) {
        throw new GraphQLError('Favorite genre must not be null', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.favoriteGenre,
          },
        });
      }

      const user = new User({ 
        username: args.username, 
        favoriteGenre: args.favoriteGenre
      })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({ author: root._id })
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )

      const currentUser = await User
        .findById(decodedToken.id)
      return currentUser
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})