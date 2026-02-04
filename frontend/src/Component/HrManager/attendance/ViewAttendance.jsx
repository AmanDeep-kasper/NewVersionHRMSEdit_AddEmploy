
import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";
import SearchDark from "../../../img/Attendance/SearchDark.svg";
import SearchLight from "../../../img/Attendance/SearchLight.svg";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { convertToAmPm, getMonthName } from "../../../Utils/GetDayFormatted";
import { MdOutlineTimelapse, MdOutlineWbSunny } from "react-icons/md";
import { TbStatusChange } from "react-icons/tb";
import { GoArrowRight, GoHash } from "react-icons/go";
import { IoIosCloseCircleOutline, IoIosTimer, IoMdTimer } from "react-icons/io";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import AttendanceLogsPopover from "./SelfAttendanceComponents/AttendanceLogsPopover";
import BreakLogsPopover from "./SelfAttendanceComponents/BreakLogsPopover";
import api from "../../../Pages/config/api";

const AttendanceDetails = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const { darkMode } = useTheme();
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isInfoHovering, setIsInfoHovering] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const UserType = userData?.Account;
  const Email = userData?.Email;
  const handleClose = () => setIsInfoHovering(false);
const [loading, setLoading] = useState(false);


  // console.log("Attendance Data:", attendanceData);

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
      const response = await api.get(`/api/employee`, {
      });

      if (UserType === 1) {
        setEmployees(response.data);
      } else if (UserType === 2) {
        setEmployees(response.data.filter((data) => data.Account !== 1));
      } else if (UserType === 3) {
        setEmployees([]);
      } else if (UserType === 4) {
        setEmployees(
          response.data.filter((data) => data.reportManager === Email)
        );
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleEmployeeChange = (event) => {
    setEmployeeId(event.target.value);
  };

  // const handleFetchAttendance = async () => {
  //   try {
  //     const response = await api.get(
  //       `/api/attendance/${employeeId}`,
  //     );

  //     // let singleUser = response.data.filter((val) => {
  //     //   return val.employeeObjID && val.employeeObjID._id === employeeId;
  //     // });

  //     // setAttendanceData(singleUser.length > 0 ? singleUser[0] : null);

  //     setAttendanceData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching attendance data:", error);
  //   }
  // };
const handleFetchAttendance = async () => {
  try {
    setLoading(true);  // start loading

    const response = await api.get(`/api/attendance/${employeeId}`);

    setAttendanceData(response.data);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
  } finally {
    setLoading(false); // stop loading always
  }
};

  const getMonthsForYear = (year) => {
    if (year === new Date().getFullYear()) {
      return Array.from({ length: new Date().getMonth() + 1 }, (_, i) => i + 1);
    }
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const getYears = () => {
    // Handle new API response structure: attendance is nested
    const attendanceRecord = attendanceData?.attendance || attendanceData;
    
    if (attendanceRecord && attendanceRecord.years) {
      const currentYear = new Date().getFullYear();
      return attendanceRecord.years.filter((year) => year.year <= currentYear);
    }
    return [];
  };

  const getAttendanceMark = (date) => {
    //  Guard clauses — missing data → Absent
    if (!date || !date.loginTime || !date.shifts || !date.shifts.startTime) {
      return (
        <span className={darkMode ? "badge-danger border" : "badge-success-dark"}>
          Absent
        </span>
      );
    }

    //Parse inputs --------------------------------------------------------
    const totalLogAfterBreak = date.totalLogAfterBreak
      ? parseInt(date.totalLogAfterBreak, 10)
      : 0;

    const loginTime = date.loginTime[0];
    const { startTime } = date.shifts;

    // special codes (NCNS, Sandwich, Leave, …) ---------------------------------
    if (date.isForcedAbsent)
      return (
        <span className={darkMode ? "badge-danger border" : "badge-danger-dark"}>
          Absent
        </span>
      );
    if (date.isNCNS)
      return (
        <span className={darkMode ? "badge-danger border" : "badge-danger-dark"}>
          NCNS
        </span>
      );
    if (date.isSandwhich)
      return (
        <span className={darkMode ? "badge-danger border" : "badge-danger-dark"}>
          Sandwich
        </span>
      );
    if (loginTime === "LV")
      return (
        <span className={darkMode ? "badge-info border" : "badge-info-dark"}>
          On Leave
        </span>
      );
    if (loginTime === "WO")
      return (
        <span className={darkMode ? "badge-primary border" : "badge-primary-dark"}>
          Week off
        </span>
      );
    if (loginTime === "HD")
      return (
        <span className={darkMode ? "badge-primary border" : "badge-primary-dark"}>
          Holiday
        </span>
      );

    //Validate & convert the HH:MM strings to minutes ---------------------
    if (typeof loginTime !== "string" || typeof startTime !== "string")
      return (
        <span className={darkMode ? "badge-danger border" : "badge-danger-dark"}>
          Absent
        </span>
      );

    const [lH, lM] = loginTime.split(":").map(Number);
    const [sH, sM] = startTime.split(":").map(Number);
    if ([lH, lM, sH, sM].some((x) => Number.isNaN(x)))
      return (
        <span className={darkMode ? "badge-danger border" : "badge-danger-dark"}>
          Absent
        </span>
      );

    const loginMin = lH * 60 + lM;
    const shiftStartMin = sH * 60 + sM;
    const lateThreshold = shiftStartMin + 15; // 15‑minute grace

    //Business rules ------------------------------------------------------

    // — A — Worked ≥ 7 h 45 m
    if (totalLogAfterBreak >= 465) {
      if (loginMin <= shiftStartMin) {
        // on or before shift start
        return (
          <span className={darkMode ? "badge-success" : "badge-success-dark"}>
            On Time
          </span>
        );
      }
      if (loginMin <= lateThreshold) {
        // within grace, still Present
        return (
          <span className={darkMode ? "badge-info border" : "badge-info-dark"}>
            Late
          </span>
        );
      }
      // beyond grace ⇒ Half Day even though hours are enough
      return (
        <span className={darkMode ? "badge-warning border" : "badge-warning-dark"}>
          Half Day
        </span>
      );
    }

    // — B — Worked 4 h to < 7 h 45 m ⇒ Half Day
    if (totalLogAfterBreak >= 240) {
      return (
        <span className={darkMode ? "badge-warning border" : "badge-warning-dark"}>
          Half Day
        </span>
      );
    }

    // — C — Worked < 4 h ⇒ Absent
    return (
      <span className={darkMode ? "badge-danger border" : "badge-danger-dark"}>
        Absent
      </span>
    );
  };


  const GetDay = (s) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[s];
  };

  function convertMinutesToHMS(totalSeconds) {
    if (totalSeconds < 0) {
      return "0 Hrs 0 Min";
    }

    var hours = Math.floor(totalSeconds / 60);
    var remainingMinutes = totalSeconds % 60;

    return hours + " Hrs " + remainingMinutes + " Min";
  }


  return (
    <div className="container-fluid d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between my-2">
        <TittleHeader
          title={"Employee Wise Attendance."}
          message={"You can view attendance by employee here."}
        />
        <div className="d-flex gap-3 justify-content-start justify-content-md-end my-auto">
          <div>
            <select
              className={`form-select ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
                }`}
              id="employeeId"
              value={employeeId}
              onChange={handleEmployeeChange}
            >
              <option
                value=""
                disabled
                className={
                  darkMode ? "bg-light text-dark" : "bg-dark text-light"
                }
              >
                --Select Employee--
              </option>

              {employees
                .sort((a, b) => a.empID - b.empID)
                .filter((data) => data.status === "active")
                .map((employee) => (
                  <option
                    className={
                      darkMode ? "bg-light text-dark" : "bg-dark text-light"
                    }
                    key={employee._id}
                    value={employee._id}
                  >
                    {employee.empID} → {employee.FirstName.toUpperCase()}{" "}
                    {employee.LastName.toUpperCase()}
                  </option>
                ))}
              {employees
                .sort((a, b) => a.empID - b.empID)
                .filter((data) => data.status !== "active")
                .map((employee) => (
                  <option
                    className={
                      darkMode ? "bg-light text-dark" : "bg-dark text-light"
                    }
                    key={employee._id}
                    value={employee._id}
                  >
                    {employee.empID} → {employee.FirstName.toUpperCase()}{" "}
                    {employee.LastName.toUpperCase()} - {employee.status}
                  </option>
                ))}
            </select>
          </div>
          {/* 
          <button
            className={`btn my-auto rounded-2  btn-primary`}
            style={{ width: "fit-content" }}
            onClick={handleFetchAttendance}
            disabled={!employeeId}
          >
            Fetch Attendance
          </button> */}

          <button
  className="btn my-auto rounded-2 btn-primary d-flex align-items-center gap-2"
  style={{ width: "fit-content" }}
  onClick={handleFetchAttendance}
  disabled={!employeeId || loading}
>
  {loading ? (
    <>
      <span className="spinner-border spinner-border-sm"></span>
      Loading...
    </>
  ) : (
    "Fetch Attendance"
  )}
</button>

        </div>
      </div>

      {attendanceData && (
        <div
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="d-flex gap-3"
        >
          <div className="d-flex align-items-center gap-2">
            <label
              style={{ whiteSpace: "pre" }}
              className="my-auto"
              htmlFor="year"
            >
              Select Year:
            </label>
            <select
              className={`form-select ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
                }`}
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
          <div className="d-flex align-items-center gap-2">
            <label
              style={{ whiteSpace: "pre" }}
              className="my-auto"
              htmlFor="month"
            >
              Select Month:
            </label>
            <select
              className={`form-select ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
                }`}
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

      {attendanceData && (
        <div>
          <div
            style={{
              height: "fit-content",
              maxHeight: "75vh",
              overflow: "auto",
              position: "relative",
              border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
            }}
            className="scroller mb-2 rounded-2"
          >
            <table className="table mb-0 table-hover">
              <thead>
                <tr style={{ position: "sticky", top: "0", zIndex: "3" }}>
                  <th style={rowHeadStyle(darkMode)}>
                    <MdOutlineWbSunny /> Date | Day
                  </th>
                  <th style={rowHeadStyle(darkMode)}>
                    <MdOutlineWbSunny /> Shift
                  </th>
                  <th style={rowHeadStyle(darkMode)}>
                    <TbStatusChange /> Status
                  </th>
                  <th style={rowHeadStyle(darkMode)}>
                    <HiOutlineLogin />
                    Login Time
                  </th>
                  <th style={rowHeadStyle(darkMode)}>
                    <HiOutlineLogout /> Logout Time
                  </th>
                  <th style={rowHeadStyle(darkMode)}>
                    <GoHash /> logs
                  </th>
                  <th style={rowHeadStyle(darkMode)}>
                    <IoIosTimer /> Gross Login
                  </th>
                  <th style={rowHeadStyle(darkMode)}>
                    <GoHash /> Breaks
                  </th>
                  <th style={rowHeadStyle(darkMode)}>
                    <IoMdTimer />
                    Total Break
                  </th>
                  <th style={rowHeadStyle(darkMode)}>
                    <MdOutlineTimelapse />
                    Net Login
                  </th>
                </tr>
              </thead>
              <hr className="m-0 py-1" style={{ opacity: "0" }} />
              <tbody>
                {getYears().map((year) =>
                  year.months
                    .filter((month) => month.month === selectedMonth)
                    .map((month) =>
                      month.dates
                        .sort((a, b) => a.date - b.date)
                        .map((date) => {
                          return (
                            <tr
                              key={date.date}
                              id={`attendance-row-${date.date}`}
                              onMouseEnter={() => handleMouseEnter(date.date)}
                              onMouseLeave={() => handleMouseLeave()}
                            >
                              <td style={rowBodyStyle(darkMode)}>
                                <div className="d-flex align-items-center gap-1">
                                  {" "}
                                  <span
                                    className=" d-flex btn align-items-center justify-content-center rounded-0"
                                    style={{
                                      height: "30px",
                                      width: "30px",
                                      color: darkMode
                                        ? "var(--primaryDashColorDark)"
                                        : "var( --primaryDashMenuColor)",
                                    }}
                                  >
                                    {String(date.date).padStart(2, "0")}
                                  </span>{" "}
                                  <span
                                    className="py-0 btn  d-flex align-items-center justify-content-center rounded-0"
                                    style={{
                                      height: "30px",
                                      width: "45px",
                                      color: darkMode
                                        ? "var(--primaryDashColorDark)"
                                        : "var( --primaryDashMenuColor)",
                                    }}
                                  >
                                    {" "}
                                    {GetDay(date.day)}
                                  </span>
                                </div>
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                <span
                                  style={{ width: "fit-content" }}
                                  className={`py-1 px-2 d-flex align-items-center  gap-2 ${darkMode
                                    ? "badge-primary"
                                    : "badge-primary-dark"
                                    }`}
                                >
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-warning"
                                        : "badge-warning-dark"
                                    }
                                  >
                                    {" "}
                                    {date.shifts.name} :
                                  </span>
                                  <span>
                                    {convertToAmPm(date.shifts.startTime)}{" "}
                                  </span>
                                  <GoArrowRight />
                                  <span>
                                    {convertToAmPm(date.shifts.endTime)}
                                  </span>
                                </span>
                              </td>
                              <td
                                style={rowBodyStyle(darkMode)}
                                className="text-start"
                              >
                                {getAttendanceMark(date)}
                              </td>
                              <td
                                style={rowBodyStyle(darkMode)}
                                className="text-uppercase"
                              >
                                {date.loginTime[0] === "LV" ? (
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-info border text-capitalize"
                                        : "badge-info-dark text-capitalize"
                                    }
                                  >
                                    On Leave
                                  </span>
                                ) : date.loginTime[0] === "WO" ? (
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-primary border text-capitalize"
                                        : "badge-primary-dark text-capitalize"
                                    }
                                  >
                                    Week off
                                  </span>
                                ) : date.loginTime[0] === "HD" ? (
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-primary border text-capitalize"
                                        : "badge-primary-dark  text-capitalize"
                                    }
                                  >
                                    Holiday
                                  </span>
                                ) : date.isNCNS === true ? (
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-danger border text-capitalize"
                                        : "badge-danger-dark text-capitalize"
                                    }
                                  >
                                    NCNS
                                  </span>
                                ) : date.isSandwhich === true ? (
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-danger border text-capitalize"
                                        : "badge-danger-dark text-capitalize"
                                    }
                                  >
                                    Sandwich
                                  </span>
                                ) : date.loginTime[0] ? (
                                  convertToAmPm(date.loginTime[0])
                                ) : (
                                  "--"
                                )}
                              </td>
                              <td
                                style={rowBodyStyle(darkMode)}
                                className="text-uppercase"
                              >
                                {date.logoutTime[date.logoutTime.length - 1] ===
                                  "LV" ? (
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-info border text-capitalize"
                                        : "badge-info-dark text-capitalize"
                                    }
                                  >
                                    On Leave
                                  </span>
                                ) : date.logoutTime[
                                  date.logoutTime.length - 1
                                ] === "WO" ? (
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-primary border text-capitalize"
                                        : "badge-primary-dark text-capitalize"
                                    }
                                  >
                                    Week off
                                  </span>
                                ) : date.logoutTime[
                                  date.logoutTime.length - 1
                                ] === "HD" ? (
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-primary border text-capitalize"
                                        : "badge-primary-dark text-capitalize"
                                    }
                                  >
                                    Holiday
                                  </span>
                                ) : date.isNCNS === true ? (
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-danger border text-capitalize"
                                        : "badge-danger-dark text-capitalize"
                                    }
                                  >
                                    NCNS
                                  </span>
                                ) : date.isSandwhich === true ? (
                                  <span
                                    className={
                                      darkMode
                                        ? "badge-danger border text-capitalize"
                                        : "badge-danger-dark text-capitalize"
                                    }
                                  >
                                    Sandwich
                                  </span>
                                ) : date.logoutTime[
                                  date.logoutTime.length - 1
                                ] ? (
                                  convertToAmPm(
                                    date.logoutTime[date.logoutTime.length - 1]
                                  )
                                ) : (
                                  "--"
                                )}
                              </td>
                              <td
                                style={rowBodyStyle(darkMode)}
                                className="position-relative"
                              >

                                <AttendanceLogsPopover
                                  date={date}
                                  darkMode={darkMode}
                                  convertMinutesToHMS={convertMinutesToHMS}
                                />


                                {/* <div
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
                                    className="py-0 "
                                    style={{
                                      color: darkMode
                                        ? "var(--primaryDashColorDark)"
                                        : "var( --primaryDashMenuColor)",
                                    }}
                                  >
                                    {" "}
                                    {date.loginTime.length}
                                  </span>
                                </div> 
                                <div
                                  style={{
                                    zIndex: "5",
                                    right: "100%",
                                    maxHeight: "30vh",
                                    overflow: "auto",
                                    top: "0",
                                  }}
                                  className="position-absolute"
                                >
                                  {isInfoHovering &&
                                    hoveredDate === date.date && (
                                      <table className="table table-bordered table-striped">
                                        <thead>
                                          <tr>
                                            <th
                                              style={rowHeadStyle(darkMode)}
                                              className="text-capitalize text-center"
                                            >
                                              Login
                                            </th>
                                            <th
                                              style={rowHeadStyle(darkMode)}
                                              className="text-capitalize text-center"
                                            >
                                              Logout
                                            </th>
                                            <th
                                              style={rowHeadStyle(darkMode)}
                                              className="text-capitalize text-center"
                                            >
                                              Total Login
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {date.loginTime.map(
                                            (loginTime, index) => (
                                              <tr key={index}>
                                                <td
                                                  style={rowBodyStyle(darkMode)}
                                                  className="text-center"
                                                >
                                                  {loginTime ? loginTime : "--"}
                                                </td>
                                                <td
                                                  style={rowBodyStyle(darkMode)}
                                                  className="text-center"
                                                >
                                                  {date.logoutTime[index]
                                                    ? date.logoutTime[index]
                                                    : "--"}
                                                </td>
                                                <td
                                                  style={rowBodyStyle(darkMode)}
                                                  className="text-capitalize text-center"
                                                >
                                                  {date.LogData[index]
                                                    ? convertMinutesToHMS(
                                                      date.LogData[index]
                                                    )
                                                    : "--"}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    )}
                                </div> */}
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                {convertMinutesToHMS(date.TotalLogin)}
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                <BreakLogsPopover
                                  date={{
                                    ...date,
                                    // Ensure resumeTime always present, fallback to ResumeTime if needed
                                    resumeTime: Array.isArray(date.resumeTime) && date.resumeTime.length > 0
                                      ? date.resumeTime
                                      : (Array.isArray(date.ResumeTime) ? date.ResumeTime : []),
                                  }}
                                  darkMode={darkMode}
                                  convertMinutesToHMS={convertMinutesToHMS}
                                />
                                {/* <span
                                  className="py-0 "
                                  style={{
                                    color: darkMode
                                      ? "var(--primaryDashColorDark)"
                                      : "var( --primaryDashMenuColor)",
                                  }}
                                >
                                  {" "}
                                  {date.breakTime.length}
                                </span> */}
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                {convertMinutesToHMS(date.totalBrake)}
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                {convertMinutesToHMS(date.totalLogAfterBreak)}
                              </td>
                            </tr>
                          );
                        })
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
            gap: "2rem",
          }}
        >
          <img
            style={{
              height: "auto",
              width: "20%",
            }}
            src={darkMode ? SearchDark : SearchLight}
            alt="img"
          />
          <p
            className="text-center w-75 mx-auto"
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var( --primaryDashMenuColor)",
            }}
          >
            User not selected. To view data, please select a user.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceDetails;




// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Card } from "react-bootstrap";
// import {
//   HiOutlineLogin,
//   HiOutlineLogout
// } from "react-icons/hi";
// import { MdOutlineTimelapse, MdOutlineWbSunny } from "react-icons/md";
// import { TbStatusChange } from "react-icons/tb";
// import { GoArrowRight, GoHash } from "react-icons/go";
// import { IoIosTimer, IoMdTimer } from "react-icons/io";
// import { useTheme } from "../../../Context/TheamContext/ThemeContext";
// import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
// import { convertToAmPm, getMonthName } from "../../../Utils/GetDayFormatted";
// import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
// import AttendanceLogsPopover from "./SelfAttendanceComponents/AttendanceLogsPopover";
// import BreakLogsPopover from "./SelfAttendanceComponents/BreakLogsPopover";
// import SearchDark from "../../../img/Attendance/SearchDark.svg";
// import SearchLight from "../../../img/Attendance/SearchLight.svg";
// import api from "../../../Pages/config/api";

// const AttendanceDetails = () => {
//   const { darkMode } = useTheme();
//   const { userData } = useSelector((state) => state.user);
//   const UserType = userData?.Account;
//   const Email = userData?.Email;

//   const [employeeId, setEmployeeId] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [attendanceData, setAttendanceData] = useState(null);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

