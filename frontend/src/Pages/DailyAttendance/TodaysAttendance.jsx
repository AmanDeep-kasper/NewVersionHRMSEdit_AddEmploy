
import { useState, useEffect, useMemo } from "react";
import { RxCounterClockwiseClock } from "react-icons/rx";
import SearchLight from "../../img/Attendance/SearchLight.svg";
import {
  HiOutlineLogin,
  HiOutlineLogout,
  HiStatusOnline,
} from "react-icons/hi";
import { FaUserClock } from "react-icons/fa6";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import Pagination from "../../Utils/Pagination";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import Modal from "react-modal";
import { convertToAmPm } from "../../Utils/GetDayFormatted";
import { useSelector } from "react-redux";
import api from "../config/api";

const TodaysAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { darkMode } = useTheme();
  const [selectedFields, setSelectedFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userData } = useSelector((state) => state.user);

  const UserType = userData?.Account;
  const userEmail = userData?.Email;

  console.log(attendanceData)

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await api.get(`/api/todays-attendance`, {
          params: { page: 1, limit: 100 }
        });
        const responseData = response.data?.data || response.data || [];

        let visibleData = [];

        if (UserType === 1) {
          visibleData = responseData;
        } else if (UserType === 2) {
          visibleData = responseData.filter((user) => user.Account !== 1);
        } else if (UserType === 4) {
          visibleData = responseData.filter((user) => user.reportManager === userEmail);
        }

        setAttendanceData(visibleData);
      } catch (error) {
        console.error("Error fetching today's attendance data:", error);
        setAttendanceData([]); // Set empty array on error
      }
    };

    fetchAttendanceData();
  }, [UserType, userEmail]);

  useEffect(() => {
    api
      .get(`/api/company`,
        
    )
      .then((response) => {
        setCompanyData(response.data[0]);
      })
      .catch((error) => console.log(error));
  }, []);

  const companyRecords = {
    CompanyName: companyData.CompanyName,
    Address: companyData.Address,
    city: companyData?.city?.CityName,
    PostalCode: companyData.PostalCode,
    PanNo: companyData.PanNo,
    GSTNo: companyData.GSTNo,
    CINNo: companyData.CINNo,
    ContactNo: companyData.ContactNo,
    Email: companyData.Email,
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  let dayCurrent = today.getDay();

  const getAttendanceMark = (user) => {
    if (!user || !user.attendance || !user.attendance.loginTime) {
      return "Absent";
    }

    const loginTime = user.attendance.loginTime[0];
    const loginTimelength = user.attendance.loginTime.length;
    const logoutTimelength = user.attendance.logoutTime?.length || 0;
    // Handle case where shifts may not be populated (lean aggregation)
    const startTime = user.attendance.shifts?.startTime || user.attendance.shifts;

    // Special code-based statuses
    if (user.attendance.isNCNS === true) return "NCNS";
    if (user.attendance.isForcedAbsent === true) return "Absent";
    if (user.attendance.isSandwhich === true) return "Sandwich";
    if (loginTime === "LV") return "On Leave";
    if (loginTime === "WO") return "Week off";
    if (loginTime === "HD") return "Holiday";

    // If login/logout count mismatch, do not apply time-based rules
    if (loginTimelength !== logoutTimelength) {
      // Ensure loginTime and startTime are defined and valid strings
      if (
        !loginTime ||
        !startTime ||
        typeof loginTime !== "string" ||
        typeof startTime !== "string" ||
        !loginTime.includes(":") ||
        (typeof startTime === "string" && !startTime.includes(":"))
      ) {
        return "Absent";
      }

      const [loginHour, loginMinute] = loginTime.split(":").map(Number);
      const [shiftStartHour, shiftStartMinute] = startTime
        .split(":")
        .map(Number);

      // Check if parsing resulted in valid numbers
      if (
        isNaN(loginHour) ||
        isNaN(loginMinute) ||
        isNaN(shiftStartHour) ||
        isNaN(shiftStartMinute)
      ) {
        return "Absent";
      }

      const loginTimeInMinutes = loginHour * 60 + loginMinute;
      const shiftStartTimeInMinutes = shiftStartHour * 60 + shiftStartMinute;

      const gracePeriodEnd = shiftStartTimeInMinutes + 15;
      const halfDayThreshold = shiftStartTimeInMinutes + 360; // 6 hours

      if (loginTimeInMinutes <= shiftStartTimeInMinutes) {
        return "Present";
      } else if (loginTimeInMinutes <= gracePeriodEnd) {
        return "Late";
      } else if (loginTimeInMinutes <= halfDayThreshold) {
        return "Half Day";
      } else {
        return "Absent";
      }
    }

    const totalLogAfterBreak = user.attendance.totalLogAfterBreak
      ? parseInt(user.attendance.totalLogAfterBreak)
      : 0;

    // Validate loginTime and shift startTime
    if (typeof loginTime !== "string" || typeof startTime !== "string") {
      return "Absent";
    }

    const [loginHour, loginMinute] = loginTime.split(":").map(Number);
    const [shiftStartHour, shiftStartMinute] = startTime.split(":").map(Number);

    if (
      isNaN(loginHour) ||
      isNaN(loginMinute) ||
      isNaN(shiftStartHour) ||
      isNaN(shiftStartMinute)
    ) {
      return "Absent";
    }

    const loginTimeInMinutes = loginHour * 60 + loginMinute;
    const shiftStartTimeInMinutes = shiftStartHour * 60 + shiftStartMinute;
    const lateThreshold = shiftStartTimeInMinutes + 15;

    // New logic with presence + hours validation
    if (loginTimeInMinutes <= lateThreshold) {
      // On time
      if (totalLogAfterBreak >= 465) {
        return "Present";
      } else if (totalLogAfterBreak >= 240) {
        return "Half Day";
      } else {
        return "Absent";
      }
    } else {
      // Late
      if (totalLogAfterBreak >= 465) {
        return "Half Day"; // Full time but came late
      } else if (totalLogAfterBreak >= 240) {
        return "Half Day"; // 4–7.75 hrs, irrespective of login time
      } else {
        return "Absent";
      }
    }
  };

  const status = (s) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[s];
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) =>
      sortField === field ? (prevOrder === "asc" ? "desc" : "asc") : "asc"
    );
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? "▴" : "▾";
    }
    return null;
  };

  const sortedAndFilteredData = useMemo(() => {
    return attendanceData
      .filter((item) =>
        (item.FirstName + " " + item.LastName)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField) {
          const aValue = a[sortField];
          const bValue = b[sortField];
          return typeof aValue === "string"
            ? sortOrder === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
            : sortOrder === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
        return 0;
      });
  }, [attendanceData, searchQuery, sortField, sortOrder]);

  function convertMinutesToHoursAndMinutes(minutes) {
    // If the input is zero or negative, return "0 Hrs 0 Min"
    if (minutes <= 0) return "0 Hrs 0 Min";

    // Calculate hours
    var hours = Math.floor(minutes / 60);
    // Calculate remaining minutes
    var remainingMinutes = minutes % 60;

    return hours + " Hrs " + remainingMinutes + " Min";
  }

  const availableFields = [
    { label: "Employee ID", value: "empID" },
    { label: "Employee Name", value: "employeeName" },
    { label: "Login Time (24Hrs)", value: "loginTime" },
    { label: "Logout Time (24Hrs)", value: "logoutTime" },
    { label: "Total Login Time", value: "totalLoginTime" },
    { label: "Log Count", value: "logCount" },
    { label: "Gross Login", value: "grossLogin" },
    { label: "Total Break", value: "totalBreak" },
    { label: "Net Login", value: "netLogin" },
    { label: "Status", value: "status" },
    { label: "Break Count", value: "breakCount" },
    { label: "Mark", value: "mark" },
  ];

  const handleFieldChange = (field) => {
    setSelectedFields((prevFields) =>
      prevFields.includes(field)
        ? prevFields.filter((f) => f !== field)
        : [...prevFields, field]
    );
  };

  const handleSelectAll = () => {
    if (selectedFields.length === availableFields.length) {
      // Deselect all if all are currently selected
      setSelectedFields([]);
    } else {
      // Select all
      const allFieldValues = availableFields.map((field) => field.value);
      setSelectedFields(allFieldValues);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const exportToExcel = () => {
    const dataToExport = attendanceData.map((user) => {
      const userData = {};
      selectedFields.forEach((field) => {
        if (field === "empID") {
          userData["Employee ID"] = user.empID.toUpperCase();
        }
        if (field === "employeeName") {
          userData["Employee Name"] =
            user.FirstName.toUpperCase() + " " + user.LastName.toUpperCase();
        }
        if (field === "loginTime") {
          userData["Login Time (24Hrs)"] = user.attendance
            ? user.attendance.loginTime[0]
            : "--";
        }
        if (field === "logoutTime") {
          userData["Logout Time (24Hrs)"] = user.attendance
            ? user.attendance.logoutTime[user.attendance.logoutTime.length - 1]
            : "--";
        }
        if (field === "totalLoginTime") {
          userData["Total Login Time"] = user.attendance
            ? convertMinutesToHoursAndMinutes(
                user.attendance.totalLogAfterBreak
              ).toUpperCase()
            : "--";
        }
        if (field === "logCount") {
          // userData["Log Count"] = user.logCount || "--";
                  userData["Log Count"] = user.attendance?.loginTime?.length ?? "--";

        }
        if (field === "grossLogin") {
          // userData["Gross Login"] = user.grossLogin || "--";
            userData["Gross Login"] = user.attendance?.TotalLogin
          ? convertMinutesToHoursAndMinutes(user.attendance.TotalLogin)
          : "--";
        }
        if (field === "totalBreak") {
          // userData["Total Break"] = user.totalBreak || "--";
                  userData["Total Break"] = user.attendance?.totalBrake
          ? convertMinutesToHoursAndMinutes(user.attendance.totalBrake)
          : "--";
        }
        if (field === "netLogin") {
          // userData["Net Login"] = user.netLogin || "--";
                  userData["Net Login"] = user.attendance?.totalLogAfterBreak
          ? convertMinutesToHoursAndMinutes(user.attendance.totalLogAfterBreak)
          : "--";
        }
        if (field === "status") {
          // userData["Status"] = user.status || "--";
                  userData["Status"] = user.attendance?.status || "--";

        }
        if (field === "breakCount") {
          // userData["Break Count"] = user.breakCount || "--";
                  userData["Break Count"] = user.attendance?.breakTime?.length ?? "--";

        }
        if (field === "mark") {
          userData["Mark"] = getAttendanceMark(user).toUpperCase();
        }
      });
      return userData;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Add the caption at the top of the worksheet
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          `${companyRecords.CompanyName}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          `Address : ${companyRecords.Address}`,
          `${companyRecords.city}`,
          `${companyRecords.PostalCode}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          `CIN NO : ${companyRecords.CINNo}`,
          "",
          `GST NO : ${companyRecords.GSTNo}`,
          "",
          `PAN NO : ${companyRecords.PanNo}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          `Email : ${companyRecords.Email}`,
          "",
          `Contact : ${companyRecords.ContactNo}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
      ],
      {
        origin: "A1", // Set the origin to A1 for the caption
      }
    );

    // Add the data starting from the next row (now A5)
    XLSX.utils.sheet_add_json(worksheet, dataToExport, {
      header: [],
      skipHeader: false,
      origin: "A6",
    });

    // Add the export time to the last row
    const exportTime = `Exported on ${new Date().toLocaleString()}`;
    XLSX.utils.sheet_add_aoa(worksheet, [[exportTime]], {
      origin: "A" + (dataToExport.length + 8),
    }); // Adjust to the last row

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(workbook, "attendance.xlsx");
    closeModal(); // Close the modal after export
  };

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(sortedAndFilteredData.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Add this at the top of your file or in a separate utils file
  const getMarkBadgeClass = (mark, darkMode) => {
    switch (mark) {
      case "Present":
      case "On Time":
        return darkMode ? "badge-success border" : "badge-success-dark";
      case "Late":
      case "Week off":
      case "On Leave":
        return darkMode ? "badge-info border" : "badge-info-dark";
      case "Holiday":
        return darkMode ? "badge-primary border" : "badge-primary-dark";
      case "Half Day":
        return darkMode ? "badge-warning border" : "badge-warning-dark";
      default: // "Absent", "NCNS", or any fallback
        return darkMode ? "badge-danger border" : "badge-danger-dark";
    }
  };

  return (
    <div className="container-fluid pb-5">
      <div className="d-flex justify-content-between py-3">
        <div>
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
            className=" my-auto"
          >
            Today's Attendance
          </h5>
          <span className="p-0 fs-6 d-flex ">
            <span
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
              }}
              className="m-0 p-0 fs-6 text-center"
            >
              {status(dayCurrent)}, <span>{dd}</span>/<span>{mm}</span>/
              <span>{yyyy}</span>
            </span>
          </span>
        </div>
        <div>
          <div className="d-flex gap-2">
            <input
              style={{ width: "15rem" }}
              value={searchQuery}
              onChange={handleInputChange}
              type="search"
              className={`form-control ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              placeholder="Search by employee name"
            />
            <button
              className={`btn d-flex align-items-center gap-2  shadow-sm rounded-2 ${
                darkMode
                  ? "bg-light text-dark border"
                  : "bg-dark text-light border-0"
              }`}
              onClick={openModal}
              style={{
                whiteSpace: "pre",
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              <FaFileExcel className="text-success fs-5" />
              <span className="d-none d-md-flex text-success">Export XLSX</span>
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex d-sm-none">
        <input
          value={searchQuery}
          onChange={handleInputChange}
          type="search"
          className="form-control mb-3 rounded-0"
          placeholder="Search by employee name"
        />
      </div>
      <div>
        {currentItems.length > 0 ? (
          <div>
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
                <table className="table mb-0 table-hover table-striped">
                  <thead>
                    <tr style={{ position: "sticky", top: "0", zIndex: "1" }}>
                      <th style={rowHeadStyle(darkMode)}>Employee</th>
                      <th style={rowHeadStyle(darkMode)}> Shift</th>
                      <th
                        className="text-center"
                        style={rowHeadStyle(darkMode)}
                      >
                        {" "}
                        <IoCheckmarkDoneOutline /> Mark{" "}
                      </th>
                      <th
                        className="text-center"
                        style={rowHeadStyle(darkMode)}
                      >
                        {" "}
                        <HiOutlineLogin /> Login Time{" "}
                      </th>
                      <th
                        className="text-center"
                        style={rowHeadStyle(darkMode)}
                      >
                        {" "}
                        Logout Time <HiOutlineLogout />{" "}
                      </th>

                      <th
                        className="text-center"
                        style={rowHeadStyle(darkMode)}
                      >
                        {" "}
                        <RxCounterClockwiseClock /> Log Count{" "}
                      </th>
                      <th
                        className="text-center"
                        style={rowHeadStyle(darkMode)}
                      >
                        {" "}
                        Gross Login <HiOutlineLogout />{" "}
                      </th>
                      <th
                        className="text-center"
                        style={rowHeadStyle(darkMode)}
                      >
                        {" "}
                        Total Break{" "}
                      </th>
                      <th
                        className="text-center"
                        style={rowHeadStyle(darkMode)}
                      >
                        {" "}
                        <FaUserClock /> Net Login{" "}
                      </th>
                      <th
                        className="text-center"
                        style={rowHeadStyle(darkMode)}
                      >
                        {" "}
                        Status <HiStatusOnline />
                      </th>

                      <th
                        style={rowHeadStyle(darkMode)}
                        className="text-center"
                      >
                        {" "}
                        Break Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((user) => {
                      const mark = getAttendanceMark(user);

                      return (
                        <tr
                          id={`attendance-row-${user?.attendance?.date}`}
                          key={user.userId}
                        >
                          <td style={rowBodyStyle(darkMode)}>
                            <div className="d-flex align-items-center gap-2">
                              <div
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  backgroundColor: "#ccc",
                                  borderRadius: "50%",
                                  fontSize: "1rem",
                                  fontWeight: "bold",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {user?.profile?.image_url ? (
                                  <img
                                    style={{
                                      height: "100%",
                                      width: "100%",
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                    }}
                                    src={user.profile.image_url}
                                    alt={`${user?.FirstName || ""} ${
                                      user?.LastName || ""
                                    }`}
                                  />
                                ) : (
                                  `${
                                    user?.FirstName?.[0]?.toUpperCase() || ""
                                  }${user?.LastName?.[0]?.toUpperCase() || ""}`
                                )}
                              </div>
                              <div>
                                <p style={{ fontSize: ".8rem", margin: 0 }}>
                                  {user.empID}
                                </p>
                                <p
                                  className="text-capitalize"
                                  style={{ fontSize: "1rem", margin: 0 }}
                                >
                                  {user.FirstName} {user.LastName}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Shift Information */}
                         {/* <td style={rowBodyStyle(darkMode)}>
                            {typeof user.attendance?.shifts === "object" && user.attendance?.shifts?.name ? (
                              <span
                                style={{ width: "fit-content" }}
                                className={`py-1 d-flex align-items-center gap-2 ${
                                  darkMode
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
                                  {user.attendance.shifts.name}
                                </span>
                                {user.attendance.shifts.startTime} -{" "}
                                {user.attendance.shifts.endTime}
                              </span>
                            ) : user.attendance?.shifts && typeof user.attendance.shifts === "string" ? (
                              <span className={darkMode ? "badge-secondary" : "badge-secondary-dark"}>
                                Shift ID: {user.attendance.shifts}
                              </span>
                            ) : (
                              "--"
                            )}
                          </td>  */}
                                                    {/* Shift Information */}
                          <td style={rowBodyStyle(darkMode)}>
                            {/* {user.attendance?.shifts?.name ? ( */}
                          {typeof user.attendance?.shifts === "object" && user.attendance?.shifts?.name ? (

                              <span
                                style={{ width: "fit-content" }}
                                className={`py-1 d-flex align-items-center gap-2 ${
                                  darkMode
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
                                  {/* {user.attendance.shifts.name} */}
                                  {user.attendance?.shifts?.name}
                                </span>
                                {user.attendance?.shifts?.startTime} -{" "}
                                {user.attendance?.shifts?.endTime}
                              </span>
                            ) : (
                              "--"
                            )}
                          </td> 

                          {/* Attendance Mark */}
                          <td
                            className="text-center"
                            style={rowBodyStyle(darkMode)}
                          >
                            <span
                              className={`px-2 rounded-2 ${getMarkBadgeClass(
                                mark,
                                darkMode
                              )}`}
                            >
                              {mark}
                            </span>
                          </td>

                          {/* Login Time */}
                          <td
                            className="text-center"
                            style={rowBodyStyle(darkMode)}
                          >
                            {user.attendance?.loginTime?.[0] === "LV" ? (
                              <span
                                className={
                                  darkMode
                                    ? "badge-info border"
                                    : "badge-info-dark"
                                }
                              >
                                {" "}
                                {user.attendance?.leaveAttendanceData
                                  ?.Leavetype === "Casual Leave"
                                  ? "Paid Leave"
                                  : user.attendance?.leaveAttendanceData
                                      ?.Leavetype === "Paid Leave"
                                  ? "Paid Leave"
                                  : "Un-Paid Leave"}
                                {" / "}
                                {user.attendance?.leaveAttendanceData
                                  ?.leaveDuration === "Full Day"
                                  ? "Full"
                                  : "Half"}
                              </span>
                            ) : user.attendance?.loginTime?.[0] === "WO" ? (
                              <span
                                className={
                                  darkMode
                                    ? "badge-primary border"
                                    : "badge-primary-dark"
                                }
                              >
                                Week Off
                              </span>
                            ) : user.attendance?.loginTime?.[0] === "HD" ? (
                              <span
                                className={
                                  darkMode
                                    ? "badge-primary border"
                                    : "badge-primary-dark"
                                }
                              >
                                Holiday
                              </span>
                            ) : user.attendance?.loginTime?.[0] ? (
                              convertToAmPm(user.attendance.loginTime[0])
                            ) : (
                              "--"
                            )}
                          </td>

                          {/* Logout Time */}
                          <td
                            className="text-center"
                            style={rowBodyStyle(darkMode)}
                          >
                            {user.attendance?.logoutTime?.[
                              user.attendance.logoutTime.length - 1
                            ] === "LV" ? (
                              <span
                                className={
                                  darkMode
                                    ? "badge-info border"
                                    : "badge-info-dark"
                                }
                              >
                                {user.attendance?.leaveAttendanceData
                                  ?.Leavetype === "Casual Leave"
                                  ? "Paid Leave"
                                  : user.attendance?.leaveAttendanceData
                                      ?.Leavetype === "Paid Leave"
                                  ? "Paid Leave"
                                  : "Un-Paid Leave"}
                                {" / "}
                                {user.attendance?.leaveAttendanceData
                                  ?.leaveDuration === "Full Day"
                                  ? "Full"
                                  : "Half"}
                              </span>
                            ) : user.attendance?.logoutTime?.[
                                user.attendance.logoutTime.length - 1
                              ] === "WO" ? (
                              <span
                                className={
                                  darkMode
                                    ? "badge-primary border"
                                    : "badge-primary-dark"
                                }
                              >
                                Week Off
                              </span>
                            ) : user.attendance?.logoutTime?.[
                                user.attendance.logoutTime.length - 1
                              ] === "HD" ? (
                              <span
                                className={
                                  darkMode
                                    ? "badge-primary border"
                                    : "badge-primary-dark"
                                }
                              >
                                Holiday
                              </span>
                            ) : user.attendance?.logoutTime?.[
                                user.attendance.logoutTime.length - 1
                              ] ? (
                              convertToAmPm(
                                user.attendance.logoutTime[
                                  user.attendance.logoutTime.length - 1
                                ]
                              )
                            ) : (
                              "--"
                            )}
                          </td>

                          <td
                            style={{
                              ...rowBodyStyle(darkMode),
                              position: "relative",
                            }}
                            className="text-center"
                          >
                            {user.attendance?.loginTime?.length || "--"}
                            <div
                              tyle={{
                                zIndex: "5",
                                right: "100%",
                                height: "25vh",
                                overflow: "auto",
                                top: "0",
                                scrollbarWidth: "thin",
                                scrollbarColor: darkMode
                                  ? "lightgray transparent"
                                  : "darkgray transparent",
                              }}
                              className="position-absolute"
                            ></div>
                          </td>

                          {/* Total Login Time */}
                          <td style={rowBodyStyle(darkMode)}>
                            {user.attendance?.TotalLogin
                              ? convertMinutesToHoursAndMinutes(
                                  user.attendance.TotalLogin
                                )
                              : "--"}
                          </td>

                          {/* Total Break Time */}
                          <td style={rowBodyStyle(darkMode)}>
                            {user.attendance?.totalBrake
                              ? convertMinutesToHoursAndMinutes(
                                  user.attendance.totalBrake
                                )
                              : "--"}
                          </td>

                          {/* Total Log Time After Break */}
                          <td style={rowBodyStyle(darkMode)}>
                            {user.attendance?.totalLogAfterBreak
                              ? convertMinutesToHoursAndMinutes(
                                  user.attendance.totalLogAfterBreak
                                )
                              : "--"}
                          </td>

                          {/* Status */}

                          <td style={rowBodyStyle(darkMode)}>
                            {user.attendance?.status === "LV" ||
                            user.attendance?.isOnLeave ? (
                              <span
                                title={user.attendance?.holidayName}
                                className={
                                  darkMode
                                    ? "badge-info border"
                                    : "badge-info-dark"
                                }
                              >
                                On Leave
                              </span>
                            ) : user.attendance?.status === "HD" ? (
                              <span
                                title={user.attendance?.holidayName}
                                className={
                                  darkMode
                                    ? "badge-primary border"
                                    : "badge-primary-dark"
                                }
                              >
                                Holiday
                              </span>
                            ) : user.attendance?.status === "WO" ? (
                              <span
                                className={
                                  darkMode
                                    ? "badge-primary border"
                                    : "badge-primary-dark"
                                }
                              >
                                Week Off
                              </span>
                            ) : user.attendance?.status === "break" ? (
                              <span
                                className={
                                  darkMode
                                    ? "badge-warning border"
                                    : "badge-warning-dark"
                                }
                              >
                                On Break
                              </span>
                            ) : user.attendance?.status === "login" ? (
                              <span
                                className={
                                  darkMode
                                    ? "badge-success border"
                                    : "badge-success-dark"
                                }
                              >
                                Login
                              </span>
                            ) : (
                              <span
                                className={
                                  darkMode
                                    ? "badge-danger border"
                                    : "badge-danger-dark"
                                }
                              >
                                Logout
                              </span>
                            )}
                          </td>
                          {/* Break Count */}
                          <td
                            className="text-center"
                            style={rowBodyStyle(darkMode)}
                          >
                            {user.attendance?.breakTime?.length || "--"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              handlePaginationPrev={handlePaginationPrev}
              handlePaginationNext={handlePaginationNext}
              setCurrentPage={setCurrentPage}
              filteredDataLength={sortedAndFilteredData.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        ) : (
          <div
            style={{
              minHeight: "70vh",
              maxHeight: "70vh",
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
              src={SearchLight}
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
              Sorry records not found or attendance not marked yet.
            </p>
          </div>
        )}
      </div>
      {/* Modal for field selection */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Export Fields"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "auto",
            padding: "13px",
            borderRadius: ".5rem",
            color: !darkMode ? "White" : "black",
            background: darkMode ? "White" : "black",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <h5>Select Fields to Export</h5>
        <hr />
        <div>
          <label className="d-flex gap-3 align-items-center">
            <input
              type="checkbox"
              style={{ height: "1.4rem", width: "1.4rem" }}
              checked={selectedFields.length === availableFields.length}
              onChange={handleSelectAll}
            />
            Select All
          </label>
        </div>
        <hr />
        <div className="row">
          {availableFields.map((field) => (
            <div className="col-12 col-md-6" key={field.value}>
              <label className="d-flex gap-3 align-items-center">
                <input
                  type="checkbox"
                  style={{ height: "1.4rem", width: "1.4rem" }}
                  value={field.value}
                  checked={selectedFields.includes(field.value)}
                  onChange={() => handleFieldChange(field.value)}
                />
                <span>{field.label}</span>
              </label>
            </div>
          ))}
        </div>
        <hr />
        <div className="d-flex align-items-center gap-3 ">
          <button
            onClick={exportToExcel}
            className="btn btn-primary rounded-3 mt-2"
          >
            Export
          </button>
          <button
            onClick={closeModal}
            className="btn btn-danger rounded-3 mt-2 "
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TodaysAttendance;
