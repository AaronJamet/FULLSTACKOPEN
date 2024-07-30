import { configureStore } from '@reduxjs/toolkit'
import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

// Reducers manage the state from an app, the actual state and 
// action type as given as parameters to the function.
// Reducers never must be called directly from the app code, 
// is passed to configureStore() as a parameter. 
// State must be composed of immutable objects, that can be replaced by new modified objects.
const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

export default store