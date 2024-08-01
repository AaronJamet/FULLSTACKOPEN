import { useCounterDispatch } from '../CounterContext'
import PropTypes from 'prop-types'

const Button = ({ type, label }) => {
  const dispatch = useCounterDispatch()

  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default Button