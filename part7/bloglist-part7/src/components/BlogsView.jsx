import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useMatch,
  Routes, Route, Link
} from 'react-router-dom'
import { initializeBlogs, removeBlog, voteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import Blog from './Blog'

const BlogsView = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const updateLikes = async (id) => {
    const blog = blogs.find(n => n.id === id)

    try {
      dispatch(voteBlog(id))
      dispatch(initializeBlogs())
      dispatch(setNotification(`Blog '${blog.title}' liked successfully`, 'success', 5))
    } catch (error) {
      dispatch(setNotification(`Blog '${blog.title}' have a problem and cannot update`, 'error', 5))
    }
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Delete ${blog.title}, by ${blog.author}?`)) {
      try {
        dispatch(removeBlog(blog.id))
        dispatch(setNotification('Blog has been deleted correctly', 'success', 5))
      } catch (error) {
        dispatch(setNotification(`Error: Blog '${blog.title}' cannot be deleted`, 'error', 5))
      }
    }
  }

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 5,
    width: '100%',
    boxSizing: 'border-box'
  }

  const match = useMatch('blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === Number(match.params.id))
    : null

  if (!blogs.length) {
    return <div>Loading blogs...</div>
  }

  return(
    <div>
      <h2>blogs</h2>

      <Routes>
        {/* Route for the /blogs path */}
        <Route
          path="/"
          element={
            <div>
              {[...blogs]
                .sort((b1, b2) => parseInt(b2.likes) - parseInt(b1.likes))
                .map(blog =>
                  <p key={blog.id}>
                    <Link to={`/blogs/${blog.id}`}
                      key={blog.id} style={blogStyle}
                    >{blog.title} - {blog.author}</Link>
                  </p>
                )}
            </div>
          }
        />

        <Route path=':id' element={<Blog
          user={user.loggedInUser}
          updateLikes={updateLikes}
          deleteBlog={deleteBlog} />} />
      </Routes>
    </div>
  )
}

export default BlogsView