interface BmiValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too much arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
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
}

try {
  const { value1, value2 } = parseArguments(process.argv);
  console.log(calculateBmi(value1, value2));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}