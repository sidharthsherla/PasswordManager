import axios from 'axios';

const api = axios.create({
  baseURL: 'https://passwordmanager-reo5.onrender.com', // Your backend URL - Corrected Port
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
