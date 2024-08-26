import { useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { LOGIN } from './queries'
import PropTypes from 'prop-types'

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('phonenumbers-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  const submit = (event) => {
    event.preventDefault()

    login({ variables: { username, password }})
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input value={username} 
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input value={password} 
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button type='submit'>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  setError: PropTypes.func,
  setToken: PropTypes.func
}

export default LoginForm