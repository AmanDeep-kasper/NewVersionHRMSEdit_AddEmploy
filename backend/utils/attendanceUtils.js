// utils/attendanceUtils.js



// function markAttendance({
//   loginTime,
//   day,
//   shifts,
//   isNCNS,
//   isOnLeave,
//   isSandwhich,
//   isForcedAbsent,
//   LeaveDurationName,
//   LeaveTypeName,
//   netLogiHours,
//   loginTimeLength,
//   logoutTimeLength,
// }) {
//   let darkMode = false;
//   let filterYear = new Date().getFullYear();
//   let filterMonth = new Date().getMonth() + 1;
//   {
//     const today = new Date();
//     const currentDay = today.getDate();
//     const currentMonth = today.getMonth() + 1;
//     const currentYear = today.getFullYear();

//     if (
//       filterYear < currentYear ||
//       (filterYear === currentYear && filterMonth < currentMonth) ||
//       (filterYear === currentYear &&
//         filterMonth === currentMonth &&
//         day < currentDay)
//     ) {
//       if (isForcedAbsent) {
//         return {
//           status: "A",
//           color: darkMode ? "rgba(255, 0, 0, 0.99)" : "rgba(255, 0, 0, 0.73)",
//           title: "Absent",
//         };
//       }
//       if (isSandwhich) {
//         return {
//           status: "S",
//           color: darkMode ? "rgb(244, 208, 63)" : "rgba(244, 208, 63, 0.67)",
//           title: "Sandwhich Leave",
//         };
//       }
//       if (isNCNS) {
//         return {
//           status: "N",
//           color: darkMode ? "rgba(255, 0, 0, 0.99)" : "rgba(255, 0, 0, 0.73)",
//           title: "No Call No Show",
//         };
//       }
//       if (!loginTime || loginTime.length === 0) {
//         return {
//           status: "A",
//           color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//           title: "Absent",
//         };
//       }
//     } else if (!loginTime || loginTime.length === 0) {
//       return {
//         status: "--",
//         color: darkMode ? "#c1bdbd" : "rgba(32, 32, 32, 0.3)",
//         title: "No Data",
//       };
//     } else if (loginTime[0] === "") {
//       return {
//         status: "A",
//         color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//         title: "Absent",
//       };
//     }

//     /* ---------- leave handling (unchanged) ---------- */
//     if (isOnLeave) {
//       const isPaid = [
//         "Paid Leave",
//         "Casual Leave",
//         "Paternity Leave",
//         "Maternity Leave",
//       ].includes(LeaveTypeName);

//       if (LeaveDurationName === "Full Day") {
//         return {
//           status: isPaid ? "VF" : "UF",
//           color: isPaid
//             ? darkMode
//               ? "rgba(3, 201, 136,1)"
//               : "rgba(3, 201, 136,.5)"
//             : darkMode
//               ? "rgba(175, 23, 64, 1)"
//               : "rgba(175, 23, 64, .5)",
//           title: "Work Off",
//         };
//       }
//       return {
//         status: isPaid ? "VH" : "UH",
//         color: isPaid
//           ? darkMode
//             ? "rgba(133, 169, 71,1)"
//             : "rgba(73, 107, 15, 0.66)"
//           : darkMode
//             ? "rgba(222, 124, 125, 1)"
//             : "rgba(222, 124, 125, .5)",
//         title: "Work Off",
//       };
//     }

//     /* ---------- weekend / holiday codes (unchanged) ---------- */
//     if (loginTime === "WO") {
//       return {
//         status: "W",
//         color: darkMode ? "rgb(155, 89, 182)" : "rgba(201, 117, 235, 0.32)",
//         title: "Work Off",
//       };
//     }
//     if (loginTime === "HD") {
//       return {
//         status: "O",
//         color: darkMode ? "rgb(63, 157, 233)" : "rgba(72, 152, 218, 0.66)",
//         title: "Holiday",
//       };
//     }

//     /* ---------- work-time & arrival calculations ---------- */

//     const totalMinutes = parseInt(netLogiHours, 10); // may be NaN
//     const firstLogin = Array.isArray(loginTime) ? loginTime[0] : loginTime;

