import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  taskId: null,
  to: [],
  profile: null,
  name: null,
  taskName: null,
};
const messageSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addDetails: (state, action) => {
      const { taskId, to, profile, name, taskName } = action.payload;
      // you can use this payload in your component to access these values.
      state.taskId = taskId;
      state.to = to;
      state.profile = profile;
      state.name = name;
      state.taskName = taskName;
    },
  },
});

export const { addDetails } = messageSlice.actions;
export default messageSlice.reducer;
