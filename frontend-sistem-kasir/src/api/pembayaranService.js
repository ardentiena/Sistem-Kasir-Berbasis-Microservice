import { pembayaranClient } from './axiosClient';

// Catatan: createDetailPembayaran sudah dibuat otomatis oleh service transaksi
// saat createTransaksi dipanggil (lihat idDetailPembayaran di TransaksiResponseDTO).
// Endpoint ini disediakan untuk kasus lain (mis. retry/manual), bukan dipakai di alur checkout normal.
export const createDetailPembayaran = (data) => pembayaranClient.post('/api/payment', data);

// payload: { metodeBayar: 'TUNAI', totalBayar: number }
export const payTransaksi = (idDetailPembayaran, data) =>
  pembayaranClient.post(`/api/payment/${idDetailPembayaran}/paid`, data);

export const retryCallback = (idDetailPembayaran) =>
  pembayaranClient.post(`/api/payment/${idDetailPembayaran}/retry-callback`);

export const getAllPembayaran = () => pembayaranClient.get('/api/payment');
export const getPembayaranById = (id) => pembayaranClient.get(`/api/payment/${id}`);