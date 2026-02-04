import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Pages/config/api"; // ✅ use axios instance with cookies

// ✅ Fetch attendance data using HttpOnly cookie
export const fetchAttendanceData = createAsyncThunk(
  "attendance/fetchAttendanceData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/todays-attendance");

      // ✅ Handle paginated response: { data: [...], page, limit, total, hasMore }
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      // ✅ Handle case where backend returns an array directly
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // ✅ Handle case where backend returns an object like { attendance: [...] }
      if (response.data && Array.isArray(response.data.attendance)) {
        return response.data.attendance;
      }

      // ❌ If not an array, return empty array safely
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance data"
      );
    }
  }
);


const attendanceSlice = createSlice({
  name: "Todaysattendance",
  initialState: {
    attendanceData: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAttendanceData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.attendanceData = action.payload;
      })
      .addCase(fetchAttendanceData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
