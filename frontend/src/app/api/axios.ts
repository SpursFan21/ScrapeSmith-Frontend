// frontend\src\app\api\axios.ts

import axios, {
  AxiosResponse,
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from 'axios';
import { store } from '../../redux/store';
import { updateAccessToken, clearCredentials } from '../../redux/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Refresh access token using refresh token
async function refreshAccessToken(): Promise<string | null> {
  try {
    const authState = store.getState().auth;
    console.log("🔎 Access token from Redux:", authState.accessToken);
    console.log("🔎 Refresh token from Redux:", authState.refreshToken);

    if (!authState.refreshToken) throw new Error("No refresh token available");

    const response = await axios.post('http://localhost:8000/auth/refresh', {
      refresh_token: authState.refreshToken,
    });

    const newAccessToken = response.data.access_token;
    if (!newAccessToken) throw new Error("No access token returned");

    store.dispatch(updateAccessToken(newAccessToken));
    console.log("✅ Token refreshed:", newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error("❌ Token refresh failed:", err);
    store.dispatch(clearCredentials());
    return null;
  }
}

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh'];
    if (authEndpoints.some(path => config.url?.includes(path))) return config;

    let token = store.getState().auth.accessToken;
    if (!token) {
      console.warn("⚠️ No token, trying refresh...");
      token = await refreshAccessToken();
    }

    if (token) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = new AxiosHeaders({ Authorization: `Bearer ${token}` });
      }
    } else {
      console.warn("⚠️ No token attached to request");
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("🚫 Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
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
          originalRequest.headers = new AxiosHeaders({ Authorization: `Bearer ${newToken}` });
        }

        console.log("🔁 Retrying original request with refreshed token");
        return api(originalRequest);
      }

      store.dispatch(clearCredentials());
    }

    return Promise.reject(error);
  }
);

export default api;
