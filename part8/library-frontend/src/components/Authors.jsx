import PropTypes from 'prop-types'
import { useState } from 'react'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ changeAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      console.log(messages)
    }
  })

  const submit = (event) => {
    event.preventDefault()

    changeAuthor({ variables: { name, setBornTo: parseInt(born) }})

    setName('')
    setBorn('')
  }

  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <p>Loading...</p>
  }

  if (result.error) {
    <p>Error: {result.error.message}</p>
  }

  const authors = result.data.allAuthors

  const options =  authors.map((a) => ({
                    value: a.name, 
                    label: a.name
                  }))
  

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <Select 
            defaultValue={name}
            onChange={(selectedAuthor) => setName(selectedAuthor.value)}
            options={options}
            styles={{ 
              control: (provided) => ({
                ...provided,
                width: '300px',
              })
            }}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

Authors.propTypes = {
  show: PropTypes.bool
}

export default Authors
