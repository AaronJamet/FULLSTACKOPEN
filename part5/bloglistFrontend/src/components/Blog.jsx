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

  const hideWhenVisible = { display: showDetails ? '' : 'none' }
  const buttonLabel =  showDetails ? 'Hide details' : 'View details'

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }


  return (
    <>
      <div style={blogStyle} id='titleAuthorText'>
        <p> {blog.title} - {blog.author} &nbsp;
          <button id='detailsButton' onClick={toggleVisibility}>{buttonLabel}</button>
        </p>

        <div style={hideWhenVisible} id='detailsText'>
          <p> {blog.url} </p>
          <p title="likes"> likes: {blog.likes} &nbsp;
            <button type="submit" id="likesButton" onClick={updateLikes}>Like</button>
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
      </div>
    </>
  )
}

export default Blog