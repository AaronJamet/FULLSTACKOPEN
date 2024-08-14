const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    // using populate to replace the id referenced with the object of note documents,
    // selecting which fields to take as the second argument
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    // using populate to replace the id referenced with the object of note documents,
    // selecting which fields to take as the second argument
    .findById(request.params.id).populate('user', { username: 1, name: 1 })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id/comments', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      response.status(404).json({ error: 'Blog not found' })
    }

    response.json(blog.comments)
  } catch (e) {
    response.status(500).json({ error: 'Something went wrong in server...' })
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { content } = request.body
  if (!content) {
    response.status(400).json({ error: 'Comment content missing' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.status(400).json({ error: 'Blog not found' })
  }

  const comment = {
    content,
    date: new Date()
  }

  blog.comments = blog.comments.concat(comment)

  response.status(201).json(comment)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  const deletedBlog = await Blog.findByIdAndDelete(blog.id)
  user.blogs = user.blogs.filter(b => b.id !== deletedBlog._id)
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const userId = request.user.id

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes, userId },
    { new: true , runValidators: true, context: 'query' }
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter