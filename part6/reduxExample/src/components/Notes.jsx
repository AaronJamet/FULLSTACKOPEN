import { toggleImportanceOf } from '../reducers/noteReducer'
import { useSelector, useDispatch } from 'react-redux'

const Note = ({ note, handleClick }) => {
  return(
    <li onClick={handleClick}>
      {note.content} &nbsp;
      <strong>{note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  // the hook useDispatch allows access to any component to dispatch function of redux-store
  // that allows all components to change the state of Redux store
  const dispatch = useDispatch()
  // useSelector can access, with a function as parameter, to the data in Redux store
  const notes = useSelector(({ filter, notes }) => {
    if (filter === 'ALL') {
      return notes
    }
    return filter === 'IMPORTANT'
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)
  })
  console.log('Current State:', notes)

  return(
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() =>
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

export default Notes