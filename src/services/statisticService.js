import apiClient from '../api/apiClient';
import { getErrorMessage } from '../utils/getErrorMessage';

export const getStatistics = async () => {
  try {
    const response = await apiClient.get('/api/statistics');
    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Gagal memuat statistik'));
  }
};
