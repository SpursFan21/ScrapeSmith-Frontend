//Frontend\frontend\src\redux\forgeBalanceSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { RootState } from './store'; // needed to get state in thunk

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

// Hardened thunk with accessToken check
export const fetchForgeBalance = createAsyncThunk<
  number,                 // return type
  void,                   // argument type
  { state: RootState; rejectValue: string } // extra type config
>(
  'forgeBalance/fetchBalance',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;
    if (!token) {
      return rejectWithValue('User not authenticated');
    }

    try {
      const res = await api.get('/payment/balance');
      return res.data.balance;
    } catch (err: any) {
      console.error("Failed to fetch balance:", err);
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
