// frontend\src\app\api\axios.ts

import axios, {
  AxiosResponse,
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from 'axios';
import { store } from '../../redux/store';
import { updateAccessToken, clearCredentials } from '../../redux/authSlice';

// derive API base URL from environment
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://d17tfod34gawxo.cloudfront.net');

// axios instance for app calls
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// refresh endpoint
const REFRESH_ENDPOINT = '/auth/refresh';

// Refresh access token using refresh token
async function refreshAccessToken(): Promise<string | null> {
  try {
    const { accessToken, refreshToken } = store.getState().auth;
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axios.post(
      `${API_BASE}${REFRESH_ENDPOINT}`,
      { refresh_token: refreshToken }
    );

    const newAccessToken: string = response.data.access_token;
    if (!newAccessToken) throw new Error('No access token returned');

    store.dispatch(updateAccessToken(newAccessToken));
    return newAccessToken;
  } catch (err) {
    console.error('Token refresh failed:', err);
    store.dispatch(clearCredentials());
    return null;
  }
}

// Request interceptor to attach token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // skip auth endpoints
    if (config.url?.startsWith('/auth/')) return config;

    let token = store.getState().auth.accessToken;
    if (!token) {
      token = await refreshAccessToken();
    }

    if (token) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        });
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to retry on 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        if (originalRequest.headers instanceof AxiosHeaders) {
          originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        } else {
          originalRequest.headers = new AxiosHeaders({
            Authorization: `Bearer ${newToken}`,
          });
        }
        return api(originalRequest);
      }
      store.dispatch(clearCredentials());
    }
    return Promise.reject(error);
  }
);

export default api;
