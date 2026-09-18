import apiClient from '../api/apiClient';
import { getErrorMessage } from '../utils/getErrorMessage';

/**
 * Buat donasi (user login atau tamu tanpa Bearer palsu).
 * Authorization hanya dikirim jika ada token nyata di localStorage (via apiClient).
 */
export const createDonation = async (campaignId, donationData) => {
  try {
    const response = await apiClient.post('/api/donate', {
      campaignId,
      amount: parseInt(donationData.amount, 10),
      name: donationData.name,
      email: donationData.email,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Terjadi kesalahan saat membuat donasi.'));
  }
};

export const getDonationHistory = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Harus login untuk melihat riwayat donasi.');
  }

  try {
    const response = await apiClient.get('/api/donations/history');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Terjadi kesalahan saat mengambil riwayat donasi.'));
  }
};
