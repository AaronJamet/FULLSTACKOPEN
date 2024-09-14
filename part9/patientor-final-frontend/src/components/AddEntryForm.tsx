import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MenuItem, Select, InputLabel, FormControl, Button, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';
import { Entry } from '../types';
import { apiBaseUrl } from '../constants';

interface AddEntryFormProps {
  patientId: string;
  addNewEntry: (entry: Entry) => void;
}

interface Diagnosis {
  code: string;
  name: string;
}

const AddEntryForm: React.FC<AddEntryFormProps>  = ({ patientId, addNewEntry }) => {
  const initialState = {
    description: '',
    date: '',
    specialist: '',
    healthCheckRating: '',
    diagnosisCodes: [] as string[],
    type: '',
    employerName: '',
    sickLeaveStartDate: '',
    sickLeaveEndDate: '',
    dischargeDate: '',
    dischargeCriteria: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [entryType, setEntryType] = useState<'HealthCheck' | 'OccupationalHealthcare' | 'Hospital'>('HealthCheck');
  const [error, setError] = useState('');
  const [diagnosisOptions, setDiagnosisOptions] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
        setDiagnosisOptions(data);
      } catch (error: unknown) {
        console.error('Failed to fetch diagnoses', error);
      }
    };
    fetchDiagnoses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    setFormData({
      ...formData,
      diagnosisCodes: event.target.value as string[],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newEntry;
    switch (entryType) {
      case 'HealthCheck':
        const rating = Number(formData.healthCheckRating);
        if (isNaN(rating) || rating < 0 || rating > 3) {
          setError("Health check rating must be between 0 and 3");
          return;
        }
        newEntry = {
          ...formData,
          type: 'HealthCheck',
          healthCheckRating: rating,
        };
        break;
      case 'OccupationalHealthcare':
        newEntry = {
          ...formData,
          type: 'OccupationalHealthcare',
          employerName: formData.employerName,
          sickLeave: formData.sickLeaveStartDate && formData.sickLeaveEndDate ? {
            startDate: formData.sickLeaveStartDate,
            endDate: formData.sickLeaveEndDate
          } : undefined
        };
        break;
      case 'Hospital':
        newEntry = {
          ...formData,
          type: 'Hospital',
          discharge: formData.dischargeDate && formData.dischargeCriteria ? {
            date: formData.dischargeDate,
            criteria: formData.dischargeCriteria
          } : undefined
        };
        break;
    }
    
    try {
      console.log('Submitting new entry:', newEntry);
      const { data } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        newEntry
      );
      addNewEntry(data); // Function to update the patient entries in the parent component

      setFormData(initialState);
      setError('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        setError(error.response?.data || "Failed to add new entry");
      } else {
        console.error('Unexpected error:', error);
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="new-entry-form">
      <h3>New Entry</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Type</label>
          <select name="entryType" value={entryType} onChange={(e) => setEntryType(e.target.value as 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital')}>
            <option value="HealthCheck">Health Check</option>
            <option value="OccupationalHealthcare">Occupational Healthcare</option>
            <option value="Hospital">Hospital</option>
          </select>
        </div>

        <div>
          <label>Description</label>
          <input 
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Date</label>
          <input 
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Specialist</label>
          <input 
            type="text"
            name="specialist"
            value={formData.specialist}
            onChange={handleChange}
            required
          />
        </div>

        {entryType === 'HealthCheck' && (
          <div>
            <label>HealthCheck Rating</label>
            <input 
              type="number"
              name="healthCheckRating"
              value={formData.healthCheckRating}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {entryType === 'OccupationalHealthcare' && (
          <>
            <div>
              <label>Employer Name</label>
              <input 
                type="text"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Sick Leave Start Date</label>
              <input 
                type="date"
                name="sickLeaveStartDate"
                value={formData.sickLeaveStartDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Sick Leave End Date</label>
              <input 
                type="date"
                name="sickLeaveEndDate"
                value={formData.sickLeaveEndDate}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {entryType === 'Hospital' && (
          <>
            <div>
              <label>Discharge Date</label>
              <input 
                type="date"
                name="dischargeDate"
                value={formData.dischargeDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Discharge Criteria</label>
              <input 
                type="text"
                name="dischargeCriteria"
                value={formData.dischargeCriteria}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <FormControl fullWidth sx={{ mt: 2, mb: 2, width: '50%' }}>
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={formData.diagnosisCodes}
            onChange={handleDiagnosisChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {diagnosisOptions.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                <Checkbox checked={formData.diagnosisCodes.indexOf(diagnosis.code) > -1} />
                <ListItemText primary={diagnosis.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type='submit' variant="contained" color="primary" sx={{ mt: 3 }}>
          Add
        </Button>
      </form>

      <button onClick={() => setFormData(initialState)}>Cancel</button>
    </div>
  );
};

export default AddEntryForm;