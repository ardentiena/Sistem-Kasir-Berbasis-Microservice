import { userClient } from './axiosClient';

export const login = async (credentials) => {
  const res = await userClient.post('/api/auth/login', credentials);
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getUsers = () => userClient.get('/api/users');