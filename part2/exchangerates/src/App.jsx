import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [value, setValue] = useState('')
  const [rates, setRates] = useState('')
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now:', currency);

    // omitir si la moneda NO está definida
    if (currency) {
      // se obtienen las tasas de cambio
      console.log('fetching exchange rates');
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setCurrency(value)
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        Currency: <input value={value} onChange={handleChange} />
        <button type='submit'>Exchange rate</button>
      </form>
      <pre>
        {JSON.stringify(rates, null, 2)}  
      </pre>  
    </div>
  )
}

export default App
