import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Pages/config/api"; // ✅ Axios instance withCookies

// ✅ Fetch holidays using secure HttpOnly cookie
export const fetchHolidays = createAsyncThunk(
  "holidays/fetchHolidays",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/holidays");

      // ✅ Always ensure it's an array
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // If not array, return empty array safely
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch holidays"
      );
    }
  }
);


const holidaysSlice = createSlice({
  name: "holidays",
  initialState: {
    holidaysData: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.holidaysData = action.payload;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default holidaysSlice.reducer;
