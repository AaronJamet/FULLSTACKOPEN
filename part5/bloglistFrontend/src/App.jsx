import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      
      setUsername('')
      setPassword('')
    } catch(exception) {
      setIsErrorMessage(true)
      setMessage('Wrong/invalid credentials, cannot login')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
  }

  const loginForm = () => (
    <>
      <h2>Log in to bloglistApp</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input type='text' 
                     value={username} name="Username"
                     onChange={({ target }) => setUsername(target.value)}
              />
          </div>
          <div>
            password
              <input type='password' 
                     value={password} name="Password"
                     onChange={({ target }) => setPassword(target.value)}
              />
          </div>
          <button type='submit'>Login</button>
        </form>
    </>
  )

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog = { ...returnedBlog, user: user}
        setBlogs(blogs.concat(returnedBlog))
      })
      .catch(() => {
        setIsErrorMessage(true)
        setMessage(
          'Blog not added, there has been a problem'
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setBlogs(blogs.filter(b => b.id !== id))
      })
  }

  const updateLikes = (id) => {
    const blog = blogs.find(n => n.id === id)
    const newLikes = Number(blog.likes) + 1
    const changedBlog = { ...blog, likes: newLikes.toString(), user: user}

    blogService
      .update(id, changedBlog)
      .then(() => {
        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        )
      })
      .catch(() => {
        setIsErrorMessage(true)
        setMessage(
          `Blog '${blog.content}' have a problem and cannot update`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setBlogs(blogs.filter(b => b.id !== id))
      })
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Delete ${blog.title}, by ${blog.author}?`)) {
      blogService
        .deleteBlog(blog.id)
        .then(deletedBlog => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          setIsErrorMessage(false)
          setMessage(
            `Blog has been deleted correctly`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(() => {
          setIsErrorMessage(true)
          setMessage(
            `Error: Blog '${blog.content}' cannot be deleted`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      } 
  }

  // DISPLAY
  if (user === null) {
    return (
      <div>
        <Notification message={message} isError={isErrorMessage} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} isError={isErrorMessage} />
      <h2>blogs</h2>
      
      <p>{user.name} logged in</p>
      <Togglable buttonLabel="Create new blog">
        <BlogForm createBlog={addBlog} />
      </Togglable>
      
      {blogs
        .sort((b1, b2) => parseInt(b2.likes) - parseInt(b1.likes))
        .map(blog =>
        <Blog key={blog.id} 
              blog={blog} 
              user={user}     
              updateLikes={() => updateLikes(blog.id)} 
              deleteBlog={() => deleteBlog(blog)}
        />
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default App