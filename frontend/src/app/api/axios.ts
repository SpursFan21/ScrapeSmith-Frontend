import axios from 'axios';
import { store } from '../../redux/store';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Base URL for your API
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token; // Get the token from Redux
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;