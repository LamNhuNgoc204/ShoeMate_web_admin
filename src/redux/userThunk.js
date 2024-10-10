import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from 'helper/AxiosInstance';

// Async action để login người dùng
export const logIn = createAsyncThunk('users/logIn', async (credentials) => {
  try {
    const response = await AxiosInstance().post('/auth/login', credentials);
    const data = response.data;
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Login failed');
  }
});
