import { useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { EDIT_NUMBER } from './queries'
import PropTypes from 'prop-types'

const PhoneForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  // obtain second parameter result to generate an error message if person not exists
  const [ changeNumber, result ] = useMutation(EDIT_NUMBER)

  const submit = (event) => {
    event.preventDefault()

    changeNumber({ variables: { name, phone } })

    setName('')
    setPhone('')
  }

  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('person not found')
    }
  }, [result.data]) // eslint-disable-line

  return (
    <div>
      <h2>change number</h2>

      <form onSubmit={submit}>
      <div>
          name <input value={name} 
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input value={phone} 
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>

        <button type='submit'>change number</button>
      </form>
    </div>
  )
}

PhoneForm.propTypes = {
  setError: PropTypes.func
}

export default PhoneForm