import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import UsersView from './components/UsersView'
import BlogsView from './components/BlogsView'
import { setNotification } from './reducers/notificationReducer'
import { createBlog, initializeBlogs, removeBlog, voteBlog } from './reducers/blogReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/userReducer'
import {
  Routes, Route, Link
} from 'react-router-dom'
import { Container, TextField, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

// Styled Link using Material-UI's styled utility
const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontSize: '0.875rem', // Smaller font size
  padding: '0 8px', // Adjust padding
  '&:hover': {
    textDecoration: 'underline',
  }
}))

const App = () => {
  //const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      dispatch(loginUser({ username, password }))

      setUsername('')
      setPassword('')

      dispatch(setNotification('Successfully logged in', 'normal', 5))
    } catch(exception) {
      dispatch(setNotification('Wrong/invalid credentials, cannot login', 'error', 5))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const sxValues = {
    width: '100%',
    maxWidth: '200px',
    marginBottom: '16px',
    '& .MuiInputBase-root': {
      height: '30px',
    },
    '& .MuiInputBase-input': {
      fontSize: '0.85rem',
      padding: '6px 8px',
    }
  }

  const loginForm = () => (
    <>
      <h2>Log in to bloglistApp</h2>
      <form onSubmit={handleLogin}>
        <div>
          <p>username</p>
          <TextField type='text'
            value={username} name="Username"
            onChange={({ target }) => setUsername(target.value)}
            placeholder='write username here'
            size='small'
            sx={sxValues}
          />
        </div>
        <div>
          <p>password</p>
          <TextField type='password'
            value={password} name="Password"
            onChange={({ target }) => setPassword(target.value)}
            placeholder='write password here'
            size='small'
            sx={sxValues}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </>
  )

  const addBlog = async (blogObject) => {
    try {
      blogObject = { ...blogObject, user: user }
      dispatch(createBlog(blogObject))
      dispatch(setNotification('Blog added successfully', 'success', 5))
    } catch (error) {
      dispatch(setNotification('Blog not added, there has been a problem', 'error', 5))
    }
  }

  // DISPLAY
  if (user.loggedInUser === null) {
    return (
      <div>
        <Notification />
        {loginForm()}
      </div>
    )
  }

  const padd = {
    padding: 5
  }

  const linksDiv = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    padding: '5px',
    width: '100%',
    boxSizing: 'border-box',
    gap: '10px'
  }

  return (
    <Container>
      <div>
        <div style={linksDiv}>
          <NavLink style={padd} to="/blogs">blogs</NavLink>
          <NavLink style={padd} to="/users">users</NavLink>
          {user.loggedInUser
            ? <Typography variant="body2" style={{ marginLeft: 'auto' }}>
              {user.loggedInUser.name} logged in
            </Typography>
            : null
          }
          <button onClick={handleLogout}>Logout</button>
        </div>

        <Notification />
        <h2>blogs app</h2>

        <Togglable buttonLabel="Create new blog">
          <BlogForm createBlog={addBlog} />
        </Togglable>

        <br />

        <Routes>
          <Route path='/blogs/*' element={<BlogsView />} />
          <Route path='/users/*' element={<UsersView />} />
        </Routes>
      </div>
    </Container>
  )
}

export default App