import apiClient from '../api/apiClient';
import { getErrorMessage } from '../utils/getErrorMessage';

const BASE = '/api/campaigns';

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.campaigns)) return payload.campaigns;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeOne = (payload) => {
  if (!payload || typeof payload !== 'object') return null;
  if (payload.campaign) return payload.campaign;
  if (payload.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
};

/** GET /api/campaigns — selalu mengembalikan array */
export const getCampaigns = async () => {
  try {
    const response = await apiClient.get(BASE);
    return normalizeList(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Gagal memuat campaign'));
  }
};

/** GET /api/campaigns/:id */
export const getCampaignById = async (id) => {
  try {
    const response = await apiClient.get(`${BASE}/${id}`);
    const campaign = normalizeOne(response.data);
    if (!campaign || !(campaign._id || campaign.id)) {
      throw new Error('Data campaign tidak ditemukan.');
    }
    return campaign;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Gagal memuat campaign'));
  }
};

/** POST /api/campaigns (JSON atau FormData) */
export const createCampaign = async (data) => {
  try {
    const response = await apiClient.post(BASE, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Gagal membuat program'));
  }
};

/** PUT /api/campaigns/:id */
export const updateCampaign = async (id, data) => {
  try {
    const response = await apiClient.put(`${BASE}/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Gagal memperbarui program'));
  }
};

/** DELETE /api/campaigns/:id */
export const deleteCampaign = async (id) => {
  try {
    const response = await apiClient.delete(`${BASE}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Gagal menghapus program'));
  }
};
