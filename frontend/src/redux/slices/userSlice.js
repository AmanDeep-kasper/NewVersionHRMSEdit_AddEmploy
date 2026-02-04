import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Pages/config/api"; // ✅ axios instance (withCredentials: true)

const initialState = {
  userData: null,
  meResponse: null,
  error: null,
  notification: [],
  messageData: { taskId: null, to: null },
};

export const userInfo = createAsyncThunk(
  "user/userInfo",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/api/me");

      const resData = response.data;
      // Normalize known response shapes into a `user` object
      let userObj = resData && resData.user ? resData.user : resData && resData.data ? resData.data : resData;

      // If the token-decoded object doesn't include Email or department, try to fetch full employee by id
      if (userObj && userObj._id && (!userObj.Email || !userObj.department)) {
        try {
          const full = await api.get(`/api/userData/${userObj._id}`);
          const fullData = full.data || null;
          if (fullData) {
            // merge: prefer fullData fields when available
            userObj = { ...userObj, ...fullData };
          }
        } catch (err) {
          console.warn('[userInfo] could not fetch full user by id:', err?.message || err);
        }
      }

      return { user: userObj };
    } catch (error) {
      console.error("❌ /api/me error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch user info"
      );
    }
  }
);

export const notificationAdd = createAsyncThunk(
  "user/notificationAdd",
  (noti, thunkAPI) => {
    const currentNotifications = thunkAPI.getState().user.notification;
    const updatedNotifications = [noti, ...currentNotifications];
    return updatedNotifications;
  }
);

export const notificationStatusUpdate = createAsyncThunk(
  "user/NotificationStatusUpdate",
  async ({ id, val }, thunkAPI) => {
    try {
      await api.post(`/api/notificationStatusUpdate/${id}`, {
        email: thunkAPI.getState().user.userData.Email,
      });

      const updatedNotifications = thunkAPI
        .getState()
        .user.notification.map((notification) => {
          if (notification.taskId === id) {
            return { ...notification, status: "seen" };
          }
          return notification;
        });

      const messageData = { taskId: val.taskIden, to: val.to };

      return { notifications: updatedNotifications, messageData };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to change status"
      );
    }
  }
);

export const notificationDelete = createAsyncThunk(
  "user/notificationDelete",
  async (id, thunkAPI) => {
    try {
      await api.post(`/api/notificationDeleteHandler/${id}`, {
        email: thunkAPI.getState().user.userData.Email,
      });

      const updatedNotifications = thunkAPI
        .getState()
        .user.notification.filter((notification) => notification.taskId !== id);

      return { notifications: updatedNotifications };
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete notification"
      );
    }
  }
);

// Fetch a specific employee by id using backend /api/userData/:id
export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/api/userData/${id}`);
      // backend returns the employee document directly
      console.log("[fetchUserById] response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[fetchUserById] error:", error);
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch user by id");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle /api/me result
      .addCase(userInfo.fulfilled, (state, action) => {
        // store raw payload
        state.meResponse = action.payload || null;

        const payload = action.payload || {};
        const user = payload.user || payload.data || payload;

        if (!user || Object.keys(user).length === 0) {
          console.warn("⚠️ No user data found in payload:", action.payload);
          state.userData = null;
          state.notification = [];
          state.error = null;
          return;
        }

        const { Account, Email, FirstName, LastName, _id, department, Notification } = user;

        state.userData = {
          Account: Account ?? null,
          Email: Email ?? null,
          FirstName: FirstName ?? null,
          LastName: LastName ?? null,
          _id: _id ?? null,
          department: department ?? null,
        };

        state.notification = Notification || [];
        state.error = null;
      })

      // Handle fetching arbitrary user by id (/api/userData/:id)
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const user = action.payload || null;
        if (!user) {
          state.userData = null;
          return;
        }

        const { Account, Email, FirstName, LastName, _id, department, Notification } = user;
        state.userData = {
          Account: Account ?? null,
          Email: Email ?? null,
          FirstName: FirstName ?? null,
          LastName: LastName ?? null,
          _id: _id ?? null,
          department: department ?? null,
        };
        state.notification = Notification || [];
        state.error = null;
      })

      .addCase(userInfo.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(notificationAdd.fulfilled, (state, action) => {
        state.notification = action.payload;
      })

      .addCase(notificationStatusUpdate.fulfilled, (state, action) => {
        state.notification = action.payload.notifications;
        state.messageData = action.payload.messageData;
      })

      .addCase(notificationStatusUpdate.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(notificationDelete.fulfilled, (state, action) => {
        state.notification = action.payload.notifications;
      })

      .addCase(notificationDelete.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;

// selectors
export const selectUserData = (state) => state.user.userData;
export const selectMeResponse = (state) => state.user.meResponse;
export const selectNotifications = (state) => state.user.notification;