//   const [hoveredDate, setHoveredDate] = useState(null);
//   const [isInfoHovering, setIsInfoHovering] = useState(false);

//   // Fetch employees
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await api.get("/api/employee");

//         if (UserType === 1) setEmployees(response.data);
//         else if (UserType === 2)
//           setEmployees(response.data.filter((data) => data.Account !== 1));
//         else if (UserType === 3) setEmployees([]);
//         else if (UserType === 4)
//           setEmployees(response.data.filter((data) => data.reportManager === Email));
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };
//     fetchEmployees();
//   }, [UserType, Email]);

//   const handleEmployeeChange = (e) => setEmployeeId(e.target.value);

//   const handleFetchAttendance = async () => {
//     if (!employeeId) return;
//     try {
//       const response = await api.get(`/api/attendance/${employeeId}`);
//       setAttendanceData(response.data);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//     }
//   };

//   const getYears = () => attendanceData?.years?.filter((y) => y.year <= new Date().getFullYear()) || [];

//   const getMonthsForYear = (year) => {
//     if (year === new Date().getFullYear())
//       return Array.from({ length: new Date().getMonth() + 1 }, (_, i) => i + 1);
//     return Array.from({ length: 12 }, (_, i) => i + 1);
//   };

//   const GetDay = (s) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][s];

