import { useState } from "react"
import { useApolloClient, useQuery } from '@apollo/client'
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import PropTypes from 'prop-types'
import { ME } from "./queries"
import Recommended from "./components/Recommended"

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

Notify.propTypes = {
  errorMessage: PropTypes.string
}

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  const client = useApolloClient()

  const { data: userData } = useQuery(ME, {
    skip: !token // Skip the query if there's no token
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("login")}>login</button>
        </div>

        <Notify errorMessage={errorMessage} />
  
        <Authors show={page === "authors"} />
  
        <Books show={page === "books"} />
  
        <LoginForm 
          show={page === "login"}
          setError={notify}
          setToken={setToken}
        />
      </div>
    )
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommended")}>recommended</button>
        <button onClick={logout}>logout</button>
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommended 
        show={page === "recommended"} 
        user={userData ? userData.me : null} 
      />
    </div>
  )
}

export default App
