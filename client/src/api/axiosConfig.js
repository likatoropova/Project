import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const guestId = localStorage.getItem('guestId');
    if (guestId) {
      config.headers['X-Guest-ID'] = guestId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;