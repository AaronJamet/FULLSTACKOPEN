import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserDetail = () => {
  const users = useSelector(state => state.user.allUsers)
  const { id } = useParams()

  // Retrieve the blog from the Redux store using the id from the URL
  const user = users ? users.find(user => user.id === id) : null

  return (
    <>
      <h2>{user.username}</h2>

      <h3>added blogs</h3>

      <ul>
        {user.blogs
          .map(blog => <li key={blog.id}>{blog.title}</li>)
        }
      </ul>
    </>
  )
}

export default UserDetail