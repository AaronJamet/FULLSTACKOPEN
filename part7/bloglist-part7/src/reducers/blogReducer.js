import { createSlice, current } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload.id
      const changedBlog = action.payload

      const newState = state.map(blog => {
        return blog.id !== id ? blog : changedBlog
      })

      console.log('State after Updating:', current(state))

      return newState
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    deleteBlog(state, action) {
      const id = action.payload

      return state.filter(blog => blog.id !== id)
    },
    setBlogs(state, action) {
      return action.payload
    },
    addComment(state, action) {
      const { id, comment } = action.payload
      const blogToUpdate = state.find(blog => blog.id === id)

      if (blogToUpdate) {
        blogToUpdate.comments = blogToUpdate.comments.concat({
          content: comment.content,
          date: comment.date,
          _id: comment._id
        })
      }

      console.log('Updated blog state:', current(state))
    }
  }
})

export const {
  vote, appendBlog, setBlogs, deleteBlog, addComment
} = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogsService.getAll()
    console.log('Initial blogs:', blogs)
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogsService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const removeBlog = id => {
  return async dispatch => {
    await blogsService.deleteBlog(id)
    dispatch(deleteBlog(id))
  }
}

export const voteBlog = id => {
  return async dispatch => {
    const updatedBlog = await blogsService.updateBlog(id)
    console.log('Updated blog:', updatedBlog)
    dispatch(vote(updatedBlog))
  }
}

export const postComment = (id, content) => {
  return async dispatch => {
    const newComment = await blogsService.addComment(id, content)
    dispatch(addComment({ id, comment: newComment }))
  }
}

export default blogSlice.reducer