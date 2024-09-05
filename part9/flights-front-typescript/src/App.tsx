import { useEffect, useState } from 'react'
import { DiaryEntry, Visibility, Weather } from './types';
import { createEntry, getAllEntries } from './services/entryService';
import Notification from './Notification';

const visibilityOptions = ['great', 'good', 'ok', 'poor'];
const weatherOptions = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newVisibility, setNewVisibility] = useState('');
  const [newWeather, setNewWeather] = useState('');
  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAllEntries().then(data => {
      setDiaryEntries(data)
    })
  }, []);

  const entryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newEntry = await createEntry({ 
        date: newDate, 
        visibility: newVisibility as Visibility,
        weather: newWeather as Weather,
        comment: newComment
      });

      if (newEntry) {
        setDiaryEntries(diaryEntries.concat(newEntry));
        setErrorMessage('');
      }

      setNewDate('');
      setNewVisibility('');
      setNewWeather('');
      setNewComment('');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message); // Safely extract the message from the Error object
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    }
  }  

  return (
    <>
      <h2>Add new entry</h2>
      <Notification message={errorMessage} />
      <form onSubmit={entryCreation}>
        date:
        <input
          type='date' 
          value={newDate}
          onChange={(event) => setNewDate(event.target.value)}
        /> <br />
        visibility: &nbsp;&nbsp;
        {visibilityOptions.map(visibility => (
          <label key={visibility}>
            {visibility}
            <input 
              type='radio'
              name='visibility'
              value={visibility}
              checked={newVisibility === visibility}
              onChange={(e) => setNewVisibility(e.target.value)}
            /> &nbsp;
          </label>
        ))}
        <br />

        weather: &nbsp;&nbsp;
        {weatherOptions.map(weather => (
          <label key={weather}>
            {weather}
            <input 
              type='radio'
              name='weather'
              value={weather}
              checked={newWeather === weather}
              onChange={(e) => setNewWeather(e.target.value)}
            /> &nbsp;
          </label>
        ))}
        <br />

        comment:
        <input 
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
        /> <br />
        <button type='submit'>add note</button>
      </form>

      <h2>Diary entries</h2>
      {diaryEntries.map(entry => 
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <p>visibility: {entry.visibility}</p>
          <p>weather: {entry.weather}</p>
        </div>
      )}
    </>
  )
}

export default App;