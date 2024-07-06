const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const app = require('../app')
const api = supertest(app)

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
  const newBlog = {
    title: 'Ferdinando Buscema',
    author: 'Ferdinando Buscema',
    url: 'http://www.ferdinandobuscema.blogspot/',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Ferdinando Buscema'))
})

test('if key likes lacks in post body, value assigned will be 0 by default', async () => {
  const newBlogWithoutLikes = {
    title: 'Ferdinando Buscema',
    author: 'Ferdinando Buscema',
    url: 'http://www.ferdinandobuscema.blogspot/'
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  // const titles = blogsAtEnd.map(b => b.title)
  
  const newBlogPosted = blogsAtEnd.find(b => b.title.includes('Ferdinando Buscema'))
  assert.strictEqual(newBlogPosted.likes, '0')
})

test('if new blog body doesnt have title or url, backend responds with 400 Bad Request', async () => {
  const newBlogWithoutTitle = {
    author: 'Ferdinando Buscema',
    url: 'http://www.ferdinandobuscema.blogspot/',
    likes: 5
  }

  const newBlogWithoutUrl = {
    title: 'Ferdinando Buscema',
    author: 'Ferdinando Buscema',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})