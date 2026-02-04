// -================prevous code========
// import React, { useEffect, useContext, useState, useMemo } from "react";
// import axios from "axios";
// import Moment from "moment";
// import BASE_URL from "../config/config";
// import toast from "react-hot-toast";
// import { FaComputerMouse } from "react-icons/fa6";
// import { PiCoffeeFill } from "react-icons/pi";
// import { IoPlay, IoStop } from "react-icons/io5";
// import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
// import { useDispatch, useSelector } from "react-redux";
// import { attendanceInfo } from "../../redux/slices/loginSlice";
// import { useApiRefresh } from "../../Context/ApiRefreshContext/ApiRefreshContext";
// import useIsMobileOrTablet from "../../hooks/hooks/useIsMobileOrTablet";
// import { useTheme } from "../../Context/TheamContext/ThemeContext";
// import api from "../config/api";
// import Cookies from "js-cookie";

// function TakeBreakLogs({ data, treatOnLeaveAsWorkable = true }) {
//   /* -------------------- LOCAL STATE -------------------- */
//   const [todayData, setTodayData] = useState(null);
//   const [breakTimer, setBreakTimer] = useState(0); // seconds
//   const [intervalId, setIntervalId] = useState(null);
//   const [allowMobileLogin, setAllowMobileLogin] = useState(false);
//   // null = unknown (loading), true = allowed, false = not allowed
//   const [canClockIn, setCanClockIn] = useState(null);
//   const [minutesToStart, setMinutesToStart] = useState(0);
//   const { darkMode } = useTheme();


//   /* -------------------- REDUX / CONTEXT ----------------- */
//   const { userData } = useSelector((state) => state.user);
//   const { loading, success, error } = useSelector((state) => state.login);
//   const id = userData?._id;
//   const { setMessage } = useContext(AttendanceContext);
//   const dispatch = useDispatch();
//   const { setRefresh } = useApiRefresh();

//   const [monthlyHours, setMonthlyHours] = useState(null);
//   const [weeklyHours, setWeeklyHours] = useState(null);
//   // backward-compatible simple states retained (old UI)
//   const [actualMonthlyHours, setActualMonthlyHours] = useState(null);
//   const [expectedMonthlyHours, setExpectedMonthlyHours] = useState(null);
//   const [monthlyDiffHours, setMonthlyDiffHours] = useState(null);
//   const [actualWeeklyHours, setActualWeeklyHours] = useState(null);
//   const [expectedWeeklyHours, setExpectedWeeklyHours] = useState(null);
//   const [weeklyDiffHours, setWeeklyDiffHours] = useState(null);

// useEffect(() => {
//   loadPersonalInfoData();
//   fetchMobileLoginStatus();
//   fetchCanClockIn();
//   fetchWorkingHours();

//   computeFromShiftStart();

//   const storedBreakStart = Cookies.get("breakStartTime");
//   if (storedBreakStart) {
//     const elapsedSeconds = Math.floor(
//       (Date.now() - Number(storedBreakStart)) / 1000
//     );
//     startTimer(elapsedSeconds);
//   }
// }, [data, id]);



// const fetchWorkingHours = async () => {
//   if (!userData?._id) return;
//   try {
//     const { data } = await api.get(`/api/working-hours-summary/${userData._id}`);
//     // Backwards compatibility: older API returned monthlyHours/weeklyHours
//     if (typeof data.monthlyHours !== 'undefined' || typeof data.weeklyHours !== 'undefined') {
//       setMonthlyHours(data.monthlyHours ?? null);
//       setWeeklyHours(data.weeklyHours ?? null);
//       // clear detailed fields
//       setActualMonthlyHours(null);
//       setExpectedMonthlyHours(null);
//       setMonthlyDiffHours(null);
//       setActualWeeklyHours(null);
//       setExpectedWeeklyHours(null);
//       setWeeklyDiffHours(null);
//     } else {
//       setMonthlyHours(null);
//       setWeeklyHours(null);
//       setActualMonthlyHours(data.actualMonthlyHours ?? null);
//       setExpectedMonthlyHours(data.expectedMonthlyHours ?? null);
//       setMonthlyDiffHours(data.monthlyDiffHours ?? null);
//       setActualWeeklyHours(data.actualWeeklyHours ?? null);
//       setExpectedWeeklyHours(data.expectedWeeklyHours ?? null);
//       setWeeklyDiffHours(data.weeklyDiffHours ?? null);
//     }
//   } catch (err) {
//     console.error('Failed to fetch working hours:', err);
//     setMonthlyHours(null);
//     setWeeklyHours(null);
//     setActualMonthlyHours(null);
//     setExpectedMonthlyHours(null);
//     setMonthlyDiffHours(null);
//     setActualWeeklyHours(null);
//     setExpectedWeeklyHours(null);
//     setWeeklyDiffHours(null);
//   }
// };

//   /* -------------------- DATA FETCHERS ------------------- */
//   const fetchMobileLoginStatus = async () => {
//     if (!id) return;
//     try {
//       const { data } = await api.get(`/api/employee/${id}/mobile-login-status`, 
//     );
//       setAllowMobileLogin(data.allowMobileLogin);
//       // console.log("allowMobileLogin", data.allowMobileLogin);
//     } catch (err) {
//       console.error("Failed to get mobile-login flag:", err);
//     }
//   };

//   const loadPersonalInfoData = async () => {
//     if (!id) return;
//     try {
//       const { data } = await api.get(`/api/attendances/${id}`, 
//     );
//       setTodayData(data);
//     } catch (err) {
//       console.error("Error fetching personal info:", err);
//     }
//   };

//   const fetchCanClockIn = async () => {
//     if (!id) return;
//     try {
//       const { data } = await api.get(`/api/attendance/${id}/can-clock-in`);
//       if (data && typeof data.canClockIn !== 'undefined') {
//         setCanClockIn(!!data.canClockIn);
//         setMinutesToStart(typeof data.minutesToStart === 'number' ? data.minutesToStart : 0);
//       } else {
//         setCanClockIn(true);
//         setMinutesToStart(0);
//       }
//     } catch (err) {
//       console.error('Failed to fetch canClockIn:', err);
//       // fail-open: allow clock-in if server check fails
//       setCanClockIn(true);
//       setMinutesToStart(0);
//     }
//   };

//   // Compute canClockIn and minutesToStart from assigned shift startTime (prefer per-date shift)
//   const computeFromShiftStart = () => {
//     try {
//       // Prefer today's assigned shift if present, otherwise fallback to user default shift
//       const shift =
//         todayData?.today?.shifts?.[0] || userData?.shifts?.[0] || null;
//       if (!shift) return false;

//       // common property name used elsewhere: startTime
//       const startStr = shift.startTime || shift.StartTime || shift.start || shift.start_time;
//       if (!startStr) return false;

//       // Try parsing time strings like HH:mm or HH:mm:ss
//       let shiftStart = Moment(`${Moment().format('YYYY-MM-DD')} ${startStr}`, 'YYYY-MM-DD HH:mm:ss');
//       if (!shiftStart.isValid()) {
//         shiftStart = Moment(`${Moment().format('YYYY-MM-DD')} ${startStr}`, 'YYYY-MM-DD HH:mm');
//       }
//       if (!shiftStart.isValid()) return false;

//       // Allowed clock-in window starts 20 minutes before shift start
//       const allowedStart = shiftStart.clone().subtract(20, 'minutes');
//       const diffMs = allowedStart.valueOf() - Date.now();
//       const diffMin = Math.ceil(diffMs / 60000);

//       if (diffMin <= 0) {
//         setCanClockIn(true);
//         setMinutesToStart(0);
//       } else {
//         setCanClockIn(false);
//         setMinutesToStart(diffMin);
//       }
//       return true;
//     } catch (err) {
//       console.error('computeFromShiftStart error', err);
//       return false;
//     }
//   };

//   /* -------------------- EFFECTS ------------------------- */
//   // initial + when employee changes (id) or parent passes new data trigger

//  useEffect(() => {
//   loadPersonalInfoData();
//   fetchMobileLoginStatus();
//   fetchCanClockIn();

//   // If today's data contains shift info, compute minutes from that shift start to match UI accurately
//   // computeFromShiftStart will overwrite values set by fetchCanClockIn when shift info exists
//   // (keeps server as fallback when shift info is missing)
//   computeFromShiftStart();

//   const storedBreakStart = Cookies.get("breakStartTime"); // ✅ Get from cookie

//   if (storedBreakStart) {
//     const elapsedSeconds = Math.floor(
//       (Date.now() - Number(storedBreakStart)) / 1000
//     );
//     startTimer(elapsedSeconds);
//   }
// }, [data, id]);

// // Periodically refresh the canClockIn flag (every 60s). Cleans up on unmount.
// useEffect(() => {
//   if (!id) return;
//   const tid = setInterval(() => fetchCanClockIn(), 60 * 1000);
//   return () => clearInterval(tid);
// }, [id]);




//   // toast global success/error from redux slice
//   useEffect(() => {
//     if (success) toast.success(success);
//     if (error) toast.error(error);
//   }, [success, error]);

//   /* -------------------- DERIVED STATUS ------------------ */
//   const rawStatus = todayData?.today?.status || ""; // server-sent e.g. login | logout | break | LV | HD | WO
//   const isMobileOrTablet = useIsMobileOrTablet();
//   const isRestricted = isMobileOrTablet && allowMobileLogin !== "Allowed"; // backend flag controls mobile login

//   /**
//    * When treatOnLeaveAsWorkable=true we treat LV/HD like a logged-out state that still permits actions.
//    * This lets employees who were "pre-marked" on leave clock in if they actually work.
//    */
//   const effectiveStatus = useMemo(() => {
//     if (!treatOnLeaveAsWorkable) return rawStatus; // preserve legacy behaviour
//     if (rawStatus === "LV" || rawStatus === "HD") return "logout"; // allow clock in
//     return rawStatus;
//   }, [rawStatus, treatOnLeaveAsWorkable]);

//   const actionDisabled = loading || isRestricted;

//   /* -------------------- SERVER POST HELPERS -------------- */
//   const postAttendanceAction = async (attendanceID, payload) => {
//     return api.post(
//       `/api/attendance/${attendanceID}`,
//       payload,
//     );
//   };

//   /* -------------------- ACTION HANDLER ------------------- */
//  const handleAction = async (action) => {
//   if (isRestricted) {
//     toast.error("Mobile login is not allowed on this device.");
//     return;
//   }

//   const attendanceID = todayData?.attendanceID;
//   if (!attendanceID) {
//     toast.error("No attendance record for today.");
//     return;
//   }

//   const currentTime = Moment().format("HH:mm:ss");
//   const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60); // minutes

