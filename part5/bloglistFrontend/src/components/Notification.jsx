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

export default Notification