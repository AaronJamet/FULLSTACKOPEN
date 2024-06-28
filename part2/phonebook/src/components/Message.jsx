const Message = ({ text, isError }) => {
  if (text === null) {
    return null
  }

  if (!isError) {
    return (
      <div className="message">
        {text}
      </div>
    )
  } else {
    return (
      <div className="errorMessage">
        {text}
      </div>
    )
  }
}

export default Message