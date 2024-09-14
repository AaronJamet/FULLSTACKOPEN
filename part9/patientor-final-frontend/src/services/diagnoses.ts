import axios from "axios";
import { Diagnose } from "../types";

import { apiBaseUrl } from "../constants";

export const getAllDiagnoses = async (): Promise<Diagnose[]> => {
  const { data } = await axios.get<Diagnose[]>(
    `${apiBaseUrl}/diagnoses`
  );

  return data;
};

/* const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
}; */

export default {
  getAllDiagnoses
};

