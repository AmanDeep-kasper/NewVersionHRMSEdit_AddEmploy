import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";

// ✅ Create axios instance that automatically includes cookies
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 1️⃣ Add Marketing Report
export const addMarketingReport = createAsyncThunk(
  "marketingReports/addMarketingReport",
  async (report, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/marketingReports", report);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add marketing report"
      );
    }
  }
);

// 2️⃣ Fetch Marketing Reports
export const fetchMarketingReports = createAsyncThunk(
  "marketingReports/fetchMarketingReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/marketingReports");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch marketing reports"
      );
    }
  }
);

// 3️⃣ Slice setup
const marketingReportSlice = createSlice({
  name: "marketingReports",
  initialState: {
    marketingReports: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ➕ Add Report
      .addCase(addMarketingReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMarketingReport.fulfilled, (state, action) => {
        state.loading = false;
        state.marketingReports.push(action.payload);
      })
      .addCase(addMarketingReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📋 Fetch Reports
      .addCase(fetchMarketingReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketingReports.fulfilled, (state, action) => {
        state.loading = false;
        state.marketingReports = action.payload;
      })
      .addCase(fetchMarketingReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default marketingReportSlice.reducer;
