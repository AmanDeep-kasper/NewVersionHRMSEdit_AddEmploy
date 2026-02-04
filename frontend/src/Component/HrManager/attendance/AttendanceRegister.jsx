

// // AttendanceRegister.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { useTheme } from "../../../Context/TheamContext/ThemeContext";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { ClipLoader } from "react-spinners";
// import AttendanceFilter from "./AttendanceRegisterModules/AttendanceFilter";
// import AttendanceTable from "./AttendanceRegisterModules/AttendanceTable";
// import AttendanceLegend from "./AttendanceRegisterModules/AttendanceLegend";
// import MissingDetailsModal from "./AttendanceRegisterModules/MissingDetailsModal";
// import api from "../../../Pages/config/api";

// const AttendanceRegister = () => {
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth() + 1;

//   const [filterMonth, setFilterMonth] = useState(currentMonth);
//   const [filterYear, setFilterYear] = useState(currentYear);
//   const [attendance, setAttendance] = useState([]);
//   const { darkMode } = useTheme();
//   const [missingDetails, setMissingDetails] = useState([]);
//   const [isPayrollSend, setIsPayrollSend] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const route = useLocation().pathname.split("/")[1];
//   const navigate = useNavigate();
//   const alertRef = useRef(null);

//   const [selectedAttendance, setSelectedAttendance] = useState({ employeeId: null, day: null });
//   const [availableYears, setAvailableYears] = useState([]);
//   const [availableMonths, setAvailableMonths] = useState([]);
//   const [filtersLoaded, setFiltersLoaded] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [pagination, setPagination] = useState({
//     totalUsers: 0,
//     currentPage: 1,
//     totalPages: 1,
//     pageSize: "",
//   });
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(100);

//   // Debounce and cancellation
//   const searchDebounceRef = useRef(null);
//   const abortControllerRef = useRef(null);

//   // Fetch filters on component mount
//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         // First fetch employees to get employeeIds
//         const employeesRes = await api.get('/api/employee');
//         const employeeIds = employeesRes.data.map(emp => emp._id);

//         // Then POST to /attendance/dropdown with employeeIds
//         const res = await api.post('/api/attendance/dropdown', { employeeIds });
//         setAvailableYears(res.data.availableYears || []);
//         setAvailableMonths(res.data.availableMonths || []);
//         setFiltersLoaded(true);
//       } catch (err) {
//         console.error('Error fetching filters:', err);
//         // Set defaults if API fails
//         setAvailableYears([new Date().getFullYear()]);
//         setAvailableMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
//         setFiltersLoaded(true);
//       }
//     };
//     fetchFilters();
//   }, []);

 
//   const fetchAttendanceData = async (signal) => {
//     setLoading(true);
//     try {
//       const response = await api.get(
//         `/api/attendance-register/${filterYear}/${filterMonth}?search=${encodeURIComponent(
//           searchQuery
//         )}&page=${page}&limit=${limit}`,
//         { signal } // axios supports AbortController in modern setups
//       );
//       setAttendance(response.data.attendance || []);
//       setAvailableYears(response.data.availableYears || []);
//       setAvailableMonths(response.data.availableMonths || []);
//       setPagination(response.data.pagination || {});
//     } catch (error) {
//       if (signal?.aborted) return; // ignore aborted requests
//       console.error("Error fetching attendance data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   // const fetchPayroll = async () => {
//   //   try {
//   //     const response = await api.get(`/api/payroll`);
//   //     const yearData = response.data[0]?.years.find((yr) => yr.year === filterYear);
//   //     const monthData = yearData?.months.find((m) => m.month === filterMonth);
//   //     setIsPayrollSend(monthData?.isPayslipSent || false);
//   //   } catch (error) {
//   //     console.error("Error fetching payroll data", error);
//   //   }
//   // };

//     const fetchPayroll = async () => {
//     try {
//       const response = await api.get(`/api/payroll`);
//       const yearData = response.data[0]?.years.find(
//         (yr) => yr.year === filterYear
//       );
//       const monthData = yearData?.months.find((m) => m.month === filterMonth);
//       const isPayslipSent = monthData?.isPayslipSent;
//       setIsPayrollSend(isPayslipSent);
//     } catch (error) {
//       console.error("Error fetching payroll data", error);
//     }
//   };

//   useEffect(() => {
//     // Clear previous debounce
//     if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

//     // Cancel previous request
//     if (abortControllerRef.current) abortControllerRef.current.abort();
//     const controller = new AbortController();
//     abortControllerRef.current = controller;

//     // Debounce search to reduce server hits
//     searchDebounceRef.current = setTimeout(() => {
//       if (filtersLoaded && filterYear && filterMonth) {
//         fetchAttendanceData(controller.signal);
//         fetchPayroll();
//       }
//     }, 250); // 250ms debounce

//     return () => {
//       clearTimeout(searchDebounceRef.current);
//       controller.abort();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filtersLoaded, filterYear, filterMonth, searchQuery, page, limit]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (alertRef.current && !alertRef.current.contains(event.target)) {
//         setMissingDetails([]);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const getUserStatusColor = (month) => {
//     const months = [
//       "January","February","March","April","May","June",
//       "July","August","September","October","November","December",
//     ];
//     return months[month - 1] || "";
//   };


// // // working code 
// //  const processAttendance = async () => {
// //   try {

// //         console.log("▶️ PROCESS ATTENDANCE STARTED");
// //     console.log("Year:", filterYear, "Month:", filterMonth);
// //     console.log("Total employees in attendance →", attendance?.length);


// //     let missingData = [];

// //     const records = attendance.map((employee) => {

// //          console.log(`\n==============================`);
// //       // console.log(`EMPLOYEE INDEX #${index + 1}`);
// //       console.log("EMP OBJECT:", employee?.employeeObjID?._id);
// //       console.log("EMP NAME:", employee?.employeeObjID?.FirstName, employee?.employeeObjID?.LastName);


// //       const missingFields = [];

// //       if (employee?.status === "active") {
// //         if (!employee?.PANcardNo) missingFields.push("PanNumber");
// //         if (!employee?.UANNumber) missingFields.push("UanNumber");
// //         if (!employee?.BankName) missingFields.push("BankName");
// //         if (!employee?.BankAccount) missingFields.push("BankAccount");
// //         if (!employee?.BankIFSC) missingFields.push("BankIFSC");

// //         if (missingFields.length > 0) {
// //           missingData.push({
// //             name: `${employee?.FirstName || ""} ${employee?.LastName || ""}`.trim(),
// //             id: employee?.empID || "Not Available",
// //             missing: missingFields.join(", "),
// //           });
// //         }
// //       }

// //       const totals = employee?.attendance?.[0]?.months?.[0]?.totals || {};

// //       return {
// //         year: filterYear,
// //         month: filterMonth,

// //         employeeObjID: employee.userId,

// //         employeeData: {
// //           employeeObjID: employee.userId,
// //           isAttChecked: true,
// //           status: "Proceed",
// //           SalaryStatus: "created",

// //           daysInMonth: totals.totalDays ?? daysInMonth,

