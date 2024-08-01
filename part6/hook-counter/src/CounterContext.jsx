import { createContext, useContext, useReducer } from 'react'

// manages state with the React hook useReducer
const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}

// Context API is a type of global app state, which can be given access
// from any component in the app
const CounterContext = createContext()

export const CounterContextProvider = (props) => {
  // useReducer creates state for the app, fist parameter is a reducer 
  // that handles changes of state, and the second the initial value of state
  // returns an array which first element allows to access the actual value
  // of the state, and the second is a dispatch function to change state 
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={ [counter, counterDispatch] }>
      {props.children}
    </CounterContext.Provider>
  )
}

// CUSTOMIZED HOOKS (name always must start by the word 'use')
export const useCounterValue = () => {
  const counterAndDispatch = useContext(CounterContext)
  return counterAndDispatch[0]
}

export const useCounterDispatch = () => {
  const counterAndDispatch = useContext(CounterContext)
  return counterAndDispatch[1]
}

export default CounterContext