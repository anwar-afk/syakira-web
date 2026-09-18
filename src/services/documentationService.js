import apiClient from '../api/apiClient';
import { getErrorMessage } from '../utils/getErrorMessage';

const BASE = '/api/documentations';

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.documentations)) return payload.documentations;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

/** GET /api/documentations — selalu mengembalikan array */
export const getDocumentations = async () => {
  try {
    const response = await apiClient.get(BASE);
    return normalizeList(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Gagal memuat dokumentasi'));
  }
};

/** POST /api/documentations (FormData) */
export const createDocumentation = async (formData) => {
  try {
    const response = await apiClient.post(BASE, formData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Gagal membuat dokumentasi'));
  }
};

/** DELETE /api/documentations/:id */
export const deleteDocumentation = async (id) => {
  try {
    const response = await apiClient.delete(`${BASE}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Gagal menghapus dokumentasi'));
  }
};
