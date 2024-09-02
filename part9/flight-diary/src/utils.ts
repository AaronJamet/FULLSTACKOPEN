import { NewDiaryEntry, Visibility, Weather } from "./types";

// Assure that a properly TYPED NewDiaryEntry from the request body
const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  // type guard to check that object param exists, and has the type Object
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  // type guard using IN operator, to check that object has all
  // the required fields
  if ('comment' in object && 'date' in object && 'weather' in object
    && 'visibility' in object) {
      const newEntry: NewDiaryEntry = {
        weather: parseWeather(object.weather),
        visibility: parseVisibility(object.visibility),
        date: parseDate(object.date),
        comment: parseComment(object.comment)
      };

      return newEntry;
  }

  throw new Error('Incorrect data: some object fields are missing');
};

// example of Type Guard function
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseComment = (comment: unknown): string => {
  if (!isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }

  return comment;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

const isWeather = (param: string): param is Weather => {
  return Object.values(Weather).map(v => v.toString()).includes(param);
};

const parseWeather = (weather: unknown): Weather => {
  if (!isString(weather) || !isWeather(weather)) {
    throw new Error('Incorrect or missing weather: ' + weather);
  }

  return weather;
};

const isVisibility = (param: string): param is Visibility => {
  return Object.values(Visibility).map(v => v.toString()).includes(param);
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!isString(visibility) || !isVisibility(visibility)) {
    throw new Error('Incorrect or missing visibility: ' + visibility);
  }

  return visibility;
};

export default toNewDiaryEntry;