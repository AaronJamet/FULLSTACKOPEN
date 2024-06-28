import Person from './Person'

const Persons = ({personsToShow, handleDelete}) => {
  return (
    <div>
      {personsToShow.map(person =>
        <Person 
          key={person.id} 
          person={person} 
          handleDelete={() => handleDelete(person.id, person.name)}
        />
      )}
    </div>
  )
}

export default Persons