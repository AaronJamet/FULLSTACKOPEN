import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients';

import { PatientObject, NonSsnPatientObject, NewPatientEntry } from '../types';

const getPatients = (): PatientObject[] => {
  return patientsData;
};

const getPatientById = (id: string): PatientObject | undefined => {
  return patientsData.find(patient => patient.id === id);
};

const getNonSsnPatients = (): NonSsnPatientObject[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation, 
    entries
  }));
};

const addPatient = ( patient: NewPatientEntry ): PatientObject => {
  const id = uuid();

  const newPatient = {
    id: id,
    ...patient
  };

  patientsData.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  addPatient,
  getNonSsnPatients,
  getPatientById
};

