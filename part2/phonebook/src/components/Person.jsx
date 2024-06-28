const Person = ({ person, handleDelete }) => {
  return (
    <div>
      <p>{person.name} - {person.number}
      <button onClick={handleDelete}>Delete person</button></p>
    </div>
  )
}

export default Person