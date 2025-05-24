//Frontend\frontend\src\redux\store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import forgeBalanceReducer from './forgeBalanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgeBalance: forgeBalanceReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
