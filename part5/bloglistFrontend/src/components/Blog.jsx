import { useState } from 'react'

const Blog = ({ blog, user, updateLikes, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 5
  }

  const hideWhenVisible = { display: showDetails ? 'none' : '' }
  const showWhenVisible = { display: showDetails ? '' : 'none' }

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }

  if (!showDetails) {
    return (
      <div style={blogStyle}>
        <p> {blog.title} - {blog.author} &nbsp;
          <button onClick={toggleVisibility}>View details</button>
        </p>
      </div>
    )
  }

  if (showDetails) {
    return (
      <div style={blogStyle}>
        <p> {blog.title} - {blog.author} &nbsp;
          <button onClick={toggleVisibility}>Hide details</button>
        </p>
        <p> {blog.url} </p>
        <p> likes: {blog.likes} &nbsp;
          <button type="submit" onClick={updateLikes}>Like</button>
        </p>
        {blog.user
          ? <p> {blog.user.name} </p>
          : null
        }
        {blog.user && blog.user.name === user.name
          ? <p><button type="submit" onClick={deleteBlog}>Delete blog</button></p>
          : null
        }
      </div>
    )
  }
}

export default Blog