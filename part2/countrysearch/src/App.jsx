import { useState, useEffect } from 'react'
import axios from 'axios'

const Results = ({countries}) => {
  if (countries === undefined) {
    return null
  }
  else if  (countries.length === 1) {
     return (
      <CountryDetails countrySearched={countries[0]} />
     ) 
  }
  if (countries.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }
  else {
    return (
      <div>
        {countries.map((country, i) => 
          <Country key={i} country={country} />
        )}
      </div>
    )
  }
}

const Country = ({country}) => {
  const [selectedCountry, setSelectedCountry] = useState(false)

  const handleShowDetails = () => {
    setSelectedCountry(!selectedCountry)
  }

  return (
    <div>
      {country.name.common}
      <button onClick={handleShowDetails}>Show</button>
      {selectedCountry ? <CountryDetails countrySearched={country}/> : null }
    </div>
  )
}

const CountryDetails = ({countrySearched}) => {
  const [weather, setWeather] = useState([])
  const countryLanguages = countrySearched.languages
  const country = countrySearched

  const capitalName = country.capital
  const apiKey = 'f63a3e74d2dbf8036aa0b2cd78547aff'

  useEffect(() => {
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${capitalName}&appid=${apiKey}&units=metric`)
    .then(response => {
      console.log(response.data)
      setWeather(response.data)
    })
    .then(data => {
      //setWeather(data)
      console.log(data)
    })
    .catch(err => console.log(err))  
  }, [])

  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital: {country.capital[0]}</p>
      <p>area: {country.area} km2</p>

      <h3>languages:</h3>
      <ul>
      {Object.keys(countryLanguages).map((item, i) =>
        <li key={i}>{countryLanguages[item]}</li> 
      )}
      </ul>

      <img src={country.flags.png} alt={country.flags.alt} />

      <Weather capital={country.capital[0]} weather={weather} />
    </>
  )
}

const Weather = ({capital, weather}) => {
  if (weather !== undefined && weather.length !== 0) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <>
      <h3>Weather in {capital}</h3>
      Temperature: {weather.main.temp} Celcius
      <br />
      <img src={iconUrl} alt={weather.weather[0].description} />
      <br />
      Wind: {weather.wind.speed} m/s
    </>
  )
  }
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.data)
      .then(data => setCountries(data))
      .catch(err => console.log(err))      
  }, [])

  const handleSearch = (event) => {
    setSearch(event.target.value)

    const searchValue = event.target.value
    const filteredItems = countries
      .filter(country => country.name.common.toLowerCase().includes(searchValue))

    console.log(search);

    setFilteredCountries(filteredItems)
  }

  return (
    <div>
      Find countries: <input type='text'
                             value={search} 
                             onChange={handleSearch}
                             placeholder='Type to search' />
      
      <Results countries={filteredCountries} />
    </div>
  )
}

export default App
