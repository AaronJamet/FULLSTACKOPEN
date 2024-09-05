interface NotificationProps {
  message: string | null;
}

const Notification = ({ message }: NotificationProps) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    color: 'red'
  }

  if (message === null || message === '') {
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification