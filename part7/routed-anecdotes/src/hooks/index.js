import { useState } from 'react'

// CUSTOM HOOK
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const resetValue = () => {
    setValue('')
  }

  return {
    field: {
      type, value, onChange
    },
    resetValue
  }
}