import React from 'react'
import { useMessageDispatch } from './MessageContext'

const useNotify = () => {
  const dispatch = useMessageDispatch()

  const setNotification = (message, duration = 5000) => {
    dispatch({ type: 'MESSAGE', payload: message })

    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, duration)
  }

  return setNotification
}

export default useNotify