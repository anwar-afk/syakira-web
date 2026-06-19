import axios from 'axios';

const API_URL = 'http://localhost:5000/api/campaigns'; // Sesuaikan dengan URL API Anda

// Fungsi untuk mengambil semua campaign
export const getCampaigns = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};