//   const convertMinutesToHMS = (totalMinutes) => {
//     if (!totalMinutes || totalMinutes < 0) return "0 Hrs 0 Min";
//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = totalMinutes % 60;
//     return `${hours} Hrs ${minutes} Min`;
//   };

//   const getAttendanceMark = (date) => {
//     if (!date || !date.loginTime || !date.shifts?.startTime) return badge("Absent", "danger");

//     const totalLogAfterBreak = parseInt(date.totalLogAfterBreak || 0, 10);
//     const loginTime = date.loginTime[0];
//     const { startTime } = date.shifts;

//     if (date.isForcedAbsent) return badge("Absent", "danger");
//     if (date.isNCNS) return badge("NCNS", "danger");
//     if (date.isSandwhich) return badge("Sandwich", "danger");
//     if (loginTime === "LV") return badge("On Leave", "info");
//     if (loginTime === "WO") return badge("Week off", "primary");
//     if (loginTime === "HD") return badge("Holiday", "primary");

//     const [lH, lM] = loginTime.split(":").map(Number);
//     const [sH, sM] = startTime.split(":").map(Number);
//     if ([lH, lM, sH, sM].some((x) => Number.isNaN(x))) return badge("Absent", "danger");

//     const loginMin = lH * 60 + lM;
//     const shiftStartMin = sH * 60 + sM;
//     const lateThreshold = shiftStartMin + 15;

