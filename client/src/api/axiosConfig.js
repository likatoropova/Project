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
    console.log('🔵 Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;