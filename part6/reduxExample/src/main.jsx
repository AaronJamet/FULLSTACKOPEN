import React from 'react'
import ReactDOM from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import App from './App'
import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

// Reducers manage the state from an app, the actual state and 
// action type as given as parameters to the function.
// Reducers never must be called directly from the app code, 
// is passed to createStore() as a parameter.
// State must be composed of immutable objects, that can be replaced by new modified objects.
const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
