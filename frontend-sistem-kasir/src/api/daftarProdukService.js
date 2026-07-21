import { produkClient } from './axiosClient';

export const getAllProduk = () => produkClient.get('/api/products');
export const findProdukByName = (namaProduk) =>
  produkClient.get('/api/products/find', { params: { namaProduk } });
export const createProduk = (data) => produkClient.post('/api/products', data);

// data: { namaProduk, kategori, harga, stok, barcode? }
export const updateProduk = (kodeProduk, data) =>
  produkClient.put(`/api/products/${kodeProduk}`, data);

export const deleteProduk = (kodeProduk) =>
  produkClient.delete(`/api/products/${kodeProduk}`);