//     // Compute “minutes late”, but only if we have both times in HH:mm format
//     let minutesLate = null;
//     if (
//       firstLogin &&
//       typeof firstLogin === "string" &&
//       firstLogin.includes(":") &&
//       shifts &&
//       shifts.startTime
//     ) {
//       const [lH, lM] = firstLogin.split(":").map(Number);
//       const [sH, sM] = shifts.startTime.split(":").map(Number);
//       minutesLate = lH * 60 + lM - (sH * 60 + sM); // can be negative (early/on-time)
//     }

//     // New rules: Check login time relative to shift start (9:30 AM) and unequal login/logout lengths
//     if (minutesLate !== null && loginTimeLength !== logoutTimeLength) {
//       if (minutesLate <= 15) {
//         // Login by 9:45 AM
//         return {
//           status: "L",
//           color: darkMode ? "rgb(93, 173, 226)" : "rgba(170, 211, 238, 0.55)",
//           title: `Late (${minutesLate} min)`,
//         };
//       } else if (minutesLate <= 360) {
//         // Login after 9:45 AM but by 3:30 PM
//         return {
//           status: "H",
//           color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//           title: `Half Day (Late ${minutesLate} min)`,
//         };
//       } else {
//         // Login after 3:30 PM
//         return {
//           status: "A",
//           color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//           title: `Absent (Late ${minutesLate} min)`,
//         };
//       }
//     }

//     const isNetLoginAvailable = !isNaN(totalMinutes);

//     /* ---------- RULE 1: evaluate by hours worked ---------- */
//     if (isNetLoginAvailable) {
//       const hrs = Math.floor(totalMinutes / 60);
//       const mins = totalMinutes % 60;

//       // FULL DAY but possibly late
//       if (totalMinutes >= 465) {
//         // NEW RULE: late > 15 min ⇒ Half Day
//         if (minutesLate !== null && minutesLate > 15) {
//           return {
//             status: "H",
//             color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//             title: `Half Day (${hrs}h ${mins}m, Late ${minutesLate} min)`,
//           };
//         }
//         return {
//           status: "P",
//           color: darkMode ? "rgb(26, 188, 156)" : "rgba(26, 188, 156, 0.64)",
//           title: `Present (${hrs}h ${mins}m)`,
//         };
//       }

//       // HALF DAY by hours
//       if (totalMinutes >= 240) {
//         return {
//           status: "H",
//           color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//           title: `Half Day (${hrs}h ${mins}m)`,
//         };
//       }

//       // Less than 4h ⇒ Absent by hours
//       return {
//         status: "A",
//         color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//         title: `Absent (${hrs}h ${mins}m)`,
//       };
//     }

//     /* ---------- RULE 2: fallback to arrival-time rule ---------- */

//     // No shift info → cannot judge, treat as Absent
//     if (!shifts || !shifts.startTime) {
//       return {
//         status: "A",
//         color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//         title: "Absent",
//       };
//     }

//     // NOTE: minutesLate is guaranteed to be a number at this point
//     if (minutesLate <= 0) {
//       return {
//         status: "P",
//         color: darkMode ? "rgb(26, 188, 156)" : "rgba(26, 188, 156, 0.64)",
//         title: "Present",
//       };
//     }
//     if (minutesLate <= 15) {
//       return {
//         status: "L",
//         color: darkMode ? "rgb(93, 173, 226)" : "rgba(170, 211, 238, 0.55)",
//         title: "Late",
//       };
//     }
//     if (minutesLate <= 360) {
//       return {
//         status: "H",
//         color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//         title: "Half Day",
//       };
//     }

//     return {
//       status: "A",
//       color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//       title: "Absent",
//     };
//   };
// }


