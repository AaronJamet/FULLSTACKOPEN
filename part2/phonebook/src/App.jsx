import { useState } from 'react'
import './App.css'
import './index.css'
import Filter from './components/Filter'
import Message from './components/Message'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/personsService'
import { useEffect } from 'react'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    if (persons.find(p => p.name === newName && p.number === newNumber)) {
      alert(`${newName} is already added to the phonebook with that same number`)
    } else if (persons.find(p => p.name === newName && p.number !== newNumber)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = { ...person, number: newNumber }   
        
        personService
          .update(person.id, changedPerson)
          .then(updatedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
          })
          .catch(error => {
            // show custom validation error message to the user
            setIsErrorMessage(true)  
            setMessage(error.response.data.error)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
        
          setIsErrorMessage(false)
          setMessage(`${person.name} phonenumber has been updated`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      }
    } else {
      personService
        .create(nameObject)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          // show custom validation error message to the user
          setIsErrorMessage(true)  
          setMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })

      setIsErrorMessage(false)  
      setMessage(`Added ${nameObject.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)  
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      personService
      .remove(id)
      .then( 
        setPersons(persons.filter(p => p.id !== id))
      )
      .catch(() => {
        setIsErrorMessage(true)
        setMessage(
          `the person '${name}' was already deleted from the server`
        )
        setPersons(persons.filter(p => p.id !== id))
      })

      setIsErrorMessage(false)
      setMessage(`${name} has been deleted`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilter = (event) => {
    setNameFilter(event.target.value.toLowerCase())
  }

  const personsToShow = 
    nameFilter === '' 
      ? persons 
      : persons.filter(p => p.name.toLowerCase().includes(nameFilter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Message text={message} isError={isErrorMessage} />
      <Filter nameFilter={nameFilter} handleFilterChange={handleNameFilter} />
      
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson}
           newName={newName} handleNameChange={handleNameChange}
           newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={deletePerson} />
    </div>
  )
}

export default App
