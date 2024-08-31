import express from 'express';
const app = express();
app.use(express.json());

import { calculateExerciseGoals } from './exerciseCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.post('/exercises', (req, res) => {
  try {
    console.log(req.body);
    
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || !Array.isArray(daily_exercises)) {
      return res.status(400).send({ error: 'First JSON field daily exercises must be an Array' });
    }

    if (daily_exercises.length !== 7) {
      return res.status(400).send({ error: 'First JSON field daily exercises must be an Array with 7 numbers' });
    }

    if (!daily_exercises.every(Number.isFinite)) {
      return res.status(400).send({ error: 'First JSON field daily exercises must be must contain 7 numbers as values' });
    }

    if (!target || isNaN(Number(target))) {
      return res.status(400).send({ error: 'Second JSON field must be a number' });
    }

    const result = calculateExerciseGoals(daily_exercises, target);
    return res.send(result);
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
    return res.status(500).send(errorMessage);
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});