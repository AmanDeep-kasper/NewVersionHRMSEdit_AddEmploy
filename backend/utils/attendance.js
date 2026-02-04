// module.exports = function markAttendance({
//   loginTime,
//   day,
//   shifts,
//   isNCNS,
//   isOnLeave,
//   isSandwich,
//   isForcedAbsent,
//   LeaveDurationName,
//   LeaveTypeName,
//   netLogiHours,
//   loginTimeLength,
//   logoutTimeLength,
//   filterYear,
//   filterMonth,
// }) {
//   const today = new Date();
//   const currentDay = today.getDate();
//   const currentMonth = today.getMonth() + 1;
//   const currentYear = today.getFullYear();

//   // 🔥 SAME CONDITIONS AS FRONTEND
//   if (
//     filterYear < currentYear ||
//     (filterYear === currentYear && filterMonth < currentMonth) ||
//     (filterYear === currentYear &&
//       filterMonth === currentMonth &&
//       day < currentDay)
//   ) {
//     if (isForcedAbsent) return { status: "A" };
//     if (isSandwich) return { status: "S" };
//     if (isNCNS) return { status: "N" };
//     if (!loginTime || loginTime.length === 0) return { status: "A" };
//   } else if (!loginTime || loginTime.length === 0) {
//     return { status: "--" };
//   }

//   // Leave logic
//   if (isOnLeave) {
//     const isPaid = [
//       "Paid Leave",
//       "Casual Leave",
//       "Paternity Leave",
//       "Maternity Leave",
//     ].includes(LeaveTypeName);

//     if (LeaveDurationName === "Full Day") {
//       return { status: isPaid ? "VF" : "UF" };
//     }
//     return { status: isPaid ? "VH" : "UH" };
//   }

//   if (loginTime === "WO") return { status: "W" };
//   if (loginTime === "HD") return { status: "O" };

//   const totalMinutes = parseInt(netLogiHours, 10);
//   const firstLogin = Array.isArray(loginTime) ? loginTime[0] : loginTime;

//   let minutesLate = null;
//   if (firstLogin && shifts?.startTime) {
//     const [lH, lM] = firstLogin.split(":").map(Number);
//     const [sH, sM] = shifts.startTime.split(":").map(Number);
//     minutesLate = lH * 60 + lM - (sH * 60 + sM);
//   }

//   if (!isNaN(totalMinutes)) {
//     if (totalMinutes >= 465) {
//       if (minutesLate > 15) return { status: "H" };
//       return { status: "P" };
//     }
//     if (totalMinutes >= 240) return { status: "H" };
//     return { status: "A" };
//   }

//   return { status: "A" };
// };


function markAttendance({
  loginTime,
  isNCNS = false,
  isOnLeave = false,
  isSandwich = false,
  isForcedAbsent = false,
  LeaveDurationName = "",
  LeaveTypeName = "",
  netLogiHours = 0,
  loginTimeLength = 0,
  logoutTimeLength = 0,
}) {
  let status = "--";
  let title = "";
  let color = "";

  if (loginTime === "HD") {
    return { status: "O", title: "Holiday", color: "#00bcd4" };
  }

  if (loginTime === "WO") {
    return { status: "W", title: "Week Off", color: "#9e9e9e" };
  }

  if (isNCNS) {
    return { status: "N", title: "NCNS", color: "#d32f2f" };
  }

  if (isSandwich) {
    return { status: "S", title: "Sandwich Leave", color: "#8e24aa" };
  }

  if (isForcedAbsent) {
    return { status: "A", title: "Forced Absent", color: "#f44336" };
  }

  if (isOnLeave) {
    if (LeaveDurationName === "Full Day") {
      return {
        status: LeaveTypeName === "Paid" ? "VF" : "UF",
        title: "Full Day Leave",
        color: "#ff9800",
      };
    }
    if (LeaveDurationName === "Half Day") {
      return {
        status: LeaveTypeName === "Paid" ? "VH" : "UH",
        title: "Half Day Leave",
        color: "#ff9800",
      };
    }
  }

  if (loginTimeLength && logoutTimeLength) {
    if (netLogiHours >= 8)
      return { status: "P", title: "Present", color: "#4caf50" };
    if (netLogiHours >= 4)
      return { status: "H", title: "Half Day", color: "#ffeb3b" };
  }

  return { status: "A", title: "Absent", color: "#f44336" };
}

module.exports = markAttendance;
