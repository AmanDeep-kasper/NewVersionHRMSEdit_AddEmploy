import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Pages/config/api";

// Async thunk for adding a daily report
export const addDailyReport = createAsyncThunk(
  "dailyReports/addDailyReport",
  async (report, { rejectWithValue }) => {
    try {
      // const token = localStorage.getItem("authToken");
      const response = await api.post(
        `/api/dailyReports`,
        report,
        
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk for fetching daily reports
export const fetchDailyReports = createAsyncThunk(
  "dailyReports/fetchDailyReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/dailyReports`, {
       
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Daily report slice
const dailyReportSlice = createSlice({
  name: "dailyReports",
  initialState: {
    dailyReports: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Daily Report
      .addCase(addDailyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDailyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyReports.push(action.payload);
      })
      .addCase(addDailyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Daily Reports
      .addCase(fetchDailyReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyReports.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyReports = action.payload;
      })
      .addCase(fetchDailyReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dailyReportSlice.reducer;
