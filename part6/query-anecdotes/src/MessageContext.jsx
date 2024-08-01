import { createContext, useContext, useReducer } from 'react'

// manages state with the React hook useReducer
const messageReducer = (state, action) => {
  switch (action.type) {
    case "MESSAGE":
        return action.payload
    case "CLEAR":
        return null
    default:
        return null
  }
}

// Context API is a type of global app state, which can be given access
// from any component in the app
const MessageContext = createContext()

export const MessageContextProvider = (props) => {
  // useReducer creates state for the app, fist parameter is a reducer 
  // that handles changes of state, and the second the initial value of state
  // returns an array which first element allows to access the actual value
  // of the state, and the second is a dispatch function to change state 
  const [message, messageDispatch] = useReducer(messageReducer, 0)

  return (
    <MessageContext.Provider value={ [message, messageDispatch] }>
      {props.children}
    </MessageContext.Provider>
  )
}

// CUSTOMIZED HOOKS (name always must start by the word 'use')
export const useMessageValue = () => {
  const messageAndDispatch = useContext(MessageContext)
  return messageAndDispatch[0]
}

export const useMessageDispatch = () => {
  const messageAndDispatch = useContext(MessageContext)
  return messageAndDispatch[1]
}

export default MessageContext