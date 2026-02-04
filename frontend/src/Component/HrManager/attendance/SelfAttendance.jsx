import React, { useState, useEffect, memo } from "react";
import { TfiReload } from "react-icons/tfi";
import { useSelector } from "react-redux";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import AttendanceHeader from "./SelfAttendanceComponents/AttendanceHeader";
import AttendanceTable from "./SelfAttendanceComponents/AttendanceTable";
import api from "../../../Pages/config/api";
import EmpAttendanceCard from "../../../Pages/Attendance/EmpAttendanceCard";

const SelfAttendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [hoveredDate, setHoveredDate] = useState(null);
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  // Pagination (kept simple; you can expand to page numbers)
  const [itemsPerPage] = useState(10);
  const [page] = useState(1); // reserved if you want to expand pagination later

  const empMail = userData?.Email;
  const employeeId = userData?._id;

  const handleMouseEnter = (date) => setHoveredDate(date);
  const handleMouseLeave = () => setHoveredDate(null);

useEffect(() => {
  if (!employeeId) return;

  const controller = new AbortController();

  const handleFetchAttendance = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/attendance/${employeeId}`, {
        params: { year: selectedYear, month: selectedMonth },
      });

      setAttendanceData(response.data || null);
    } catch (err) {
      if (err.code !== "ERR_CANCELED") {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  handleFetchAttendance();
  return () => controller.abort();
}, [employeeId, selectedYear, selectedMonth]);


  // Utilities
  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1] || "";
  };

  // const getMonthsForYear = (year) => {
  //   if (year === new Date().getFullYear()) {
  //     return Array.from({ length: new Date().getMonth() + 1 }, (_, i) => i + 1);
  //   }
  //   return Array.from({ length: 12 }, (_, i) => i + 1);
  // };

  const getMonthsForYear = (year) => {
    const yearObj = attendanceData?.attendance?.years?.find(
      (y) => Number(y.year) === Number(year),
    );

    // Return only months available in API when present
    if (yearObj && Array.isArray(yearObj.months) && yearObj.months.length > 0) {
      return yearObj.months.map((m) => m.month).sort((a, b) => a - b);
    }

    // Fallback to calendar months for the year
    if (Number(year) === new Date().getFullYear()) {
      return Array.from({ length: new Date().getMonth() + 1 }, (_, i) => i + 1);
    }
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  // NOTE: backend already filters years/months — frontend reads them directly
  const getYears = () => {
    return attendanceData?.attendance?.years || [];
  };

  const getAttendanceMark = (date) => {
    if (!date) return null;

    const { loginTime = [], logoutTime = [], totalLogAfterBreak } = date;
    const loginFirst = Array.isArray(loginTime) ? loginTime[0] : null;
    const shiftStartTime = date?.shifts?.startTime;

    if (!loginFirst || !shiftStartTime) {
      return (
        <span className={darkMode ? "badge-danger" : "badge-danger-dark"}>
          Absent
        </span>
      );
    }

    const loginCount = Array.isArray(loginTime) ? loginTime.length : 0;
    const logoutCount = Array.isArray(logoutTime) ? logoutTime.length : 0;

    const [sH, sM] = shiftStartTime.split(":").map(Number);
    const [lH, lM] = loginFirst.split(":").map(Number);
    const shiftStartMin = sH * 60 + sM;
    const loginMin = lH * 60 + lM;

    const netMinutes = parseInt(totalLogAfterBreak ?? "0", 10); // Safe parse

    if (loginCount === logoutCount && loginCount > 0) {
      if (netMinutes >= 465) {
        if (loginMin > shiftStartMin + 15) {
          return (
            <span
              className={
                darkMode ? "badge-warning border" : "badge-warning-dark"
              }
            >
              Half&nbsp;Day
            </span>
          );
        }
        return (
          <span
            className={darkMode ? "badge-success border" : "badge-success-dark"}
          >
            Present
          </span>
        );
      }

      if (netMinutes >= 240) {
        return (
          <span
            className={darkMode ? "badge-warning border" : "badge-warning-dark"}
          >
            Half&nbsp;Day
          </span>
        );
      }

      return (
        <span
          className={darkMode ? "badge-danger border" : "badge-danger-dark"}
        >
          Absent
        </span>
      );
    }

    // Fallback for unmatched logins/logouts
    if (loginMin <= shiftStartMin) {
      return (
        <span
          className={darkMode ? "badge-success border" : "badge-success-dark"}
        >
          On&nbsp;Time
        </span>
      );
    }

    if (loginMin <= shiftStartMin + 15) {
      return (
        <span className={darkMode ? "badge-info border" : "badge-info-dark"}>
          Late
        </span>
      );
    }

    if (loginMin <= shiftStartMin + 360) {
      return (
        <span
          className={darkMode ? "badge-warning border" : "badge-warning-dark"}
        >
          Half&nbsp;Day
        </span>
      );
    }

    return (
      <span className={darkMode ? "badge-danger border" : "badge-danger-dark"}>
        Absent
      </span>
    );
  };

  const convertMinutesToHMS = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return "0 Hrs 0 Min";
    const hours = Math.floor(totalSeconds / 60);
    const remainingMinutes = totalSeconds % 60;
    return `${hours} Hrs ${remainingMinutes} Min`;
  };

  const twoDigitDate = (date) => String(date).padStart(2, "0");

  const daySwitch = (day) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day] || "Sunday";
  };

  // Use backend-provided years and select the object for the selected year
  const currentItems = getYears().filter(
    (y) => Number(y.year) === Number(selectedYear),
  );

  return (
    <div className="flex flex-col container-fluid gap-2">
      <AttendanceHeader
        attendanceData={attendanceData}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        getYears={getYears}
        getMonthsForYear={getMonthsForYear}
        getMonthName={getMonthName}
      />
      {loading ? (
        <div
          style={{
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="text-2xl font-bold">
            <TfiReload className="animate-spin text-blue-500" />
          </div>
          <p
            className={`text-gray-500 ${darkMode ? "text-black" : "text-white"}`}
          >
            Loading attendance...
          </p>
        </div>
      ) : error ? (
        <div
          style={{
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <p className="text-red-500">{error}</p>
        </div>
      ) : attendanceData && getYears().length > 0 ? (
        <AttendanceTable
          currentItems={currentItems}
          selectedMonth={selectedMonth}
          darkMode={darkMode}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          getAttendanceMark={getAttendanceMark}
          convertMinutesToHMS={convertMinutesToHMS}
          twoDigitDate={twoDigitDate}
          daySwitch={daySwitch}
        />
      ) : (
        <div
          style={{
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="text-2xl font-bold">
            <TfiReload className="animate-spin text-blue-500" />
          </div>
          <p
            className={`text-gray-500 ${darkMode ? "text-black" : "text-white"}`}
          >
            No attendance data available for the selected month/year.
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(SelfAttendance);
