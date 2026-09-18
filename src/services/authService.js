import apiClient from '../api/apiClient';
import { getErrorMessage } from '../utils/getErrorMessage';

const AUTH_BASE = '/api/auth';

const normalizeUser = (payload) => {
  const user = payload?.user ?? payload?.data?.user ?? payload?.data ?? payload;
  if (!user || typeof user !== 'object') return null;

  return {
    id: user._id || user.id,
    name: user.name || user.username || user.email,
    email: user.email,
    role: user.role,
    ...user,
  };
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post(`${AUTH_BASE}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Terjadi kesalahan saat registrasi'));
  }
};

export const login = async (credentials) => {
  try {
    const response = await apiClient.post(`${AUTH_BASE}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Email atau password salah'));
  }
};

/**
 * Validasi session ke server. Role & identitas hanya dipercaya dari respons ini.
 * Endpoint: GET /api/auth/me
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get(`${AUTH_BASE}/me`);
    const user = normalizeUser(response.data);
    if (!user?.role) {
      throw new Error('Data user tidak valid');
    }
    return user;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Sesi tidak valid'));
  }
};
