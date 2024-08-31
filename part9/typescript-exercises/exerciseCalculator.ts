interface ExerciseValues {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExerciseGoals = (dailyHours: number[], target: number): ExerciseValues => {
  /* if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too much arguments'); */

  const hoursArray = dailyHours;
  //const hoursArray = inputArray.map(Number);
  const targetHours = target;

  if (isNaN(Number(target))) {
    throw new Error('Second argument passed is not a single number');
  }
  else if (hoursArray.length !== 7) {
    throw new Error('Array must include all 7 days in the week');
  } else {
    const training = hoursArray.filter((hours: number) => hours !== 0).length;
    const totalTrainingHours = hoursArray.reduce((accumulator: number, current: number) => accumulator + current, 0);
    const averageHours = totalTrainingHours / hoursArray.length;

    let success = false;
    let rating = 0;
    let ratingDescription = '';

    if ((averageHours+0.5) < targetHours) {
      success = false;
      rating = 1;
      ratingDescription = 'very bad, you got to work much more';
    } 
    else if (averageHours < targetHours) {
      success = false;
      rating = 1;
      ratingDescription = 'bad, you got to try harder';
    }
    else if (averageHours > (targetHours+0.5)) {
      success = true;
      rating = 3;
      ratingDescription = 'excellent, above the expected results';
    }
    else if (averageHours > targetHours) {
      success = true;
      rating = 2;
      ratingDescription = 'good, you have reached the goal';
    }

    return {
      periodLength: hoursArray.length,
      trainingDays:  training,
      target: targetHours,
      average: averageHours,
      success: success,
      rating: rating,
      ratingDescription: ratingDescription
    };
  }  
};

/* try {
  const result = calculateExerciseGoals(process.argv);
  console.log(result);
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
} */