//   const statusMapping = {
//     login: {
//       status: "login",
//       loginTime: [currentTime],
//       loginTimeMs: [currentTimeMs],
//     },
//     logout: {
//       status: "logout",
//       logoutTime: [currentTime],
//       logoutTimeMs: [currentTimeMs],
//     },
//     break: {
//       status: "break",
//       breakTime: [currentTime],
//       breakTimeMs: [currentTimeMs],
//     },
//     resume: {
//       status: "login",
//       ResumeTime: [currentTime],
//       resumeTimeMS: [currentTimeMs],
//     },
//   };

//   setRefresh((p) => !p); // nudge global re-fetchers

//   try {
//     await postAttendanceAction(attendanceID, {
//       employeeId: id,
//       year: new Date().getFullYear(),
//       month: new Date().getMonth() + 1,
//       date: new Date().getDate(),
//       ...statusMapping[action],
//     });

//     // ✅ Replace localStorage with Cookies
//     if (action === "break") {
//       Cookies.set("breakStartTime", Date.now().toString(), { expires: 1 }); // 1 day
//       startTimer();
//     } else if (action === "resume") {
//       stopTimer();
//       Cookies.remove("breakStartTime");
//       setRefresh((p) => !p);
//       await loadPersonalInfoData();
//     }

//     await loadPersonalInfoData();
//     toast.success(`${action[0].toUpperCase()}${action.slice(1)} recorded`);
//   } catch (err) {
//     console.error(`Error recording ${action}`, err);
//     toast.error(`Error recording ${action}`);
//   }
// };




//   /* -------------------- SIMPLE LOGIN / LOGOUT ------------- */
//   const loginHandler = async (status) => {
//     if (isRestricted) {
//       toast.error("Mobile login is not allowed on this device.");
//       return;
//     }


//     // Try validating by employeeId
//     let validShift = await validateShiftFromModal(userData?._id);
//     // If not valid, try by shiftId (if available)
//     if (!validShift && userData?.shifts?.length > 0) {
//       validShift = await validateShiftFromModal(userData.shifts[0]._id || userData.shifts[0]);
//     }
//     if (!validShift) return;

//     try {
//       console.log('loginHandler called:', { employeeId: id, status });
//       const result = await dispatch(attendanceInfo({ employeeId: id, status }));
//       console.log('attendanceInfo dispatch result:', result);
//       await loadPersonalInfoData();
//       setRefresh((p) => !p);
//       toast.success(`${status} marked successfully`);
//     } catch (err) {
//       console.error(`Error marking ${status}`, err);
//       toast.error(`Error marking ${status}`);
//     }
//   };

//   // const validateShiftFromModal = async (employeeId) => {
//   //   try {
//   //     const response = await api.get(`/api/shifts/${employeeId}`);
//   //     const shiftData = response.data;

//   //     if (!shiftData || !shiftData.startTime || !shiftData.endTime) {
//   //       toast.error("Shift details are missing or incomplete.");
//   //       return null;
//   //     }

//   //     const now = Moment();
//   //     let shiftStart = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.startTime}`, 'YYYY-MM-DD HH:mm:ss');
//   //     let shiftEnd = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.endTime}`, 'YYYY-MM-DD HH:mm:ss');

//   //     if (!shiftStart.isValid()) {
//   //       shiftStart = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.startTime}`, 'YYYY-MM-DD HH:mm');
//   //     }
//   //     if (!shiftEnd.isValid()) {
//   //       shiftEnd = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.endTime}`, 'YYYY-MM-DD HH:mm');
//   //     }

//   //     if (!shiftStart.isValid() || !shiftEnd.isValid()) {
//   //       toast.error("Invalid shift timing.");
//   //       return null;
//   //     }

//   //     // Allow clock-in 20 minutes before shift start
//   //     const allowedStart = shiftStart.clone().subtract(20, 'minutes');

//   //     // If shift crosses midnight, handle early morning clock-in
//   //     if (shiftEnd.isBefore(shiftStart)) {
//   //       // If now is after allowedStart (today) or before shiftEnd (next day)
//   //       if (now.isBetween(allowedStart, shiftStart, null, '[)') || now.isBetween(shiftStart, shiftEnd, null, '[)')) {
//   //         return shiftData;
//   //       }
//   //     } else {
//   //       if (now.isBetween(allowedStart, shiftEnd, null, '[)')) {
//   //         return shiftData;
//   //       }
//   //     }
//   //     toast.error("You can only clock in during your assigned shift time (including 20 min before start).");
//   //     return null;
//   //   } catch (error) {
//   //     console.error("Error fetching shift details:", error);
//   //     toast.error("Failed to validate shift timing.");
//   //     return null;
//   //   }
//   // };



//   const validateShiftFromModal = async (idOrShiftId) => {
//   try {
//     // Try both employeeId and shiftId endpoints
//     let shiftData;
//     // If idOrShiftId looks like a MongoDB ObjectId (24 hex chars), treat as shiftId
//     if (typeof idOrShiftId === "string" && idOrShiftId.length === 24) {
//       const response = await api.get(`/api/shifts/${idOrShiftId}`);
//       shiftData = response.data;
//     } else {
//       const response = await api.get(`/api/shifts/${idOrShiftId}`);
//       shiftData = response.data;
//     }

//     if (!shiftData || !shiftData.startTime || !shiftData.endTime) {
//       toast.error("Shift details are missing or incomplete.");
//       return null;
//     }

//     const now = Moment();
//     let shiftStart = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.startTime}`, 'YYYY-MM-DD HH:mm:ss');
//     let shiftEnd = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.endTime}`, 'YYYY-MM-DD HH:mm:ss');

//     if (!shiftStart.isValid()) {
//       shiftStart = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.startTime}`, 'YYYY-MM-DD HH:mm');
//     }
//     if (!shiftEnd.isValid()) {
//       shiftEnd = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.endTime}`, 'YYYY-MM-DD HH:mm');
//     }

//     if (!shiftStart.isValid() || !shiftEnd.isValid()) {
//       toast.error("Invalid shift timing.");
//       return null;
//     }

//     // Allow clock-in 20 minutes before shift start
//     const allowedStart = shiftStart.clone().subtract(20, 'minutes');

//     // Overnight shift handling
//     if (shiftEnd.isBefore(shiftStart)) {
//       // If now is after allowedStart (today) or before shiftEnd (next day)
//       if (
//         now.isBetween(allowedStart, shiftStart, null, '[)') ||
//         now.isBetween(shiftStart, shiftEnd.clone().add(1, 'day'), null, '[)')
//       ) {
//         return shiftData;
//       }
//     } else {
//       if (now.isBetween(allowedStart, shiftEnd, null, '[)')) {
//         return shiftData;
//       }
//     }
//     toast.error("You can only clock in during your assigned shift time (including 20 min before start).");
//     return null;
//   } catch (error) {
//     console.error("Error fetching shift details:", error);
//     toast.error("Failed to validate shift timing.");
//     return null;
//   }
// };
//   /* -------------------- BREAK TIMER HELPERS --------------- */
//   const startTimer = (initial = 0) => {
//     setBreakTimer(initial);
//     const newId = setInterval(() => setBreakTimer((t) => t + 1), 1000);
//     setIntervalId((old) => {
//       if (old) clearInterval(old);
//       return newId;
//     });
//   };

//   const stopTimer = () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//     }
//   };



//   const formatTime = (s) =>
//     [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
//       .map((n) => String(n).padStart(2, "0"))
//       .join(":");

//     /* -------------------- BADGE HELPERS --------------------- */
//   const LeaveBadge = () => {
//     if (!treatOnLeaveAsWorkable) return null; // old behaviour -> disabled buttons handle message
//     if (rawStatus === "LV") {
//       return (
//         <span className="badge bg-warning text-dark ms-2" title="You are marked on Leave, but actions are allowed.">
//           On Leave
//         </span>
//       );
//     }
//     if (rawStatus === "HD") {
//       return (
//         <span className="badge bg-info text-dark ms-2" title="Today is marked Holiday, but actions are allowed.">
//           Holiday
//         </span>
//       );
//     }
//     return null;
//   };

//   /* -------------------- RENDER -------------------------- */
//   if (!todayData) return null;

//   const isTodayLogged = todayData?.today?.status !== "logout";




//   return (

//     //old design below
//       <div className="row gap-2">
//         <div className="mt-2">
//   {todayData?.today?.shifts?.length > 0 ? (
//     <div className="text-sm text-gray-700">
//       {`Shift: ${todayData.today.shifts[0].shiftName || "N/A"}`}
//       <div className="flex gap-2">
//         <div>{`In: ${todayData.today.shifts[0].startTime || "N/A"}`}</div>
//         <div>{`Out: ${todayData.today.shifts[0].endTime || "N/A"}`}</div>
//       </div>
//     </div>
//   ) : (
//     <div className="text-sm text-red-500">
//       No shift assigned for today.
//     </div>
//   )}
//   {/* Working Hours Summary */}
//   <div className="mt-2 text-sm text-blue-700">
//     {actualMonthlyHours !== null || monthlyHours !== null ? (
//       <div>
//         <div>{`Monthly (Actual / Expected): ${actualMonthlyHours !== null ? actualMonthlyHours : (monthlyHours !== null ? monthlyHours : '--')} hrs / ${expectedMonthlyHours !== null ? expectedMonthlyHours : '--'} hrs`}</div>
//         <div>{`Difference: ${monthlyDiffHours !== null ? monthlyDiffHours : (monthlyHours !== null && expectedMonthlyHours !== null ? (monthlyHours - expectedMonthlyHours).toFixed(2) : '--')} hrs`}</div>
//       </div>
//     ) : (
//       <div>{`Monthly Working Hours: ${monthlyHours !== null ? monthlyHours : '--'} hrs`}</div>
//     )}

//     {actualWeeklyHours !== null || weeklyHours !== null ? (
//       <div>
//         <div>{`Weekly (Actual / Expected): ${actualWeeklyHours !== null ? actualWeeklyHours : (weeklyHours !== null ? weeklyHours : '--')} hrs / ${expectedWeeklyHours !== null ? expectedWeeklyHours : '--'} hrs`}</div>
//         <div>{`Difference: ${weeklyDiffHours !== null ? weeklyDiffHours : (weeklyHours !== null && expectedWeeklyHours !== null ? (weeklyHours - expectedWeeklyHours).toFixed(2) : '--')} hrs`}</div>
//       </div>
//     ) : (
//       <div>{`Weekly Working Hours: ${weeklyHours !== null ? weeklyHours : '--'} hrs`}</div>
//     )}
//   </div>
// </div>
//       {isRestricted ? (

        
//         <div
//           style={{ width: "97%" }}
//           className={`text-center d-flex gap-2 my-2 py-2 rounded-2 mx-auto bg-warning`}
//         >
//           <h5 className="mx-auto fw-normal my-0" style={{ whiteSpace: "pre" }}>
//             Mobile login is not allowed
//           </h5>
//         </div>
//       ) : (
//         <div className="d-flex gap-2 flex-wrap" style={{ alignItems: "center" }}>
//           {/* LOGGED IN STATE ------------------------------------------------*/}
//           {effectiveStatus === "login" && (
//             <div className="d-flex align-items-center gap-2 w-100">
//               <button
//                 style={{ whiteSpace: "pre" }}
//                 className="btn w-100 btn-warning rounded-2 d-flex align-items-center justify-content-center gap-2"
//                 onClick={() => handleAction("break")}
//                 disabled={actionDisabled}
//               >
//                 <PiCoffeeFill className="my-auto fs-5" /> Take a Break
//                 <LeaveBadge />
//               </button>
//               <button
//                 style={{ whiteSpace: "pre" }}
//                 className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
//                 onClick={() => loginHandler("logout")}
//                 disabled={actionDisabled}
//               >
//                 {loading ? "Processing…" : (<><IoStop /> Clock Out</>)}
//                 <LeaveBadge />
//               </button>
//             </div>
//           )}

