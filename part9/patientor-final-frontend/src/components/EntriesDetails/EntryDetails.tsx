import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthCareEntry } from "../../types";
import HealthCheckEntryDetails from "./HealthCheckEntryDetail";
import OccupationalHealthCareEntryDetails from "./OccupationalHealthCareEntryDetail";
import HospitalEntryDetails from "./HospitalEntryDetails";

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry as HealthCheckEntry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthCareEntryDetails entry={entry as OccupationalHealthCareEntry} />;
    case "Hospital":
      return <HospitalEntryDetails entry={entry as HospitalEntry} />;
    default:
      return assertNever(entry);
  }
};

// Helper function to ensure that all cases are covered
const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

export default EntryDetails;
