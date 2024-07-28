import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'

const NewNote = () => {
  const dispatch = useDispatch()

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''

    dispatch(createNote(content)) // calls to Action Creator
  }

  return (
    <form onSubmit={addNote}>
      <input name='note' />
      <button type='submit'>Add</button>
    </form>
  )
}

export default NewNote