// //           // ⭐ USE BACKEND TOTALS
// //           present: totals.present ?? 0,
// //           absent: totals.absent ?? 0,
// //           halfday: totals.halfday ?? 0,
// //           holiday: totals.holiday ?? 0,
// //           paidLeaves: totals.paidLeaves ?? 0,
// //           unpaidLeaves: totals.unpaidLeaves ?? 0,
// //           NCNS: totals.NCNS ?? 0,
// //           Sandwhich: totals.Sandwich ?? 0,

// //           // ⭐ VERY IMPORTANT → FROM BACKEND
// //           totalPayableDays: totals.totalPayableDays ?? 0,

// //           FullName: `${employee?.FirstName || ""} ${employee?.LastName || ""}`.trim(),

// //           empID: employee?.empID || "Not Available",

// //           doj: employee?.DateOfJoining || "Not Available",
// //           workLocation: employee?.LocationType || "Not Available",

// //           PanNumber: employee?.PANcardNo || "Not Available",
// //           UanNumber: employee?.UANNumber || "Not Available",
// //           BankName: employee?.BankName || "Not Available",
// //           BankAccount: employee?.BankAccount || "Not Available",
// //           BankIFSC: employee?.BankIFSC || "Not Available",

// //           departmentName: employee?.department?.DepartmentName || "Not Available",
// //           designationName: employee?.position?.PositionName || "Not Available",

// //           fixedBasic: employee?.salary?.[0]?.BasicSalary || 0,
// //           fixedHRA: employee?.salary?.[0]?.HRASalary || 0,
// //           fixedConvenyance: employee?.salary?.[0]?.ConvenyanceAllowance || 0,
// //           fixedOthers: employee?.salary?.[0]?.otherAllowance || 0,
// //           fixedTotalSalary: employee?.salary?.[0]?.totalSalary || 0,
// //         },
// //       };
// //     });

// //     if (missingData.length > 0) {
// //       setMissingDetails(missingData);
// //       return;
// //     }

// //     await api.post(`/api/payroll/addPayrollRecordsMany`, { records });

// //     toast.success("Attendance processed successfully!");
// //     navigate(`/${route}/Run_payroll`);

// //   } catch (error) {
// //     console.error("Error processing attendance:", error);
// //     toast.error("Failed to process attendance.");
// //   }
// // };


// const processAttendance = async () => {
//   try {
//     console.log("▶️ PROCESS ATTENDANCE API CALL STARTED");
//     console.log("Year:", filterYear, "Month:", filterMonth);
//     console.log("Total employees in attendance →", attendance?.length || 0);


//     if (!attendance || attendance.length === 0) {
//       toast.error("No attendance data found");
//       return;
//     }

//     // ✅ Define daysInMonth safely
//     const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();

//     let missingData = [];

//     const records = attendance.map((employee) => {
//       //  const salary = employee?.employeeObjID?.salary?.[0] || {};
//         // ✅ salary id only
//       const salaryId = employee?.salary?.[0] || null;

//       // ================= ATTENDANCE TOTALS =================
//       const totals =
//         employee?.attendance?.[0]?.months?.[0]?.totals || {};

//       // ================= EMPLOYEE ID FIX =================
//       const employeeId =
//         employee?.userId ||
//         employee?._id ||
//         employee?.employeeObjID ||
//         null;

//       console.log("\n👤 EMPLOYEE:", employee?.FirstName, employee?.LastName);
//       console.log("🆔 EMP ID SENT TO BACKEND:", employeeId);
      

//       // ================= SALARY LOG =================
//       // const salary = employee?.salary?.[0];

//       // console.log("💰 SALARY CHECK:");
//       // console.log({
//       //   BasicSalary: salary?.BasicSalary,
//       //   HRASalary: salary?.HRASalary,
//       //   ConvenyanceAllowance: salary?.ConvenyanceAllowance,
//       //   OtherAllowance: salary?.otherAllowance,
//       //   TotalSalary: salary?.totalSalary,
//       // });

//       // 🔍 find salary even if nested
// // const salary =
// //   employee?.salary?.[0] ||
// //   employee?.employeeObjID?.salary?.[0] ||
// //   employee?.employee?.salary?.[0] ||
// //   null;

// // 🧾 Salary Debug Log
// console.log("💰 SALARY CHECK FOR:", employee?.FirstName, employee?.LastName);
// console.log("RAW EMPLOYEE OBJECT:", employee);

// console.log({
// fixedBasic: employee?.salary?.[0]?.BasicSalary || 0,
// fixedHRA: employee?.salary?.[0]?.HRASalary || 0,
// fixedConvenyance: employee?.salary?.[0]?.ConvenyanceAllowance || 0,
// fixedOthers: employee?.salary?.[0]?.otherAllowance || 0,
// fixedTotalSalary: employee?.salary?.[0]?.totalSalary || 0,

// });

//       // ================= REQUIRED FIELD CHECK =================
//       const missingFields = [];

//       if (employee?.status === "active") {
//         if (!employee?.PANcardNo) missingFields.push("PanNumber");
//         if (!employee?.UANNumber) missingFields.push("UanNumber");
//         if (!employee?.BankName) missingFields.push("BankName");
//         if (!employee?.BankAccount) missingFields.push("BankAccount");
//         if (!employee?.BankIFSC) missingFields.push("BankIFSC");

//         if (missingFields.length > 0) {
//           missingData.push({
//             name: `${employee?.FirstName || ""} ${employee?.LastName || ""}`.trim(),
//             id: employee?.empID || "Not Available",
//             missing: missingFields.join(", "),
//           });
//         }
//       }

//       return {
//         year: filterYear,
//         month: filterMonth,

//         // 🔥 FIXED here
//         employeeObjID: employeeId,

//         employeeData: {
//           employeeObjID: employeeId,
//           isAttChecked: true,
//           status: "Proceed",
//           SalaryStatus: "created",

//           // days in month fallback
//           daysInMonth: totals?.totalDays ?? daysInMonth,

//           present: totals?.present ?? 0,
//           absent: totals?.absent ?? 0,
//           halfday: totals?.halfday ?? 0,
//           holiday: totals?.holiday ?? 0,
//           paidLeaves: totals?.paidLeaves ?? 0,
//           unpaidLeaves: totals?.unpaidLeaves ?? 0,
//           NCNS: totals?.NCNS ?? 0,
//           Sandwhich: totals?.Sandwich ?? 0,

//           totalPayableDays: totals?.totalPayableDays ?? 0,

//           FullName: `${employee?.FirstName || ""} ${employee?.LastName || ""}`.trim(),
//           empID: employee?.empID || "Not Available",

//           doj: employee?.DateOfJoining || "Not Available",
//           workLocation: employee?.LocationType || "Not Available",

//           PanNumber: employee?.PANcardNo || "Not Available",
//           UanNumber: employee?.UANNumber || "Not Available",
//           BankName: employee?.BankName || "Not Available",
//           BankAccount: employee?.BankAccount || "Not Available",
//           BankIFSC: employee?.BankIFSC || "Not Available",

