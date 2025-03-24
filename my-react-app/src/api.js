// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend API URL
});

// Add a request interceptor to include the token in headers if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assuming you're storing the JWT token in localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
