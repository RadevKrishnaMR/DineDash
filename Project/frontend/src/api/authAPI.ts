import axios from 'axios';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../../src/types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE; 
console.log(API_BASE_URL)
const api = axios.create({
  // baseURL: "http://localhost:6321/api",
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dinedash_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dinedash_token');
      localStorage.removeItem('dinedash_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/register', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
  },

  // verifyToken: async (): Promise<AuthResponse> => {
  //   const response = await api.get('/auth/verify');
  //   return response.data;
  // },
};

export default api;