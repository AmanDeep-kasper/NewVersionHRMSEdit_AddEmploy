import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";

// ✅ Create axios instance that automatically sends cookies
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Ensures JWT cookies are sent automatically
});

// ✅ Fetch personal info (authenticated via cookie)
export const fetchPersonalInfo = createAsyncThunk(
  "personalInfo/fetchPersonalInfo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/personal-info/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error fetching personal info. Please try again later."
      );
    }
  }
);

const personalInfoSlice = createSlice({
  name: "personalInfo",
  initialState: {
    empData: null,
    email: "",
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonalInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.empData = action.payload;
        state.email = action.payload?.Email || "";
      })
      .addCase(fetchPersonalInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default personalInfoSlice.reducer;
