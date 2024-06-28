import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}: {value}</td>
  </tr>
)

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={props.good} />
        <StatisticLine text='neutral' value={props.neutral} />
        <StatisticLine text='bad' value={props.bad} />
        <StatisticLine text='all' value={props.all} />
        <StatisticLine text='average puntuation' value={props.average} />
        <StatisticLine text='positive' value={props.positive} />
      </tbody>
    </table>
  )
}

const App = () => {
  // guarda los clicks de cada boton en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [points, setPoints] = useState(0)

  const increaseGood = () => {
    const newTotal = (good + neutral + bad) + 1
    setGood(good + 1)
    setTotal(newTotal)
    setPoints(points + 1)
  }

  const increaseNeutral = () => {
    const newTotal = (good + neutral + bad) + 1
    setNeutral(neutral + 1)
    setTotal(newTotal)
  }

  const increaseBad = () => {
    const newTotal = (good + neutral + bad) + 1
    setBad(bad + 1)
    setTotal(newTotal)
    setPoints(points - 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={increaseGood} text='good' />
      <Button handleClick={increaseNeutral} text='neutral' />
      <Button handleClick={increaseBad} text='bad' />
      <h1>statistics</h1>
      <Statistics 
        good={good} neutral={neutral} 
        bad={bad} all={total}
        average={points / total}
        positive={good / total * 100}
      />
    </div>
  )
}

export default App
