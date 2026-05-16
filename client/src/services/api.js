import axios from 'axios';

const api = axios.create({
  // In production VITE_API_URL = https://taskflow-api.onrender.com/api
  // In development the Vite proxy forwards /api → http://localhost:5000/api
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('taskflow_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('taskflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