//     if (totalLogAfterBreak >= 465) {
//       if (loginMin <= shiftStartMin) return badge("On Time", "success");
//       if (loginMin <= lateThreshold) return badge("Late", "info");
//       return badge("Half Day", "warning");
//     }

//     if (totalLogAfterBreak >= 240) return badge("Half Day", "warning");
//     return badge("Absent", "danger");
//   };

//   const badge = (text, type) => (
//     <span className={`badge-${type} ${darkMode ? "" : "-dark"} border`}>{text}</span>
//   );

//   return (
//     <div className="container-fluid d-flex flex-column gap-3">
//       <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between my-2">
//         <TittleHeader title="Employee Wise Attendance." message="You can view attendance by employee here." />
//         <div className="d-flex gap-3 justify-content-start justify-content-md-end my-auto">
//           <select
//             className={`form-select rounded-2 ${darkMode ? "bg-light text-dark border dark-placeholder" : "bg-dark text-light border-0 light-placeholder"}`}
//             value={employeeId}
//             onChange={handleEmployeeChange}
//           >
//             <option value="" disabled>--Select Employee--</option>
//             {employees
//               .sort((a, b) => a.empID - b.empID)
//               .map((emp) => (
//                 <option key={emp._id} value={emp._id}>
//                   {emp.empID} → {emp.FirstName.toUpperCase()} {emp.LastName.toUpperCase()} {emp.status !== "active" ? `- ${emp.status}` : ""}
//                 </option>
//               ))}
//           </select>
//           <button className="btn btn-primary rounded-2" onClick={handleFetchAttendance} disabled={!employeeId}>
//             Fetch Attendance
//           </button>
//         </div>
//       </div>

