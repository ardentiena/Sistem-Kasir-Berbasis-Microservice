import { userClient } from './axiosClient';
import { decodeJwt } from '../utils/jwt';

export const register = (data) => userClient.post('/api/auth/register', data);

export const login = async (credentials) => {
  const res = await userClient.post('/api/auth/login', credentials);
  // Endpoint login return ResponseEntity<String> (token polos, bukan object)
  const token = res.data;
  localStorage.setItem('token', token);

  // Simpan role dari dalam token supaya frontend tahu tampilkan menu admin atau tidak
  try {
    const payload = decodeJwt(token);
    localStorage.setItem('role', payload.role);
  } catch {
    localStorage.removeItem('role');
  }

  return token;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

export const getAllUser = () => userClient.get('/api/users');
export const getUser = (id) => userClient.get(`/api/users/${id}`);
export const updateUser = (id, data) => userClient.put(`/api/users/${id}`, data);
export const deleteUser = (id) => userClient.delete(`/api/users/${id}`);