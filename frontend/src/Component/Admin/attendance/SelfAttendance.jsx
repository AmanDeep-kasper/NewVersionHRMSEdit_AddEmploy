import React, { useState, useEffect, memo } from "react";
import { TfiReload } from "react-icons/tfi";
import { FaCircleInfo } from "react-icons/fa6";
import api from "../../../Pages/config/api";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { GetDayFormatted } from "../../../Utils/GetDayFormatted";
import { useSelector } from "react-redux";

const SelfAttendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const { userData} = useSelector((state)=> state.user);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isInfoHovering, setIsInfoHovering] = useState(false);
  const empMail = userData?.Email;
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
    const handleFetchAttendance = async () => {
      try {
        const response = await api.get(`/api/attendance/${employeeId}`);
        let singleUser = response.data.filter((val) => {
          return val.employeeObjID && val.employeeObjID.Email === empMail;
        });

        setAttendanceData(() => {
          return singleUser.length > 0 ? singleUser[0] : null;
        });
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    handleFetchAttendance();
  }, [employeeId, empMail]);

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

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const getAttendanceMark = (date) => {
    const loginTime = date && date.loginTime[0];
    if (loginTime) {
      const [loginHour, loginMinute] = loginTime.split(":").map(Number);
      if (loginHour > 9 || (loginHour === 9 && loginMinute > 45)) {
        return "Half Day";
      } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
        return "Late";
      }
    }
    return loginTime ? "Present" : "Absent";
  };

  const twoDigit = (data) => {
    return data.toString().padStart(2, 0);
  };

  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "100",
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--primaryDashMenuColor)",
    border: "none",
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex align-items-center justify-content-between my-2">
        <div>
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
            className=" my-auto"
          >
            Attendance
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
            className=" my-auto"
          >
            You can view your attendance here.
          </p>
        </div>

        {attendanceData && (
          <div className="d-flex gap-3">
            <div>
              <select
                className="form-select rounded-0 shadow"
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
            <div>
              <select
                className="form-select rounded-0 shadow"
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
          </div>
        )}
      </div>

      {attendanceData && (
        <div style={{ overflow: "auto", height: "76vh" }}>
            <div style={{
          // maxHeight: "68vh",
          overflow: "auto",
          position: "relative",
        }}
        className="table-responsive p-2 mb-3">  
          <table className="table">
            <thead>
              <tr className="shadow-sm">
                <th style={rowHeadStyle}>Date | Day</th>
                <th style={rowHeadStyle}>Status</th>
                <th style={rowHeadStyle}>Login Time</th>
                <th style={rowHeadStyle}>Logout Time</th>
                <th style={rowHeadStyle}>Logout Count</th>
                <th style={rowHeadStyle}>Break Count</th>
                <th style={rowHeadStyle}>Break</th>
                <th style={rowHeadStyle}>Total Login</th>
                <th style={rowHeadStyle}>Status</th>
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
                          id={`attendance-row-${date.date}`} // Assign unique ID to each row
                          onMouseEnter={() => handleMouseEnter(date.date)}
                          onMouseLeave={() => handleMouseLeave()}
                        >
                          <td style={rowBodyStyle}>
                            <div className="d-flex align-items-center gap-1">
                              <span
                                style={{
                                  height: "40px",
                                  width: "40px",
                                  border: darkMode
                                    ? "1px solid var(--primaryDashColorDark)"
                                    : "1px solid var(--primaryDashMenuColor)",
                                }}
                                className=" d-flex align-items-center justify-content-center"
                              >
                                {twoDigit(date.date)}
                              </span>
                              <span
                                style={{
                                  height: "40px",
                                  width: "50px",
                                  border: darkMode
                                    ? "1px solid var(--primaryDashColorDark)"
                                    : "1px solid var(--primaryDashMenuColor)",
                                }}
                                className="d-flex align-items-center justify-content-center"
                              >
                                {GetDayFormatted(date.day)}
                              </span>
                            </div>
                          </td>
                          <td style={rowBodyStyle}>
                            {getAttendanceMark(date)}
                          </td>
                          <td style={rowBodyStyle}>{date.loginTime[0]}</td>
                          <td style={rowBodyStyle}>
                            {date.logoutTime[date.logoutTime.length - 1]}
                          </td>
                          <td style={rowBodyStyle}>{date.loginTime.length}</td>
                          <td style={rowBodyStyle}>{date.breakTime.length}</td>
                          <td
                            className="position-relative"
                            style={rowBodyStyle}
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
                              <span
                                style={{ scale: "0.7" }}
                                className="bg-warning py-0  text-white  px-2 rounded-5 my-auto"
                              >
                                {date.breakTime.length}
                              </span>
                              <span className="fs-6">
                                {millisecondsToTime(date.totalBrake)}
                              </span>{" "}
                              <FaCircleInfo
                                style={{ fontSize: ".9rem" }}
                                className="text-info "
                              />
                            </div>

                            <div
                              style={{ zIndex: "5", right: "0%" }}
                              className="position-absolute"
                            >
                              {isInfoHovering && hoveredDate === date.date && (
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
                                    {date.breakTime.map((breakTime, index) => (
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
                                          {millisecondsToTime(
                                            date.BreakData[index]
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                          <td style={rowBodyStyle}>
                            {millisecondsToTime(date.totalLogAfterBreak)}
                          </td>
                          <td style={rowBodyStyle}>{date.status}</td>
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
            wordSpacing: "5px",
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

export default memo(SelfAttendance);

