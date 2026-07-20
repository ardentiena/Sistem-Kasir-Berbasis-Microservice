import { produkClient } from './axiosClient';

export const getAllProduk = () => produkClient.get('/api/products');
export const findProdukByName = (namaProduk) =>
  produkClient.get('/api/products/find', { params: { namaProduk } });
export const createProduk = (data) => produkClient.post('/api/products', data);
export const updateProduk = (id, data) => produkClient.put(`/api/products/${id}`, data);
export const deleteProduk = (id) => produkClient.delete(`/api/products/${id}`);