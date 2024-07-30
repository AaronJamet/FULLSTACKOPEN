import { createSlice } from "@reduxjs/toolkit"

const initialState = null

export const handleVoteNotification = (anecdote) => (dispatch) => {
  dispatch(clearNotification())
  dispatch(voteNotification(anecdote))
  setTimeout(() => {
    console.log('Clearing notification')
    dispatch(clearNotification())
  }, 5000)
}

export const handleCreateNotification = (anecdote) => (dispatch) => {
  dispatch(clearNotification());
  dispatch(createNotification(anecdote));
  setTimeout(() => {
    console.log('Clearing notification');
    dispatch(clearNotification());
  }, 5000)
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotification() {
      return ''
    },
    showNotification(state, action) {
      return action.payload
    }
  }
})

export const setNotification = (message, duration) => {
  return (dispatch) => {
    dispatch(clearNotification())
    dispatch(showNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, duration * 1000) // convert from seconds to milliseconds
  }
}

export const { clearNotification, showNotification } = notificationSlice.actions  
export default notificationSlice.reducer