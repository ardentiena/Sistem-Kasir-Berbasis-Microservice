import axios from 'axios';

const createClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  // Attach JWT ke semua request
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Handle token expired secara global
  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );

  return client;
};

export const userClient = createClient(import.meta.env.USER_SERVICE_URL);
export const barangClient = createClient(import.meta.env.BARANG_SERVICE_URL);
export const transaksiClient = createClient(import.meta.env.TRANSAKSI_SERVICE_URL);
export const pembayaranClient = createClient(import.meta.env.PEMBAYARAN_SERVICE_URL);