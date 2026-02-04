import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaRegClock,
} from "react-icons/fa";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { BsStopwatch } from "react-icons/bs";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api";

const AttendanceDetails = ({ data }) => {
  // const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [viewType, setViewType] = useState("monthly");
  Date.prototype.getWeek = function() {
    const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    const pastDaysOfYear = (this - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};
  const [selectedWeek, setSelectedWeek] = useState(new Date().getWeek());
  const { userData} = useSelector((state)=> state.user);

  const employeeId = userData._id;
  const { darkMode } = useTheme();

  useEffect(() => {
    // fetchEmployees();
    handleFetchAttendance();
  }, [selectedYear, selectedMonth, selectedWeek, viewType]);

  // const fetchEmployees = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${BASE_URL}/api/employee/${data["_id"]}`,
  //       {
  //         headers: { authorization: localStorage.getItem("token") || "" },
  //       }
  //     );
  //     setEmployees(response.data);
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //   }
  // };
  function isDateInCurrentWeek(day) {
    const now = new Date();
    
    // Get the current week start (Monday) and end (Sunday)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));

    // Remove the time part from the comparison
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);
 
    // Create a Date object for the given day in the current month
    const dateToCheck = new Date(now.getFullYear(), now.getMonth()-1, day);
  
    // Check if the date is within the current week
    return dateToCheck >= startOfWeek && dateToCheck <= endOfWeek;
  }
  const handleFetchAttendance = async () => {
    try {
      const response = await api.get(
        `/api/attendance/${employeeId}`,
      );
      const attendance = response.data && (response.data.attendance || response.data);
      setAttendanceData(attendance || null);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const getTotalHolidays = () =>
    attendanceData?.user?.holidayObjID?.holidays.length || 0;

  const getMonthName = (monthNumber) =>
    new Date(0, monthNumber - 1).toLocaleString("en-US", { month: "long" });

  const getMonthsForYear = (year) =>
    year === new Date().getFullYear()
      ? Array.from({ length: new Date().getMonth() + 1 }, (_, i) => i + 1)
      : Array.from({ length: 12 }, (_, i) => i + 1);

  const getYears = () =>
    attendanceData?.years?.filter(
      (year) => year.year <= new Date().getFullYear()
    ) || [];

  const getWeekRanges = (year, month) => {
    const date = new Date(year, month - 1, 1);
 
    const weeks = [];
    let start = 1;

    while (date.getMonth() === month - 1) {
      const end = new Date(year, month - 1, start + 6);
      if (end.getMonth() === month - 1) {
        weeks.push({ start, end: end.getDate() });
      } else {
        weeks.push({ start, end: new Date(year, month, 0).getDate() });
      }
      start += 7;
      date.setDate(start);
    }
   
    return weeks;
  };

  // const millisecondsToTime = (milliseconds) => {
  //   const hours = Math.floor(milliseconds / 3600);
  //   const minutes = Math.floor((milliseconds % 3600) / 60);
  //   const seconds = Math.floor((milliseconds % 60) / 1000);

  //   return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
  //     2,
  //     "0"
  //   )}:${String(seconds).padStart(2, "0")}`;
  // };

  function minutesToTime(minutes) {
    // Calculate total seconds
    let totalSeconds = minutes * 60;

    // Calculate hours, minutes, and seconds
    let hours = Math.floor(totalSeconds / 3600);
    let remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    // Pad the numbers with leading zeros if needed
    hours = hours < 10 ? "0" + hours : hours;
    remainingMinutes =
      remainingMinutes < 10 ? "0" + remainingMinutes : remainingMinutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // Return the formatted time
    return hours + " : " + remainingMinutes + " : " + seconds;
  }

  const getAttendanceMark = (date) => {
    const [loginHour, loginMinute] = date?.loginTime[0]
      ?.split(":")
      .map(Number) || [0, 0];
    return loginHour > 9 || (loginHour === 9 && loginMinute > 45)
      ? "H"
      : loginHour
      ? "P"
      : "A";
  };

  const calculateTotals = (data, type) => {
    if (!data) return null;
    const yearData = data.years.find(
      (yearData) => yearData.year === selectedYear
    );
   
    const monthData = type === "monthly" || type === "weekly"  ? yearData?.months.find((month) => month.month === selectedMonth)   : null;
   
    const totals = {
      totalWorkingHours: 0,
      totalPresent: 0,
      totalAbsent: 0,
      totalHalfDays: 0,
    };

    const dates = type === "monthly"
    ? monthData?.dates
    : type === "weekly"
    ? monthData?.dates.filter((dateObj) => isDateInCurrentWeek(dateObj.date))
    : yearData?.months.flatMap((month) => month.dates);
        
    if (dates) {
      dates.forEach((date) => {
        const mark = getAttendanceMark(date);
        totals.totalWorkingHours += date.totalLogAfterBreak;
        totals.totalPresent += mark === "P" ? 1 : 0;
        totals.totalAbsent += mark === "A" ? 1 : 0;
        totals.totalHalfDays += mark === "H" ? 1 : 0;
      });
    }

    return totals;
  };

  const totals =
    viewType === "monthly" || viewType === "weekly"
      ? calculateTotals(attendanceData, viewType)
      : calculateTotals(attendanceData, "yearly");

  const containerStyle = {
    height: "fit-content",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    maxHeight: "fit-content",
    overflow: "hidden",
  };
 

  return (
    <div style={containerStyle} className="p-2 py-3 rounded-0 shadow">
      {attendanceData && (
        <>
          {/* <div className="mb-3 d-none">
            <select
              className="form-select shadow"
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {getYears().map((year) => (
                <option key={year.year} value={year.year}>
                  {year.year}
                </option>
              ))}
            </select>
            {viewType === "monthly" && (
              <div>
                <label htmlFor="month">Select a month:</label>
                <select
                  className="form-select shadow"
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {getMonthsForYear(selectedYear).map((month) => (
                    <option key={month} value={month}>
                      {getMonthName(month)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {viewType === "weekly" && (
              <div>
                <label htmlFor="week">Select a week:</label>
                <select
                  className="form-select shadow"
                  id="week"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                >
                  {getWeekRanges(selectedYear, selectedMonth).map(
                    (week, index) => (
                      <option key={index} value={index + 1}>
                        {`Week ${index + 1} (${week.start}-${week.end})`}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
          </div> */}
          <div className="container-fluid d-flex align-items-center justify-content-between">
            <div className="mb-3">
              <select
                className={`${
                  darkMode
                    ? "form-select bg-white text-dark border-0 shadow"
                    : "form-select bg-dark text-white border-0 shadow"
                }`}
                id="viewType"
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
              >
                <option value="yearly">View Yearly Logs</option>
                <option value="monthly">View Monthly Logs</option>
                <option value="weekly">View Weekly Logs</option>
              </select>
            </div>
            <h6
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
                fontWeight: "normal",
              }}
            >
              {viewType === "monthly"
                ? "Monthly Logs"
                : viewType === "weekly"
                ? "Weekly Logs"
                : "Yearly Logs"}
            </h6>
          </div>
          {totals && (
            <div>
              <div className="row px-4 py-2 justify-content-between row-gap-4">
                {Object.entries(totals).map(([key, value]) => (
                  <div
                    key={key}
                    className={`align-items-center col-12 col-md-6 p-1`}
                  >
                    <div
                      style={{
                        background: darkMode
                          ? "var(--basecolor)"
                          : "var(--basecolor4)",
                      }}
                      className="d-flex align-items-center py-3 rounded-2"
                    >
                      <div className="col-8">
                        <p className="m-0">{`${key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}`}</p>
                        <h6 className="m-0 fw-normal">
                          {key === "totalWorkingHours"
                            ? minutesToTime(value) + " Hrs"
                            : `${value} Days`}
                        </h6>
                      </div>
                      <div className="col-4 d-flex justify-content-center align-items-center">
                        {key === "totalWorkingHours" && (
                          <span
                            className={`${
                              darkMode
                                ? "d-flex align-items-center  justify-content-center border-2  border border-black rounded-5"
                                : "d-flex align-items-center  justify-content-center border-2  border border-white text-white rounded-5"
                            }`}
                            style={{ height: "2rem", width: "2rem" }}
                          >
                            W
                          </span>
                        )}
                        {key === "totalPresent" && (
                          <span
                            className={`${
                              darkMode
                                ? "d-flex align-items-center  justify-content-center border-2  border border-black rounded-5"
                                : "d-flex align-items-center  justify-content-center border-2  border border-white text-white rounded-5"
                            }`}
                            style={{ height: "2rem", width: "2rem" }}
                          >
                            P
                          </span>
                        )}
                        {key === "totalAbsent" && (
                          <span
                            className={`${
                              darkMode
                                ? "d-flex align-items-center  justify-content-center border-2  border border-black rounded-5"
                                : "d-flex align-items-center  justify-content-center border-2  border border-white text-white rounded-5"
                            }`}
                            style={{ height: "2rem", width: "2rem" }}
                          >
                            A
                          </span>
                        )}
                        {key === "totalHalfDays" && (
                          <span
                            className={`${
                              darkMode
                                ? "d-flex align-items-center  justify-content-center border-2  border border-black rounded-5"
                                : "d-flex align-items-center  justify-content-center border-2  border border-white text-white rounded-5"
                            }`}
                            style={{ height: "2rem", width: "2rem" }}
                          >
                            H
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceDetails;
