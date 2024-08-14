import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

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

export const setNotification = (message, type, duration) => {
  return (dispatch) => {
    dispatch(clearNotification())
    dispatch(showNotification({ message, type }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, duration * 1000) // convert from seconds to milliseconds
  }
}

export const { clearNotification, showNotification } = notificationSlice.actions
export default notificationSlice.reducer