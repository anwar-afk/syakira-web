import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Sesuaikan dengan URL API Anda

// Fungsi untuk membuat donasi
export const createDonation = async (campaignId, amount) => {
  try {
    const response = await axios.post(
      `${API_URL}/donate`,
      {
        campaignId, // ID campaign yang sedang dibuka
        amount: parseInt(amount), // Konversi amount ke number
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Jika memerlukan token
        },
      }
    );

    return response.data; // Mengembalikan respons dari API
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error.response?.data || "Terjadi kesalahan saat membuat donasi."; // Lempar error untuk ditangani di komponen
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