const markAttendance = ({
  loginTime,
  day,
  month,
  year,
  shifts,
  isNCNS,
  isOnLeave,
  isSandwhich,
  isForcedAbsent,
  LeaveDurationName,
  LeaveTypeName,
  netLogiHours,
}) => {
  const darkMode = false;

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const isPastDate =
    year < currentYear ||
    (year === currentYear && month < currentMonth) ||
    (year === currentYear && month === currentMonth && day < currentDay);

  /* ---------- PRIORITY FLAGS ---------- */
  if (isPastDate) {
    if (isForcedAbsent)
      return { status: "A", color: "rgba(255,0,0,.7)", title: "Absent" };

    if (isSandwhich)
      return { status: "S", color: "rgba(244,208,63,.7)", title: "Sandwich Leave" };

    if (isNCNS)
      return { status: "N", color: "rgba(255,0,0,.7)", title: "No Call No Show" };
  }

  /* ---------- NO DATA ---------- */
  if (!loginTime || loginTime.length === 0) {
    return isPastDate
      ? { status: "A", color: "rgba(231,18,18,.4)", title: "Absent" }
      : { status: "--", color: "rgba(32,32,32,.3)", title: "No Data" };
  }

  /* ---------- LEAVE ---------- */
  if (isOnLeave) {
    const isPaid = ["Paid Leave", "Casual Leave"].includes(LeaveTypeName);
    const status =
      LeaveDurationName === "Full Day"
        ? isPaid ? "VF" : "UF"
        : isPaid ? "VH" : "UH";

    return {
      status,
      color: isPaid ? "rgba(3,201,136,.5)" : "rgba(175,23,64,.5)",
      title: "Work Off",
    };
  }

  /* ---------- HOLIDAY / WO ---------- */
  if (loginTime === "WO")
    return { status: "W", color: "rgba(201,117,235,.3)", title: "Work Off" };

  if (loginTime === "HD")
    return { status: "O", color: "rgba(72,152,218,.6)", title: "Holiday" };

  /* ---------- HOURS BASED (HIGHEST PRIORITY) ---------- */
  const totalMinutes = parseInt(netLogiHours, 10);
  if (!isNaN(totalMinutes)) {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (totalMinutes >= 465)
      return { status: "P", color: "rgba(26,188,156,.6)", title: `Present (${hrs}h ${mins}m)` };

    if (totalMinutes >= 240)
      return { status: "H", color: "rgba(243,157,18,.7)", title: `Half Day (${hrs}h ${mins}m)` };

    return { status: "A", color: "rgba(231,18,18,.4)", title: `Absent (${hrs}h ${mins}m)` };
  }

  /* ---------- ARRIVAL BASED (FALLBACK) ---------- */
  if (!shifts?.startTime) {
    return { status: "A", color: "rgba(231,18,18,.4)", title: "Absent" };
  }

  const firstLogin = Array.isArray(loginTime) ? loginTime[0] : loginTime;
  const [lH, lM] = firstLogin.split(":").map(Number);
  const [sH, sM] = shifts.startTime.split(":").map(Number);

  const minutesLate = lH * 60 + lM - (sH * 60 + sM);

  if (minutesLate <= 0) return { status: "P", color: "rgba(26,188,156,.6)", title: "Present" };
  if (minutesLate <= 15) return { status: "L", color: "rgba(170,211,238,.5)", title: "Late" };
  if (minutesLate <= 360) return { status: "H", color: "rgba(243,157,18,.7)", title: "Half Day" };

  return { status: "A", color: "rgba(231,18,18,.4)", title: "Absent" };
};


// const markAttendance = ({
//   loginTime,
//   day,
//   shifts,
//   isNCNS,
//   isOnLeave,
//   isSandwhich,
//   isForcedAbsent,
//   LeaveDurationName,
//   LeaveTypeName,
//   netLogiHours,
//   loginTimeLength,
//   logoutTimeLength,
// }) => {
//   let darkMode = false;
//   let filterYear = new Date().getFullYear();
//   let filterMonth = new Date().getMonth() + 1;
//   const today = new Date();
//   const currentDay = today.getDate();
//   const currentMonth = today.getMonth() + 1;
//   const currentYear = today.getFullYear();

//   if (
//     filterYear < currentYear ||
//     (filterYear === currentYear && filterMonth < currentMonth) ||
//     (filterYear === currentYear &&
//       filterMonth === currentMonth &&
//       day < currentDay)
//   ) {
//     if (isForcedAbsent) {
//       return {
//         status: "A",
//         color: darkMode ? "rgba(255, 0, 0, 0.99)" : "rgba(255, 0, 0, 0.73)",
//         title: "Absent",
//       };
//     }
//     if (isSandwhich) {
//       return {
//         status: "S",
//         color: darkMode ? "rgb(244, 208, 63)" : "rgba(244, 208, 63, 0.67)",
//         title: "Sandwhich Leave",
//       };
//     }
//     if (isNCNS) {
//       return {
//         status: "N",
//         color: darkMode ? "rgba(255, 0, 0, 0.99)" : "rgba(255, 0, 0, 0.73)",
//         title: "No Call No Show",
//       };
//     }
//     if (!loginTime || loginTime.length === 0) {
//       return {
//         status: "A",
//         color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//         title: "Absent",
//       };
//     }
//   } else if (!loginTime || loginTime.length === 0) {
//     return {
//       status: "--",
//       color: darkMode ? "#c1bdbd" : "rgba(32, 32, 32, 0.3)",
//       title: "No Data",
//     };
//   } else if (loginTime[0] === "") {
//     return {
//       status: "A",
//       color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//       title: "Absent",
//     };
//   }

