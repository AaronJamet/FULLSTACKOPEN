import { useEffect } from 'react'
import NewNote from './components/NewNote'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { useDispatch } from 'react-redux'
import { initializeNotes, setNotes } from './reducers/noteReducer'

const App = () => {
 
  // Initialize note states based in data recieved from the backend
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeNotes())
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
