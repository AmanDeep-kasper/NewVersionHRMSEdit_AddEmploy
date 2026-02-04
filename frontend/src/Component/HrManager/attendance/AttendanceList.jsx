import React, { useState, useEffect } from "react";
import axios from "axios";
import { TfiReload } from "react-icons/tfi";
import { FaCircleInfo } from "react-icons/fa6";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api";

const AttendanceDetails = (props) => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isInfoHovering, setIsInfoHovering] = useState(false);
  const { userData} = useSelector((state)=> state.user);

  const employeeId = userData?._id;
  const { darkMode } = useTheme();

  const handleMouseEnter = (date) => {
    setHoveredDate(date);
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const handleInfoMouseEnter = () => {
    setIsInfoHovering(true);
  };

  const handleInfoMouseLeave = () => {
    setIsInfoHovering(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get(
        `/api/employee/` + props.data["_id"],
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleFetchAttendance = async () => {
    try {
      const response = await api.get(
        `/api/attendance/${employeeId}`,
      );

      let singleUser = response.data.filter((val) => {
        return val.employeeObjID && val.employeeObjID._id === employeeId;
      });

      setAttendanceData(singleUser.length > 0 ? singleUser[0] : null);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };
  useEffect(() => {
    handleFetchAttendance();
  }, []);
  const getTotalHolidays = () => {
    if (
      attendanceData &&
      attendanceData.user &&
      attendanceData.user.holidayObjID
    ) {
      return attendanceData.user.holidayObjID.holidays.length;
    }
    return 0;
  };

  const getMonthName = (monthNumber) => {
    switch (monthNumber) {
      case 1:
        return "January";
      case 2:
        return "February";
      case 3:
        return "March";
      case 4:
        return "April";
      case 5:
        return "May";
      case 6:
        return "June";
      case 7:
        return "July";
      case 8:
        return "August";
      case 9:
        return "September";
      case 10:
        return "October";
      case 11:
        return "November";
      case 12:
        return "December";
      default:
        return "";
    }
  };

  const getMonthsForYear = (year) => {
    if (year === new Date().getFullYear()) {
      return Array.from({ length: new Date().getMonth() + 1 }, (_, i) => i + 1);
    }
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const getYears = () => {
    if (attendanceData && attendanceData.years) {
      const currentYear = new Date().getFullYear();
      return attendanceData.years.filter((year) => year.year <= currentYear);
    }
    return [];
  };

  const millisecondsToTime = (milliseconds) => {
    const millisecond = Math.floor(milliseconds);
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes % 60).padStart(2, "0");
    const formattedSeconds = String(seconds % 60).padStart(2, "0");
    const formattedMillisecond = String(millisecond % 60).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMillisecond}`;
  };

  const getAttendanceMark = (date) => {
    const loginTime = date && date.loginTime[0];
    if (loginTime) {
      const [loginHour, loginMinute] = loginTime.split(":").map(Number);
      if (loginHour > 9 || (loginHour === 9 && loginMinute > 45)) {
        return "H";
      } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
        return "L";
      }
    }
    return loginTime ? "P" : "A";
  };

  const TwoDigitDate = (date) => {
    return date.toString().padStart(2, "0");
  };

  function convertMinutesToHoursAndMinutes(minutes) {
    // Calculate hours
    var hours = Math.floor(minutes / 60);
    // Calculate remaining minutes
    var remainingMinutes = minutes % 60;

    return hours + " Hrs " + remainingMinutes + " Min";
  }

  // function convertMinutesToHoursAndMinutes(totalSeconds) {
  //   // Calculate hours
  //   var hours = Math.floor(totalSeconds / 3600);
  //   // Calculate remaining minutes
  //   var minutes = Math.floor(totalSeconds % 60);
  //   // Calculate remaining seconds
  //   var remainingSeconds = totalSeconds % 60;

  //   return `${hours}H: ${minutes} M: ${remainingSeconds} S`;
  // }
    

  // function convertMinutesToHoursAndMinutes(seconds) {
  //   // Calculate hours
  //    var hours = Math.floor(seconds / 60);
  //    // Calculate remaining minutes
  //    var minutes = Math.floor(seconds %  60);
  //    // Calculate remaining seconds
  //    var remainingSeconds = seconds % 60;

  //    return `${hours} Hrs ${minutes} Min ${remainingSeconds} Sec`; }

  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var( --primaryDashMenuColor)",
        maxHeight: "80vh",
        overflow: "auto",
      }}
      className="d-flex flex-column pb-5 py-3 container-fluid gap-3"
    >
      <div className="d-flex align-items-center justify-content-between">
        <h6>View Monthly Attendance</h6>
        {attendanceData && (
          <div className="d-flex gap-3">
            <div>
              {/* <label htmlFor="month">Month:</label> */}
              <select
                className="form-select shadow"
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {getMonthsForYear(selectedYear).map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="form-select shadow"
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {getYears().map((year) => (
                  <option key={year.year} value={year.year}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {attendanceData && (
        <div style={{ overflow: "auto", height: "80vh" }}>
            <div style={{
          // maxHeight: "68vh",
          overflow: "auto",
          position: "relative",
        }}
        className="table-responsive p-2 mb-3">  
          <table
            className="table"
            style={{ fontSize: ".9rem", position: "relative" }}
          >
            <thead>
              <tr className="shadow-sm">
                <th
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "pre",
                    background: darkMode
                      ? "var( --secondaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var( --primaryDashMenuColor)",
                    border: "none",
                    position: "sticky",
                    top: "-5px",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "pre",
                    background: darkMode
                      ? "var( --secondaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var( --primaryDashMenuColor)",
                    border: "none",
                    position: "sticky",
                    top: "-5px",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "pre",
                    background: darkMode
                      ? "var( --secondaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var( --primaryDashMenuColor)",
                    border: "none",
                    position: "sticky",
                    top: "-5px",
                  }}
                >
                  Login Time
                </th>
                <th
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "pre",
                    background: darkMode
                      ? "var( --secondaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var( --primaryDashMenuColor)",
                    border: "none",
                    position: "sticky",
                    top: "-5px",
                  }}
                >
                  Logout Time
                </th>
                <th
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "pre",
                    background: darkMode
                      ? "var( --secondaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var( --primaryDashMenuColor)",
                    border: "none",
                    position: "sticky",
                    top: "-5px",
                    zIndex: "10",
                  }}
                >
                  Total Break
                </th>
                <th
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "pre",
                    background: darkMode
                      ? "var( --secondaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var( --primaryDashMenuColor)",
                    border: "none",
                    position: "sticky",
                    top: "-5px",
                  }}
                >
                  Total Login
                </th>
                <th
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "pre",
                    background: darkMode
                      ? "var( --secondaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var( --primaryDashMenuColor)",
                    border: "none",
                    position: "sticky",
                    top: "-5px",
                  }}
                >
                  Log
                </th>
              </tr>
            </thead>
            <tbody>
              {getYears().map((year) =>
                year.months
                  .filter((month) => month.month === selectedMonth)
                  .map((month) =>
                    month.dates
                      .sort((a, b) => a.date - b.date)
                      .map((date) => (
                        <tr
                          className="shadow-sm"
                          key={date.date}
                          id={`attendance-row-${date.date}`}
                          onMouseEnter={() => handleMouseEnter(date.date)}
                          onMouseLeave={() => handleMouseLeave()}
                        >
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            {TwoDigitDate(date.date)}
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            {getAttendanceMark(date)}
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            <div className="d-flex gap-2 align-items-center">
                              <div
                                style={{ height: "20px", width: "20px" }}
                                className="rounded-0 btn btn-success d-flex align-items-center justify-content-center"
                              >
                                {date.loginTime.length}
                              </div>{" "}
                              {date.loginTime[0]}
                            </div>
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            {date.logoutTime[date.logoutTime.length - 1]}
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                            className="position-relative"
                          >
                            <div
                              style={{
                                display: "flex ",
                                justifyContent: "start",
                                alignItems: "center",
                              }}
                              className="fs-6 gap-2 "
                              onMouseEnter={handleInfoMouseEnter}
                              onMouseLeave={handleInfoMouseLeave}
                            >
                              {" "}
                              <div
                                style={{ height: "20px", width: "20px" }}
                                className="rounded-0 btn btn-warning d-flex align-items-center justify-content-center"
                              >
                                {date.breakTime.length}
                              </div>
                              <p className="p-0 m-0">
                                {convertMinutesToHoursAndMinutes(
                                  date.totalBrake
                                )}
                              </p>{" "}
                              <FaCircleInfo
                                style={{ fontSize: ".9rem" }}
                                className="text-info "
                              />
                            </div>

                            <div
                              style={{ zIndex: "5", right: "0%" }}
                              className="position-absolute"
                            >
                              {isInfoHovering &&
                                hoveredDate === date.date && ( // Check if info button is hovered and the date is the hovered date
                                  <table className="table table-bordered table-striped">
                                    <thead>
                                      <tr className="shadow-sm p-0">
                                        <th className="bg-info  py-0 text-white">
                                          Break
                                        </th>
                                        <th className="bg-info  py-0 text-white">
                                          Resume
                                        </th>
                                        <th
                                          className="text-end  py-0 bg-info text-white"
                                          style={{ whiteSpace: "pre" }}
                                        >
                                          Total Break
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {date.breakTime.map(
                                        (breakTime, index) => (
                                          <tr className="shadow-sm" key={index}>
                                            <td
                                              className="text-uppercase  py-1 text-center"
                                              style={{ whiteSpace: "pre" }}
                                            >
                                              {breakTime}
                                            </td>
                                            <td
                                              className="text-uppercase  py-1 text-center"
                                              style={{ whiteSpace: "pre" }}
                                            >
                                              {date.ResumeTime[index]}
                                            </td>
                                            <td
                                              className="text-end py-1 "
                                              style={{ whiteSpace: "pre" }}
                                            >
                                              {convertMinutesToHoursAndMinutes(
                                                date.BreakData[index]
                                              )}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                )}
                            </div>
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            {convertMinutesToHoursAndMinutes(
                              date.totalLogAfterBreak
                            )}
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            {date.status}
                          </td>
                        </tr>
                      ))
                  )
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
      {attendanceData === null && (
        <div
          style={{
            height: "80vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // wordSpacing: "5px",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="fs-2 fw-bolder">
            <TfiReload className="spinner-border text-info" />
          </div>
          <p className="text-muted">
            User not selected. To view data, please select a user.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceDetails;
