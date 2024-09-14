import { HospitalEntry} from "../../types";
import { LocalHospital  } from '@mui/icons-material';

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <div>
      <h4>{entry.date} <LocalHospital /></h4>
      <p>{entry.description}</p>
      <p>Specialist: {entry.specialist}</p>
      {entry.discharge && (
        <p>
          Discharge date: {entry.discharge.date}, criteria: {entry.discharge.criteria}
        </p>
      )}
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code, idx) => (
            <li key={idx}>{code}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HospitalEntryDetails;