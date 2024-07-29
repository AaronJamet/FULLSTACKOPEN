import { useEffect } from 'react'
import NewNote from './components/NewNote'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { useDispatch } from 'react-redux'
import noteService from './services/notes'
import { setNotes } from './reducers/noteReducer'

const App = () => {
 
// Initialize note states based in data recieved from the backend
const dispatch = useDispatch()
useEffect(() => {
  noteService.getAll().then(notes => {
    dispatch(setNotes(notes))
  })
}, [])  
 
  return(
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
