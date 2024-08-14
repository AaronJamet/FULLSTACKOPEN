import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  TextField, Button
} from '@mui/material'

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

  const sxValues = {
    width: '100%',
    maxWidth: '300px',
    marginBottom: '16px',
    '& .MuiInputBase-root': {
      height: '30px',
    },
    '& .MuiInputBase-input': {
      fontSize: '0.85rem',
      padding: '6px 8px',
    }
  }

  return (
    <div>
      <h3>Add a new blog:</h3>

      <form onSubmit={addBlog}>
        <div>
          <p>blog name:</p>
          <TextField type="text"
            value={blogName}
            name="Blogname"
            onChange={({ target }) => setBlogName(target.value)}
            placeholder='write blog name here'
            size='small'
            sx={sxValues}
          />
        </div>

        <div>
          <p>blog author:</p>
          <TextField type="text"
            value={blogAuthor}
            name="Blogauthor"
            onChange={({ target }) => setBlogAuthor(target.value)}
            placeholder='write blog author here'
            size='small'
            sx={sxValues}
          />
        </div>

        <Button type='submit'
          variant="outlined" color="primary" sx={{ mt: 2 }}>
          Add Blog
        </Button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm