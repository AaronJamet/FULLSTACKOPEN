import { useState } from 'react'

const Title = ({value}) => (
  <h1>{value}</h1>
)

const Text = ({anecdote, votes}) => (
  <>
    <p>{anecdote}</p>
    <p>Has {votes} votes.</p>
  </>
)

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)

  const [points, setPoints] = useState(new Array(8).fill(0))

  const generateRandom = () => {
    const random = Math.floor(Math.random() * (anecdotes.length))
    setSelected(random)
  }

  const voteAnecdote = () => {
    console.log(selected)
    const pointsCopy = [...points]
    pointsCopy[selected] += 1
    console.log(pointsCopy)
    setPoints(pointsCopy)
  }

  const mostVoted = points.indexOf(Math.max(...points))

  return (
    <div>
      <Title value='Anecdote of the day' />
      <Text 
        anecdote={anecdotes[selected]} 
        votes={points[selected]}
      />
      <Button handleClick={voteAnecdote} text='Vote'/>
      <Button handleClick={generateRandom} text='Next anecdote' />
      <Title value='Anecdote with most votes' />
      <Text 
        anecdote={anecdotes[mostVoted]} 
        votes={points[mostVoted]}
      />
    </div>
  )
}

export default App
