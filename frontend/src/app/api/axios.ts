// frontend\src\app\api\axios.ts
import axios from 'axios';
import { store } from '../../redux/store';
import { updateAccessToken, clearCredentials } from '../../redux/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Base URL for your API
});

// Refresh the access token using the refresh token
async function refreshAccessToken() {
  try {
    const refreshToken = store.getState().auth.refreshToken;

    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post('http://localhost:8000/auth/refresh', {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.access_token;

    // Update the access token in Redux
    store.dispatch(updateAccessToken(newAccessToken));

    console.log("Access token refreshed:", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    store.dispatch(clearCredentials());
    return null;
  }
}

// Axios request interceptor to include the token in the headers
api.interceptors.request.use(
  async (config) => {
    let token = store.getState().auth.accessToken;

    // If no token or token has expired, try to refresh it
    if (!token) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized, try to refresh the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // Retry the original request
      }
    }

    return Promise.reject(error);
  }
);

export default api;
