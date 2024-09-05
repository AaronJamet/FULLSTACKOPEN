import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllEntries = () => {
  return axios
    .get<DiaryEntry[]>(baseUrl)
    .then(response => response.data)
}

export const createEntry = async (object: NewDiaryEntry): Promise<DiaryEntry | null> => {
  try {
    const response = await axios.post<DiaryEntry>(baseUrl, object);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error creating new entry:', error.message);
      const errorMessage = error.response?.data || 'Unknown error occurred while creating entry.';
      throw new Error(errorMessage);
    }

    // Throw a generic error for non-Axios errors
    throw new Error('An unexpected error occurred.');
  }
}