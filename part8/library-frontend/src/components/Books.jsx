import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [allGenres, setAllGenres] = useState([])

  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    skip: !props.show
  })

  useEffect(() => {
    if (data && !selectedGenre) { // Ensure this only runs when there's no genre filter
      const genres = [...new Set(data.allBooks.flatMap(book => book.genres))]
      setAllGenres(genres)
    }
  }, [data, selectedGenre])

  if (!props.show) {
    return null
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    <p>Error: { error.message}</p>
  }

  const books = data.allBooks

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre)
    refetch({ genre })
  }

  return (
    <div>
      <h2>books</h2>

      <div>
        <button key="all-genres" onClick={() => handleGenreChange(null)}>All genres</button>
        {allGenres.map((genre) => 
          <button key={genre} onClick={() => handleGenreChange(genre)}>
            {genre}
          </button>
        )}
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

Books.propTypes = {
  show: PropTypes.bool.isRequired
}

export default Books
