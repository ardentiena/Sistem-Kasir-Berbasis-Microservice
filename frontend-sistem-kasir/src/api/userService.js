import { userClient } from './axiosClient';

export const register = (data) => userClient.post('/api/auth/register', data);

export const login = async (credentials) => {
  const res = await userClient.post('/api/auth/login', credentials);
  // Endpoint login return ResponseEntity<String> (token polos, bukan object)
  localStorage.setItem('token', res.data);
  return res.data;
};

export const logout = () => localStorage.removeItem('token');

export const getAllUser = () => userClient.get('/api/users');
export const getUser = (id) => userClient.get(`/api/users/${id}`);
export const updateUser = (id, data) => userClient.put(`/api/users/${id}`, data);
export const deleteUser = (id) => userClient.delete(`/api/users/${id}`);