import { NewPatientEntry, Gender, Entry, HealthCheckEntry, OccupationalHealthCareEntry, HospitalEntry, HealthCheckRating, EntryWithoutId } from "./types";
import { v1 as uuid } from 'uuid';

// Assure that a properly TYPED NewDiaryEntry from the request body
export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
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

// Type guard for ENTRIES of each kind received by POST request from user
// ENTRY TYPES
const hasFields = (obj: unknown, fields: string[]): obj is Record<string, unknown> =>
  typeof obj === 'object' && obj !== null && fields.every(field => field in obj);

// Type guard for HealthCheckEntry
export const isHealthCheckEntry = (object: unknown): object is HealthCheckEntry =>
  hasFields(object, ['type', 'healthCheckRating']) &&
  (object as Record<string, unknown>).type === 'HealthCheck' &&
  typeof (object as Record<string, unknown>).healthCheckRating === 'number';

// Type guard for OccupationalHealthcareEntry
export const isOccupationalHealthCareEntry = (object: unknown): object is OccupationalHealthCareEntry =>
  hasFields(object, ['type', 'employerName']) &&
  (object as Record<string, unknown>).type === 'OccupationalHealthcare';

// Type guard for HospitalEntry
export const isHospitalEntry = (object: unknown): object is HospitalEntry =>
  hasFields(object, ['type']) &&
  (object as Record<string, unknown>).type === 'Hospital';

// Type guard for HealthCheckRating
export const isHealthCheckRating = (param: unknown): param is HealthCheckRating =>
  typeof param === 'number' && Object.values(HealthCheckRating).includes(param);

// Type guard for Discharge
const isDischarge = (discharge: unknown): discharge is { date: string; criteria: string } =>
  hasFields(discharge, ['date', 'criteria']);

// Parser function to validate and create an entry
export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!hasFields(object, ['description', 'date', 'specialist'])) {
    throw new Error('Incorrect or missing entry data');
  }

  const baseEntry = {
    description: parseDescription(object.description),
    date: parseDate(object.date),
    specialist: parseSpecialist(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object)
  };

  if (isHealthCheckEntry(object) && isHealthCheckRating(object.healthCheckRating)) {
    return { ...baseEntry, type: 'HealthCheck', healthCheckRating: object.healthCheckRating };
  }

  if (isOccupationalHealthCareEntry(object)) {
    return {
      ...baseEntry,
      type: 'OccupationalHealthcare',
      employerName: object.employerName as string,
      sickLeave: object.sickLeave ? parseSickLeave(object.sickLeave) : undefined
    };
  }

  if (isHospitalEntry(object)) {
    return {
      ...baseEntry,
      type: 'Hospital',
      discharge: object.discharge ? parseDischarge(object.discharge) : undefined
    };
  }

  throw new Error('Incorrect entry type');
};

// Helper parser functions (examples)
const parseDescription = (description: unknown): string => {
  if (typeof description !== 'string') {
    throw new Error('Invalid description');
  }
  return description;
};

const parseDate = (date: unknown): string => {
  if (typeof date !== 'string' || isNaN(Date.parse(date))) {
    throw new Error('Invalid date');
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (typeof specialist !== 'string') {
    throw new Error('Invalid specialist');
  }
  return specialist;
};

const parseDiagnosisCodes = (object: unknown): string[] => {
  if (!hasFields(object, ['diagnosisCodes'])) {
    return [];
  }
  return object.diagnosisCodes as string[];
};

const parseSickLeave = (sickLeave: unknown): { startDate: string; endDate: string } => {
  if (!hasFields(sickLeave, ['startDate', 'endDate'])) {
    throw new Error('Invalid sick leave');
  }
  return {
    startDate: parseDate(sickLeave.startDate),
    endDate: parseDate(sickLeave.endDate),
  };
};

const parseDischarge = (discharge: unknown): { date: string; criteria: string } => {
  if (!isDischarge(discharge)) {
    throw new Error('Invalid discharge');
  }
  return discharge;
};

export const parseHealthCheckEntry = (entry: any): HealthCheckEntry => {
  return {
    id: generateId(), // Implement ID generation
    type: 'HealthCheck',
    healthCheckRating: entry.healthCheckRating,
    description: entry.description,
    date: entry.date,
    specialist: entry.specialist,
    diagnosisCodes: parseDiagnosisCodes(entry)
  };
};

export const parseOccupationalHealthCareEntry = (entry: any): OccupationalHealthCareEntry => {
  return {
    id: generateId(), // Implement ID generation
    type: 'OccupationalHealthcare',
    employerName: entry.employerName,
    description: entry.description,
    date: entry.date,
    specialist: entry.specialist,
    diagnosisCodes: parseDiagnosisCodes(entry)
  };
};

export const parseHospitalEntry = (entry: any): HospitalEntry => {
  return {
    id: generateId(), // Implement ID generation
    type: 'Hospital',
    discharge: entry.discharge,
    description: entry.description,
    date: entry.date,
    specialist: entry.specialist,
    diagnosisCodes: parseDiagnosisCodes(entry)
  };
};

const generateId = (): string => {
  return uuid();
};

export default toNewPatientEntry;