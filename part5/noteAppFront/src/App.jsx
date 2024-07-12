import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
  
  // checks if user is already logged when the pages loads, and gets user info in that case
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from the server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password
      })

      // save user info in local storage to avoid lose login at refreshing page
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      // get token from login response, to allow the logged user to post or delete notes
      noteService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')
    } catch(exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <>
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
        <div>
          username
            <input type="text" 
                   value={username}
                   name="Username"
                   onChange={({ target }) => setUsername(target.value)} 
            />
        </div>
        <div>
          password
            <input type="password" 
                   value={password}
                   name="Password"
                   onChange={({ target }) => setPassword(target.value)} 
            />
        </div>
        <button type='submit'>login</button>
    </form>
    </>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type='submit'>save</button>
    </form>
  )

  return (
    <div>
      <h1>Notes App</h1>
      <Notification message={errorMessage} />

      {user === null 
        ? loginForm()
        : <div>
            <p>{user.name} logged-in</p>
            {noteForm()}  
          </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show: {showAll ? 'important notes' : 'all notes'}
        </button>
      </div>

      <ul>
        {notesToShow.map((note, i) => 
          <Note 
            key={i}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <Footer />
    </div>
  )
}

export default App
