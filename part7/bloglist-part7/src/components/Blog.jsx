import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { postComment } from '../reducers/blogReducer'
import { Button, TextField } from '@mui/material'

const Blog = ({ user, updateLikes, deleteBlog }) => {
  const [newComment, setNewComment] = useState('')
  const blogs = useSelector(state => state.blogs)
  const { id } = useParams()
  const dispatch = useDispatch()

  // Retrieve the blog from the Redux store using the id from the URL
  const blog = blogs.find(blog => blog.id === id)

  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    await dispatch(postComment(id, { content: newComment }))
    setNewComment('')
  }

  const sxValues = {
    width: '100%',
    maxWidth: '300px',
    marginTop: '3px',
    marginBottom: '16px',
    '& .MuiInputBase-root': {
      height: '30px',
    },
    '& .MuiInputBase-input': {
      fontSize: '0.85rem',
      padding: '6px 8px',
    }
  }

  if (!blog) {
    return <div>Blog not found or loading...</div>
  }

  return (
    <>
      <h3>{blog.title} - {blog.author}</h3>

      <p> <a href="{blog.url}">{blog.url}</a> </p>
      <p title="likes"> likes: {blog.likes} &nbsp;
        <Button type="submit" id="likesButton" onClick={() => updateLikes(blog.id)}
          variant="outlined" color="primary">
          Like
        </Button>
      </p>
      {blog.user
        ? <p>added by {blog.user.name} </p>
        : null
      }
      {blog.user && blog.user.name === user.name
        ? <p><Button type="submit" onClick={() => deleteBlog(blog)}
          variant="outlined" color="primary" sx={{ mt: 2 }}>
          Delete blog
        </Button></p>
        : null
      }

      <h4>comments</h4>

      <form onSubmit={handleCommentSubmit}>
        <TextField
          type="text"
          value={newComment}
          onChange={({ target }) => setNewComment(target.value)}
          placeholder='Write a comment'
          size='small'
          sx={sxValues}
        />
        &nbsp;&nbsp;
        <Button type='submit'
          variant="outlined" color="primary" >
            add comment
        </Button>
      </form>

      <ul>
        {Array.isArray(blog.comments) && blog.comments.length > 0
          ? blog.comments.map((comment, index) =>
            comment && comment.content
              ? <li key={index}> {comment.content}</li>
              : null
          )
          : <p>no comments added yet</p>
        }
      </ul>
    </>
  )
}

export default Blog