//   /* ---------- leave handling (unchanged) ---------- */
//   if (isOnLeave) {
//     const isPaid = [
//       "Paid Leave",
//       "Casual Leave",
//       "Paternity Leave",
//       "Maternity Leave",
//     ].includes(LeaveTypeName);

//     if (LeaveDurationName === "Full Day") {
//       return {
//         status: isPaid ? "VF" : "UF",
//         color: isPaid
//           ? darkMode
//             ? "rgba(3, 201, 136,1)"
//             : "rgba(3, 201, 136,.5)"
//           : darkMode
//             ? "rgba(175, 23, 64, 1)"
//             : "rgba(175, 23, 64, .5)",
//         title: "Work Off",
//       };
//     }
//     return {
//       status: isPaid ? "VH" : "UH",
//       color: isPaid
//         ? darkMode
//           ? "rgba(133, 169, 71,1)"
//           : "rgba(73, 107, 15, 0.66)"
//         : darkMode
//           ? "rgba(222, 124, 125, 1)"
//           : "rgba(222, 124, 125, .5)",
//       title: "Work Off",
//     };
//   }

//   /* ---------- weekend / holiday codes (unchanged) ---------- */
//   if (loginTime === "WO") {
//     return {
//       status: "W",
//       color: darkMode ? "rgb(155, 89, 182)" : "rgba(201, 117, 235, 0.32)",
//       title: "Work Off",
//     };
//   }
//   if (loginTime === "HD") {
//     return {
//       status: "O",
//       color: darkMode ? "rgb(63, 157, 233)" : "rgba(72, 152, 218, 0.66)",
//       title: "Holiday",
//     };
//   }

//   /* ---------- work-time & arrival calculations ---------- */

//   const totalMinutes = parseInt(netLogiHours, 10); // may be NaN
//   const firstLogin = Array.isArray(loginTime) ? loginTime[0] : loginTime;

//   // Compute “minutes late”, but only if we have both times in HH:mm format
//   let minutesLate = null;
//   if (
//     firstLogin &&
//     typeof firstLogin === "string" &&
//     firstLogin.includes(":") &&
//     shifts &&
//     shifts.startTime
//   ) {
//     const [lH, lM] = firstLogin.split(":").map(Number);
//     const [sH, sM] = shifts.startTime.split(":").map(Number);
//     minutesLate = lH * 60 + lM - (sH * 60 + sM); // can be negative (early/on-time)
//   }

//   // New rules: Check login time relative to shift start (9:30 AM) and unequal login/logout lengths
//   if (minutesLate !== null && loginTimeLength !== logoutTimeLength) {
//     if (minutesLate <= 15) {
//       // Login by 9:45 AM
//       return {
//         status: "L",
//         color: darkMode ? "rgb(93, 173, 226)" : "rgba(170, 211, 238, 0.55)",
//         title: `Late (${minutesLate} min)`,
//       };
//     } else if (minutesLate <= 360) {
//       // Login after 9:45 AM but by 3:30 PM
//       return {
//         status: "H",
//         color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//         title: `Half Day (Late ${minutesLate} min)`,
//       };
//     } else {
//       // Login after 3:30 PM
//       return {
//         status: "A",
//         color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//         title: `Absent (Late ${minutesLate} min)`,
//       };
//     }
//   }

//   const isNetLoginAvailable = !isNaN(totalMinutes);

//   /* ---------- RULE 1: evaluate by hours worked ---------- */
//   if (isNetLoginAvailable) {
//     const hrs = Math.floor(totalMinutes / 60);
//     const mins = totalMinutes % 60;

//     // FULL DAY but possibly late
//     if (totalMinutes >= 465) {
//       // NEW RULE: late > 15 min ⇒ Half Day
//       if (minutesLate !== null && minutesLate > 15) {
//         return {
//           status: "H",
//           color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//           title: `Half Day (${hrs}h ${mins}m, Late ${minutesLate} min)`,
//         };
//       }
//       return {
//         status: "P",
//         color: darkMode ? "rgb(26, 188, 156)" : "rgba(26, 188, 156, 0.64)",
//         title: `Present (${hrs}h ${mins}m)`,
//       };
//     }

