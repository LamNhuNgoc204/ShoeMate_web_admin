import { createSlice } from '@reduxjs/toolkit';
import { logIn } from './userThunk';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    isAuthenticated: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        console.log('------------------fullilled---------------------');

        state.loading = false;
        state.users = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default userSlice.reducer;
