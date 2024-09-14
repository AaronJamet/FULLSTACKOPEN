import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Male, Female, Transgender } from '@mui/icons-material';
import axios from "axios";
import { Entry, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import Notification from "./Notification";
import EntryDetails from "./EntriesDetails/EntryDetails";
import AddHealthCheckEntry from "./AddEntryForm";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientData } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        setPatient(patientData);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e?.response?.data && typeof e?.response?.data === "string") {
            const message = e.response.data.replace('Something went wrong. Error: ', '');
            console.error(message);
            setError(message);
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
      }
    };

    if (id) {
      void fetchPatient();
    }
  }, [id]);

  const addNewEntry = (newEntry: Entry) => {
    setPatient((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        entries: [...prev.entries, newEntry]
      };
    });
  };

  const renderGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return <Male />;
      case 'female':
        return <Female />;
      case 'other':
        return <Transgender />;
      default:
        return null;
    }
  };

  const divStyle: React.CSSProperties = {
    width: '100%',
    border: '2px solid black',
    borderRadius: '10px',
    padding: '0px 10px',
    boxSizing: 'border-box',
    margin: '10px auto'
  };

  const toggleFormVisibility = () => {
    setShowEntryForm(!showEntryForm);
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Notification message={error} />
      <h2>{patient.name} {renderGenderIcon(patient.gender)}</h2>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>

      <button onClick={toggleFormVisibility}>
        {showEntryForm ? 'Hide form' : 'Show new Entry form'}
      </button>

      {showEntryForm && (
        <div style={{ border: '2px dashed black', width: '100%', padding: '10px', margin: '10px 0' }}>
          <AddHealthCheckEntry 
            patientId={id!} 
            addNewEntry={addNewEntry} 
          />
        </div>  
      )}

      <h3>entries</h3>
      {patient.entries?.length > 0 && patient.entries.map((e, index) => (
        <div key={index} style={divStyle}>
          <EntryDetails entry={e} />
        </div>
      ))}
    </div>
  );
};

export default PatientDetail;