//     // HALF DAY by hours
//     if (totalMinutes >= 240) {
//       return {
//         status: "H",
//         color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//         title: `Half Day (${hrs}h ${mins}m)`,
//       };
//     }

//     // Less than 4h ⇒ Absent by hours
//     return {
//       status: "A",
//       color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//       title: `Absent (${hrs}h ${mins}m)`,
//     };
//   }

//   /* ---------- RULE 2: fallback to arrival-time rule ---------- */

//   // No shift info → cannot judge, treat as Absent
//   if (!shifts || !shifts.startTime) {
//     return {
//       status: "A",
//       color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//       title: "Absent",
//     };
//   }

//   // NOTE: minutesLate is guaranteed to be a number at this point
//   if (minutesLate <= 0) {
//     return {
//       status: "P",
//       color: darkMode ? "rgb(26, 188, 156)" : "rgba(26, 188, 156, 0.64)",
//       title: "Present",
//     };
//   }
//   if (minutesLate <= 15) {
//     return {
//       status: "L",
//       color: darkMode ? "rgb(93, 173, 226)" : "rgba(170, 211, 238, 0.55)",
//       title: "Late",
//     };
//   }
//   if (minutesLate <= 360) {
//     return {
//       status: "H",
//       color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//       title: "Half Day",
//     };
//   }

//   return {
//     status: "A",
//     color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//     title: "Absent",
//   };
// };


function calculateTotal(status, employee) {
  let total = 0;
  const yearIndex = employee.years.findIndex(
    (year) => year.year === filterYear
  );
  const monthIndex =
    yearIndex !== -1
      ? employee.years[yearIndex].months.findIndex(
        (month) => month.month === filterMonth
      )
      : -1;
  const dates = employee.years[yearIndex]?.months[monthIndex]?.dates || [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObject = dates.find((date) => date.date === day);
    const loginTime = dateObject ? dateObject.loginTime[0] : "";
    const loginTimeLength = dateObject ? dateObject.loginTime : 0;
    const logoutTimeLength = dateObject ? dateObject.loginTime : 0;
    const netLogiHours = dateObject?.totalLogAfterBreak
      ? parseInt(dateObject.totalLogAfterBreak, 10)
      : 0;
    const shifts = dateObject?.shifts || {};
    const isNCNS = dateObject?.isNCNS || false;
    const isOnLeave = dateObject?.isOnLeave || false;
    const isSandwhich = dateObject?.isSandwhich || false;
    const isForcedAbsent = dateObject?.isForcedAbsent || false;
    const LeaveDurationName = dateObject
      ? dateObject?.leaveAttendanceData?.leaveDuration
      : "";
    const LeaveTypeName = dateObject
      ? dateObject?.leaveAttendanceData?.leaveType
      : "";
    const attendanceStatus = markAttendance({
      loginTime,
      day,
      shifts,
      isNCNS,
      isOnLeave,
      isSandwhich,
      isForcedAbsent,
      LeaveDurationName,
      LeaveTypeName,
      netLogiHours,
      loginTimeLength,
      logoutTimeLength,
    }).status;
    if (
      attendanceStatus === status ||
      (status === "P" &&
        (attendanceStatus === "W" || attendanceStatus === "L")) ||
      (status === "A" && attendanceStatus === "--")
    ) {
      total++;
    }
  }
  return total;
};

// function markAttendance({
//   loginTime,
//   day,
//   shifts,
//   isNCNS,
//   isOnLeave,
//   isSandwhich,
//   isForcedAbsent,
//   LeaveDurationName,
//   LeaveTypeName,
//   netLogiHours,
//   loginTimeLength,
//   logoutTimeLength,
//   darkMode = false,
//   filterYear,
//   filterMonth,
// }) {
//   const today = new Date();
//   const currentDay = today.getDate();
//   const currentMonth = today.getMonth() + 1;
//   const currentYear = today.getFullYear();

