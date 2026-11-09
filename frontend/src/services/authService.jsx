import { authApi } from './api';

export const register = async (userData) => {
  return authApi.register(userData);
};

export const login = async (credentials) => {
  return authApi.login(credentials);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { success: true };
};
