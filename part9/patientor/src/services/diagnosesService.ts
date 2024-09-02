import diagnosesData from '../../data/diagnoses';

import { DiagnoseObject } from '../types';

const getDiagnoses = (): DiagnoseObject[] => {
  return diagnosesData;
};

const addDiagnose = () => {
  return null;
};

export default {
  getDiagnoses,
  addDiagnose
};

