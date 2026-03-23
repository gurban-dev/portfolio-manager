// frontend/src/lib/api.ts
import axios from 'axios';
import { API_URL } from '@/lib/env';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    return Promise.reject(error);
  }
);

export default api;
