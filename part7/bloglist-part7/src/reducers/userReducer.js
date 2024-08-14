import { createSlice, current } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import userService from '../services/users'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loggedInUser: null,
    allUsers: []
  },
  reducers: {
    setUser(state, action) {
      state.loggedInUser = action.payload
    },
    clearUser(state) {
      state.loggedInUser = null
    },
    getAllUsers(state, action) {
      state.allUsers = action.payload
    }
  }
})

export const { setUser, clearUser, getAllUsers } = userSlice.actions

export const loginUser = (credentials) => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)

      dispatch(setUser(user))
      dispatch(setNotification('Successfully logged in', 'success', 5))
    } catch (error) {
      dispatch(setNotification('Wrong/invalid credentials, cannot login', 'error', 5))
    }
  }
}

export const logoutUser = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken(null)

    dispatch(clearUser())
    dispatch(setNotification('Successfully logged out', 'success', 5))
  }
}

export const initializeUser = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export const fetchAllUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    console.log(users)

    dispatch(getAllUsers(users))
  }
}

export default userSlice.reducer