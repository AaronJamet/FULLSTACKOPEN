import { NewPatientEntry, Gender, Entry } from "./types";

// Assure that a properly TYPED NewDiaryEntry from the request body
const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  // type guard to check that object param exists, and has the type Object
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  // type guard using IN operator, to check that object has all
  // the required fields
  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object
    && 'gender' in object && 'occupation' in object && 'entries' in object) {
      const newEntry: NewPatientEntry = {
        name: parseName(object.name),
        dateOfBirth: parseDateOfBirth(object.dateOfBirth),
        ssn: parseSsn(object.ssn),
        gender: parseGender(object.gender),
        occupation: parseOccupation(object.occupation),
        entries: parseEntries(object.entries)
      };

      return newEntry;
  }

  throw new Error('Incorrect data: some object fields are missing');
};

// example of Type Guard function
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error('Incorrect or missing Date of Birth: ' + dateOfBirth);
  }

  return dateOfBirth;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing Ssn: ' + ssn);
  }

  return ssn;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing Gender: ' + gender);
  }

  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing Occupation: ' + occupation);
  }

  return occupation;
};

const isArray = (param: unknown): param is Entry[] => {
  return Array.isArray(param) 
    && param.every(item => typeof item === 'object' && item !== null);
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!isArray(entries)) {
    throw new Error('Incorrect or missing entries: ' + JSON.stringify(entries));
  }

  return entries;
};

export default toNewPatientEntry;