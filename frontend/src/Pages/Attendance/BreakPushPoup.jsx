// import React, {
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";
// import axios from "axios";
// import Moment from "moment";
// import BASE_URL from "../config/config";
// import toast from "react-hot-toast";
// import { PiCoffeeFill } from "react-icons/pi";
// import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
// import { useSelector } from "react-redux";
// import { useShowBreakPushPoup } from "../../Context/BreakPushPoupContext/BreakPushPoupContext";

// function BreakPushPoup(props) {
//   const [todayData, setTodayData] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(60);
//   const { userData } = useSelector((state) => state.user);
//   const id = userData?._id;
//   const { setMessage } = useContext(AttendanceContext);
//   const { isVisible, toggleVisibilityBreakPushPoup } = useShowBreakPushPoup();
//   const inactivityTimeoutRef = useRef(null);
//   const countdownIntervalRef = useRef(null);

//   const loadPersonalInfoData = useCallback(async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/attendances/` + id, {
//         headers: {
//           authorization: localStorage.getItem("token") || "",
//         },
//       });
//       setTodayData(response.data);
//     } catch (error) {
//       console.error("Error fetching personal info:", error);
//     }
//   }, [id]);

//   console.log(todayData);

//   const handleAction = useCallback(
//     async (action) => {
//       const attendanceID = todayData?.attendanceID;
//       const currentTime = Moment().format("HH:mm:ss");
//       const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
//       console.log(attendanceID);

//       const statusMapping = {
//         login: {
//           status: "login",
//           loginTime: [currentTime],
//         },
//         logout: {
//           status: "logout",
//           logoutTime: [currentTime],
//         },
//         break: {
//           status: "break",
//           breakTime: [currentTime],
//           breakTimeMs: [currentTimeMs],
//         },
//         resume: {
//           status: "login",
//           ResumeTime: [currentTime],
//           resumeTimeMS: [currentTimeMs],
//         },
//       };

//       if (!statusMapping[action]) {
//         setMessage(`Invalid action: ${action}`);
//         toast.error(`Invalid action: ${action}`);
//         return;
//       }

//       try {
//         await axios.post(
//           `${BASE_URL}/api/attendance/${attendanceID}`,
//           {
//             employeeId: id,
//             year: new Date().getFullYear(),
//             month: new Date().getMonth() + 1,
//             date: new Date().getDate(),
//             ...statusMapping[action],
//           },
//           {
//             headers: {
//               authorization: localStorage.getItem("token") || "",
//             },
//           }
//         );

//         const capitalizedAction =
//           action.charAt(0).toUpperCase() + action.slice(1);
//         setMessage(`${capitalizedAction} time recorded successfully`);
//         toast.success(`${capitalizedAction} time recorded successfully`);

//         if (action === "break") {
//           const breakStartTime = Date.now();
//           localStorage.setItem("breakStartTime", breakStartTime);
//           startTimer();
//         } else if (action === "resume") {
//           localStorage.removeItem("breakStartTime");
//           stopTimer();
//         }

//         toggleVisibilityBreakPushPoup(false);
//         loadPersonalInfoData();
//       } catch (error) {
//         setMessage(`Error recording ${action} time`);
//         toast.error(`Error recording ${action} time`);
//       }
//     },
//     [
//       todayData,
//       id,
//       setMessage,
//       loadPersonalInfoData,
//       toggleVisibilityBreakPushPoup,
//     ]
//   );

//   const resetInactivityTimeout = useCallback(() => {
//     if (inactivityTimeoutRef.current) {
//       clearTimeout(inactivityTimeoutRef.current);
//     }
//     inactivityTimeoutRef.current = setTimeout(() => {
//       toggleVisibilityBreakPushPoup(true);
//       startCountdown();
//     }, 30000);
//   }, [toggleVisibilityBreakPushPoup]);

//   useEffect(() => {
//     if (timeLeft <= 0) return;

//     if (countdownIntervalRef.current) {
//       clearInterval(countdownIntervalRef.current);
//     }

//     countdownIntervalRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           handleAction("break");
//           clearInterval(countdownIntervalRef.current);
//           toggleVisibilityBreakPushPoup(false);
//           return 0;
//         }

//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       clearInterval(countdownIntervalRef.current);
//     };
//   }, [timeLeft]);

//   const stopCountdown = () => {
//     if (countdownIntervalRef.current) {
//       clearInterval(countdownIntervalRef.current);
//     }
//   };

//   useEffect(() => {
//     const handleActivity = () => {
//       resetInactivityTimeout();
//     };

//     window.addEventListener("mousemove", handleActivity);
//     window.addEventListener("keydown", handleActivity);

//     resetInactivityTimeout();

//     return () => {
//       window.removeEventListener("mousemove", handleActivity);
//       window.removeEventListener("keydown", handleActivity);
//       if (inactivityTimeoutRef.current) {
//         clearTimeout(inactivityTimeoutRef.current);
//       }
//       stopCountdown();
//     };
//   }, [resetInactivityTimeout]);

//   return (
//     <>
//       {!isVisible && (
//         <div
//           style={{
//             height: "100vh",
//             width: "100%",
//             display: "flex",
//             position: "fixed",
//             top: "0",
//             left: "0",
//             background: "rgba(0,0,0,.5)",
//             zIndex: "10000",
//           }}
//         >
//           <div
//             style={{
//               height: "fit-content",
//               width: "fit-content",
//               display: "flex",
//               position: "absolute",
//               top: "40%",
//               left: "50%",
//               transform: "translate(-50%)",
//               background: "white",
//               padding: "2rem",
//             }}
//             className="flex-column gap-3 "
//           >
//             <h3>No Action Cause Break</h3>
//             <p>Auto-close in: {timeLeft}s</p>
//             <button
//               className="btn btn-warning d-flex align-items-center justify-content-center gap-2"
//               onClick={() => {
//                 handleAction("break");
//                 toggleVisibilityBreakPushPoup(false);
//               }}
//             >
//               <PiCoffeeFill className="my-auto fs-5" /> Take a Break
//             </button>
//             <button
//               onClick={() => {
//                 stopCountdown();
//                 toggleVisibilityBreakPushPoup(false);
//               }}
//             >
//               I am In
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default BreakPushPoup;
