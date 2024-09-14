import { HealthCheckEntry, HealthCheckRating } from "../../types";
import { MedicalServices, Favorite } from '@mui/icons-material';

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  const renderHealthRatingIcon = (check: HealthCheckRating) => {
    switch (check) {
      case 0:
        return <Favorite style={{ color: 'black' }} />;
      case 1:
        return <Favorite style={{ color: 'green' }} />;
      case 2:
        return <Favorite style={{ color: 'pink' }} />;
      case 3:
        return <Favorite style={{ color: 'red' }} />;  
      default:
        return null;
    }
  };

  return (
    <div>
      <h4>{entry.date} <MedicalServices /></h4>
      <p>{entry.description}</p>
      <p>{renderHealthRatingIcon(entry.healthCheckRating)}</p>
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

export default HealthCheckEntryDetails;