//           departmentName:
//             employee?.department?.DepartmentName || "Not Available",

//           designationName:
//             employee?.position?.PositionName || "Not Available",

//             // ✅ only send salaryId (secure)
//         salaryId: salaryId,

//           // ✅ IMPORTANT — use ?? not ||
//           fixedBasic: salaryId?.BasicSalary ?? 0,
//           fixedHRA: salaryId?.HRASalary ?? 0,
//           fixedConvenyance: salaryId?.ConvenyanceAllowance ?? 0,
//           fixedOthers: salaryId?.otherAllowance ?? 0,
//           fixedTotalSalary: salaryId?.totalSalary ?? 0,
//         },
//       };
//     });

//     // 🚫 STOP IF BANK/PAN/UAN MISSING
//     if (missingData.length > 0) {
//       console.log("❌ Missing Employee Details:", missingData);
//       setMissingDetails(missingData);
//       return;
//     }

//     // =================== FINAL PAYLOAD LOG ===================
//     console.log("📤 FINAL PAYROLL PAYLOAD →", records);

//     const res = await api.post(
//       `/api/payroll/addPayrollRecordsMany`,
//       { records }
//     );

//     console.log("📥 BACKEND RESPONSE →", res?.data);

//     toast.success("Attendance processed successfully!");
//     navigate(`/${route}/Run_payroll`);

//   } catch (error) {
//     console.error(
//       "❌ ERROR processing attendance:",
//       error?.response?.data || error?.message || error
//     );

//     toast.error("Failed to process attendance.");
//   }
// };



// // const processAttendance = async () => {
// //   try {
// //     let missingData = [];

// //     const records = attendance.map((employee) => {
// //       const missingFields = [];

// //       if (employee?.status === "active") {
// //         if (!employee?.PANcardNo) missingFields.push("PanNumber");
// //         if (!employee?.UANNumber) missingFields.push("UanNumber");
// //         if (!employee?.BankName) missingFields.push("BankName");
// //         if (!employee?.BankAccount) missingFields.push("BankAccount");
// //         if (!employee?.BankIFSC) missingFields.push("BankIFSC");

// //         if (missingFields.length > 0) {
// //           missingData.push({
// //             name: `${employee?.FirstName || "NA"} ${employee?.LastName || "NA"}`.trim(),
// //             id: employee?.empID || "NA",
// //             missing: missingFields.join(", "),
// //           });
// //         }
// //       }

// //       const yearObj =
// //         employee.attendance?.find((y) => y.year === filterYear) || {};
// //       const monthObj =
// //         yearObj?.months?.find((m) => m.month === filterMonth) || {};
// //       const totals = monthObj.totals || {};

// //       return {
// //         year: filterYear,
// //         month: filterMonth,
// //         employeeObjID: employee.userId,

// //         employeeData: {
// //           empID: employee.empID,
// //           FullName: `${employee.FirstName} ${employee.LastName}`.trim(),

// //           /* ✅ ONLY TOTALS (NO DATES) */
// //           daysInMonth: totals.totalDays || 0,
// //           present: totals.present || 0,
// //           absent: totals.absent || 0,
// //           weekoff: totals.weekoff || 0,
// //           holiday: totals.holiday || 0,
// //           halfday: totals.halfday || 0,
// //           paidLeaves: totals.paidLeaves || 0,
// //           unpaidLeaves: totals.unpaidLeaves || 0,
// //           NCNS: totals.NCNS || 0,
// //           Sandwich: totals.Sandwich || 0,
// //           totalPayableDays: totals.totalPayableDays || 0,

// //           isAttChecked: true,
// //           status: "Proceed",
// //           SalaryStatus: "created",
// //         },
// //       };
// //     });

// //     if (missingData.length > 0) {
// //       setMissingDetails(missingData);
// //       return;
// //     }

// //     await api.post(`/api/payroll/addPayrollRecordsMany`, { records });

// //     toast.success("Attendance processed successfully!");
// //     navigate(`/${route}/Run_payroll`);
// //   } catch (error) {
// //     console.error("Error processing attendance:", error);
// //     toast.error("Failed to process attendance.");
// //   }
// // };

//   const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();
  

//   return (
//     <div style={{ height: "93vh", overflow: "auto", position: "relative" }} className="container-fluid pb-5">
//       <AttendanceFilter
//         filterYear={filterYear}
//         setFilterYear={(y) => {
//           setFilterYear(y);
//           setPage(1);
//         }}
//         filterMonth={filterMonth}
//         setFilterMonth={(m) => {
//           setFilterMonth(m);
//           setPage(1);
//         }}
//         uniqueYears={availableYears}
//         uniqueMonths={availableMonths}
//         getUserStatusColor={getUserStatusColor}
//         searchQuery={searchQuery}
//         setSearchQuery={(q) => {
//           setSearchQuery(q);
//           setPage(1);
//         }}
//         darkMode={darkMode}
//         isPayrollSend={isPayrollSend}
//         processAttendance={processAttendance}
//         page={page}
//         setPage={setPage}
//         limit={limit}
//         setLimit={(l) => {
//           setLimit(l);
//           setPage(1);
//         }}
//         totalPages={pagination.totalPages || 1}
//       />

//       <AttendanceTable
//         attendance={attendance}
//         filterYear={filterYear}
//         filterMonth={filterMonth}
//         daysInMonth={daysInMonth}
//         darkMode={darkMode}
//         selectedAttendance={selectedAttendance}
//         setSelectedAttendance={setSelectedAttendance}
//       />

//       {loading && (
//         <div style={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           zIndex: 1000
//         }}>
//           <ClipLoader color={darkMode ? '#fff' : '#000'} size={50} />
//         </div>
//       )}

//       <AttendanceLegend darkMode={darkMode} />

//       {missingDetails.length > 0 && (
//         <div ref={alertRef}>
//           <MissingDetailsModal
//             missingDetails={missingDetails}
//             setMissingDetails={setMissingDetails}
//             darkMode={darkMode}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceRegister;


import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AttendanceFilter from "./AttendanceRegisterModules/AttendanceFilter";
import AttendanceTable from "./AttendanceRegisterModules/AttendanceTable";
import AttendanceLegend from "./AttendanceRegisterModules/AttendanceLegend";
import MissingDetailsModal from "./AttendanceRegisterModules/MissingDetailsModal";
import api from "../../../Pages/config/api";