//           {/* LOGGED OUT-LIKE STATES (logout, WO, "", LV, HD) ----------------*/}
//           {['logout', 'WO', ''].includes(effectiveStatus) && (
//             <button
//               style={{ whiteSpace: "pre" }}
//               className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
//               onClick={() => loginHandler("login")}
//               disabled={actionDisabled}
//             >
//               {loading ? "Processing…" : (<><IoPlay /> Clock In</>)}
//               <LeaveBadge />
//             </button>
//           )}

//           {/* BREAK STATE ----------------------------------------------------*/}
//           {effectiveStatus === "break" && (
//             <button
//               style={{ whiteSpace: "pre" }}
//               className="btn btn-dark border rounded-2 w-100 d-flex align-items-center justify-content-center gap-2"
//               onClick={() => handleAction("resume")}
//               disabled={actionDisabled}
//             >
//               <FaComputerMouse className="my-auto fs-5" /> Break Over ({formatTime(breakTimer)})
//               <LeaveBadge />
//             </button>
//           )}

//           {/* LEGACY DISABLED STATES (if treatOnLeaveAsWorkable=false) --------*/}
//           {!treatOnLeaveAsWorkable && rawStatus === "LV" && (
//             <button style={{ whiteSpace: "pre" }} className="btn btn-warning w-100" disabled>
//               You are on leave
//             </button>
//           )}
//           {!treatOnLeaveAsWorkable && rawStatus === "HD" && (
//             <button style={{ whiteSpace: "pre" }} className="btn btn-warning w-100" disabled>
//               You are on holiday
//             </button>
//           )}
//         </div>
//       )}
//     </div>
// // ===========new design above=====================
//     // <div className="row gap-2">
//     //   <div className="mt-2">
//     //     {todayData?.today?.shifts?.length > 0 ? (
//     //       <div className="text-sm text-gray-700">
//     //         {`Shift: ${todayData.today.shifts[0].shiftName || "N/A"}`}
//     //         <div className="flex gap-2">
//     //           <div>{`In: ${todayData.today.shifts[0].startTime || "N/A"}`}</div>
//     //           <div>{`Out: ${todayData.today.shifts[0].endTime || "N/A"}`}</div>
//     //         </div>
//     //       </div>
//     //     ) : (
//     //       <div className="text-sm text-red-500">
//     //         No shift assigned for today.
//     //       </div>
//     //     )}
//     //     {/* Working Hours Summary */}
//     //     <div className="mt-2 text-sm text-blue-700">
//     //       {actualMonthlyHours !== null || monthlyHours !== null ? (
//     //         <div>
//     //           <div>{`Monthly (Actual / Expected): ${actualMonthlyHours !== null ? actualMonthlyHours : (monthlyHours !== null ? monthlyHours : '--')} hrs / ${expectedMonthlyHours !== null ? expectedMonthlyHours : '--'} hrs`}</div>
//     //           <div>{`Difference: ${monthlyDiffHours !== null ? monthlyDiffHours : (monthlyHours !== null && expectedMonthlyHours !== null ? (monthlyHours - expectedMonthlyHours).toFixed(2) : '--')} hrs`}</div>
//     //         </div>
//     //       ) : (
//     //         <div>{`Monthly Working Hours: ${monthlyHours !== null ? monthlyHours : '--'} hrs`}</div>
//     //       )}

//     //       {actualWeeklyHours !== null || weeklyHours !== null ? (
//     //         <div>
//     //           <div>{`Weekly (Actual / Expected): ${actualWeeklyHours !== null ? actualWeeklyHours : (weeklyHours !== null ? weeklyHours : '--')} hrs / ${expectedWeeklyHours !== null ? expectedWeeklyHours : '--'} hrs`}</div>
//     //           <div>{`Difference: ${weeklyDiffHours !== null ? weeklyDiffHours : (weeklyHours !== null && expectedWeeklyHours !== null ? (weeklyHours - expectedWeeklyHours).toFixed(2) : '--')} hrs`}</div>
//     //         </div>
//     //       ) : (
//     //         <div>{`Weekly Working Hours: ${weeklyHours !== null ? weeklyHours : '--'} hrs`}</div>
//     //       )}
//     //     </div>

//     //   </div>


//     //   {isRestricted ? (


//     //     <div
//     //       style={{ width: "97%" }}
//     //       className={`text-center d-flex gap-2 my-2 py-2 rounded-2 mx-auto bg-warning`}
//     //     >
//     //       <h5 className="mx-auto fw-normal my-0" style={{ whiteSpace: "pre" }}>
//     //         Mobile login is not allowed
//     //       </h5>
//     //     </div>
//     //   ) : (
//     //     <div className="d-flex gap-2 flex-wrap" style={{ alignItems: "center" }}>
//     //       {effectiveStatus === "login" && (
//     //         <div className="d-flex align-items-center gap-2 w-100">
//     //           <button
//     //             style={{ whiteSpace: "pre" }}
//     //             className="btn w-100 btn-warning rounded-2 d-flex align-items-center justify-content-center gap-2"
//     //             onClick={() => handleAction("break")}
//     //             disabled={actionDisabled}
//     //           >
//     //             <PiCoffeeFill className="my-auto fs-5" /> Take a Break
//     //             <LeaveBadge />
//     //           </button>
//     //           <button
//     //             style={{ whiteSpace: "pre" }}
//     //             className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
//     //             onClick={() => loginHandler("logout")}
//     //             disabled={actionDisabled}
//     //           >
//     //             {loading ? "Processing…" : (<><IoStop /> Clock Out</>)}
//     //             <LeaveBadge />
//     //           </button>
//     //         </div>
//     //       )}

//     //       {['logout', 'WO', ''].includes(effectiveStatus) && (
//     //         <button
//     //           style={{ whiteSpace: "pre" }}
//     //           className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
//     //           onClick={() => loginHandler("login")}
//     //           disabled={actionDisabled}
//     //         >
//     //           {loading ? "Processing…" : (<><IoPlay /> Clock In</>)}
//     //           <LeaveBadge />
//     //         </button>
//     //       )}

//     //       {effectiveStatus === "break" && (
//     //         <button
//     //           style={{ whiteSpace: "pre" }}
//     //           className="btn btn-dark border rounded-2 w-100 d-flex align-items-center justify-content-center gap-2"
//     //           onClick={() => handleAction("resume")}
//     //           disabled={actionDisabled}
//     //         >
//     //           <FaComputerMouse className="my-auto fs-5" /> Break Over ({formatTime(breakTimer)})
//     //           <LeaveBadge />
//     //         </button>
//     //       )}

//     //       {!treatOnLeaveAsWorkable && rawStatus === "LV" && (
//     //         <button style={{ whiteSpace: "pre" }} className="btn btn-warning w-100" disabled>
//     //           You are on leave
//     //         </button>
//     //       )}
//     //       {!treatOnLeaveAsWorkable && rawStatus === "HD" && (
//     //         <button style={{ whiteSpace: "pre" }} className="btn btn-warning w-100" disabled>
//     //           You are on holiday
//     //         </button>
//     //       )}
//     //     </div>
//     //   )}
//     // </div>

//     // // tested code design below
//     // <div
//     //   className={`flex flex-col sm:flex-row justify-between items-center sm:items-start p-4 sm:p-6 rounded-lg shadow-md gap-4 ${
//     //     darkMode ? "bg-gray-800" : "bg-white"
//     //   }`}
//     // >
//     //   {/* Left: Date, Greetings, Shift */}
//     //   <div className="flex-1">
//     //     {/* Date */}
//     //     <div className="text-sm text-gray-500">
//     //       {Moment(todayData?.today?.date).format("dddd, MMMM D, YYYY")}
//     //     </div>

//     //     {/* Greetings + Name */}
//     //     <div className="text-xl font-semibold text-gray-800">
//     //       {`Hello, ${userData?.FirstName || "Employee"}!`}
//     //     </div>

//     //     {/* Shift Info */}
//     //     <div className="mt-2">
//     //       {todayData?.today?.shifts?.length > 0 ? (
//     //         <div className="text-sm text-gray-700">
//     //           {`Shift: ${todayData.today.shifts[0].shiftName || "N/A"}`}
//     //           <div className="flex gap-2">
//     //             <div>{`In: ${todayData.today.shifts[0].startTime || "N/A"}`}</div>
//     //             <div>{`Out: ${todayData.today.shifts[0].endTime || "N/A"}`}</div>
//     //           </div>
//     //         </div>
//     //       ) : (
//     //         <div className="text-sm text-red-500">
//     //           No shift assigned for today.
//     //         </div>
//     //       )}
//     //     </div>
//     //   </div>

//     //   {/* Right: Break Timer / Actions */}
//     //   <div className="flex flex-col sm:flex-row gap-4">
//     //     {/* Break Timer */}
//     //     <div
//     //       className={`flex items-center justify-center p-4 rounded-lg shadow-md gap-2 ${
//     //         darkMode ? "bg-gray-700" : "bg-gray-100"
//     //       }`}
//     //     >
//     //       <div
//     //         className={`text-4xl font-bold ${
//     //           darkMode ? "text-white" : "text-gray-800"
//     //         }`}
//     //       >
//     //         {`${Math.floor(breakTimer / 60)
//     //           .toString()
//     //           .padStart(2, "0")}:${(breakTimer % 60).toString().padStart(2, "0")}`}
//     //       </div>
//     //       <div
//     //         className={`text-sm ${
//     //           darkMode ? "text-gray-300" : "text-gray-500"
//     //         }`}
//     //       >
//     //         {breakTimer === 0 ? "Break not started" : "Break in progress"}
//     //       </div>
//     //     </div>

