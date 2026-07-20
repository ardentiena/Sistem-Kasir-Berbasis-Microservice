import { transaksiClient } from './axiosClient';

// payload: { produkList: [{ produkId, jumlah }] }
export const createTransaksi = (data) => transaksiClient.post('/api/transactions', data);

export const getAllTransaksi = () => transaksiClient.get('/api/transactions');
export const getTransaksi = (id) => transaksiClient.get(`/api/transactions/${id}`);

// payload: { status: 'SELESAI' | 'PENDING' | ... }
export const updateStatusTransaksi = (id, data) =>
  transaksiClient.patch(`/api/transactions/${id}`, data);