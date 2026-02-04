import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Pages/config/api"; // ✅ single axios instance
import { userInfo } from "./userSlice";

const initialState = {
  loginInfo: null,
  loginError: "",
  attendanceInfo: null,
  attendanceError: "",
};

/* =========================
   1️⃣ Login User
   ========================= */
export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (bodyLogin, thunkAPI) => {
    try {
      // 🔐 Login (cookie set by backend)
      await api.post("/api/login", bodyLogin);

      // 👤 Fetch logged-in user
      const { data } = await api.get("/api/me");

      // Store user in userSlice
      thunkAPI.dispatch(userInfo(data));

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

/* =========================
   2️⃣ Attendance API
   ========================= */
export const attendanceInfo = createAsyncThunk(
  "login/attendanceInfo",
  async ({ employeeId, attendanceId, status }, thunkAPI) => {
    try {
      const response = await api.post(`/api/attendance/${attendanceId}`, {
        employeeId,
        status,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
      });

      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark attendance"
      );
    }
  }
);

/* =========================
   3️⃣ Login Slice
   ========================= */
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearLoginError: (state) => {
      state.loginError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔐 Login
      .addCase(loginUser.pending, (state) => {
        state.loginError = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.payload;
      })

      // 🕒 Attendance
      .addCase(attendanceInfo.fulfilled, (state, action) => {
        state.attendanceInfo = action.payload;
        state.attendanceError = "";
      })
      .addCase(attendanceInfo.rejected, (state, action) => {
        state.attendanceError = action.payload;
      });
  },
});

export const { clearLoginError } = loginSlice.actions;
export default loginSlice.reducer;
