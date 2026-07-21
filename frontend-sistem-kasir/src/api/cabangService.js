import { userClient } from './axiosClient';

export const getAllCabang = () => userClient.get('/api/cabang');
export const getCabangPilihan = () => userClient.get('/api/cabang/pilihan');
export const createCabang = (data) => userClient.post('/api/cabang', data);
export const updateCabang = (kodeCabang, data) => userClient.put(`/api/cabang/${kodeCabang}`, data);
export const deleteCabang = (kodeCabang) => userClient.delete(`/api/cabang/${kodeCabang}`);