import express from 'express';
import patientsService from '../services/patientsService';
import toNewPatientEntry, { isHealthCheckEntry, isHospitalEntry, isOccupationalHealthCareEntry, parseHealthCheckEntry, parseHospitalEntry, parseOccupationalHealthCareEntry } from '../utils';
import { Entry } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getNonSsnPatients());
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const patient = patientsService.getPatientById(id);

  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send({ error: "Patient not found" });
  }
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedPatient = patientsService.addPatient(newPatientEntry);

    res.json(addedPatient);  
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }

    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', async (req, res) => {
  const patientId = req.params.id;
  const entryData = req.body;

  try {
    const patient = await patientsService.getPatientById(patientId);
    if (!patient) {
      res.status(404).send({ error: "Patient not found" });
    }

    let newEntry: Entry;
    
    if (isHealthCheckEntry(entryData)) {
      newEntry = parseHealthCheckEntry(entryData);
    } else if (isOccupationalHealthCareEntry(entryData)) {
      newEntry = parseOccupationalHealthCareEntry(entryData);
    } else if (isHospitalEntry(entryData)) {
      newEntry = parseHospitalEntry(entryData);
    } else {
      return res.status(400).send({ error: 'Invalid entry type' });
    }

    patient?.entries.push(newEntry);
    return res.status(200).json(newEntry);
  } catch (error: unknown) {
    let errorMessage = 'Problems at creating new Entry for the patient.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }

    return res.status(400).send(errorMessage);
  }
});

export default router;