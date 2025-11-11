import api from './api';
import type { RegisterData, LoginData, AuthResponse } from '../types/user.types';

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const registerPayload = {
      ...data,
      role: 'USER' 
    };
    const response = await api.post<AuthResponse>('/users/register', registerPayload);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/login', data);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },
};
