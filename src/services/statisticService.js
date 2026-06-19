// services/statisticService.js
import axios from 'axios';

const baseUrl = 'http://localhost:5000/api';

export const getStatistics = async () => {
  try {
    const response = await axios.get(`${baseUrl}/statistics`);
    return response.data.data; // Mengembalikan data statistik
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};