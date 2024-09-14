export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface DiagnoseObject {
  code: string,
  name: string,
  latin?: string
}

export interface PatientObject {
  id: string,
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: Gender,
  occupation: string,
  entries: Entry[]
}

// types can be modified with Pick or Omit
export type NonSsnPatientObject = Omit<PatientObject, 'ssn'>;

export type NewPatientEntry = Omit<PatientObject, 'id'>;

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<DiagnoseObject['code']>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface SickLeave {
  startDate: string;
  endDate: string;
}

export interface OccupationalHealthCareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: SickLeave;
}

interface Discharge {
  date: string;
  criteria: string;
}

export interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge?: Discharge;
}

export type Entry = HealthCheckEntry | OccupationalHealthCareEntry | HospitalEntry;

// Define omit especial para uniones
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry sin la propiedad 'id'
export type EntryWithoutId = UnionOmit<Entry, 'id'>;
