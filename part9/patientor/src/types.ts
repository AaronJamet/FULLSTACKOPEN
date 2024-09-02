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
  occupation: string
}

// types can be modified with Pick or Omit
export type NonSsnPatientObject = Omit<PatientObject, 'ssn'>;

export type NewPatientEntry = Omit<PatientObject, 'id'>;