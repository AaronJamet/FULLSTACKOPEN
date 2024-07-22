import PropTypes from 'prop-types'

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  if (!isError) {
    return (
      <div className="message">
        {message}
      </div>
    )
  } else {
    return (
      <div className="errorMessage">
        {message}
      </div>
    )
  }
}

Notification.propTypes = {
  message: PropTypes.string,
  isError: PropTypes.bool.isRequired
}

export default Notification