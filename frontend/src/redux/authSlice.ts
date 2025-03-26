// redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Utility function to safely access localStorage on the client side
const getLocalStorageItem = (key: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorageItem = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorageItem = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// Load saved tokens from localStorage if available
const savedAccessToken = getLocalStorageItem("accessToken");
const savedRefreshToken = getLocalStorageItem("refreshToken");

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: savedAccessToken,
  refreshToken: savedRefreshToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Save tokens to localStorage
      setLocalStorageItem("accessToken", action.payload.accessToken);
      setLocalStorageItem("refreshToken", action.payload.refreshToken);

      console.log("Tokens saved to localStorage:", action.payload.accessToken, action.payload.refreshToken);
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;

      // Update in localStorage
      setLocalStorageItem("accessToken", action.payload);

      console.log("Access token updated in localStorage:", action.payload);
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;

      // Clear from localStorage
      removeLocalStorageItem("accessToken");
      removeLocalStorageItem("refreshToken");

      console.log("Cleared tokens from localStorage");
    },
  },
});


export const { setCredentials, updateAccessToken, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