//       {attendanceData && (
//         <div className="d-flex gap-3" style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)" }}>
//           <div className="d-flex align-items-center gap-2">
//             <label>Select Year:</label>
//             <select className={`form-select rounded-2 ${darkMode ? "bg-light text-dark border dark-placeholder" : "bg-dark text-light border-0 light-placeholder"}`} value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
//               {getYears().map((year) => <option key={year.year} value={year.year}>{year.year}</option>)}
//             </select>
//           </div>
//           <div className="d-flex align-items-center gap-2">
//             <label>Select Month:</label>
//             <select className={`form-select rounded-2 ${darkMode ? "bg-light text-dark border dark-placeholder" : "bg-dark text-light border-0 light-placeholder"}`} value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
//               {getMonthsForYear(selectedYear).map((month) => <option key={month} value={month}>{getMonthName(month)}</option>)}
//             </select>
//           </div>
//         </div>
//       )}

//       {attendanceData ? (
//         <div style={{ maxHeight: "75vh", overflow: "auto", border: darkMode ? "var(--borderLight)" : "var(--borderDark)" }} className="scroller mb-2 rounded-2">
//           <table className="table mb-0 table-hover">
//             <thead>
//               <tr style={{ position: "sticky", top: 0, zIndex: 3 }}>
//                 <th style={rowHeadStyle(darkMode)}><MdOutlineWbSunny /> Date | Day</th>
//                 <th style={rowHeadStyle(darkMode)}><MdOutlineWbSunny /> Shift</th>
//                 <th style={rowHeadStyle(darkMode)}><TbStatusChange /> Status</th>
//                 <th style={rowHeadStyle(darkMode)}><HiOutlineLogin /> Login Time</th>
//                 <th style={rowHeadStyle(darkMode)}><HiOutlineLogout /> Logout Time</th>
//                 <th style={rowHeadStyle(darkMode)}><GoHash /> logs</th>
//                 <th style={rowHeadStyle(darkMode)}><IoIosTimer /> Gross Login</th>
//                 <th style={rowHeadStyle(darkMode)}><GoHash /> Breaks</th>
//                 <th style={rowHeadStyle(darkMode)}><IoMdTimer /> Total Break</th>
//                 <th style={rowHeadStyle(darkMode)}><MdOutlineTimelapse /> Net Login</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getYears().map((year) =>
//                 year.months.filter((m) => m.month === selectedMonth).map((month) =>
//                   month.dates.sort((a, b) => a.date - b.date).map((date) => (
//                     <tr key={date.date}>
//                       <td style={rowBodyStyle(darkMode)}>
//                         <div className="d-flex gap-1 align-items-center">
//                           <span className="btn d-flex justify-content-center align-items-center" style={{ width: 30, height: 30, color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)" }}>{String(date.date).padStart(2, "0")}</span>
//                           <span className="btn d-flex justify-content-center align-items-center" style={{ width: 45, height: 30, color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)" }}>{GetDay(date.day)}</span>
//                         </div>
//                       </td>
//                       <td style={rowBodyStyle(darkMode)}>
//                         <span className={`d-flex align-items-center gap-2 py-1 px-2 ${darkMode ? "badge-primary" : "badge-primary-dark"}`}>
//                           <span className={darkMode ? "badge-warning" : "badge-warning-dark"}>{date.shifts.name} :</span>
//                           <span>{convertToAmPm(date.shifts.startTime)}</span> <GoArrowRight /> <span>{convertToAmPm(date.shifts.endTime)}</span>
//                         </span>
//                       </td>
//                       <td style={rowBodyStyle(darkMode)}>{getAttendanceMark(date)}</td>
//                       <td style={rowBodyStyle(darkMode)}>{convertToAmPm(date.loginTime[0])}</td>
//                       <td style={rowBodyStyle(darkMode)}>{convertToAmPm(date.logoutTime[date.logoutTime.length - 1])}</td>
//                       <td style={rowBodyStyle(darkMode)}>
//                         <AttendanceLogsPopover date={date} darkMode={darkMode} convertMinutesToHMS={convertMinutesToHMS} />
//                       </td>
//                       <td style={rowBodyStyle(darkMode)}>{convertMinutesToHMS(date.TotalLogin)}</td>
//                       <td style={rowBodyStyle(darkMode)}>
//                         <BreakLogsPopover date={{ ...date, resumeTime: date.resumeTime || date.ResumeTime || [] }} darkMode={darkMode} convertMinutesToHMS={convertMinutesToHMS} />
//                       </td>
//                       <td style={rowBodyStyle(darkMode)}>{convertMinutesToHMS(date.totalBrake)}</td>
//                       <td style={rowBodyStyle(darkMode)}>{convertMinutesToHMS(date.totalLogAfterBreak)}</td>
//                     </tr>
//                   ))
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div style={{ height: "80vh", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
//           <img src={darkMode ? SearchDark : SearchLight} alt="search" style={{ width: "20%", height: "auto" }} />
//           <p className="text-center w-75" style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--primaryDashMenuColor)" }}>
//             User not selected. To view data, please select a user.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceDetails;
