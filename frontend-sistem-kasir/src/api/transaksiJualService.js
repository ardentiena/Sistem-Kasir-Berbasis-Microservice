import { transaksiClient } from './axiosClient';

// payload: { kodeCabang, produkList: [{ kodeProduk, jumlah }] }
export const createTransaksi = (data) => transaksiClient.post('/api/transactions', data);

export const getAllTransaksi = () => transaksiClient.get('/api/transactions');

// GET /{id} TIDAK berubah — masih UUID, karena endpoint ini belum kita ubah
export const getTransaksi = (id) => transaksiClient.get(`/api/transactions/${id}`);

// payload: { status: 'SELESAI' | 'PENDING' | ... }
export const updateStatusTransaksi = (kodeTransaksi, data) =>
  transaksiClient.patch(`/api/transactions/${kodeTransaksi}`, data);