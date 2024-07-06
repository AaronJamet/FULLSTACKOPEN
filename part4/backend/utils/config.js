require('dotenv').config()

const PORT = process.env.PORT
// independient url variables for DB of development profile, and testing profile 
const MONGODB_URI =  process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  PORT, MONGODB_URI
}