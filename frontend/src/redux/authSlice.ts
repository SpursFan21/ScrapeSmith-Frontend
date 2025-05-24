//Frontend\frontend\src\redux\authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Utility functions for localStorage
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

// Load saved tokens and admin flag from localStorage
const savedAccessToken = getLocalStorageItem("accessToken");
const savedRefreshToken = getLocalStorageItem("refreshToken");
const savedIsAdmin = getLocalStorageItem("isAdmin") === "true"; // stored as string

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAdmin: boolean;
}

const initialState: AuthState = {
  accessToken: savedAccessToken,
  refreshToken: savedRefreshToken,
  isAdmin: savedIsAdmin,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string; refreshToken: string; isAdmin: boolean }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAdmin = action.payload.isAdmin;

      setLocalStorageItem("accessToken", action.payload.accessToken);
      setLocalStorageItem("refreshToken", action.payload.refreshToken);
      setLocalStorageItem("isAdmin", action.payload.isAdmin.toString());

      console.log("Tokens saved to localStorage:", action.payload.accessToken, action.payload.refreshToken);
      console.log("Admin status saved to localStorage:", action.payload.isAdmin);
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      setLocalStorageItem("accessToken", action.payload);
      console.log("Access token updated in localStorage:", action.payload);
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAdmin = false;

      removeLocalStorageItem("accessToken");
      removeLocalStorageItem("refreshToken");
      removeLocalStorageItem("isAdmin");

      console.log("Cleared all auth tokens and admin status from localStorage");
    },
  },
});

export const { setCredentials, updateAccessToken, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
