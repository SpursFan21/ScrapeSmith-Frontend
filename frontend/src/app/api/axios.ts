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

    console.log("Attempting to refresh token with refreshToken:", refreshToken);

    const response = await axios.post('http://localhost:8000/auth/refresh', {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.access_token;

    if (!newAccessToken) {
      throw new Error("No access token returned from refresh");
    }

    // Update the access token in Redux
    store.dispatch(updateAccessToken(newAccessToken));

    console.log("Access token refreshed successfully:", newAccessToken);

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
      console.warn("No access token found, attempting refresh...");
      token = await refreshAccessToken();
    }

    if (token) {
      console.log("Attaching token to request:", token);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token available to attach");
    }

    console.log("Request config after token attachment:", config);

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("Received 401, attempting to refresh token...");

      const newToken = await refreshAccessToken();

      if (newToken) {
        console.log("Retrying original request with new token...");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        console.warn("Token refresh failed, clearing credentials");
        store.dispatch(clearCredentials());
        return Promise.reject(error);
      }
    }

    console.error("Response interceptor error:", error);
    return Promise.reject(error);
  }
);

export default api;