//     //     {/* Action Buttons */}
//     //     <div className="flex flex-col sm:flex-row gap-4 w-full">
//     //       {isTodayLogged ? (
//     //         <>
//     //           {/* Logout Button */}
//     //           <button
//     //             onClick={() => handleAction("logout")}
//     //             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//     //               actionDisabled
//     //                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//     //                 : darkMode
//     //                 ? "bg-red-600 text-white hover:bg-red-700"
//     //                 : "bg-red-100 text-red-700 hover:bg-red-200"
//     //             }`}
//     //             disabled={actionDisabled}
//     //           >
//     //             <IoStop className="text-lg" />
//     //             Logout
//     //           </button>

//     //           {/* Break Button */}
//     //           <button
//     //             onClick={() => handleAction("break")}
//     //             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//     //               actionDisabled
//     //                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//     //                 : darkMode
//     //                 ? "bg-blue-600 text-white hover:bg-blue-700"
//     //                 : "bg-blue-100 text-blue-700 hover:bg-blue-200"
//     //             }`}
//     //             disabled={actionDisabled}
//     //           >
//     //             <PiCoffeeFill className="text-lg" />
//     //             Break
//     //           </button>
//     //         </>
//     //       ) : (
//     //         <>
//     //           {/* Login Button */}
//     //           <button
//     //             onClick={() => loginHandler("login")}
//     //             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//     //               actionDisabled
//     //                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//     //                 : darkMode
//     //                 ? "bg-green-600 text-white hover:bg-green-700"
//     //                 : "bg-green-100 text-green-700 hover:bg-green-200"
//     //             }`}
//     //             disabled={actionDisabled}
//     //           >
//     //             <IoPlay className="text-lg" />
//     //             Login
//     //           </button>

//     //           {/* Treat as Workable (Logout) Button */}
//     //           {treatOnLeaveAsWorkable && (
//     //             <button
//     //               onClick={() => loginHandler("logout")}
//     //               className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//     //                 actionDisabled
//     //                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//     //                   : darkMode
//     //                   ? "bg-yellow-600 text-white hover:bg-yellow-700"
//     //                   : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
//     //               }`}
//     //               disabled={actionDisabled}
//     //             >
//     //               <FaComputerMouse className="text-lg" />
//     //               Treat as Workable
//     //             </button>
//     //           )}
//     //         </>
//     //       )}
//     //     </div>
//     //   </div>
//     // </div>
  
//   );
// }

// export default TakeBreakLogs;

// -================prevous code========//

////============ new code with update ui=======================
import React, { useEffect, useContext, useState, useMemo } from "react";
import axios from "axios";
import Moment from "moment";
import BASE_URL from "../config/config";
import toast from "react-hot-toast";
import { FaComputerMouse } from "react-icons/fa6";
import { PiCoffeeFill } from "react-icons/pi";
import { IoPlay, IoStop } from "react-icons/io5";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import { useDispatch, useSelector } from "react-redux";
import { attendanceInfo } from "../../redux/slices/loginSlice";
import { useApiRefresh } from "../../Context/ApiRefreshContext/ApiRefreshContext";
import useIsMobileOrTablet from "../../hooks/hooks/useIsMobileOrTablet";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../config/api";
import Cookies from "js-cookie";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Badge,
} from "react-bootstrap";
import { FiArrowUp, FiArrowDown, FiClock, FiUser } from "react-icons/fi";

