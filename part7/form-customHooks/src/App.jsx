import { useState } from 'react'

// custom Hook for managing state of the form fields
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type, value, onChange
  }
}

const App = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    <div>
      <form>
        name:
        <input {...name}/>
        <br />

        birthdate:
        <input {...born}/>
        <br />

        height:
        <input {...height}/>
        <br />
      </form>

      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  )
}

export default App
