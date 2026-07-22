import { userClient } from './axiosClient';
import { decodeJwt } from '../utils/jwt';

export const register = (data) => userClient.post('/api/auth/register', data);

export const login = async (credentials) => {
  const res = await userClient.post('/api/auth/login', credentials);
  const token = res.data;
  localStorage.setItem('token', token);

  try {
    const payload = decodeJwt(token);
    localStorage.setItem('role', payload.role);
    localStorage.setItem('kodeCabang', payload.kodeCabang || '');
    localStorage.setItem('email', payload.email || payload.sub || payload.username || '');
  } catch {
    localStorage.removeItem('role');
    localStorage.removeItem('kodeCabang');
    localStorage.removeItem('email');
  }

  return token;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('kodeCabang');
  localStorage.removeItem('email');
};

export const assignUserToCabang = (data) => userClient.post('/api/users/assign', data);
export const getAllUser = () => userClient.get('/api/users');
export const getUser = (kodePegawai) => userClient.get(`/api/users/${kodePegawai}`);
export const updateUser = (kodePegawai, data) => userClient.put(`/api/users/${kodePegawai}`, data);
export const deleteUser = (kodePegawai) => userClient.delete(`/api/users/${kodePegawai}`);