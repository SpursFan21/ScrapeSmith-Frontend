//Frontend\frontend\src\redux\forgeBalanceSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/api/axios';

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

export const fetchForgeBalance = createAsyncThunk<
  number, // return type
  void,   // thunk arg
  { rejectValue: string }
>(
  'forgeBalance/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/payment/balance');
      return res.data.balance;
    } catch (err: any) {
      console.error(" Failed to fetch balance:", err);
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
        state.error = action.payload || 'Unknown error';
      });
  },
});

export const { setBalance } = forgeBalanceSlice.actions;
export default forgeBalanceSlice.reducer;
