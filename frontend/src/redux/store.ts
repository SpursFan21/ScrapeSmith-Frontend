//Frontend\frontend\src\redux\store.ts

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './authSlice';
import forgeBalanceReducer from './forgeBalanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgeBalance: forgeBalanceReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed dispatch hook for async thunks
export const useAppDispatch: () => AppDispatch = useDispatch;
