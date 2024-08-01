import { useCounterValue } from '../CounterContext'

const Display = () => {
  const counter = useCounterValue() // gets counter state from the Context

  return (
    <div>
      {counter}
    </div>
  )
}

export default Display