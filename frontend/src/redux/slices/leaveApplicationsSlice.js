import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import BASE_URL from '../../Pages/config/config';

// ✅ Create axios instance with credentials enabled
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for sending cookies
});

// ✅ Async Thunk for fetching leave applications
export const fetchLeaveApplications = createAsyncThunk(
  'leaveApplications/fetchLeaveApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/getAllLeave'); // Cookie will be sent automatically
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Server error while fetching leave applications' }
      );
    }
  }
);

const leaveApplicationsSlice = createSlice({
  name: 'leaveApplications',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLeaveApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load leave data';
      });
  },
});

export default leaveApplicationsSlice.reducer;
