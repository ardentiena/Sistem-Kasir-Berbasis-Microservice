import axios from 'axios';

const createClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

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

export const userClient = createClient(import.meta.env.VITE_USER_SERVICE_URL);
export const produkClient = createClient(import.meta.env.VITE_BARANG_SERVICE_URL);
export const transaksiClient = createClient(import.meta.env.VITE_TRANSAKSI_SERVICE_URL);
export const pembayaranClient = createClient(import.meta.env.VITE_PEMBAYARAN_SERVICE_URL);