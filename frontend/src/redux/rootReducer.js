import { combineReducers } from "redux";
import { CookieStorage } from "redux-persist-cookie-storage";
import Cookies from "js-cookie";
import departmentReducer from "./slices/departmentSlice";
import attendanceReducer from "./slices/attendanceSlice";
import shiftReducer from "./slices/shiftSlice";
import holidaysReducer from "./slices/holidaysSlice";
import employeeReducer from "./slices/employeeSlice";
import personalInfoReducer from "./slices/personalInfoSlice";
import tasksReducer from "./slices/tasksSlice";
import loginReducer from "./slices/loginSlice";
import userReducer from "./slices/userSlice";
import chatReducer from "./slices/messageSlice";
import marketingReportReducer from "./slices/marketingReportSlice";
import dailyReportReducer from "./slices/dailyReportSlice";
import { createTransform } from "redux-persist";

// ✅ Transform – only persist userData for "user" slice
const userTransform = createTransform(
  (inboundState) => ({ userData: inboundState.userData }),
  (outboundState) => outboundState,
  { whitelist: ["user"] }
);

// ✅ Persist config – using cookies instead of localStorage
const rootPersistConfig = {
  key: "root",
  storage: new CookieStorage(Cookies, {
    expiration: { default: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    sameSite: "Strict",
    secure: true, // ensure HTTPS only
  }),
  keyPrefix: "redux-",
  whitelist: ["user", "chat", "marketingReports"],
  transforms: [userTransform],
};

// ✅ Combine all reducers
const rootReducer = combineReducers({
  department: departmentReducer,
  shift: shiftReducer,
  attendance: attendanceReducer,
  holidays: holidaysReducer,
  employee: employeeReducer,
  personalInfo: personalInfoReducer,
  tasks: tasksReducer,
  login: loginReducer,
  user: userReducer,
  chat: chatReducer,
  marketingReports: marketingReportReducer,
  dailyReports: dailyReportReducer,
});

export { rootPersistConfig, rootReducer };
