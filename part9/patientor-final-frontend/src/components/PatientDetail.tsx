import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Male, Female, Transgender } from '@mui/icons-material';
import axios from "axios";
import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import Notification from "./Notification";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Notification message={error} />
      <h3>{patient.name} {renderGenderIcon(patient.gender)}</h3>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
    </div>
  );
};

export default PatientDetail;