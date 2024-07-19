const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const app = require('../app')
const { log } = require('node:console')
const api = supertest(app)

const newUser = {
  username: 'test1',
  password: 'testmaster'
}

// function to be executed before the tests
// removes data of mongoDb and stores 2 new notes (to ensure DB is in the same state before each testing)
beforeEach(async() => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  // array of promises, for each note that will be saved
  const promiseArray = blogObjects.map(blog => blog.save())
  // transform a series of promises in a single promise, and awaits
  // that all these promises are done before advancing with the tests
  await Promise.all(promiseArray)

  // Create a new user to get a valid token for test POSTs
  await User.deleteOne({ username: 'test1' })
  await api
    .post('/api/users')
    .send(newUser)
})

test('blogs returned are the number expected and in JSON format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('verify that blogs have a primary key field called id', async () => {
  const blogs = await helper.blogsInDb()

  const blogsWithIdKey = blogs.filter(b => 'id' in b)
  assert.strictEqual(blogsWithIdKey.length, helper.initialBlogs.length)
})

test('a new valid blog can be added', async () => {
  // get valid token from user login response to authorize Blog POST
  const login = await api
    .post('/api/login')
    .send(newUser)

  const rootUser = await User.findOne({ username: newUser.username })

  const newBlog = {
    title: 'Ferdinando Buscema',
    author: 'Ferdinando Buscema',
    url: 'http://www.ferdinandobuscema.blogspot/',
    likes: 3,
    user: rootUser.id
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${login.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Ferdinando Buscema'))
})

test('if key likes lacks in post body, value assigned will be 0 by default', async () => {
  const login = await api
    .post('/api/login')
    .send(newUser)

  const rootUser = await User.findOne({ username: newUser.username })

  const newBlogWithoutLikes = {
    title: 'Ferdinando Buscema',
    author: 'Ferdinando Buscema',
    url: 'http://www.ferdinandobuscema.blogspot/',
    user: rootUser.id
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${login.body.token}`)
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  // const titles = blogsAtEnd.map(b => b.title)

  const newBlogPosted = blogsAtEnd.find(b => b.title.includes('Ferdinando Buscema'))
  assert.strictEqual(newBlogPosted.likes, '0')
})

test('if new blog body doesnt have title or url, backend responds with 400 Bad Request', async () => {
  const login = await api
    .post('/api/login')
    .send(newUser)

  const rootUser = await User.findOne({ username: newUser.username })

  const newBlogWithoutTitle = {
    author: 'Ferdinando Buscema',
    url: 'http://www.ferdinandobuscema.blogspot/',
    likes: 5,
    user: rootUser.id
  }

  const newBlogWithoutUrl = {
    title: 'Ferdinando Buscema',
    author: 'Ferdinando Buscema',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${login.body.token}`)
    .send(newBlogWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${login.body.token}`)
    .send(newBlogWithoutUrl)
    .expect(400)
})

test('a blog can be deleted by id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  const login = await api
    .post('/api/login')
    .send(newUser)

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${login.body.token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(!titles.includes(blogToDelete.title))
})

test('an existing blog is updated and its new value its replaced in the database', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  blogToUpdate.likes = 8

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  const blogUpdated = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(blogToUpdate.likes.toString(), blogUpdated.likes)
})

after(async () => {
  await mongoose.connection.close()
})