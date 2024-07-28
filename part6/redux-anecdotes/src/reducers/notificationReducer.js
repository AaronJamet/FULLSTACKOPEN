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
    voteNotification(state, action) {
      const message = `you voted '${action.payload.content}'`

      return message
    },
    createNotification(state, action) {
      const message = `New note created: '${action.payload}'`
      
      return message
    }
  }
})


export const { clearNotification, voteNotification, createNotification } = notificationSlice.actions  
export default notificationSlice.reducer