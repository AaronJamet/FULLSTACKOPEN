import express from 'express';
import qs from 'qs';
const app = express();

// configure query parser to obtain parameters from url
app.use('query parser', (str: string) => qs.parse(str, { depth: 2 }));

interface BmiValues {
  height: number;
  weight: number;
  bmi: string;
}

const calculateBmi = (height: number, weight: number): string => {
  try {
    const heightInMeters = height / 100;
    const bmi = (weight) / (heightInMeters*heightInMeters);
    
    if (bmi < 16.00) return 'Underweight (Severe thinness)';
    if (bmi > 16.00 && bmi < 17.00) return 'Underweight (Moderate thinness)';
    if (bmi > 17.00 && bmi < 18.50) return 'Underweight (Mild thinness)';
    if (bmi > 18.50 && bmi < 25.00) return 'Normal range';
    if (bmi > 25.00 && bmi < 30.00) return 'Overweight (Pre-obese)';
    if (bmi > 30.00 && bmi < 35.00) return 'Obese (Class I)';
    if (bmi > 35.00 && bmi < 40.00) return 'Obese (Class II)';
    if (bmi > 40.00) return 'Obese (Class III)';
  } catch (error) {
    throw new Error("Bmi calculation has failed!");
  }

  return "";
}

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  try {
    if (isNaN(height) || isNaN(weight)) {
      res.status(400).send('Height and weight must be numbers');
    } else if (height && weight) {
      const bmi = calculateBmi(height, weight);

      const response: BmiValues = {
        weight: weight,
        height: height,
        bmi: bmi
      };

      res.json(response);
    } else {
      res.status(400).send('Height and weight must be passed as query parameters');
    }
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
    res.status(500).send(errorMessage);
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})