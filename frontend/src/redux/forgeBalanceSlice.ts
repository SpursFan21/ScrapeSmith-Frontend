//Frontend\frontend\src\redux\forgeBalanceSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface ForgeBalanceState {
  balance: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ForgeBalanceState = {
  balance: null,
  loading: false,
  error: null,
};

export const fetchForgeBalance = createAsyncThunk(
  'forgeBalance/fetchBalance',
  async (accessToken: string, { rejectWithValue }) => {
    try {

      const res = await axios.get('http://localhost:8000/payment/balance', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data.balance;
    } catch (err: any) {
      return rejectWithValue('Failed to fetch balance');
    }
  }
);

const forgeBalanceSlice = createSlice({
  name: 'forgeBalance',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForgeBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForgeBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchForgeBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setBalance } = forgeBalanceSlice.actions;
export default forgeBalanceSlice.reducer;
