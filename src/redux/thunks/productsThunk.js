import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from 'api/products';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await getProducts();
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
