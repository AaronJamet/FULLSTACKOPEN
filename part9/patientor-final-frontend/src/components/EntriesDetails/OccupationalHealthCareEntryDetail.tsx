import { OccupationalHealthCareEntry} from "../../types";
import { NoteAlt } from '@mui/icons-material';

const OccupationalHealthCareEntryDetails = ({ entry }: { entry: OccupationalHealthCareEntry }) => {
  return (
    <div>
      <h4>{entry.date} <NoteAlt /></h4>
      <p>{entry.description}</p>
      <p>diagnose by: {entry.specialist}</p>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code: string, idx: number) => (
            <li key={idx}>{code}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OccupationalHealthCareEntryDetails;