import axios from 'axios';

const API_URL = '' // Replace with your actual API URL
  // e.g., 'https://api.example.com/experiment2/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Prefer': 'return=representation'
  },
});

const formatDateForAPI = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const getTodayVotes = async (date: string) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const url = `${API_URL}?created=gte.${formatDateForAPI(startOfDay)}&created=lt.${formatDateForAPI(endOfDay)}`;
    
    const response = await api.get(url, {
      headers: {
        'Range-Unit': 'items',
        'Range': '0-1000'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
};

export const submitVote = async (answer: boolean, deviceId: number) => {
  try {
    const payload = {
      created: new Date().toISOString().replace('Z', '+02:00'),
      answer,
      time_given: null,
      deviceid: deviceId
    };

    await api.post('', payload);
  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};