const AttendanceRegister = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterYear, setFilterYear] = useState(currentYear);
  const [attendance, setAttendance] = useState([]);
  const { darkMode } = useTheme();
  const [missingDetails, setMissingDetails] = useState([]);
  const [isPayrollSend, setIsPayrollSend] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const route = useLocation().pathname.split("/")[1];
  const [selectedAttendance, setSelectedAttendance] = useState({
    employeeId: null,
    day: null,
  });
  const navigate = useNavigate();
  const alertRef = useRef(null);

  useEffect(() => {
    fetchAttendanceData();
    fetchPayroll();
  }, [filterYear, filterMonth]);

  const fetchAttendanceData = async () => {
    try {
      const response = await api.get(`/api/attendance/${filterYear}/${filterMonth}`, {
      });
      setAttendance(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const fetchPayroll = async () => {
    try {
      const response = await api.get(`/api/payroll`, {
        });
      const yearData = response.data[0]?.years.find(
        (yr) => yr.year === filterYear
      );
      const monthData = yearData?.months.find((m) => m.month === filterMonth);
      const isPayslipSent = monthData?.isPayslipSent;
      setIsPayrollSend(isPayslipSent);
    } catch (error) {
      console.error("Error fetching payroll data", error);
    }
  };

const markAttendance = ({
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
}) => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  if (
    filterYear < currentYear ||
    (filterYear === currentYear && filterMonth < currentMonth) ||
    (filterYear === currentYear &&
      filterMonth === currentMonth &&
      day < currentDay)
  ) {
    if (isForcedAbsent) {
      return {
        status: "A",
        color: darkMode ? "rgba(255, 0, 0, 0.99)" : "rgba(255, 0, 0, 0.73)",
        title: "Absent",
      };
    }
    if (isSandwhich) {
      return {
        status: "S",
        color: darkMode ? "rgb(244, 208, 63)" : "rgba(244, 208, 63, 0.67)",
        title: "Sandwhich Leave",
      };
    }
    if (isNCNS) {
      return {
        status: "N",
        color: darkMode ? "rgba(255, 0, 0, 0.99)" : "rgba(255, 0, 0, 0.73)",
        title: "No Call No Show",
      };
    }
    if (!loginTime || loginTime.length === 0) {
      return {
        status: "A",
        color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
        title: "Absent",
      };
    }
  } else if (!loginTime || loginTime.length === 0) {
    return {
      status: "--",
      color: darkMode ? "#c1bdbd" : "rgba(32, 32, 32, 0.3)",
      title: "No Data",
    };
  } else if (loginTime[0] === "") {
    return {
      status: "A",
      color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
      title: "Absent",
    };
  }

  /* ---------- leave handling (unchanged) ---------- */
  if (isOnLeave) {
    const isPaid = [
      "Paid Leave",
      "Casual Leave",
      "Paternity Leave",
      "Maternity Leave",
    ].includes(LeaveTypeName);

    if (LeaveDurationName === "Full Day") {
      return {
        status: isPaid ? "VF" : "UF",
        color: isPaid
          ? darkMode
            ? "rgba(3, 201, 136,1)"
            : "rgba(3, 201, 136,.5)"
          : darkMode
          ? "rgba(175, 23, 64, 1)"
          : "rgba(175, 23, 64, .5)",
        title: "Work Off",
      };
    }
    return {
      status: isPaid ? "VH" : "UH",
      color: isPaid
        ? darkMode
          ? "rgba(133, 169, 71,1)"
          : "rgba(73, 107, 15, 0.66)"
        : darkMode
          ? "rgba(222, 124, 125, 1)"
          : "rgba(222, 124, 125, .5)",
        title: "Work Off",
      };
  }

  /* ---------- weekend / holiday codes (unchanged) ---------- */
  if (loginTime === "WO") {
    return {
      status: "W",
      color: darkMode ? "rgb(155, 89, 182)" : "rgba(201, 117, 235, 0.32)",
      title: "Work Off",
    };
  }
  if (loginTime === "HD") {
    return {
      status: "O",
      color: darkMode ? "rgb(63, 157, 233)" : "rgba(72, 152, 218, 0.66)",
      title: "Holiday",
    };
  }

  /* ---------- work-time & arrival calculations ---------- */

  const totalMinutes = parseInt(netLogiHours, 10); // may be NaN
  const firstLogin = Array.isArray(loginTime) ? loginTime[0] : loginTime;

  // Compute “minutes late”, but only if we have both times in HH:mm format
  let minutesLate = null;
  if (
    firstLogin &&
    typeof firstLogin === "string" &&
    firstLogin.includes(":") &&
    shifts &&
    shifts.startTime
  ) {
    const [lH, lM] = firstLogin.split(":").map(Number);
    const [sH, sM] = shifts.startTime.split(":").map(Number);
    minutesLate = lH * 60 + lM - (sH * 60 + sM); // can be negative (early/on-time)
  }

  // New rules: Check login time relative to shift start (9:30 AM) and unequal login/logout lengths
  if (minutesLate !== null && loginTimeLength !== logoutTimeLength) {
    if (minutesLate <= 15) {
      // Login by 9:45 AM
      return {
        status: "L",
        color: darkMode ? "rgb(93, 173, 226)" : "rgba(170, 211, 238, 0.55)",
        title: `Late (${minutesLate} min)`,
      };
    } else if (minutesLate <= 360) {
      // Login after 9:45 AM but by 3:30 PM
      return {
        status: "H",
        color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
        title: `Half Day (Late ${minutesLate} min)`,
      };
    } else {
      // Login after 3:30 PM
      return {
        status: "A",
        color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
        title: `Absent (Late ${minutesLate} min)`,
      };
    }
  }

  const isNetLoginAvailable = !isNaN(totalMinutes);

  /* ---------- RULE 1: evaluate by hours worked ---------- */
  if (isNetLoginAvailable) {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    // FULL DAY but possibly late
    if (totalMinutes >= 465) {
      // NEW RULE: late > 15 min ⇒ Half Day
      if (minutesLate !== null && minutesLate > 15) {
        return {
          status: "H",
          color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
          title: `Half Day (${hrs}h ${mins}m, Late ${minutesLate} min)`,
        };
      }
      return {
        status: "P",
        color: darkMode ? "rgb(26, 188, 156)" : "rgba(26, 188, 156, 0.64)",
        title: `Present (${hrs}h ${mins}m)`,
      };
    }

    // HALF DAY by hours
    if (totalMinutes >= 240) {
      return {
        status: "H",
        color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
        title: `Half Day (${hrs}h ${mins}m)`,
      };
    }

    // Less than 4h ⇒ Absent by hours
    return {
      status: "A",
      color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
      title: `Absent (${hrs}h ${mins}m)`,
      };
    }

  /* ---------- RULE 2: fallback to arrival-time rule ---------- */

  // No shift info → cannot judge, treat as Absent
  if (!shifts || !shifts.startTime) {
    return {
      status: "A",
      color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
      title: "Absent",
    };
  }

  // NOTE: minutesLate is guaranteed to be a number at this point
  if (minutesLate <= 0) {
    return {
      status: "P",
      color: darkMode ? "rgb(26, 188, 156)" : "rgba(26, 188, 156, 0.64)",
      title: "Present",
    };
  }
  if (minutesLate <= 15) {
    return {
      status: "L",
      color: darkMode ? "rgb(93, 173, 226)" : "rgba(170, 211, 238, 0.55)",
      title: "Late",
    };
  }
  if (minutesLate <= 360) {
    return {
      status: "H",
      color: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)",
      title: "Half Day",
    };
  }

  return {
    status: "A",
    color: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)",
    title: "Absent",
  };
};

  const uniqueYears = Array.from(
    new Set(
      attendance.flatMap((employee) => employee.years.map((year) => year.year))
    )
  );

  const uniqueMonths = Array.from(
    new Set(
      attendance.flatMap((employee) =>
        employee.years
          .filter((year) => year.year === filterYear)
          .flatMap((year) => year.months.map((month) => month.month))
      )
    )
  );

  const getUserStatusColor = (month) => {
    switch (month) {
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

  const calculateTotal = (status, employee) => {
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

  const processAttendance = async () => {
    try {
      let missingData = [];
      const records = attendance.map((employee) => {
        const missingFields = [];
        if (employee?.employeeObjID?.status === "active") {
          if (!employee?.employeeObjID?.PANcardNo)
            missingFields.push("PanNumber");
          if (!employee?.employeeObjID?.UANNumber)
            missingFields.push("UanNumber");
          if (!employee?.employeeObjID?.BankName)
            missingFields.push("BankName");
          if (!employee?.employeeObjID?.BankAccount)
            missingFields.push("BankAccount");
          if (!employee?.employeeObjID?.BankIFSC)
            missingFields.push("BankIFSC");
          if (missingFields.length > 0) {
            missingData.push({
              name: `${employee?.employeeObjID?.FirstName || "Not Available"} ${
                employee?.employeeObjID?.LastName || "Not Available"
              }`.trim(),
              id: employee?.employeeObjID?.empID || "Not Available",
              missing: missingFields.join(", "),
            });
          }
        }
        return {
          year: filterYear,
          month: filterMonth,
          employeeObjID: employee.employeeObjID._id,
          employeeData: {
            employeeObjID: employee.employeeObjID._id,
            isAttChecked: true,
            status: "Proceed",
            SalaryStatus: "created",
            daysInMonth: daysInMonth,
            absent: calculateTotal("A", employee),
            present: calculateTotal("P", employee)  + calculateTotal("VH", employee) / 2,
            halfday: calculateTotal("H", employee),
            holiday: calculateTotal("O", employee),
            paidLeaves:
              calculateTotal("VF", employee) + calculateTotal("VH", employee) / 2,
            unpaidLeaves:
              calculateTotal("UF", employee) + calculateTotal("UH", employee) / 2,
            NCNS: calculateTotal("N", employee),
            Sandwhich: calculateTotal("S", employee),
            totalPayableDays: Math.max(
                  calculateTotal("H", employee) / 2 +
                    calculateTotal("P", employee) +
                    calculateTotal("O", employee) -
                    calculateTotal("N", employee) +
                    calculateTotal("VF", employee) +  calculateTotal("UH", employee) / 2 +
                    Math.round(calculateTotal("VH", employee) * 2) / 2, 
                  0
                ),
            FullName: employee?.employeeObjID
              ? `${employee.employeeObjID.FirstName || ""} ${
                  employee.employeeObjID.LastName || ""
                }`.trim()
              : "Not Available",
            empID: employee?.employeeObjID?.empID || "Not Available",
            empID: employee?.employeeObjID?.isFullandFinal || "No",
            doj: employee?.employeeObjID?.DateOfJoining || "Not Available",
            workLocation:
              employee?.employeeObjID?.LocationType || "Not Available",
            PanNumber: employee?.employeeObjID?.PANcardNo || "Not Available",
            UanNumber: employee?.employeeObjID?.UANNumber || "Not Available",
            BankName: employee?.employeeObjID?.BankName || "Not Available",
            BankAccount:
              employee?.employeeObjID?.BankAccount || "Not Available",
            BankIFSC: employee?.employeeObjID?.BankIFSC || "Not Available",
            departmentName:
              employee?.employeeObjID?.department[0]?.DepartmentName ||
              "Not Available",
            designationName:
              employee?.employeeObjID?.position[0]?.PositionName ||
              "Not Available",
            fixedBasic: employee?.employeeObjID?.salary[0]?.BasicSalary || 0,
            fixedHRA: employee?.employeeObjID?.salary[0]?.HRASalary || 0,
            fixedConvenyance:
              employee?.employeeObjID?.salary[0]?.ConvenyanceAllowance || 0,
            fixedOthers:
              employee?.employeeObjID?.salary[0]?.otherAllowance || 0,
            fixedTotalSalary:
              employee?.employeeObjID?.salary[0]?.totalSalary || 0,
          },
        };
      });

      if (missingData.length > 0) {
        setMissingDetails(missingData);
        return;
      }

      await api.post(`/api/payroll/addPayrollRecordsMany`, {
        records,
      }, 
        );
      toast.success("Attendance processed successfully!");
      // navigate(`/hr/Run_payroll`);
      navigate(`/${route}/Run_payroll`);
    } catch (error) {
      console.error("Error processing attendance:", error);
      toast.error("Failed to process attendance.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setMissingDetails([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();
  const filteredAttendance = attendance.filter((employee) =>
    (employee.employeeObjID?.FirstName + " " + employee.employeeObjID?.LastName)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{ height: "93vh", overflow: "auto", position: "relative" }}
      className="container-fluid pb-5"
    >
      <AttendanceFilter
        filterYear={filterYear}
        setFilterYear={setFilterYear}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        uniqueYears={uniqueYears}
        uniqueMonths={uniqueMonths}
        getUserStatusColor={getUserStatusColor}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        isPayrollSend={isPayrollSend}
        processAttendance={processAttendance}
      />
      <AttendanceTable
        filteredAttendance={filteredAttendance}
        filterYear={filterYear}
        filterMonth={filterMonth}
        daysInMonth={daysInMonth}
        darkMode={darkMode}
        selectedAttendance={selectedAttendance}
        setSelectedAttendance={setSelectedAttendance}
        markAttendance={markAttendance}
        calculateTotal={calculateTotal}
      />
      <AttendanceLegend darkMode={darkMode} />

      
      {missingDetails.length > 0 && (
        <div ref={alertRef}>
          <MissingDetailsModal
            missingDetails={missingDetails}
            setMissingDetails={setMissingDetails}
            darkMode={darkMode}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceRegister;


// old
// import React, { useEffect, useState } from "react";
// import api from "../../../Pages/config/api";
// import { useTheme } from "../../../Context/TheamContext/ThemeContext";
// import AttendanceFilter from "./AttendanceRegisterModules/AttendanceFilter";
// import AttendanceTable from "./AttendanceRegisterModules/AttendanceTable";
// import AttendanceLegend from "./AttendanceRegisterModules/AttendanceLegend";

// const AttendanceRegister = () => {
//   const { darkMode } = useTheme();
//   const [attendance, setAttendance] = useState([]);
//   const [availableYears, setAvailableYears] = useState([]);
//   const [availableMonths, setAvailableMonths] = useState([]);
//   const [filterYear, setFilterYear] = useState(new Date().getFullYear());
//   const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);

//   console.log("Attendance data:", attendance);
//   console.log("Filter Year:", filterYear, "Filter Month:", filterMonth);
//   console.log("Available Years:", availableYears);
//   console.log("Available Months:", availableMonths);

//   // Fetch filters on component mount
//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         const res = await api.get('/api/attendance/filters');
//         setAvailableYears(res.data.years || []);
//         setAvailableMonths(res.data.months || []);
//       } catch (err) {
//         console.error('Error fetching filters:', err);
//         // Set defaults if API fails
//         setAvailableYears([new Date().getFullYear()]);
//         setAvailableMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
//       }
//     };
//     fetchFilters();
//   }, []);

//   // Fetch attendance whenever year/month changes
// useEffect(() => {
//   const fetchAttendance = async () => {
//     try {
//       const res = await api.get(`/api/attendance-register/${filterYear}/${filterMonth}`);
//       const data = res.data || [];

//       // Transform data to match expected structure
//       const transformedData = data.map(employee => ({
//         ...employee,
//         years: employee.attendance || [],
//         AttendanceSummary: employee.attendance?.find(y => y.year === filterYear)?.months?.find(m => m.month === filterMonth)?.totals || {},
//       }));

//       setAttendance(transformedData);

//       console.log("Available Years:", availableYears);
//       console.log("Available Months:", availableMonths);
//     } catch (err) {
//       console.error("Error fetching attendance:", err);
//     }
//   };

//   if (filterYear && filterMonth) {
//     fetchAttendance();
//   }
// }, [filterYear, filterMonth]);

//   const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();


//   console.log("Days in Month:", daysInMonth);

//   return (
//     <div className="container-fluid pb-5" style={{ height: "93vh", overflow: "auto" }}>
//       <AttendanceFilter
//         filterYear={filterYear}
//         setFilterYear={setFilterYear}
//         filterMonth={filterMonth}
//         setFilterMonth={setFilterMonth}
//         availableYears={availableYears}
//         availableMonths={availableMonths}
//         darkMode={darkMode}
//       />
//       <AttendanceTable
//         attendance={attendance}
//         filterYear={filterYear}
//         filterMonth={filterMonth}

//         darkMode={darkMode}
//       />
//       <AttendanceLegend darkMode={darkMode} />
//     </div>
//   );
// };

// export default AttendanceRegister;


// import React, { useEffect, useRef, useState } from "react";
// import { useTheme } from "../../../Context/TheamContext/ThemeContext";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import AttendanceFilter from "./AttendanceRegisterModules/AttendanceFilter";
// import AttendanceTable from "./AttendanceRegisterModules/AttendanceTable";
// import AttendanceLegend from "./AttendanceRegisterModules/AttendanceLegend";
// import MissingDetailsModal from "./AttendanceRegisterModules/MissingDetailsModal";
// import api from "../../../Pages/config/api";

// const AttendanceRegister = () => {
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth() + 1;

//   const [filterMonth, setFilterMonth] = useState(currentMonth);
//   const [filterYear, setFilterYear] = useState(currentYear);
//   const [attendance, setAttendance] = useState([]);
//   const { darkMode } = useTheme();
//   const [missingDetails, setMissingDetails] = useState([]);
//   const [isPayrollSend, setIsPayrollSend] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const route = useLocation().pathname.split("/")[1];
//   const [selectedAttendance, setSelectedAttendance] = useState({
//     employeeId: null,
//     day: null,
//   });

//   const navigate = useNavigate();
//   const alertRef = useRef(null);

//   useEffect(() => {
//     fetchAttendanceData();
//     fetchPayroll();
//   }, [filterYear, filterMonth]);

//   // ✅ अब नया backend route call होगा
//   const fetchAttendanceData = async () => {
//     try {
//       const response = await api.get(
//         `/api/attendance-register/${filterYear}/${filterMonth}`
//       );
//       setAttendance(response.data);
//       console.log("Attendance register data:", response.data);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//     }
//   };


//   const uniqueYears = Array.from(
//   new Set(
//     attendance.flatMap((employee) =>
//       employee.attendance?.map((year) => year.year) || []
//     )
//   )
// );

// const uniqueMonths = Array.from(
//   new Set(
//     attendance.flatMap((employee) =>
//       employee.attendance
//         ?.filter((year) => year.year === filterYear)
//         .flatMap((year) => year.months.map((month) => month.month)) || []
//     )
//   )
// );


//   const fetchPayroll = async () => {
//     try {
//       const response = await api.get(`/api/payroll`);
//       const yearData = response.data[0]?.years.find(
//         (yr) => yr.year === filterYear
//       );
//       const monthData = yearData?.months.find((m) => m.month === filterMonth);
//       setIsPayrollSend(monthData?.isPayslipSent || false);
//     } catch (error) {
//       console.error("Error fetching payroll data", error);
//     }
//   };

//   // ✅ Payroll processing अब backend से आए totals पर आधारित है
//   const processAttendance = async () => {
//     try {
//       let missingData = [];
//       const records = attendance.map((employee) => {
//         const missingFields = [];
//         if (employee?.status === "active") {
//           if (!employee?.PANcardNo) missingFields.push("PanNumber");
//           if (!employee?.UANNumber) missingFields.push("UanNumber");
//           if (!employee?.BankName) missingFields.push("BankName");
//           if (!employee?.BankAccount) missingFields.push("BankAccount");
//           if (!employee?.BankIFSC) missingFields.push("BankIFSC");
//           if (missingFields.length > 0) {
//             missingData.push({
//               name: `${employee?.FirstName || ""} ${employee?.LastName || ""}`.trim(),
//               id: employee?.empID || "Not Available",
//               missing: missingFields.join(", "),
//             });
//           }
//         }

//         // 👉 backend से आए totals का इस्तेमाल करें
//         const monthTotals =
//           employee.attendance
//             ?.find((y) => y.year === filterYear)
//             ?.months.find((m) => m.month === filterMonth)?.totals || {};

//         return {
//           year: filterYear,
//           month: filterMonth,
//           employeeObjID: employee.userId,
//           employeeData: {
//             employeeObjID: employee.userId,
//             isAttChecked: true,
//             status: "Proceed",
//             SalaryStatus: "created",
//             daysInMonth: new Date(filterYear, filterMonth, 0).getDate(),
//             ...monthTotals, // ✅ backend से आए totals
//             FullName: `${employee.FirstName || ""} ${employee.LastName || ""}`.trim(),
//             empID: employee.empID || "Not Available",
//             doj: employee.DateOfJoining || "Not Available",
//             workLocation: employee.LocationType || "Not Available",
//             PanNumber: employee.PANcardNo || "Not Available",
//             UanNumber: employee.UANNumber || "Not Available",
//             BankName: employee.BankName || "Not Available",
//             BankAccount: employee.BankAccount || "Not Available",
//             BankIFSC: employee.BankIFSC || "Not Available",
//             departmentName: employee.department?.DepartmentName || "Not Available",
//             designationName: employee.position?.PositionName || "Not Available",
//             fixedBasic: employee.salary?.BasicSalary || 0,
//             fixedHRA: employee.salary?.HRASalary || 0,
//             fixedConvenyance: employee.salary?.ConvenyanceAllowance || 0,
//             fixedOthers: employee.salary?.otherAllowance || 0,
//             fixedTotalSalary: employee.salary?.totalSalary || 0,
//           },
//         };
//       });

//       if (missingData.length > 0) {
//         setMissingDetails(missingData);
//         return;
//       }

//       await api.post(`/api/payroll/addPayrollRecordsMany`, { records });
//       toast.success("Attendance processed successfully!");
//       navigate(`/${route}/Run_payroll`);
//     } catch (error) {
//       console.error("Error processing attendance:", error);
//       toast.error("Failed to process attendance.");
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (alertRef.current && !alertRef.current.contains(event.target)) {
//         setMissingDetails([]);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();
//   const filteredAttendance = attendance.filter((employee) =>
//     (employee.FirstName + " " + employee.LastName)
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div style={{ height: "93vh", overflow: "auto", position: "relative" }} className="container-fluid pb-5">
//       {/* <AttendanceFilter
//         filterYear={filterYear}
//         setFilterYear={setFilterYear}
//         filterMonth={filterMonth}
//         setFilterMonth={setFilterMonth}
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         darkMode={darkMode}
//         isPayrollSend={isPayrollSend}
//         processAttendance={processAttendance}
//       /> */}

//       <AttendanceFilter
//   filterYear={filterYear}
//   setFilterYear={setFilterYear}
//   filterMonth={filterMonth}
//   setFilterMonth={setFilterMonth}
//   uniqueYears={uniqueYears || []}
//   uniqueMonths={uniqueMonths || []}
//   // getUserStatusColor={getUserStatusColor}
//   searchQuery={searchQuery}
//   setSearchQuery={setSearchQuery}
//   darkMode={darkMode}
//   isPayrollSend={isPayrollSend}
//   processAttendance={processAttendance}
// />

//       <AttendanceTable
//         filteredAttendance={filteredAttendance}
//         filterYear={filterYear}
//         filterMonth={filterMonth}
//         daysInMonth={daysInMonth}
//         darkMode={darkMode}
//         selectedAttendance={selectedAttendance}
//         setSelectedAttendance={setSelectedAttendance}
//         // ✅ अब markAttendance/calculateTotal की ज़रूरत नहीं
//         // सीधे backend से आए calcStatus और totals दिखाएँ
//       />
//       <AttendanceLegend darkMode={darkMode} />

//       {missingDetails.length > 0 && (
//         <div ref={alertRef}>
//           <MissingDetailsModal
//             missingDetails={missingDetails}
//             setMissingDetails={setMissingDetails}
//             darkMode={darkMode}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceRegister;





// old code not working below
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { useTheme } from "../../../Context/TheamContext/ThemeContext";
// import BASE_URL from "../../../Pages/config/config";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import AttendanceFilter from "./AttendanceRegisterModules/AttendanceFilter";
// import AttendanceTable from "./AttendanceRegisterModules/AttendanceTable";
// import AttendanceLegend from "./AttendanceRegisterModules/AttendanceLegend";
// import MissingDetailsModal from "./AttendanceRegisterModules/MissingDetailsModal";
// import api from "../../../Pages/config/api";

// const AttendanceRegister = () => {
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth() + 1;
//   const [filterMonth, setFilterMonth] = useState(currentMonth);
//   const [filterYear, setFilterYear] = useState(currentYear);
//   const [attendance, setAttendance] = useState([]);
//   const { darkMode } = useTheme();
//   const [missingDetails, setMissingDetails] = useState([]);
//   const [isPayrollSend, setIsPayrollSend] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const route = useLocation().pathname.split("/")[1];
//   const [selectedAttendance, setSelectedAttendance] = useState({
//     employeeId: null,
//     day: null,
//   });
//   const navigate = useNavigate();
//   const alertRef = useRef(null);

//   useEffect(() => {
//     fetchAttendanceData();
//     fetchPayroll();
//   }, [filterYear, filterMonth]);

//   const fetchAttendanceData = async () => {
//     try {
//       // Fetch pre-calculated attendance from backend
//       const response = await api.get(
//         `/api/attendance-register/${filterYear}/${filterMonth}`
//       );

//       // Backend returns full attendance with all calculations
//       // Map to component's expected format
//       const transformedData = response.data.map(record => ({
//         employeeObjID: {
//           _id: record.userId,
//           FirstName: record.FirstName,
//           LastName: record.LastName,
//           empID: record.EmpId,
//           Email: record.Email,
//           department: record.Department ? [record.Department] : [],
//           reportManager: record.ReportManager,
//           reportHr: record.ReportHr,
//           status: "active",
//         },
//         years: [
//           {
//             year: record.Year,
//             months: [
//               {
//                 month: record.Month,
//                 dates: record.Attendance, // Already has status, title, code from backend
//               },
//             ],
//           },
//         ],
//         AttendanceSummary: record.AttendanceSummary, // Pre-calculated stats
//       }));

//       setAttendance(transformedData);
//       console.log("Attendance data (pre-calculated from backend):", transformedData);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//     }
//   };

//   const fetchPayroll = async () => {
//     try {
//       const response = await api.get(`/api/payroll`, {
//         });
//       const yearData = response.data[0]?.years.find(
//         (yr) => yr.year === filterYear
//       );
//       const monthData = yearData?.months.find((m) => m.month === filterMonth);
//       const isPayslipSent = monthData?.isPayslipSent;
//       setIsPayrollSend(isPayslipSent);
//     } catch (error) {
//       console.error("Error fetching payroll data", error);
//     }
//   };

//   // ✅ ALL ATTENDANCE CALCULATIONS NOW HAPPEN ON BACKEND
//   // markAttendance function REMOVED — calculateTotal function REMOVED
//   // Backend returns pre-calculated status, title, code for each date
  
//   const getColorForStatus = (code) => {
//     const colorMap = {
//       P: darkMode ? "rgb(26, 188, 156)" : "rgba(26, 188, 156, 0.64)",  // Present - Green
//       A: darkMode ? "rgba(231, 18, 18, 0.93)" : "rgba(231, 18, 18, 0.38)", // Absent - Red
//       H: darkMode ? "rgb(243, 156, 18)" : "rgba(243, 157, 18, 0.73)", // Half Day - Orange
//       L: darkMode ? "rgb(93, 173, 226)" : "rgba(170, 211, 238, 0.55)", // Late - Blue
//       O: darkMode ? "rgb(63, 157, 233)" : "rgba(72, 152, 218, 0.66)", // Holiday - Light Blue
//       W: darkMode ? "rgb(155, 89, 182)" : "rgba(201, 117, 235, 0.32)", // Week Off - Purple
//       N: darkMode ? "rgba(255, 0, 0, 0.99)" : "rgba(255, 0, 0, 0.73)", // NCNS - Red
//       S: darkMode ? "rgb(244, 208, 63)" : "rgba(244, 208, 63, 0.67)", // Sandwich - Yellow
//       "--": darkMode ? "#c1bdbd" : "rgba(32, 32, 32, 0.3)", // No Data - Gray
//     };
//     return colorMap[code] || "#ccc";
//   };

//   const uniqueYears = Array.from(
//     new Set(
//       attendance.flatMap((employee) => employee.years.map((year) => year.year))
//     )
//   );

//   const uniqueMonths = Array.from(
//     new Set(
//       attendance.flatMap((employee) =>
//         employee.years
//           .filter((year) => year.year === filterYear)
//           .flatMap((year) => year.months.map((month) => month.month))
//       )
//     )
//   );

//   const getUserStatusColor = (month) => {
//     switch (month) {
//       case 1:
//         return "January";
//       case 2:
//         return "February";
//       case 3:
//         return "March";
//       case 4:
//         return "April";
//       case 5:
//         return "May";
//       case 6:
//         return "June";
//       case 7:
//         return "July";
//       case 8:
//         return "August";
//       case 9:
//         return "September";
//       case 10:
//         return "October";
//       case 11:
//         return "November";
//       case 12:
//         return "December";
//       default:
//         return "";
//     }
//   };

//   // ✅ calculateTotal REMOVED — Backend now provides AttendanceSummary with all counts

//   const processAttendance = async () => {
//     try {
//       let missingData = [];
//       const records = attendance.map((employee) => {
//         const missingFields = [];
//         if (employee?.employeeObjID?.status === "active") {
//           if (!employee?.employeeObjID?.PANcardNo)
//             missingFields.push("PanNumber");
//           if (!employee?.employeeObjID?.UANNumber)
//             missingFields.push("UanNumber");
//           if (!employee?.employeeObjID?.BankName)
//             missingFields.push("BankName");
//           if (!employee?.employeeObjID?.BankAccount)
//             missingFields.push("BankAccount");
//           if (!employee?.employeeObjID?.BankIFSC)
//             missingFields.push("BankIFSC");
//           if (missingFields.length > 0) {
//             missingData.push({
//               name: `${employee?.employeeObjID?.FirstName || "Not Available"} ${
//                 employee?.employeeObjID?.LastName || "Not Available"
//               }`.trim(),
//               id: employee?.employeeObjID?.empID || "Not Available",
//               missing: missingFields.join(", "),
//             });
//           }
//         }
        
//         // ✅ Use pre-calculated summary from backend instead of calculateTotal()
//         const summary = employee.AttendanceSummary || {
//           present: 0,
//           absent: 0,
//           halfday: 0,
//           holiday: 0,
//           late: 0,
//           ncns: 0,
//           sandwich: 0,
//           paidLeaves: 0,
//           unpaidLeaves: 0,
//           totalPayableDays: 0,
//         };

//         return {
//           year: filterYear,
//           month: filterMonth,
//           employeeObjID: employee.employeeObjID._id,
//           employeeData: {
//             employeeObjID: employee.employeeObjID._id,
//             isAttChecked: true,
//             status: "Proceed",
//             SalaryStatus: "created",
//             daysInMonth: daysInMonth,
//             absent: summary.absent,
//             present: summary.present + summary.paidLeaves,
//             halfday: summary.halfday,
//             holiday: summary.holiday,
//             paidLeaves: summary.paidLeaves,
//             unpaidLeaves: summary.unpaidLeaves,
//             NCNS: summary.ncns,
//             Sandwhich: summary.sandwich,
//             totalPayableDays: summary.totalPayableDays,
//             FullName: employee?.employeeObjID
//               ? `${employee.employeeObjID.FirstName || ""} ${
//                   employee.employeeObjID.LastName || ""
//                 }`.trim()
//               : "Not Available",
//             empID: employee?.employeeObjID?.empID || "Not Available",
//             isFullandFinal: employee?.employeeObjID?.isFullandFinal || "No",
//             doj: employee?.employeeObjID?.DateOfJoining || "Not Available",
//             workLocation:
//               employee?.employeeObjID?.LocationType || "Not Available",
//             PanNumber: employee?.employeeObjID?.PANcardNo || "Not Available",
//             UanNumber: employee?.employeeObjID?.UANNumber || "Not Available",
//             BankName: employee?.employeeObjID?.BankName || "Not Available",
//             BankAccount:
//               employee?.employeeObjID?.BankAccount || "Not Available",
//             BankIFSC: employee?.employeeObjID?.BankIFSC || "Not Available",
//             departmentName:
//               employee?.employeeObjID?.department[0]?.DepartmentName ||
//               "Not Available",
//             designationName:
//               employee?.employeeObjID?.position?.[0]?.PositionName ||
//               "Not Available",
//             fixedBasic: employee?.employeeObjID?.salary?.[0]?.BasicSalary || 0,
//             fixedHRA: employee?.employeeObjID?.salary?.[0]?.HRASalary || 0,
//             fixedConvenyance:
//               employee?.employeeObjID?.salary?.[0]?.ConvenyanceAllowance || 0,
//             fixedOthers:
//               employee?.employeeObjID?.salary?.[0]?.otherAllowance || 0,
//             fixedTotalSalary:
//               employee?.employeeObjID?.salary?.[0]?.totalSalary || 0,
//           },
//         };
//       });

//       if (missingData.length > 0) {
//         setMissingDetails(missingData);
//         return;
//       }

//       await api.post(`/api/payroll/addPayrollRecordsMany`, {
//         records,
//       }, 
//         );
//       toast.success("Attendance processed successfully!");
//       // navigate(`/hr/Run_payroll`);
//       navigate(`/${route}/Run_payroll`);
//     } catch (error) {
//       console.error("Error processing attendance:", error);
//       toast.error("Failed to process attendance.");
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (alertRef.current && !alertRef.current.contains(event.target)) {
//         setMissingDetails([]);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();
//   const filteredAttendance = attendance.filter((employee) =>
//     (employee.employeeObjID?.FirstName + " " + employee.employeeObjID?.LastName)
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div
//       style={{ height: "93vh", overflow: "auto", position: "relative" }}
//       className="container-fluid pb-5"
//     >
//       <AttendanceFilter
//         filterYear={filterYear}
//         setFilterYear={setFilterYear}
//         filterMonth={filterMonth}
//         setFilterMonth={setFilterMonth}
//         uniqueYears={uniqueYears}
//         uniqueMonths={uniqueMonths}
//         getUserStatusColor={getUserStatusColor}
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         darkMode={darkMode}
//         isPayrollSend={isPayrollSend}
//         processAttendance={processAttendance}
//       />
//       <AttendanceTable
//         filteredAttendance={filteredAttendance}
//         filterYear={filterYear}
//         filterMonth={filterMonth}
//         daysInMonth={daysInMonth}
//         darkMode={darkMode}
//         selectedAttendance={selectedAttendance}
//         setSelectedAttendance={setSelectedAttendance}
//         getColorForStatus={getColorForStatus}
//       />
//       <AttendanceLegend darkMode={darkMode} />

      
//       {missingDetails.length > 0 && (
//         <div ref={alertRef}>
//           <MissingDetailsModal
//             missingDetails={missingDetails}
//             setMissingDetails={setMissingDetails}
//             darkMode={darkMode}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceRegister;
