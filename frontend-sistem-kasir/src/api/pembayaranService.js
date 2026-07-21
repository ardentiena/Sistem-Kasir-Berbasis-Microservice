import { pembayaranClient } from './axiosClient';

export const createDetailPembayaran = (data) => pembayaranClient.post('/api/payment', data);

// payload: { metodeBayar: 'TUNAI', totalBayar: number }
export const payTransaksi = (kodeTransaksi, data) =>
  pembayaranClient.post(`/api/payment/${kodeTransaksi}/paid`, data);

export const retryCallback = (kodeTransaksi) =>
  pembayaranClient.post(`/api/payment/${kodeTransaksi}/retry-callback`);

export const getAllPembayaran = () => pembayaranClient.get('/api/payment');

export const getPembayaranByKode = (kodeTransaksi) =>
  pembayaranClient.get(`/api/payment/${kodeTransaksi}`);