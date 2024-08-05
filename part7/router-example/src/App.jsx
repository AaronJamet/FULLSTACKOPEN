import {
  BrowserRouter as Router,
  Routes, Route, Link,
  Navigate, 
  useNavigate, useMatch
} from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableRow, Alert, 
} from '@mui/material'
import styled from 'styled-components'

// DEFINITION OF STYLED-COMPONENTS
const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  background: Burlywood;
  padding: 1em;
`

const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

// NORMAL COMPONENTS
const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('ajametor')
    navigate('/')
  }

  return (
    <div>
      <h2>login</h2>

      <form onSubmit={onSubmit}>
        <div>
          username:
          <Input />
        </div>
        <div>
          password:
          <Input type='password' />
        </div>

        <Button type='submit' primary=''>login</Button>
      </form>
    </div>
  )
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired
}

const Note = ({note}) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}

Note.propTypes = {
  note: PropTypes.shape({
    content: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    important: PropTypes.bool.isRequired,
  })
}

const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2> 

    <TableContainer component={Paper}>
      <Table>
        <TableBody>
        {notes.map(note => (
          <TableRow key={note.id}>
            <TableCell>
              <Link to={`/notes/${note.id}`}>{note.content}</Link>
            </TableCell>

            <TableCell>
              {note.user}
            </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

Notes.propTypes = {
  notes: PropTypes.array.isRequired
}

const Users = () => (
  <div> 
    <h2>Users</h2> 
    <ul>
      <li>Matti Luukkainen</li>
      <li>Juha Tauriainen</li>
      <li>Arto Hellas</li>
      <li>ajametor</li>
    </ul>
  </div>
)

const App = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'HTML is easy',
      important: true,
      user: 'Matti Luukkainen'
    },
    {
      id: 2,
      content: 'Browser can execute only JavaScript',
      important: false,
      user: 'Matti Luukkainen'
    },
    {
      id: 3,
      content: 'Most important methods of HTTP-protocol are GET and POST',
      important: true,
      user: 'Arto Hellas'
    }
  ])

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const login = (user) => {
    setUser(user)

    setMessage(`Welcome ${user}`), Alert
    setTimeout(() =>{
      setMessage(null)
    }, 10000)
  }

  const padding = {
    padding: 5
  }

  // useMatch Hook used to obtain the id from the note that will be shown in the App component
  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  return (
    <Page>
      <div>
        {(message &&
          <Alert severity='success'>
            {message}
          </Alert>
        )}
      </div>  

      <Navigation>
        <Link style={padding} to='/'>home</Link>
        <Link style={padding} to='/notes'>notes</Link>
        <Link style={padding} to='/users'>users</Link>
        {user
          ? <em>{user} logged in</em>
          : <Link style={padding} to='/login'>login</Link>
        }
      </Navigation>

      <Routes>
        <Route path='/notes/:id' element={<Note note={note} />} />
        <Route path='/notes' element={<Notes notes={notes} />} />
        <Route path='/users' element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path='/login' element={<Login onLogin={login}/>} />
        <Route path='/' element={<Home />} />
      </Routes>

      <Footer>
        <br />
        <em>Note App, Department of Computer Science 2024</em>
      </Footer>
    </Page>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>,
)
