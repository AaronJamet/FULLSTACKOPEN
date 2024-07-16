import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [blogName, setBlogName] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title: blogName,
      author: blogAuthor
    })

    setBlogName('')
    setBlogAuthor('')
  }

  return (
    <div>
      <h3>Add a new blog:</h3>

      <form onSubmit={addBlog}>
        <div>
          blog name:
          <input type="text"
            value={blogName}
            name="Blogname"
            onChange={({ target }) => setBlogName(target.value)}
          />
        </div>

        <div>
          blog author:
          <input type="text"
            value={blogAuthor}
            name="Blogauthor"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>

        <button type='submit'>Add Blog</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm