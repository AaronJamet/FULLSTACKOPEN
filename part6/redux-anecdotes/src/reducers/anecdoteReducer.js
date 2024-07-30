import { createSlice, current } from "@reduxjs/toolkit"
import anecdotesService from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload.id
      const changedAnecdote = action.payload

      const newState = state.map(anecdote => {
        return anecdote.id !== id ? anecdote : changedAnecdote
      })

      console.log('State after Updating:', current(state))

      return newState
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
  }
)

export const { 
  vote, appendAnecdote, setAnecdotes 
} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = id => {
  return async dispatch => {
    const updatedAnecdote = await anecdotesService.updateAnecdote(id)
    console.log('Updated anecdote:', updatedAnecdote);
    dispatch(vote(updatedAnecdote))
  }
} 

export default anecdoteSlice.reducer