//   if (
//     filterYear < currentYear ||
//     (filterYear === currentYear && filterMonth < currentMonth) ||
//     (filterYear === currentYear &&
//       filterMonth === currentMonth &&
//       day < currentDay)
//   ) {
//     if (isForcedAbsent) {
//       return {
//         status: "A",
//         color: darkMode ? "rgba(255, 0, 0, 0.99)" : "rgba(255, 0, 0, 0.73)",
//         title: "Absent",
//       };
//     }
//     if (isSandwhich) {
//       return {
//         status: "S",
//         color: darkMode ? "rgb(244, 208, 63)" : "rgba(244, 208, 63, 0.67)",
//         title: "Sandwhich Leave",
//       };
//     }
//     if (isNCNS) {
//       return {
//         status: "N",
//         color: darkMode ? "rgba(255, 0, 0, 0.99)" : "rgba(255, 0, 0, 0.73)",
//         title: "No Call No Show",
//       };
//     }
//     if (!loginTime || loginTime.length === 0) {
//       return {
//         status: "A",
//         color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//         title: "Absent",
//       };
//     }
//   } else if (!loginTime || loginTime.length === 0) {
//     return {
//       status: "--",
//       color: darkMode ? "#c1bdbd" : "rgba(32, 32, 32, 0.3)",
//       title: "No Data",
//     };
//   } else if (loginTime[0] === "") {
//     return {
//       status: "A",
//       color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//       title: "Absent",
//     };
//   }

//   /* ---------- leave handling (unchanged) ---------- */
//   if (isOnLeave) {
//     const isPaid = [
//       "Paid Leave",
//       "Casual Leave",
//       "Paternity Leave",
//       "Maternity Leave",
//     ].includes(LeaveTypeName);

//     if (LeaveDurationName === "Full Day") {
//       return {
//         status: isPaid ? "VF" : "UF",
//         color: isPaid
//           ? darkMode
//             ? "rgba(3, 201, 136,1)"
//             : "rgba(3, 201, 136,.5)"
//           : darkMode
//             ? "rgba(175, 23, 64, 1)"
//             : "rgba(175, 23, 64, .5)",
//         title: "Work Off",
//       };
//     }
//     return {
//       status: isPaid ? "VH" : "UH",
//       color: isPaid
//         ? darkMode
//           ? "rgba(133, 169, 71,1)"
//           : "rgba(73, 107, 15, 0.66)"
//         : darkMode
//           ? "rgba(222, 124, 125, 1)"
//           : "rgba(222, 124, 125, .5)",
//       title: "Work Off",
//     };
//   }

//   /* ---------- weekend / holiday codes (unchanged) ---------- */
//   if (loginTime === "WO") {
//     return {
//       status: "W",
//       color: darkMode ? "rgb(155, 89, 182)" : "rgba(201, 117, 235, 0.32)",
//       title: "Work Off",
//     };
//   }
//   if (loginTime === "HD") {
//     return {
//       status: "O",
//       color: darkMode ? "rgb(63, 157, 233)" : "rgba(72, 152, 218, 0.66)",
//       title: "Holiday",
//     };
//   }

//   /* ---------- work-time & arrival calculations ---------- */

//   const totalMinutes = parseInt(netLogiHours, 10); // may be NaN
//   const firstLogin = Array.isArray(loginTime) ? loginTime[0] : loginTime;

//   // Compute “minutes late”, but only if we have both times in HH:mm format
//   let minutesLate = null;
//   if (
//     firstLogin &&
//     typeof firstLogin === "string" &&
//     firstLogin.includes(":") &&
//     shifts &&
//     shifts.startTime
//   ) {
//     const [lH, lM] = firstLogin.split(":").map(Number);
//     const [sH, sM] = shifts.startTime.split(":").map(Number);
//     minutesLate = lH * 60 + lM - (sH * 60 + sM); // can be negative (early/on-time)
//   }

//   // New rules: Check login time relative to shift start (9:30 AM) and unequal login/logout lengths
//   if (minutesLate !== null && loginTimeLength !== logoutTimeLength) {
//     if (minutesLate <= 15) {
//       // Login by 9:45 AM
//       return {
//         status: "L",
//         color: darkMode ? "rgb(93, 173, 226)" : "rgba(170, 211, 238, 0.55)",
//         title: `Late (${minutesLate} min)`,
//       };
//     } else if (minutesLate <= 360) {
//       // Login after 9:45 AM but by 3:30 PM
//       return {
//         status: "H",
//         color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//         title: `Half Day (Late ${minutesLate} min)`,
//       };
//     } else {
//       // Login after 3:30 PM
//       return {
//         status: "A",
//         color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//         title: `Absent (Late ${minutesLate} min)`,
//       };
//     }
//   }