function TakeBreakLogs({ data, treatOnLeaveAsWorkable = true }) {


 
  /* -------------------- LOCAL STATE -------------------- */
  const [todayData, setTodayData] = useState(null);
  const [breakTimer, setBreakTimer] = useState(0); // seconds
  const [intervalId, setIntervalId] = useState(null);
  const [shiftCountdown, setShiftCountdown] = useState(null); // formatted HH:MM:SS until shift end
  const [shiftIntervalId, setShiftIntervalId] = useState(null);
  const [allowMobileLogin, setAllowMobileLogin] = useState(false);
  // null = unknown (loading), true = allowed, false = not allowed
  const [canClockIn, setCanClockIn] = useState(null);
  const [minutesToStart, setMinutesToStart] = useState(0);
  const { darkMode } = useTheme();


  /* -------------------- REDUX / CONTEXT ----------------- */
  const { userData } = useSelector((state) => state.user);
  const { loading, success, error } = useSelector((state) => state.login);
  const id = userData?._id;
  const { setMessage } = useContext(AttendanceContext);
  const dispatch = useDispatch();
  const { setRefresh } = useApiRefresh();

  const [monthlyHours, setMonthlyHours] = useState(null);
  const [weeklyHours, setWeeklyHours] = useState(null);
  // backward-compatible simple states retained (old UI)
  const [actualMonthlyHours, setActualMonthlyHours] = useState(null);
  const [expectedMonthlyHours, setExpectedMonthlyHours] = useState(null);
  const [monthlyDiffHours, setMonthlyDiffHours] = useState(null);
  const [actualWeeklyHours, setActualWeeklyHours] = useState(null);
  const [liveWeeklyHours, setLiveWeeklyHours] = useState(null); // live weekly actual
  const [expectedWeeklyHours, setExpectedWeeklyHours] = useState(null);
  const [weeklyDiffHours, setWeeklyDiffHours] = useState(null);
  console.log("weeklyHours", actualWeeklyHours);

  // breakdown state
  const [breakdownDays, setBreakdownDays] = useState([]);
  const [breakdownWeekly, setBreakdownWeekly] = useState([]);
  const [breakdownTotals, setBreakdownTotals] = useState(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);

  const [standardExpectedWeeklyHours, setStandardExpectedWeeklyHours] = useState(null);
  // Today's summary
  const [actualTodayHours, setActualTodayHours] = useState(null);
  const [liveTodayHours, setLiveTodayHours] = useState(null); // live update


    // Helper: calculate expected weekly hours for 6 days (shift-based)
  const computeExpectedWeeklyHours = () => {
    // Use user's shift info (prefer today, fallback to user)
    const shift = todayData?.today?.shifts?.[0] || userData?.shifts?.[0] || null;
    if (!shift || !shift.startTime || !shift.endTime) return null;
    let startMoment = Moment(`2025-01-01 ${shift.startTime}`, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD hh:mm A']);
    let endMoment = Moment(`2025-01-01 ${shift.endTime}`, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD hh:mm A']);
    if (!startMoment.isValid() || !endMoment.isValid()) return null;
    if (!endMoment.isAfter(startMoment)) endMoment.add(1, 'day');
    const dailyMinutes = endMoment.diff(startMoment, 'minutes');
    const dailyHours = dailyMinutes / 60;
    return (dailyHours * 6).toFixed(2); // 6 working days
  };

  // Helper: calculate actual weekly hours from breakdownWeekly (current week, 6 days)
  const computeActualWeeklyHours = () => {
    if (!breakdownWeekly || !Array.isArray(breakdownWeekly)) return null;
    const today = Moment();
    const currentWeek = breakdownWeekly.find(w => {
      return today.isBetween(Moment(w.startDate, 'YYYY-MM-DD'), Moment(w.endDate, 'YYYY-MM-DD').endOf('day'), null, '[]');
    });
    if (!currentWeek) return null;
    return currentWeek.actualHours;
  };


   const expectedWeeklyHours6Days = computeExpectedWeeklyHours();
  const actualWeeklyHours6Days = computeActualWeeklyHours();
  // Helper: calculate today's actual hours from login to now/shift end
  const computeLiveTodayHours = () => {
    if (!todayData?.today?.loginTime || !Array.isArray(todayData.today.loginTime) || todayData.today.loginTime.length === 0) return null;
    const loginStr = todayData.today.loginTime[0];
    const shiftEndStr = todayData?.today?.shifts?.[0]?.endTime || userData?.shifts?.[0]?.endTime;
    if (!loginStr) return null;
    let loginMoment = Moment(`${Moment().format('YYYY-MM-DD')} ${loginStr}`, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD hh:mm A']);
    if (!loginMoment.isValid()) return null;
    let now = Moment();
    let endMoment = shiftEndStr ? Moment(`${Moment().format('YYYY-MM-DD')} ${shiftEndStr}`, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD hh:mm A']) : null;
    if (endMoment && !endMoment.isValid()) endMoment = null;
    // Overnight shift: if end before start, add 1 day
    if (endMoment && !endMoment.isAfter(loginMoment)) endMoment.add(1, 'day');
    let effectiveEnd = endMoment && endMoment.isValid() ? (now.isBefore(endMoment) ? now : endMoment) : now;
    let diffMin = effectiveEnd.diff(loginMoment, 'minutes');
    if (diffMin < 0) diffMin = 0;
    return (diffMin / 60).toFixed(2);
  };

  // Live update today's actual hours every minute
  useEffect(() => {
    if (!todayData?.today?.loginTime) return;
    setLiveTodayHours(computeLiveTodayHours());
    const interval = setInterval(() => {
      setLiveTodayHours(computeLiveTodayHours());
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, [todayData]);
  const [expectedTodayHours, setExpectedTodayHours] = useState(null);
  const [dailyDiffHours, setDailyDiffHours] = useState(null);
  const [standardExpectedMonthlyHours, setStandardExpectedMonthlyHours] = useState(null);
  
useEffect(() => {
  loadPersonalInfoData();
  fetchMobileLoginStatus();
  fetchCanClockIn();
  fetchWorkingHours();

  computeFromShiftStart();

  const storedBreakStart = Cookies.get("breakStartTime");
  if (storedBreakStart) {
    const elapsedSeconds = Math.floor(
      (Date.now() - Number(storedBreakStart)) / 1000
    );
    startTimer(elapsedSeconds);
  }
}, [data, id]);

// Start/stop shift countdown based on today's attendance and shift info
useEffect(() => {
  // clear previous interval
  if (shiftIntervalId) {
    clearInterval(shiftIntervalId);
    setShiftIntervalId(null);
  }

  try {
    const today = todayData?.today;
    if (!today) {
      setShiftCountdown(null);
      return;
    }

    // We only start countdown when status is 'login' and shift endTime is available
    if (today.status === 'login') {
      // Prefer per-date shift, otherwise fallback to user default
      const shift = (today.shifts && today.shifts.startTime) ? today.shifts : (userData?.shifts?.[0] || null);
      const shiftStartStr = shift?.startTime;
      const shiftEndStr = shift?.endTime;
      if (!shiftEndStr) {
        setShiftCountdown(null);
        return;
      }

      // Build start and end moments for today (use client's local timezone via Moment)
      const now = Moment();
      let startMoment = Moment(`${now.format('YYYY-MM-DD')} ${shiftStartStr}`, 'YYYY-MM-DD HH:mm:ss');
      if (!startMoment.isValid()) startMoment = Moment(`${now.format('YYYY-MM-DD')} ${shiftStartStr}`, 'YYYY-MM-DD HH:mm');
      let endMoment = Moment(`${now.format('YYYY-MM-DD')} ${shiftEndStr}`, 'YYYY-MM-DD HH:mm:ss');
      if (!endMoment.isValid()) endMoment = Moment(`${now.format('YYYY-MM-DD')} ${shiftEndStr}`, 'YYYY-MM-DD HH:mm');

      // If parsing failed for either, try fallback formats (AM/PM)
      if (!startMoment.isValid()) startMoment = Moment(`${now.format('YYYY-MM-DD')} ${shiftStartStr}`, 'YYYY-MM-DD hh:mm A');
      if (!endMoment.isValid()) endMoment = Moment(`${now.format('YYYY-MM-DD')} ${shiftEndStr}`, 'YYYY-MM-DD hh:mm A');

      if (!startMoment.isValid() || !endMoment.isValid()) {
        setShiftCountdown(null);
        return;
      }

      // Overnight shift handling: if end is same or before start, assume next day
      if (!endMoment.isAfter(startMoment)) endMoment.add(1, 'day');

      // Initialize countdown value
      const updateRemaining = () => {
        const diffSec = Math.max(0, Math.round(endMoment.diff(Moment(), 'seconds')));
        const hh = String(Math.floor(diffSec / 3600)).padStart(2, '0');
        const mm = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
        const ss = String(diffSec % 60).padStart(2, '0');
        setShiftCountdown(`${hh}:${mm}:${ss}`);
        if (diffSec <= 0) {
          // stop interval
          if (shiftIntervalId) {
            clearInterval(shiftIntervalId);
            setShiftIntervalId(null);
          }
        }
      };

      // Run immediately then every second
      updateRemaining();
      const sid = setInterval(updateRemaining, 1000);
      setShiftIntervalId(sid);
    } else {
      setShiftCountdown(null);
    }
  } catch (err) {
    console.warn('shift countdown setup failed', err);
    setShiftCountdown(null);
  }

  // cleanup on unmount
  return () => {
    if (shiftIntervalId) clearInterval(shiftIntervalId);
  };
}, [todayData, userData]);



const fetchWorkingHours = async () => {
  if (!userData?._id) return;
  try {
    const { data } = await api.get(`/api/working-hours-summary/${userData._id}`);
    // Backwards compatibility: older API returned monthlyHours/weeklyHours
    if (typeof data.monthlyHours !== 'undefined' || typeof data.weeklyHours !== 'undefined') {
      setMonthlyHours(data.monthlyHours ?? null);
      setWeeklyHours(data.weeklyHours ?? null);
      // clear detailed fields
      setActualMonthlyHours(null);
      setExpectedMonthlyHours(null);
      setMonthlyDiffHours(null);
      setActualWeeklyHours(null);
      setExpectedWeeklyHours(null);
      setWeeklyDiffHours(null);
      setActualTodayHours(null);
      setExpectedTodayHours(null);
      setDailyDiffHours(null);
      setStandardExpectedMonthlyHours(null);
      setStandardExpectedWeeklyHours(null);
    } else {
      setMonthlyHours(null);
      setWeeklyHours(null);
      setActualMonthlyHours(data.actualMonthlyHours ?? null);
      setExpectedMonthlyHours(data.expectedMonthlyHours ?? null);
      setMonthlyDiffHours(data.monthlyDiffHours ?? null);
      setActualWeeklyHours(data.actualWeeklyHours ?? null);
      setExpectedWeeklyHours(data.expectedWeeklyHours ?? null);
      setWeeklyDiffHours(data.weeklyDiffHours ?? null);
      setActualTodayHours(data.actualTodayHours ?? null);
      setExpectedTodayHours(data.expectedTodayHours ?? null);
      setDailyDiffHours(data.dailyDiffHours ?? null);
      setStandardExpectedMonthlyHours(data.standardExpectedMonthlyHours ?? null);
      setStandardExpectedWeeklyHours(data.standardExpectedWeeklyHours ?? null);
    }
  } catch (err) {
    console.error('Failed to fetch working hours:', err);
    setMonthlyHours(null);
    setWeeklyHours(null);
    setActualMonthlyHours(null);
    setExpectedMonthlyHours(null);
    setMonthlyDiffHours(null);
    setActualWeeklyHours(null);
    setExpectedWeeklyHours(null);
    setWeeklyDiffHours(null);
    setActualTodayHours(null);
    setExpectedTodayHours(null);
    setDailyDiffHours(null);
  }
};

  /* -------------------- DATA FETCHERS ------------------- */
  const fetchMobileLoginStatus = async () => {
    if (!id) return;
    try {
      const { data } = await api.get(`/api/employee/${id}/mobile-login-status`, 
    );
      setAllowMobileLogin(data.allowMobileLogin);
      // console.log("allowMobileLogin", data.allowMobileLogin);
    } catch (err) {
      console.error("Failed to get mobile-login flag:", err);
    }
  };

  const loadPersonalInfoData = async () => {
    if (!id) return;
    try {
      const { data } = await api.get(`/api/attendances/${id}`, 
    );
      setTodayData(data);
      // After loading today's attendance, refresh working-hours summary from backend
      try {
        await fetchWorkingHours();
      } catch (err) {
        console.warn('fetchWorkingHours after loadPersonalInfoData failed', err);
      }
      // Recompute shift-derived UI (canClockIn) using the newly loaded todayData
      try {
        computeFromShiftStart();
      } catch (err) {
        console.warn('computeFromShiftStart after loadPersonalInfoData failed', err);
      }
      // Fetch detailed breakdown for month/week/today
      try {
        await fetchWorkingBreakdown();
      } catch (err) {
        console.warn('fetchWorkingBreakdown failed', err);
      }
    } catch (err) {
      console.error("Error fetching personal info:", err);
    }
  };

  const fetchWorkingBreakdown = async (opts = {}) => {
    if (!userData?._id) return;
    setBreakdownLoading(true);
    try {
      // optional month/year could be added later via opts
      const { data } = await api.get(`/api/working-hours-breakdown/${userData._id}`);
      // data.days is array, weeklySummary and totals
      setBreakdownDays(data.days || []);
      setBreakdownWeekly(data.weeklySummary || []);
      setBreakdownTotals(data.totals || null);
      // Calculate actual weekly hours from weeklySummary (current week)
      if (data.weeklySummary && Array.isArray(data.weeklySummary)) {
        // Find current week (by date)
        const today = Moment();
        const currentWeek = data.weeklySummary.find(w => {
          return today.isBetween(Moment(w.startDate, 'YYYY-MM-DD'), Moment(w.endDate, 'YYYY-MM-DD').endOf('day'), null, '[]');
        });
        if (currentWeek) {
          setLiveWeeklyHours(currentWeek.actualHours);
        } else {
          setLiveWeeklyHours(null);
        }
      } else {
        setLiveWeeklyHours(null);
      }
    } catch (err) {
      console.error('Failed to fetch working breakdown:', err);
      setBreakdownDays([]);
      setBreakdownWeekly([]);
      setBreakdownTotals(null);
      setLiveWeeklyHours(null);
    } finally {
      setBreakdownLoading(false);
    }
  };

  const fetchCanClockIn = async () => {
    if (!id) return;
    try {
      const { data } = await api.get(`/api/attendance/${id}/can-clock-in`);
      if (data && typeof data.canClockIn !== 'undefined') {
        setCanClockIn(!!data.canClockIn);
        setMinutesToStart(typeof data.minutesToStart === 'number' ? data.minutesToStart : 0);
      } else {
        setCanClockIn(true);
        setMinutesToStart(0);
      }
    } catch (err) {
      console.error('Failed to fetch canClockIn:', err);
      // fail-open: allow clock-in if server check fails
      setCanClockIn(true);
      setMinutesToStart(0);
    }
  };

  // Compute canClockIn and minutesToStart from assigned shift startTime (prefer per-date shift)
  const computeFromShiftStart = () => {
    try {
      // Prefer today's assigned shift if present, otherwise fallback to user default shift
      const shift =
        todayData?.today?.shifts?.[0] || userData?.shifts?.[0] || null;
      if (!shift) return false;

      // common property name used elsewhere: startTime
      const startStr = shift.startTime || shift.StartTime || shift.start || shift.start_time;
      if (!startStr) return false;

      // Try parsing time strings like HH:mm or HH:mm:ss
      let shiftStart = Moment(`${Moment().format('YYYY-MM-DD')} ${startStr}`, 'YYYY-MM-DD HH:mm:ss');
      if (!shiftStart.isValid()) {
        shiftStart = Moment(`${Moment().format('YYYY-MM-DD')} ${startStr}`, 'YYYY-MM-DD HH:mm');
      }
      if (!shiftStart.isValid()) return false;

      // Allowed clock-in window starts 20 minutes before shift start
      const allowedStart = shiftStart.clone().subtract(20, 'minutes');
      const diffMs = allowedStart.valueOf() - Date.now();
      const diffMin = Math.ceil(diffMs / 60000);

      if (diffMin <= 0) {
        setCanClockIn(true);
        setMinutesToStart(0);
      } else {
        setCanClockIn(false);
        setMinutesToStart(diffMin);
      }
      return true;
    } catch (err) {
      console.error('computeFromShiftStart error', err);
      return false;
    }
  };

  /* -------------------- EFFECTS ------------------------- */
  // initial + when employee changes (id) or parent passes new data trigger

 useEffect(() => {
  loadPersonalInfoData();
  fetchMobileLoginStatus();
  fetchCanClockIn();

  // If today's data contains shift info, compute minutes from that shift start to match UI accurately
  // computeFromShiftStart will overwrite values set by fetchCanClockIn when shift info exists
  // (keeps server as fallback when shift info is missing)
  computeFromShiftStart();

  const storedBreakStart = Cookies.get("breakStartTime"); // ✅ Get from cookie

  if (storedBreakStart) {
    const elapsedSeconds = Math.floor(
      (Date.now() - Number(storedBreakStart)) / 1000
    );
    startTimer(elapsedSeconds);
  }
}, [data, id]);

// Periodically refresh the canClockIn flag (every 60s). Cleans up on unmount.
useEffect(() => {
  if (!id) return;
  const tid = setInterval(() => fetchCanClockIn(), 60 * 1000);
  return () => clearInterval(tid);
}, [id]);




  // toast global success/error from redux slice
  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, [success, error]);

  /* -------------------- DERIVED STATUS ------------------ */
  const rawStatus = todayData?.today?.status || ""; // server-sent e.g. login | logout | break | LV | HD | WO
  const isMobileOrTablet = useIsMobileOrTablet();
  const isRestricted = isMobileOrTablet && allowMobileLogin !== "Allowed"; // backend flag controls mobile login

  /**
   * When treatOnLeaveAsWorkable=true we treat LV/HD like a logged-out state that still permits actions.
   * This lets employees who were "pre-marked" on leave clock in if they actually work.
   */
  const effectiveStatus = useMemo(() => {
    if (!treatOnLeaveAsWorkable) return rawStatus; // preserve legacy behaviour
    if (rawStatus === "LV" || rawStatus === "HD") return "logout"; // allow clock in
    return rawStatus;
  }, [rawStatus, treatOnLeaveAsWorkable]);

  const actionDisabled = loading || isRestricted;

  /* -------------------- SERVER POST HELPERS -------------- */
  const postAttendanceAction = async (attendanceID, payload) => {
    return api.post(
      `/api/attendance/${attendanceID}`,
      payload,
    );
  };

  /* -------------------- ACTION HANDLER ------------------- */
 const handleAction = async (action) => {
  if (isRestricted) {
    toast.error("Mobile login is not allowed on this device.");
    return;
  }

  const attendanceID = todayData?.attendanceID;
  if (!attendanceID) {
    toast.error("No attendance record for today.");
    return;
  }

  const currentTime = Moment().format("HH:mm:ss");
  const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60); // minutes

  const statusMapping = {
    login: {
      status: "login",
      loginTime: [currentTime],
      loginTimeMs: [currentTimeMs],
    },
    logout: {
      status: "logout",
      logoutTime: [currentTime],
      logoutTimeMs: [currentTimeMs],
    },
    break: {
      status: "break",
      breakTime: [currentTime],
      breakTimeMs: [currentTimeMs],
    },
    resume: {
      status: "login",
      ResumeTime: [currentTime],
      resumeTimeMS: [currentTimeMs],
    },
  };

  setRefresh((p) => !p); // nudge global re-fetchers

  try {
    await postAttendanceAction(attendanceID, {
      employeeId: id,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      date: new Date().getDate(),
      ...statusMapping[action],
    });

    // ✅ Replace localStorage with Cookies
    if (action === "break") {
      Cookies.set("breakStartTime", Date.now().toString(), { expires: 1 }); // 1 day
      startTimer();
    } else if (action === "resume") {
      stopTimer();
      Cookies.remove("breakStartTime");
      setRefresh((p) => !p);
      await loadPersonalInfoData();
    }

    await loadPersonalInfoData();
    toast.success(`${action[0].toUpperCase()}${action.slice(1)} recorded`);
  } catch (err) {
    console.error(`Error recording ${action}`, err);
    toast.error(`Error recording ${action}`);
  }
};




  /* -------------------- SIMPLE LOGIN / LOGOUT ------------- */
  const loginHandler = async (status) => {
    if (isRestricted) {
      toast.error("Mobile login is not allowed on this device.");
      return;
    }


    // Try validating by employeeId
    let validShift = await validateShiftFromModal(userData?._id);
    // If not valid, try by shiftId (if available)
    if (!validShift && userData?.shifts?.length > 0) {
      validShift = await validateShiftFromModal(userData.shifts[0]._id || userData.shifts[0]);
    }
    if (!validShift) return;

    try {
      console.log('loginHandler called:', { employeeId: id, status });
      const result = await dispatch(attendanceInfo({ employeeId: id, status }));
      console.log('attendanceInfo dispatch result:', result);
      await loadPersonalInfoData();
      setRefresh((p) => !p);
      toast.success(`${status} marked successfully`);
    } catch (err) {
      console.error(`Error marking ${status}`, err);
      toast.error(`Error marking ${status}`);
    }
  };

  // const validateShiftFromModal = async (employeeId) => {
  //   try {
  //     const response = await api.get(`/api/shifts/${employeeId}`);
  //     const shiftData = response.data;

  //     if (!shiftData || !shiftData.startTime || !shiftData.endTime) {
  //       toast.error("Shift details are missing or incomplete.");
  //       return null;
  //     }

  //     const now = Moment();
  //     let shiftStart = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.startTime}`, 'YYYY-MM-DD HH:mm:ss');
  //     let shiftEnd = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.endTime}`, 'YYYY-MM-DD HH:mm:ss');

  //     if (!shiftStart.isValid()) {
  //       shiftStart = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.startTime}`, 'YYYY-MM-DD HH:mm');
  //     }
  //     if (!shiftEnd.isValid()) {
  //       shiftEnd = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.endTime}`, 'YYYY-MM-DD HH:mm');
  //     }

  //     if (!shiftStart.isValid() || !shiftEnd.isValid()) {
  //       toast.error("Invalid shift timing.");
  //       return null;
  //     }

  //     // Allow clock-in 20 minutes before shift start
  //     const allowedStart = shiftStart.clone().subtract(20, 'minutes');

  //     // If shift crosses midnight, handle early morning clock-in
  //     if (shiftEnd.isBefore(shiftStart)) {
  //       // If now is after allowedStart (today) or before shiftEnd (next day)
  //       if (now.isBetween(allowedStart, shiftStart, null, '[)') || now.isBetween(shiftStart, shiftEnd, null, '[)')) {
  //         return shiftData;
  //       }
  //     } else {
  //       if (now.isBetween(allowedStart, shiftEnd, null, '[)')) {
  //         return shiftData;
  //       }
  //     }
  //     toast.error("You can only clock in during your assigned shift time (including 20 min before start).");
  //     return null;
  //   } catch (error) {
  //     console.error("Error fetching shift details:", error);
  //     toast.error("Failed to validate shift timing.");
  //     return null;
  //   }
  // };



  const validateShiftFromModal = async (idOrShiftId) => {
  try {
    // Try both employeeId and shiftId endpoints
    let shiftData;
    // If idOrShiftId looks like a MongoDB ObjectId (24 hex chars), treat as shiftId
    if (typeof idOrShiftId === "string" && idOrShiftId.length === 24) {
      const response = await api.get(`/api/shifts/${idOrShiftId}`);
      shiftData = response.data;
    } else {
      const response = await api.get(`/api/shifts/${idOrShiftId}`);
      shiftData = response.data;
    }

    if (!shiftData || !shiftData.startTime || !shiftData.endTime) {
      toast.error("Shift details are missing or incomplete.");
      return null;
    }

    const now = Moment();
    let shiftStart = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.startTime}`, 'YYYY-MM-DD HH:mm:ss');
    let shiftEnd = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.endTime}`, 'YYYY-MM-DD HH:mm:ss');

    if (!shiftStart.isValid()) {
      shiftStart = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.startTime}`, 'YYYY-MM-DD HH:mm');
    }
    if (!shiftEnd.isValid()) {
      shiftEnd = Moment(`${now.format('YYYY-MM-DD')} ${shiftData.endTime}`, 'YYYY-MM-DD HH:mm');
    }

    if (!shiftStart.isValid() || !shiftEnd.isValid()) {
      toast.error("Invalid shift timing.");
      return null;
    }

    // Allow clock-in 20 minutes before shift start
    const allowedStart = shiftStart.clone().subtract(20, 'minutes');

    // Overnight shift handling
    if (shiftEnd.isBefore(shiftStart)) {
      // If now is after allowedStart (today) or before shiftEnd (next day)
      if (
        now.isBetween(allowedStart, shiftStart, null, '[)') ||
        now.isBetween(shiftStart, shiftEnd.clone().add(1, 'day'), null, '[)')
      ) {
        return shiftData;
      }
    } else {
      if (now.isBetween(allowedStart, shiftEnd, null, '[)')) {
        return shiftData;
      }
    }
    toast.error("You can only clock in during your assigned shift time (including 20 min before start).");
    return null;
  } catch (error) {
    console.error("Error fetching shift details:", error);
    toast.error("Failed to validate shift timing.");
    return null;
  }
};
  /* -------------------- BREAK TIMER HELPERS --------------- */
  const startTimer = (initial = 0) => {
    setBreakTimer(initial);
    const newId = setInterval(() => setBreakTimer((t) => t + 1), 1000);
    setIntervalId((old) => {
      if (old) clearInterval(old);
      return newId;
    });
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };



  const formatTime = (s) =>
    [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");

    /* -------------------- BADGE HELPERS --------------------- */
  const LeaveBadge = () => {
    if (!treatOnLeaveAsWorkable) return null; // old behaviour -> disabled buttons handle message
    if (rawStatus === "LV") {
      return (
        <span className="badge bg-warning text-dark ms-2" title="You are marked on Leave, but actions are allowed.">
          On Leave
        </span>
      );
    }
    if (rawStatus === "HD") {
      return (
        <span className="badge bg-info text-dark ms-2" title="Today is marked Holiday, but actions are allowed.">
          Holiday
        </span>
      );
    }
    return null;
  };

  /* -------------------- RENDER -------------------------- */
  if (!todayData) return null;

  const isTodayLogged = todayData?.today?.status !== "logout";




  return (

    <Container fluid className="p-4" style={{ background: "#f3f4f6" }}>
      {/* TOP GRID */}
      <Row className="g-4">
        {/* Left Profile Card */}
        <Col xs={6} md={3}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="text-center mb-3">
                <h5 className="mb-0">Good Morning, Adrian</h5>
                <small className="text-muted">08:35 AM, 11 Mar 2025</small>
              </div>

              <Image
                src="/profile-placeholder.png"
                roundedCircle
                style={{ width: 128, height: 128, objectFit: "cover", border: "4px solid #60a5fa" }}
                className="mb-3"
                alt="profile"
              />

              <div className="text-center mb-3">
                <Badge bg="warning" text="dark" pill style={{ fontSize: "0.95rem", padding: "0.6rem 1rem" }}>
                  Production : <strong className="ms-2">3.45 hrs</strong>
                </Badge>
              </div>

              <div className="d-flex align-items-center text-muted mb-3">
                <FiClock size={16} className="me-2" />
                <div>
                  {todayData?.today?.loginTime && Array.isArray(todayData.today.loginTime) && todayData.today.loginTime.length > 0 ? (
                    // Render each login time on its own line (filter out placeholders like 'WO' or numeric zero)
                    todayData.today.loginTime
                      .filter((t) => typeof t === 'string' && t.includes(':'))
                      .map((t, idx) => (
                        <div key={idx} style={{ lineHeight: 1.2 }}>
                          <small className="text-muted">Punch In: {t}</small>
                        </div>
                      ))
                  ) : (
                    <small className="text-muted">Punch In: --</small>
                  )}
                  {/* Shift countdown when logged in */}
                  {shiftCountdown && (
                    <div>
                      <small className="text-muted">Shift ends in: {shiftCountdown}</small>
                    </div>
                  )}
                </div>
              </div>

              {/* <Button variant="dark" className="w-100 mt-auto rounded-pill py-2">
                Punch Out
              </Button> */}
              {isRestricted ? (


                <div
                  style={{ width: "97%" }}
                  className={`text-center d-flex gap-2 my-2 py-2 rounded-2 mx-auto bg-warning`}
                >
                  <h5 className="mx-auto fw-normal my-0" style={{ whiteSpace: "pre" }}>
                    Mobile login is not allowed
                  </h5>
                </div>
              ) : (
                <div className="d-flex gap-2 flex-wrap" style={{ alignItems: "center" }}>
                  {effectiveStatus === "login" && (
                    <div className="d-flex align-items-center gap-2 w-100">
                      <button
                        style={{ whiteSpace: "pre" }}
                        className="btn w-100 btn-warning rounded-2 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleAction("break")}
                        disabled={actionDisabled}
                      >
                        <PiCoffeeFill className="my-auto fs-5" /> Take a Break
                        <LeaveBadge />
                      </button>
                      <button
                        style={{ whiteSpace: "pre" }}
                        className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => loginHandler("logout")}
                        disabled={actionDisabled}
                      >
                        {loading ? "Processing…" : (<><IoStop /> Clock Out</>)}
                        <LeaveBadge />
                      </button>
                    </div>
                  )}

                  {['logout', 'WO', ''].includes(effectiveStatus) && (
                    <button
                      style={{ whiteSpace: "pre" }}
                      className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => loginHandler("login")}
                      disabled={actionDisabled}
                    >
                      {loading ? "Processing…" : (<><IoPlay /> Clock In</>)}
                      <LeaveBadge />
                    </button>
                  )}

                  {effectiveStatus === "break" && (
                    <button
                      style={{ whiteSpace: "pre" }}
                      className="btn btn-dark border rounded-2 w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => handleAction("resume")}
                      disabled={actionDisabled}
                    >
                      <FaComputerMouse className="my-auto fs-5" /> Break Over ({formatTime(breakTimer)})
                      <LeaveBadge />
                    </button>
                  )}

                  {!treatOnLeaveAsWorkable && rawStatus === "LV" && (
                    <button style={{ whiteSpace: "pre" }} className="btn btn-warning w-100" disabled>
                      You are on leave
                    </button>
                  )}
                  {!treatOnLeaveAsWorkable && rawStatus === "HD" && (
                    <button style={{ whiteSpace: "pre" }} className="btn btn-warning w-100" disabled>
                      You are on holiday
                    </button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Info Cards */}
        <Col xs={12} md={9}>
          <Row className="g-4">
            {/* Shift Info Card */}
            {/* Stats Cards */}
            <Col xs={12} md={3}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="mb-0">
                      {liveTodayHours !== null && expectedTodayHours !== null
                        ? `${liveTodayHours} / ${expectedTodayHours}`
                        : (todayData?.today?.totalLogAfterBreak ? `${(todayData.today.totalLogAfterBreak / 60).toFixed(2)} / --` : '-- / --')}
                    </h3>
                    <small className="text-muted">Total Hours Today</small>
                    {/* Progress bar for today's work */}
                    <div className="mt-2">
                      <div style={{ height: 8, background: '#e9ecef', borderRadius: 4 }}>
                        <div style={{ width: `${liveTodayHours && expectedTodayHours ? Math.min(100, Math.round((liveTodayHours / expectedTodayHours) * 100)) : 0}%`, height: 8, background: '#10b981', borderRadius: 4, transition: 'width 0.5s' }} />
                      </div>
                      <div className="d-flex justify-content-between mt-1 small text-muted">
                        <span>{`Worked: ${liveTodayHours || '--'} hrs`}</span>
                        <span>{`Goal: ${expectedTodayHours || '--'} hrs`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mt-3 text-success">
                    <FiArrowUp className="me-1" />
                    <small className="mb-0">{liveTodayHours !== null && expectedTodayHours !== null ? `Diff: ${(liveTodayHours - expectedTodayHours).toFixed(2)} hrs` : 'Today vs Shift'}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={3}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="mb-0">
                      {actualWeeklyHours6Days !== null && expectedWeeklyHours6Days !== null
                        ? `${actualWeeklyHours6Days} / ${expectedWeeklyHours6Days}`
                        : '-- / --'}
                    </h3>
                    <small className="text-muted">Total Hours Week (6 days)</small>
                    {/* Progress bar for weekly work (6 days) */}
                    <div className="mt-2">
                      <div style={{ height: 8, background: '#e9ecef', borderRadius: 4 }}>
                        <div style={{ width: `${actualWeeklyHours6Days && expectedWeeklyHours6Days ? Math.min(100, Math.round((actualWeeklyHours6Days / expectedWeeklyHours6Days) * 100)) : 0}%`, height: 8, background: '#3b82f6', borderRadius: 4, transition: 'width 0.5s' }} />
                      </div>
                      <div className="d-flex justify-content-between mt-1 small text-muted">
                        <span>{`Worked: ${actualWeeklyHours6Days || '--'} hrs`}</span>
                        <span>{`Goal: ${expectedWeeklyHours6Days || '--'} hrs`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mt-3 text-success">
                    <FiArrowUp className="me-1" />
                    <small className="mb-0">{actualWeeklyHours6Days !== null && expectedWeeklyHours6Days !== null ? `Diff: ${(actualWeeklyHours6Days - expectedWeeklyHours6Days).toFixed(2)} hrs` : 'Week vs Shift'}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={3}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="mb-0">
                      {actualMonthlyHours !== null && (expectedMonthlyHours !== null || standardExpectedMonthlyHours !== null)
                        ? `${actualMonthlyHours} / ${expectedMonthlyHours !== null ? expectedMonthlyHours : standardExpectedMonthlyHours}`
                        : '-- / --'}
                    </h3>
                    <small className="text-muted">Total Hours Month</small>
                    {/* Progress bar for monthly work */}
                    <div className="mt-2">
                      <div style={{ height: 8, background: '#e9ecef', borderRadius: 4 }}>
                        <div style={{ width: `${actualMonthlyHours && (expectedMonthlyHours || standardExpectedMonthlyHours) ? Math.min(100, Math.round((actualMonthlyHours / (expectedMonthlyHours !== null ? expectedMonthlyHours : standardExpectedMonthlyHours)) * 100)) : 0}%`, height: 8, background: '#f59e0b', borderRadius: 4, transition: 'width 0.5s' }} />
                      </div>
                      <div className="d-flex justify-content-between mt-1 small text-muted">
                        <span>{`Worked: ${actualMonthlyHours || '--'} hrs`}</span>
                        <span>{`Goal: ${(expectedMonthlyHours !== null ? expectedMonthlyHours : standardExpectedMonthlyHours) || '--'} hrs`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mt-3 text-danger">
                    <FiArrowDown className="me-1" />
                    <small className="mb-0">{actualMonthlyHours !== null && expectedMonthlyHours !== null ? `Diff: ${(actualMonthlyHours - expectedMonthlyHours).toFixed(2)} hrs` : 'Month vs Shift'}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Extra stat (Overtime) as another row item */}
            <Col xs={12} md={3}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="mb-0">16 / 28</h3>
                    <small className="text-muted">Overtime this Month</small>
                  </div>

                  <div className="d-flex align-items-center mt-3 text-danger">
                    <FiArrowDown className="me-1" />
                    <small className="mb-0">6% Last Month</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>


            <Col xs={12}>
              <Card>
                <Card.Body>
                  <Row className="text-center text-md-start">
                    <Col xs={6} md={3} className="mb-3 mb-md-0">
                      <small className="text-muted d-block">Total Working Hours</small>
                      <div className="fw-semibold fs-5">12h 36m</div>
                    </Col>

                    <Col xs={6} md={3} className="mb-3 mb-md-0">
                      <small className="text-muted d-block">Productive Hours</small>
                      <div className="fw-semibold fs-5">08h 36m</div>
                    </Col>

                    <Col xs={6} md={3} className="mb-3 mb-md-0">
                      <small className="text-muted d-block">Break Hours</small>
                      <div className="fw-semibold fs-5">22m 15s</div>
                    </Col>

                    <Col xs={6} md={3} className="mb-3 mb-md-0">
                      <small className="text-muted d-block">Overtime</small>
                      <div className="fw-semibold fs-5">02h 15m</div>
                    </Col>
                  </Row>

                  {/* TIME BAR VISUAL */}
                  <div className="mt-4">
                    <div
                      className="d-flex overflow-hidden rounded-pill"
                      style={{ height: 18, background: "#e9ecef" }}
                    >
                      {/* Green flexible part */}
                      <div style={{ background: "#10b981", flex: 2 }} />

                      {/* Yellow fixed portion */}
                      <div style={{ background: "#f59e0b", width: 80 }} />

                      {/* Another green portion */}
                      <div style={{ background: "#10b981", flex: 3 }} />

                      {/* small blue segments */}
                      <div style={{ background: "#3b82f6", width: 30 }} />
                      <div style={{ background: "#93c5fd", width: 30 }} />
                    </div>

                    {/* TIME LABELS */}
                    <div className="d-flex justify-content-between mt-2 small text-muted">
                      <span>06:00</span>
                      <span>07:00</span>
                      <span>08:00</span>
                      <span>09:00</span>
                      <span>10:00</span>
                      <span>11:00</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {/* Monthly breakdown table + weekly summary */}
            <Col xs={12} className="mt-4">
              <Row className="g-4">
                <Col xs={12} md={8}>
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Monthly Breakdown</h5>
                        <small className="text-muted">{breakdownTotals ? `Month: ${Moment().month(breakdownTotals && breakdownTotals.month ? breakdownTotals.month - 1 : (Moment().month())).format('MMMM')}` : ''}</small>
                      </div>
                      {breakdownLoading ? (
                        <div>Loading...</div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Day</th>
                                <th>Status</th>
                                <th className="text-end">Actual (hrs)</th>
                                <th className="text-end">Expected (hrs)</th>
                                <th>Logins</th>
                              </tr>
                            </thead>
                            <tbody>
                              {breakdownDays && breakdownDays.length > 0 ? breakdownDays.map((d) => (
                                <tr key={d.date}>
                                  <td>{d.date}</td>
                                  <td>{d.dayOfWeek}</td>
                                  <td>{d.status || '--'}</td>
                                  <td className="text-end">{(d.actualMinutes / 60).toFixed(2)}</td>
                                  <td className="text-end">{(d.expectedMinutes / 60).toFixed(2)}</td>
                                  <td>
                                    {Array.isArray(d.loginTimes) && d.loginTimes.length > 0 ? (
                                      d.loginTimes.filter(t => typeof t === 'string').map((t, i) => <div key={i}>{t}</div>)
                                    ) : '--'}
                                  </td>
                                </tr>
                              )) : (
                                <tr><td colSpan={6} className="text-center">No data for this month</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={4}>
                  <Card className="h-100">
                    <Card.Body>
                      <h6>Weekly Summary</h6>
                      {breakdownWeekly && breakdownWeekly.length > 0 ? (
                        breakdownWeekly.map((w, i) => (
                          <div key={i} className="mb-3">
                            <div className="d-flex justify-content-between">
                              <div><strong>Week {w.weekNumber}</strong></div>
                              <div className="text-end small text-muted">{w.startDate} to {w.endDate}</div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                              <div>Actual</div>
                              <div>{w.actualHours} hrs</div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div>Expected</div>
                              <div>{w.expectedHours} hrs</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>No weekly data</div>
                      )}
                      <hr />
                      <div>
                        <div className="d-flex justify-content-between">
                          <div>Total this month</div>
                          <div>{breakdownTotals ? `${breakdownTotals.totalMonthlyActualHours} / ${breakdownTotals.totalMonthlyExpectedHours} hrs` : '--'}</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

      </Row>


    </Container>
  



    //old design below
//       <div className="row gap-2">
//         <div className="mt-2">
//   {todayData?.today?.shifts?.length > 0 ? (
//     <div className="text-sm text-gray-700">
//       {`Shift: ${todayData.today.shifts[0].shiftName || "N/A"}`}
//       <div className="flex gap-2">
//         <div>{`In: ${todayData.today.shifts[0].startTime || "N/A"}`}</div>
//         <div>{`Out: ${todayData.today.shifts[0].endTime || "N/A"}`}</div>
//       </div>
//     </div>
//   ) : (
//     <div className="text-sm text-red-500">
//       No shift assigned for today.
//     </div>
//   )}
//   {/* Working Hours Summary */}
//   <div className="mt-2 text-sm text-blue-700">
//     {actualMonthlyHours !== null || monthlyHours !== null ? (
//       <div>
//         <div>{`Monthly (Actual / Expected): ${actualMonthlyHours !== null ? actualMonthlyHours : (monthlyHours !== null ? monthlyHours : '--')} hrs / ${expectedMonthlyHours !== null ? expectedMonthlyHours : '--'} hrs`}</div>
//         <div>{`Difference: ${monthlyDiffHours !== null ? monthlyDiffHours : (monthlyHours !== null && expectedMonthlyHours !== null ? (monthlyHours - expectedMonthlyHours).toFixed(2) : '--')} hrs`}</div>
//       </div>
//     ) : (
//       <div>{`Monthly Working Hours: ${monthlyHours !== null ? monthlyHours : '--'} hrs`}</div>
//     )}

//     {actualWeeklyHours !== null || weeklyHours !== null ? (
//       <div>
//         <div>{`Weekly (Actual / Expected): ${actualWeeklyHours !== null ? actualWeeklyHours : (weeklyHours !== null ? weeklyHours : '--')} hrs / ${expectedWeeklyHours !== null ? expectedWeeklyHours : '--'} hrs`}</div>
//         <div>{`Difference: ${weeklyDiffHours !== null ? weeklyDiffHours : (weeklyHours !== null && expectedWeeklyHours !== null ? (weeklyHours - expectedWeeklyHours).toFixed(2) : '--')} hrs`}</div>
//       </div>
//     ) : (
//       <div>{`Weekly Working Hours: ${weeklyHours !== null ? weeklyHours : '--'} hrs`}</div>
//     )}
//   </div>
// </div>
//       {isRestricted ? (

        
//         <div
//           style={{ width: "97%" }}
//           className={`text-center d-flex gap-2 my-2 py-2 rounded-2 mx-auto bg-warning`}
//         >
//           <h5 className="mx-auto fw-normal my-0" style={{ whiteSpace: "pre" }}>
//             Mobile login is not allowed
//           </h5>
//         </div>
//       ) : (
//         <div className="d-flex gap-2 flex-wrap" style={{ alignItems: "center" }}>
//           {/* LOGGED IN STATE ------------------------------------------------*/}
//           {effectiveStatus === "login" && (
//             <div className="d-flex align-items-center gap-2 w-100">
//               <button
//                 style={{ whiteSpace: "pre" }}
//                 className="btn w-100 btn-warning rounded-2 d-flex align-items-center justify-content-center gap-2"
//                 onClick={() => handleAction("break")}
//                 disabled={actionDisabled}
//               >
//                 <PiCoffeeFill className="my-auto fs-5" /> Take a Break
//                 <LeaveBadge />
//               </button>
//               <button
//                 style={{ whiteSpace: "pre" }}
//                 className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
//                 onClick={() => loginHandler("logout")}
//                 disabled={actionDisabled}
//               >
//                 {loading ? "Processing…" : (<><IoStop /> Clock Out</>)}
//                 <LeaveBadge />
//               </button>
//             </div>
//           )}

//           {/* LOGGED OUT-LIKE STATES (logout, WO, "", LV, HD) ----------------*/}
//           {['logout', 'WO', ''].includes(effectiveStatus) && (
//             <button
//               style={{ whiteSpace: "pre" }}
//               className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
//               onClick={() => loginHandler("login")}
//               disabled={actionDisabled}
//             >
//               {loading ? "Processing…" : (<><IoPlay /> Clock In</>)}
//               <LeaveBadge />
//             </button>
//           )}

//           {/* BREAK STATE ----------------------------------------------------*/}
//           {effectiveStatus === "break" && (
//             <button
//               style={{ whiteSpace: "pre" }}
//               className="btn btn-dark border rounded-2 w-100 d-flex align-items-center justify-content-center gap-2"
//               onClick={() => handleAction("resume")}
//               disabled={actionDisabled}
//             >
//               <FaComputerMouse className="my-auto fs-5" /> Break Over ({formatTime(breakTimer)})
//               <LeaveBadge />
//             </button>
//           )}

//           {/* LEGACY DISABLED STATES (if treatOnLeaveAsWorkable=false) --------*/}
//           {!treatOnLeaveAsWorkable && rawStatus === "LV" && (
//             <button style={{ whiteSpace: "pre" }} className="btn btn-warning w-100" disabled>
//               You are on leave
//             </button>
//           )}
//           {!treatOnLeaveAsWorkable && rawStatus === "HD" && (
//             <button style={{ whiteSpace: "pre" }} className="btn btn-warning w-100" disabled>
//               You are on holiday
//             </button>
//           )}
//         </div>
//       )}
//     </div>
// ===========new design above=====================
//       <div className="row gap-2">
//         <div className="mt-2">
//   {todayData?.today?.shifts?.length > 0 ? (
//     <div className="text-sm text-gray-700">
//       {`Shift: ${todayData.today.shifts[0].shiftName || "N/A"}`}
//       <div className="flex gap-2">
//         <div>{`In: ${todayData.today.shifts[0].startTime || "N/A"}`}</div>
//         <div>{`Out: ${todayData.today.shifts[0].endTime || "N/A"}`}</div>
//       </div>
//     </div>
//   ) : (
//     <div className="text-sm text-red-500">
//       No shift assigned for today.
//     </div>
//   )}
//   {/* Working Hours Summary */}
//   <div className="mt-2 text-sm text-blue-700">
//     {actualMonthlyHours !== null || monthlyHours !== null ? (
//       <div>
//         <div>{`Monthly (Actual / Expected): ${actualMonthlyHours !== null ? actualMonthlyHours : (monthlyHours !== null ? monthlyHours : '--')} hrs / ${expectedMonthlyHours !== null ? expectedMonthlyHours : '--'} hrs`}</div>
//         <div>{`Difference: ${monthlyDiffHours !== null ? monthlyDiffHours : (monthlyHours !== null && expectedMonthlyHours !== null ? (monthlyHours - expectedMonthlyHours).toFixed(2) : '--')} hrs`}</div>
//       </div>
//     ) : (
//       <div>{`Monthly Working Hours: ${monthlyHours !== null ? monthlyHours : '--'} hrs`}</div>
//     )}

//     {actualWeeklyHours !== null || weeklyHours !== null ? (
//       <div>
//         <div>{`Weekly (Actual / Expected): ${actualWeeklyHours !== null ? actualWeeklyHours : (weeklyHours !== null ? weeklyHours : '--')} hrs / ${expectedWeeklyHours !== null ? expectedWeeklyHours : '--'} hrs`}</div>
//         <div>{`Difference: ${weeklyDiffHours !== null ? weeklyDiffHours : (weeklyHours !== null && expectedWeeklyHours !== null ? (weeklyHours - expectedWeeklyHours).toFixed(2) : '--')} hrs`}</div>
//       </div>
//     ) : (
//       <div>{`Weekly Working Hours: ${weeklyHours !== null ? weeklyHours : '--'} hrs`}</div>
//     )}
//   </div>
  
// </div>


//       {/* {isRestricted ? (

        
//         <div
//           style={{ width: "97%" }}
//           className={`text-center d-flex gap-2 my-2 py-2 rounded-2 mx-auto bg-warning`}
//         >
//           <h5 className="mx-auto fw-normal my-0" style={{ whiteSpace: "pre" }}>
//             Mobile login is not allowed
//           </h5>
//         </div>
//       ) : (
//         <div className="d-flex gap-2 flex-wrap" style={{ alignItems: "center" }}>
//           {effectiveStatus === "login" && (
//             <div className="d-flex align-items-center gap-2 w-100">
//               <button
//                 style={{ whiteSpace: "pre" }}
//                 className="btn w-100 btn-warning rounded-2 d-flex align-items-center justify-content-center gap-2"
//                 onClick={() => handleAction("break")}
//                 disabled={actionDisabled}
//               >
//                 <PiCoffeeFill className="my-auto fs-5" /> Take a Break
//                 <LeaveBadge />
//               </button>
//               <button
//                 style={{ whiteSpace: "pre" }}
//                 className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
//                 onClick={() => loginHandler("logout")}
//                 disabled={actionDisabled}
//               >
//                 {loading ? "Processing…" : (<><IoStop /> Clock Out</>)}
//                 <LeaveBadge />
//               </button>
//             </div>
//           )}

//           {['logout', 'WO', ''].includes(effectiveStatus) && (
//             <button
//               style={{ whiteSpace: "pre" }}
//               className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
//               onClick={() => loginHandler("login")}
//               disabled={actionDisabled}
//             >
//               {loading ? "Processing…" : (<><IoPlay /> Clock In</>)}
//               <LeaveBadge />
//             </button>
//           )}

//           {effectiveStatus === "break" && (
//             <button
//               style={{ whiteSpace: "pre" }}
//               className="btn btn-dark border rounded-2 w-100 d-flex align-items-center justify-content-center gap-2"
//               onClick={() => handleAction("resume")}
//               disabled={actionDisabled}
//             >
//               <FaComputerMouse className="my-auto fs-5" /> Break Over ({formatTime(breakTimer)})
//               <LeaveBadge />
//             </button>
//           )}

//           {!treatOnLeaveAsWorkable && rawStatus === "LV" && (
//             <button style={{ whiteSpace: "pre" }} className="btn btn-warning w-100" disabled>
//               You are on leave
//             </button>
//           )}
//           {!treatOnLeaveAsWorkable && rawStatus === "HD" && (
//             <button style={{ whiteSpace: "pre" }} className="btn btn-warning w-100" disabled>
//               You are on holiday
//             </button>
//           )}
//         </div>
//       )} */}
//     </div>

  
  );
}

export default TakeBreakLogs;

