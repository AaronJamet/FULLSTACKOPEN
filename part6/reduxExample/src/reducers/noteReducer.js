import { createSlice, current } from "@reduxjs/toolkit"
import noteService from "../services/notes"

/* const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2
  }
] */

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    toggleImportanceOf(state, action) {
      const id = action.payload

      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }

      console.log(current(state))

      const newState = state.map(note => {
        return note.id !== id ? note : changedNote
      })

      console.log('State after Updating:', current(state))

      return newState
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    setNotes(state, action) {
      return action.payload
    }
  }
})

export const { 
  toggleImportanceOf, appendNote, setNotes 
} = noteSlice.actions

// ASYNCHRONOUS operations
export const initializeNotes = () => {
  return async dispatch => {
    // asynchronous action, first get notes from server 
    // and then dispatch them to the app's state
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export const createNote = content => {
  return async dispatch => {
    // first an asynchronous action is executed, then an action 
    // is dispatched to change the state in store
    const newNote = await noteService.createNew(content)
    dispatch(appendNote(newNote))
  }
}

export default noteSlice.reducer