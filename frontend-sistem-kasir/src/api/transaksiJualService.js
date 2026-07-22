import { transaksiClient } from './axiosClient';

// payload: { kodeCabang, produkList: [{ kodeProduk, jumlah }] }
export const createTransaksi = (data) => transaksiClient.post('/api/transactions', data);

export const getAllTransaksi = () => transaksiClient.get('/api/transactions');

export const getTransaksi = (kodeTransaksi) => transaksiClient.get(`/api/transactions/${kodeTransaksi}`);

// payload: { status: 'SELESAI' | 'PENDING' | ... }
export const updateStatusTransaksi = (kodeTransaksi, data) =>
  transaksiClient.patch(`/api/transactions/${kodeTransaksi}`, data);