import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients';

import { PatientObject, NonSsnPatientObject, NewPatientEntry } from '../types';

const getPatients = (): PatientObject[] => {
  return patientsData;
};

const getNonSsnPatients = (): NonSsnPatientObject[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
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
  getNonSsnPatients
};

