import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { handleVoteNotification } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  // the hook useDispatch allows access to any component to dispatch function of redux-store
  // that allows all components to change the state of Redux store
  const dispatch = useDispatch()
  // useSelector can access, with a function as parameter, to the data in Redux store
  const anecdotes = useSelector(state => {
    if (state.filter === '') {
      return state.anecdotes
    }
    let filterString = state.filter
    console.log('State before filter:', state);
    return state.anecdotes.filter(a => a.content.toLowerCase().includes(filterString.toLowerCase()))
  }
  )
  // sort anecdotes by the number of likes
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
  console.log('Current State:', anecdotes)

  return(
    <>
      {sortedAnecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(vote(anecdote.id))
            dispatch(handleVoteNotification(anecdote))
           }
          } 
        />
      )}
    </>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired, 
    content: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired
  }).isRequired,
  handleClick: PropTypes.func.isRequired
}

export default AnecdoteList