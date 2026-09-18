/**
 * Ambil pesan error yang aman ditampilkan ke UI dari error axios / objek biasa.
 */
export const getErrorMessage = (error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') => {
  if (!error) return fallback;
  if (typeof error === 'string') return error;

  if (error.code === 'ECONNABORTED') {
    return 'Permintaan terlalu lama. Coba lagi.';
  }
  if (error.message === 'Network Error') {
    return 'Tidak dapat terhubung ke server. Periksa koneksi atau API URL.';
  }

  const data = error.response?.data ?? error;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors[0]?.msg) return data.errors[0].msg;
  if (Array.isArray(data?.errors) && typeof data.errors[0] === 'string') return data.errors[0];
  if (error.message && !error.message.startsWith('Request failed')) return error.message;

  return fallback;
};
