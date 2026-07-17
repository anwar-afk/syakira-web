import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

// Fungsi untuk membuat donasi (guest atau user login)
export const createDonation = async (campaignId, donationData) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(
      `${API_URL}/donate`,
      {
        campaignId,
        amount: parseInt(donationData.amount, 10),
        name: donationData.name,
        email: donationData.email,
      },
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error.response?.data || "Terjadi kesalahan saat membuat donasi.";
  }
};

// Fungsi untuk mengambil riwayat donasi
export const getDonationHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/donations/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Jika memerlukan token
      },
    });

    return response.data; // Mengembalikan data riwayat donasi
  } catch (error) {
    console.error("Error fetching donation history:", error);
    throw error.response?.data || "Terjadi kesalahan saat mengambil riwayat donasi."; // Lempar error untuk ditangani di komponen
  }
};