//   const isNetLoginAvailable = !isNaN(totalMinutes);

//   /* ---------- RULE 1: evaluate by hours worked ---------- */
//   if (isNetLoginAvailable) {
//     const hrs = Math.floor(totalMinutes / 60);
//     const mins = totalMinutes % 60;

//     // FULL DAY but possibly late
//     if (totalMinutes >= 465) {
//       // NEW RULE: late > 15 min ⇒ Half Day
//       if (minutesLate !== null && minutesLate > 15) {
//         return {
//           status: "H",
//           color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//           title: `Half Day (${hrs}h ${mins}m, Late ${minutesLate} min)`,
//         };
//       }
//       return {
//         status: "P",
//         color: darkMode ? "rgb(26, 188, 156)" : "rgba(26, 188, 156, 0.64)",
//         title: `Present (${hrs}h ${mins}m)`,
//       };
//     }

//     // HALF DAY by hours
//     if (totalMinutes >= 240) {
//       return {
//         status: "H",
//         color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//         title: `Half Day (${hrs}h ${mins}m)`,
//       };
//     }

//     // Less than 4h ⇒ Absent by hours
//     return {
//       status: "A",
//       color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//       title: `Absent (${hrs}h ${mins}m)`,
//     };
//   }

//   /* ---------- RULE 2: fallback to arrival-time rule ---------- */

//   // No shift info → cannot judge, treat as Absent
//   if (!shifts || !shifts.startTime) {
//     return {
//       status: "A",
//       color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//       title: "Absent",
//     };
//   }

//   // NOTE: minutesLate is guaranteed to be a number at this point
//   if (minutesLate <= 0) {
//     return {
//       status: "P",
//       color: darkMode ? "rgb(26, 188, 156)" : "rgba(26, 188, 156, 0.64)",
//       title: "Present",
//     };
//   }
//   if (minutesLate <= 15) {
//     return {
//       status: "L",
//       color: darkMode ? "rgb(93, 173, 226)" : "rgba(170, 211, 238, 0.55)",
//       title: "Late",
//     };
//   }
//   if (minutesLate <= 360) {
//     return {
//       status: "H",
//       color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
//       title: "Half Day",
//     };
//   }

//   return {
//     status: "A",
//     color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
//     title: "Absent",
//   };
// };


// function calculateTotal(dates, daysInMonth) {
//   const totals = {
//     totalDays: daysInMonth,
//     absent: 0,
//     present: 0,
//     halfday: 0,
//     late: 0,
//     holiday: 0,
//     weekoff: 0,
//     paidLeaves: 0,
//     unpaidLeaves: 0,
//     NCNS: 0,
//     Sandwhich: 0,
//     totalPayableDays: 0,
//   };

//   dates.forEach(d => {
//     switch (d.status) {
//       case "A": // Absent
//       case "--": // No Data
//         totals.absent++;
//         break;

//       case "P": // Present
//         totals.present++;
//         totals.totalPayableDays += 1;
//         break;

//       case "L": // Late
//         totals.late++;
//         totals.totalPayableDays += 1;
//         break;

//       case "H": // Half Day
//         totals.halfday++;
//         totals.totalPayableDays += 0.5;
//         break;

//       case "O": // Holiday
//         totals.holiday++;
//         totals.totalPayableDays += 1;
//         break;

//       case "W": // Week Off
//         totals.weekoff++;
//         totals.totalPayableDays += 1;
//         break;

//       case "VF": // Paid Full Leave
//         totals.paidLeaves++;
//         totals.totalPayableDays += 1;
//         break;

//       case "VH": // Paid Half Leave
//         totals.paidLeaves += 0.5;
//         totals.totalPayableDays += 0.5;
//         break;

//       case "UF": // Unpaid Full Leave
//         totals.unpaidLeaves++;
//         break;

//       case "UH": // Unpaid Half Leave
//         totals.unpaidLeaves += 0.5;
//         break;

//       case "N": // No Call No Show
//         totals.NCNS++;
//         break;

//       case "S": // Sandwhich Leave
//         totals.Sandwhich++;
//         break;
//     }
//   });

//   return totals;
// }



module.exports = { markAttendance, calculateTotal };
