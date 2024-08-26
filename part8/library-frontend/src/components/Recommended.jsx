import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Recommended = ({ show, user }) => {
  const { loading, error, data} = useQuery(ALL_BOOKS, {
    variables: { genre: user?.favoriteGenre },
    skip: !user,
  })

  if (!show) {
    return null
  }
  
  if (!show && !user) {
    return null
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    <p>Error: { error.message}</p>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <h4>Recommended books based in your favorite genre: {user.favoriteGenre}</h4>
      
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

Recommended.propTypes = {
  show: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    favoriteGenre: PropTypes.string,
  })
}

export default Recommended