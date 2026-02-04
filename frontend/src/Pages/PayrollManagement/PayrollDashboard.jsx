import React, { useEffect, useRef, useState } from "react";
import TittleHeader from "../TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import {
  MdAutoGraph,
  MdInfoOutline,
  MdKeyboardArrowRight,
  MdOutlineFullscreen,
  MdOutlineFullscreenExit,
  MdOutlinePayments,
} from "react-icons/md";
import SalaryStatusImage from "../../img/Payroll/SalaryStatus.svg";
import ActivityImage from "../../img/Payroll/Activity.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatIndianCurrency } from "../../Utils/CurrencySymbol/formatIndianCurrency";
import { LuCalendar, LuIndianRupee } from "react-icons/lu";
import axios from "axios";
import BASE_URL from "../config/config";
import ProfileAvatar from "../../Utils/ProfileAvatar/ProfileAvatar";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
  BsGraphDownArrow,
  BsGraphUpArrow,
} from "react-icons/bs";
import { FaCoins, FaHandHoldingUsd, FaUserCheck } from "react-icons/fa";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import api from "../config/api";

const getStartAndEndDate = (year, month) => {
  // Get the first day of the month
  const startDate = new Date(year, month - 1, 1);

  // Get the last day of the month
  const endDate = new Date(year, month, 0);

  // Format dates to dd-mm-yyyy
  const startFormatted = `${startDate.getDate()} ${startDate.toLocaleString(
    "en-US",
    { month: "short" }
  )} ${startDate.getFullYear()}`;
  const endFormatted = `${endDate.getDate()} ${endDate.toLocaleString("en-US", {
    month: "short",
  })} ${endDate.getFullYear()}`;

  return { startFormatted, endFormatted };
};

const PayrollDashboard = () => {
  const { darkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYearData = new Date().getFullYear();
  const currentMonthData = new Date().getMonth() + 1;
  const Paramsyear = searchParams.get("year") || currentYearData;
  const Paramsmonth = searchParams.get("month") || currentMonthData;
  const [selectedYear, setSelectedYear] = useState(parseInt(Paramsyear, 10));
  const [selectedMonth, setSelectedMonth] = useState(parseInt(Paramsmonth, 10));
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [isAttencanceCheck, setIsAttencanceCheck] = useState(false);
  const [isSalaryChecked, setIsSalaryChecked] = useState(false);
  const [isIncentivandBonusChecked, setIsIncentivandBonusChecked] =
    useState(false);
  const [isArrerChecked, setIsArrerChecked] = useState(false);
  const [isDeductionChecked, setIsDeductionChecked] = useState(false);
  const [isReimbursmentChecked, setIsReimbursmentChecked] = useState(false);
  const [isAdvanceChecked, setIsAdvanceChecked] = useState(false);
  const [salaryStatus, setISsalaryStatus] = useState(false);
  const [ShowArrearDetails, setShowArrearDetails] = useState(false);
  const [showInsentiveDetails, setShowInsentiveDetails] = useState(false);
  const [showAdvanceDetails, setShowAdvanceDetails] = useState(false);
  const [filter, setFilter] = useState("All");
  const [maxCombinedSalary, setMaxCombinedSalary] = useState(0);
  const [transformedData, setTransformedData] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  const filteredUpdates = updates.filter((data) =>
    filter === "All" ? true : data.status === filter
  );
  const scrollRef = useRef(null);

  const { userData } = useSelector((state) => state.user);
  const UserType = userData.Account;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [transformedData]); // Ensure it scrolls when data updates

  // Function to update URL parameters when year or month changes
  const updateURLParams = (year, month) => {
    searchParams.set("year", year);
    searchParams.set("month", month);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  useEffect(() => {
    const fetchEmployeeAttendanceData = async () => {
      try {
        const response = await api.get(`/api/payroll`, {
        });
        const payrollRecords = response.data;

        // Get previous month and adjust year if needed
        let prevMonth = selectedMonth - 1;
        let prevYear = selectedYear;
        if (prevMonth === 0) {
          prevMonth = 12;
          prevYear -= 1;
        }

        // Helper function to extract employee attendance data
        const extractAttendanceData = (year, month) => {
          return payrollRecords
            .filter((record) => record.years.some((y) => y.year === year))
            .flatMap((record) =>
              record.years
                .filter((y) => y.year === year)
                .flatMap((y) =>
                  y.months
                    .filter((m) => m.month === month)
                    .flatMap((m) => m.EmployeeAttandanceData || [])
                )
            );
        };

        // Get records for selected and previous months
        const filteredRecords = extractAttendanceData(
          selectedYear,
          selectedMonth
        );
        const previousRecords = extractAttendanceData(prevYear, prevMonth);

        // Get payroll status flags for selected month
        const yearData = payrollRecords
          .find((r) => r.years.some((y) => y.year === selectedYear))
          ?.years.find((y) => y.year === selectedYear);

        const monthData = yearData?.months.find(
          (m) => m.month === selectedMonth
        );

        setISsalaryStatus(monthData?.SalaryStatus || false);
        setIsAttencanceCheck(monthData?.isAttencanceCheck || false);
        setIsSalaryChecked(monthData?.isSalaryChecked || false);
        setIsIncentivandBonusChecked(
          monthData?.isIncentivandBonusChecked || false
        );
        setIsArrerChecked(monthData?.isArrerChecked || false);
        setIsDeductionChecked(monthData?.isDeductionChecked || false);
        setIsReimbursmentChecked(monthData?.isReimbursmentChecked || false);
        setIsAdvanceChecked(monthData?.isAdvanceChecked || false);

        // Create a map of previous advances for easy lookup
        const previousAdvanceMap = new Map();
        previousRecords.forEach((prevEmp) => {
          const empID = prevEmp?.employeeObjID?._id || prevEmp?._id;
          previousAdvanceMap.set(empID, prevEmp?.advanceBalance || 0);
        });

        // Process employee attendance data
        const initialUpdates = filteredRecords.map((employee) => {
          const empID = employee?.employeeObjID?._id || employee?._id;
          const latestSalary =
            employee?.employeeObjID?.salary?.slice(-1)[0] || {};

          return {
            employeeObjID: empID,
            FullName: `${employee?.employeeObjID?.FirstName || ""} ${
              employee?.employeeObjID?.LastName || ""
            }`.trim(),
            empID: employee?.employeeObjID?.empID || "",
            profile: employee?.employeeObjID?.profile?.image_url,
            BasicSalary: latestSalary?.BasicSalary || 0,
            BasicHRA: latestSalary?.HRASalary || 0,
            BasicConvenyance: latestSalary?.ConvenyanceAllowance || 0,
            BasicOthers: latestSalary?.OtherAllowance || 0,
            FixedMonthlySalary: latestSalary?.totalSalary || 0,
            isAttChecked: employee?.isAttChecked || false,
            status: employee?.status || "Proceed",
            daysInMonth: employee?.daysInMonth || 0,
            absent: employee?.absent || 0,
            present: employee?.present || 0,
            halfday: employee?.halfday || 0,
            holiday: employee?.holiday || 0,
            paidLeaves: employee?.paidLeaves || 0,
            unpaidLeaves: employee?.unpaidLeaves || 0,
            NCNS: employee?.NCNS || 0,
            Sandwhich: employee?.Sandwhich || 0,
            totalPayableDays: employee?.totalPayableDays || 0,
            fixedBasic: employee?.fixedBasic || 0,
            fixedHRA: employee?.fixedHRA || 0,
            fixedConvenyance: employee?.fixedConvenyance || 0,
            fixedOthers: employee?.fixedOthers || 0,
            fixedTotalSalary: employee?.fixedTotalSalary || 0,
            actualBasic: employee?.actualBasic || 0,
            actualHRA: employee?.actualHRA || 0,
            actualConvenyance: employee?.actualConvenyance || 0,
            actualOthers: employee?.actualOthers || 0,
            actualTotalSalary: employee?.actualTotalSalary || 0,
            bonusAmount: employee?.bonusAmount || 0,
            bonusType: employee?.bonusType || "",
            insentiveAmount: employee?.insentiveAmount || 0,
            insentiveType: employee?.insentiveType || "",
            totalBNIAdditions: employee?.totalBNIAdditions || 0,
            additionComment: employee?.additionComment || "",
            salaryaAfterBonusAndInsentive:
              employee?.salaryaAfterBonusAndInsentive || 0,
            ArrearMonth: employee?.ArrearMonth || "",
            ArrearAmountPay: employee?.ArrearAmountPay || 0,
            ArrearAmountDeduct: employee?.ArrearAmountDeduct || 0,
            SalaryAfterArrearAmt: employee?.SalaryAfterArrearAmt || 0,
            arrearMessage: employee?.arrearMessage || "",
            PFDeduction: employee?.PFDeduction || 0,
            ESIDedeuction: employee?.ESIDedeuction || 0,
            TDSDeduction: employee?.TDSDeduction || 0,
            totalDeductionsAmount: employee?.totalDeductionsAmount || 0,
            SalaryAfterDeduction: employee?.SalaryAfterDeduction || 0,
            deductionNotes: employee?.deductionNotes || "",
            salaryAfterPFESIandTDS: employee?.salaryAfterPFESIandTDS || 0,
            reimbursmentApplied: employee?.reimbursmentApplied || 0,
            reimbursmentApproved: employee?.reimbursmentApproved || 0,
            reimbursmentNotes: employee?.reimbursmentNotes || "",
            salaryAfterReimbursment: employee?.salaryAfterReimbursment || 0,
            advanceDuration: employee?.advanceDuration || 0,
            PreviousAdvance: previousAdvanceMap.get(empID) || 0,
            advanceAmountPay: employee?.advanceAmountPay || 0,
            advanceAmountDeduct: employee?.advanceAmountDeduct || 0,
            advanceBalance: employee?.advanceBalance || 0,
            netSalaryPayable: employee?.netSalaryPayable || 0,
            ReasionForAdvance: employee?.ReasionForAdvance || "",
          };
        });

        setUpdates(initialUpdates);
      } catch (error) {
        console.error("Error fetching employee attendance data:", error);
      }
    };

    fetchEmployeeAttendanceData();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const fetchEmployeeAttendanceDataGraph = async () => {
      try {
        const response = await api.get(`/api/payroll`, {
        });
        const payrollRecords = response.data;

        // Helper function to extract employee attendance data
        const extractAttendanceData = (year, month) => {
          return payrollRecords
            .filter((record) => record.years.some((y) => y.year === year))
            .flatMap((record) =>
              record.years
                .filter((y) => y.year === year)
                .flatMap((y) =>
                  y.months
                    .filter((m) => m.month === month)
                    .flatMap((m) => m.EmployeeAttandanceData || [])
                )
            );
        };

        // Get the current date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // Months are 1-indexed

        // Initialize arrays to store data for the previous 12 months
        const previous12MonthsData = [];

        // Loop through the previous 12 months
        for (let i = 0; i < 12; i++) {
          // Calculate the month and year for the current iteration
          let month = currentMonth - i;
          let year = currentYear;

          // Adjust month and year if the month is less than 1
          if (month < 1) {
            month += 12;
            year -= 1;
          }

          // Fetch data for the current month and year
          const monthData = extractAttendanceData(year, month);

          // Calculate the total salary after reimbursement for the month
          const salaryAfterReimbursment = monthData.reduce(
            (sum, emp) => sum + (emp.salaryAfterReimbursment || 0),
            0
          );

          // Add the data to the array
          previous12MonthsData.push({
            month,
            year,
            salaryAfterReimbursment,
          });
        }

        // Reverse the array to display the months in chronological order
        previous12MonthsData.reverse();

        // Calculate total spending for the previous 12 months
        const totalSpending = previous12MonthsData.reduce(
          (sum, data) => sum + data.salaryAfterReimbursment,
          0
        );

        // Calculate total spending for the previous 12 months of the previous year
        const previous12MonthsDataLastYear = previous12MonthsData.map(
          (data) => ({
            month: data.month,
            year: data.year - 1,
            salaryAfterReimbursment: extractAttendanceData(
              data.year - 1,
              data.month
            ).reduce((sum, emp) => sum + (emp.salaryAfterReimbursment || 0), 0),
          })
        );

        const previousYearSpending = previous12MonthsDataLastYear.reduce(
          (sum, data) => sum + data.salaryAfterReimbursment,
          0
        );

        // Calculate percentage change
        const percentageChange =
          previousYearSpending === 0
            ? totalSpending > 0
              ? 100
              : 0 // If spending increases from 0, consider it a 100% increase
            : ((totalSpending - previousYearSpending) / previousYearSpending) *
              100;

        // Set total spending and percentage change in state
        setTotalSpending(totalSpending);
        setPercentageChange(percentageChange);

        // Combine data for comparison (current and previous years)
        const transformedData = previous12MonthsData.map((data, index) => ({
          currentMonth: data.month,
          currentYear: data.year,
          currentCombinedSalary: data.salaryAfterReimbursment,
          previousCombinedSalary:
            previous12MonthsDataLastYear[index].salaryAfterReimbursment,
        }));

        // Set the transformed data for rendering
        setTransformedData(transformedData);

        // Calculate maxCombinedSalary for scaling the bar heights
        const maxCombinedSalary = Math.max(
          ...transformedData.map((data) =>
            Math.max(data.currentCombinedSalary, data.previousCombinedSalary)
          )
        );
        setMaxCombinedSalary(maxCombinedSalary);
      } catch (error) {
        console.error("Error fetching employee attendance data:", error);
      }
    };

    fetchEmployeeAttendanceDataGraph();
  }, []);
  const formatSalary = (num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + " C";
    if (num >= 100000) return (num / 100000).toFixed(1) + " L";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNumber - 1] || "Invalid Month";
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const latestMonth = currentMonth;
    const latestYear = currentYear;

    const { startFormatted, endFormatted } = getStartAndEndDate(
      selectedYear,
      selectedMonth
    );

    setStartDate(startFormatted);
    setEndDate(endFormatted);
  }, [selectedYear, selectedMonth]);

  // Handle year change
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setSelectedYear(newYear);
    updateURLParams(newYear, selectedMonth);
  };

  // Handle month change
  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setSelectedMonth(newMonth);
    updateURLParams(selectedYear, newMonth);
  };
  const monthNames = [
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

  const statusMap = {
    created: { text: "Salary Created", className: "badge-warning" },
    inprogress: { text: "Salary In - Progress", className: "badge-info" },
    completed: { text: "Salary Furnished", className: "badge-success" },
  };

  const { text, className } = statusMap[salaryStatus] || {
    text: "Pending to Process",
    className: "badge-warning",
  };

  const activities = [
    {
      checked: isReimbursmentChecked,
      label: "Reimbursement Checked",
      icon: <MdOutlinePayments className="fs-3 text-primary" />,
    }, // Payment icon
    {
      checked: isDeductionChecked,
      label: "Deduction Checked",
      icon: <BsFillArrowDownCircleFill className="fs-3 text-danger" />,
    }, // Downward arrow to indicate deduction
    {
      checked: isAdvanceChecked,
      label: "Advance Checked",
      icon: <FaHandHoldingUsd className="fs-3 text-warning" />,
    }, // Hand holding money
    {
      checked: isArrerChecked,
      label: "Arrear Checked",
      icon: <BsFillArrowUpCircleFill className="fs-3 text-info" />,
    }, // Upward arrow to indicate pending payments
    {
      checked: isIncentivandBonusChecked,
      label: "Incentive & Bonus Checked",
      icon: <FaCoins className="fs-3 text-success" />,
    }, // Coins to indicate incentives/bonus
    {
      checked: isSalaryChecked,
      label: "Salary Checked",
      icon: <LuIndianRupee className="fs-3 text-success" />,
    }, // Money symbol to indicate salary
    {
      checked: isAttencanceCheck,
      label: "Attendance Checked",
      icon: <FaUserCheck className="fs-3 text-primary" />,
    }, // User check icon for attendance
  ];

  return (
    <div
      className="container-fluid"
      style={{ color: darkMode ? "#000" : "#FFF" }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <TittleHeader
          title={"Payroll Dashboard"}
          message={"You can view payroll details"}
        />
        <div className="d-flex align-items-center gap-2">
          <span
            className="d-flex align-items-center gap-2"
            style={{ whiteSpace: "pre" }}
          >
            <LuCalendar /> Pay Period
          </span>

          {/* Year Selector */}
          <select
            onChange={handleYearChange}
            className={`form-select ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            style={{ width: "fit-content" }}
            value={selectedYear}
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = currentYear - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>

          {/* Month Selector */}
          <select
            onChange={handleMonthChange}
            style={{ width: "fit-content" }}
            className={`form-select ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            value={selectedMonth}
          >
            {Array.from({ length: 12 }, (_, i) => {
              const monthValue = i + 1;
              const isDisabled =
                selectedYear === currentYear && monthValue > currentMonth;

              return (
                <option
                  key={monthValue}
                  value={monthValue}
                  disabled={isDisabled}
                >
                  {new Date(2024, i, 1).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div>
        <div className="row mx-auto mt-2">
          <div className="col-12 col-lg-9  p-0">
            <div className="pr-0 pr-lg-2">
              <div
                className="p-3 rounded-2"
                style={{ background: "rgba(187, 184, 184, 0.2)" }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h6
                        style={{
                          fontSize: "1.4rem",
                          fontStyle: "normal",
                          fontWeight: "500",
                          lineHeight: "1.6rem",
                          letterSpacing: "3.007px",
                        }}
                        className="m-0"
                      >
                        Process Payroll for: {monthNames[selectedMonth - 1]}{" "}
                        {selectedYear}
                      </h6>
                      <span className="badge-success py-1 px-2">Approved</span>
                    </div>
                    <p className="m-0">
                      {startDate} - {endDate}
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2 py-2">
                  <div className="d-flex align-items-center justify-content-between gap-2 py-2">
                    <p
                      style={{ width: "fit-content" }}
                      className="py-1 m-0 px-2 bg-primary rounded-2 text-white"
                    >
                      {formatIndianCurrency(
                        updates.reduce(
                          (acc, emp) =>
                            acc +
                            (isReimbursmentChecked
                              ? emp.salaryAfterReimbursment
                              : isDeductionChecked
                              ? emp.salaryAfterPFESIandTDS
                              : isAdvanceChecked
                              ? emp.salaryAfterAdvance
                              : isArrerChecked
                              ? emp.SalaryAfterArrearAmt
                              : isIncentivandBonusChecked
                              ? emp.salaryaAfterBonusAndInsentive
                              : emp.actualTotalSalary),
                          0
                        )
                      )}
                    </p>
                    <span
                      className={darkMode ? className : `${className}-dark`}
                    >
                      {text}
                    </span>
                    ;
                  </div>

                  <Link
                    to={`/${
                      UserType === 1 ? "admin" : UserType === 2 ? "hr" : ""
                    }/Payroll_Processing?year=${selectedYear}&month=${selectedMonth}`}
                    className="btn btn-primary d-flex align-items-center gap-1"
                  >
                    Create Payroll <MdKeyboardArrowRight className="fs-4" />
                  </Link>
                </div>
                <div
                  className="p-2 rounded-2"
                  style={{
                    background: darkMode ? "#FFF" : "rgba(20, 20, 20, 0.92)",
                  }}
                >
                  <div
                    style={{
                      background: darkMode
                        ? "linear-gradient(90deg, #F9FEF1 0%, #FFF 100%)"
                        : "linear-gradient(90deg,rgba(44, 44, 43, 0.45) 0%, rgba(146, 142, 142, 0.5) 100%)",
                      borderLeft: "4px solid green",
                    }}
                    className="row mx-0 rounded-3 p-2"
                  >
                    <div className="col-12 col-md-10 p-2 rounded-2 d-flex">
                      <div
                        className="p-2 "
                        style={{
                          flex: "1",
                          borderRight: "1px solid rgba(185, 180, 180, 0.34)",
                        }}
                      >
                        <p>Net Pay</p>
                        <h3
                          style={{
                            fontSize: "2.5rem",
                            fontWeight: "700",
                            lineHeight: "2rem",
                            letterSpacing: ".1rem",
                            flex: "1",
                          }}
                          className="fw-bold"
                        >
                          ₹{" "}
                          {formatSalary(
                            updates.reduce(
                              (acc, emp) =>
                                acc +
                                (isReimbursmentChecked
                                  ? emp.salaryAfterReimbursment
                                  : isDeductionChecked
                                  ? emp.salaryAfterPFESIandTDS
                                  : isAdvanceChecked
                                  ? emp.salaryAfterAdvance
                                  : isArrerChecked
                                  ? emp.SalaryAfterArrearAmt
                                  : isIncentivandBonusChecked
                                  ? emp.salaryaAfterBonusAndInsentive
                                  : emp.actualTotalSalary || 0),
                              0
                            )
                          )}
                        </h3>
                      </div>
                      <div
                        className="p-2 "
                        style={{
                          flex: "1",
                          borderRight: "1px solid rgba(185, 180, 180, 0.34)",
                        }}
                      >
                        <p>Salaries On Hold</p>
                        <h3>
                          {(() => {
                            const holdSalaryTotal = updates
                              .filter((emp) => emp.status === "Hold")
                              .reduce(
                                (total, emp) =>
                                  total + (emp.salaryAfterReimbursment || 0),
                                0
                              );

                            return holdSalaryTotal > 0 ? (
                              formatIndianCurrency(holdSalaryTotal)
                            ) : (
                              <span
                                className={`fs-5 ${
                                  darkMode
                                    ? "badge-success"
                                    : "badge-success-dark"
                                }`}
                              >
                                No Salary is on Hold
                              </span>
                            );
                          })()}
                        </h3>
                      </div>
                    </div>
                    <div className="col-12 col-md-2 p-2 d-flex align-items-start justify-content-center flex-column">
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          lineHeight: "2rem",
                          letterSpacing: ".1rem",
                        }}
                      >
                        {updates.length || 0} Nos.
                      </span>
                      <p
                        style={{
                          color: darkMode ? "#7C7A7A" : "#f6f6f6",
                          fontWeight: "500",
                          lineHeight: "1.2rem",
                          letterSpacing: "2px",
                        }}
                      >
                        Active Employee in Payroll
                      </p>
                    </div>
                  </div>
                  <div className="row mx-0 p-2">
                    <div className="col-6 col-md-4 p-0">
                      <p
                        className="p-0 m-0 "
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "500",
                          color: "#7C7A7A",
                        }}
                      >
                        Acctual Pay
                      </p>
                      <h5
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          lineHeight: "2rem",
                          letterSpacing: ".1rem",
                        }}
                      >
                        {formatIndianCurrency(
                          updates.reduce((accumulator, employee) => {
                            return accumulator + employee.actualTotalSalary;
                          }, 0)
                        )}
                      </h5>
                    </div>
                    <div
                      onMouseEnter={() => setShowInsentiveDetails(true)}
                      onMouseLeave={() => setShowInsentiveDetails(false)}
                      style={{ position: "relative" }}
                      className="col-6 col-md-4 p-2"
                    >
                      {showInsentiveDetails && (
                        <div
                          className="rounded-2 d-flex align-items-start flex-column justify-content-center p-2"
                          style={{
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            left: "0",
                            top: "0",
                            background: darkMode
                              ? "linear-gradient(90deg, #F9FEF1 0%, #FFF 100%)"
                              : "linear-gradient(90deg, #F9FEF1 0%, #FFF 100%)",
                          }}
                        >
                          <p
                            className="p-0 m-0 "
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "500",
                              color: "#7C7A7A",
                            }}
                          >
                            Bonus :{" "}
                            {formatIndianCurrency(
                              updates.reduce((accumulator, employee) => {
                                return accumulator + employee.bonusAmount;
                              }, 0)
                            )}
                          </p>{" "}
                          <p
                            className="p-0 m-0 "
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "500",
                              color: "#7C7A7A",
                            }}
                          >
                            Incentive :{" "}
                            {formatIndianCurrency(
                              updates.reduce((accumulator, employee) => {
                                return accumulator + employee.insentiveAmount;
                              }, 0)
                            )}
                          </p>
                        </div>
                      )}
                      <p
                        className="p-0 m-0 "
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "500",
                          color: "#7C7A7A",
                        }}
                      >
                        Bonus & incentive’
                      </p>
                      <h5
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          lineHeight: "2rem",
                          letterSpacing: ".1rem",
                        }}
                      >
                        {formatIndianCurrency(
                          updates.reduce((accumulator, employee) => {
                            return accumulator + employee.totalBNIAdditions;
                          }, 0)
                        )}
                      </h5>
                    </div>
                    <div
                      onMouseEnter={() => setShowArrearDetails(true)}
                      onMouseLeave={() => setShowArrearDetails(false)}
                      style={{ position: "relative" }}
                      className="col-6 col-md-4 p-2"
                    >
                      {ShowArrearDetails && (
                        <div
                          className="rounded-2 d-flex align-items-start flex-column justify-content-center p-2"
                          style={{
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            left: "0",
                            top: "0",
                            background: darkMode
                              ? "linear-gradient(90deg, #F9FEF1 0%, #FFF 100%)"
                              : "linear-gradient(90deg,rgb(34, 36, 34) 0%, rgb(40, 43, 40) 100%)",
                          }}
                        >
                          <p
                            className="p-0 m-0 "
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "500",
                              color: "#7C7A7A",
                            }}
                          >
                            Paid :{" "}
                            {formatIndianCurrency(
                              updates.reduce((accumulator, employee) => {
                                return accumulator + employee.ArrearAmountPay;
                              }, 0)
                            )}
                          </p>{" "}
                          <p
                            className="p-0 m-0 "
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "500",
                              color: "#7C7A7A",
                            }}
                          >
                            Deduct :{" "}
                            {formatIndianCurrency(
                              updates.reduce((accumulator, employee) => {
                                return (
                                  accumulator + employee.ArrearAmountDeduct
                                );
                              }, 0)
                            )}
                          </p>
                        </div>
                      )}
                      <p
                        className="p-0 m-0 "
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "500",
                          color: "#7C7A7A",
                        }}
                      >
                        Arrears
                      </p>
                      <h5
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          lineHeight: "2rem",
                          letterSpacing: ".1rem",
                        }}
                      >
                        {formatIndianCurrency(
                          updates.reduce((accumulator, employee) => {
                            return accumulator + employee.ArrearAmountPay;
                          }, 0) -
                            updates.reduce((accumulator, employee) => {
                              return accumulator + employee.ArrearAmountDeduct;
                            }, 0)
                        )}
                      </h5>
                    </div>
                    <div
                      onMouseEnter={() => setShowAdvanceDetails(true)}
                      onMouseLeave={() => setShowAdvanceDetails(false)}
                      style={{ position: "relative" }}
                      className="col-6 col-md-4 p-2"
                    >
                      {showAdvanceDetails && (
                        <div
                          className="rounded-2 d-flex align-items-start flex-column justify-content-center p-2"
                          style={{
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            left: "0",
                            top: "0",
                            background: darkMode
                              ? "linear-gradient(90deg, #F9FEF1 0%, #FFF 100%)"
                              : "linear-gradient(90deg, #F9FEF1 0%, #FFF 100%)",
                          }}
                        >
                          <p
                            className="p-0 m-0 "
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "500",
                              color: "#7C7A7A",
                            }}
                          >
                            Paid :{" "}
                            {formatIndianCurrency(
                              updates.reduce((accumulator, employee) => {
                                return accumulator + employee.advanceAmountPay;
                              }, 0)
                            )}
                          </p>{" "}
                          <p
                            className="p-0 m-0 "
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "500",
                              color: "#7C7A7A",
                            }}
                          >
                            Deduct :{" "}
                            {formatIndianCurrency(
                              updates.reduce((accumulator, employee) => {
                                return (
                                  accumulator + employee.advanceAmountDeduct
                                );
                              }, 0)
                            )}
                          </p>
                        </div>
                      )}
                      <p
                        className="p-0 m-0 "
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "500",
                          color: "#7C7A7A",
                        }}
                      >
                        Advance
                      </p>
                      <h5
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          lineHeight: "2rem",
                          letterSpacing: ".1rem",
                        }}
                      >
                        {formatIndianCurrency(
                          updates.reduce((accumulator, employee) => {
                            return accumulator + employee.advanceAmountPay;
                          }, 0) -
                            updates.reduce((accumulator, employee) => {
                              return accumulator + employee.advanceAmountDeduct;
                            }, 0)
                        )}
                      </h5>
                    </div>
                    <div className="col-6 col-md-4 p-2">
                      <p
                        className="p-0 m-0 "
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "500",
                          color: "#7C7A7A",
                        }}
                      >
                        Reimbursment
                      </p>
                      <h5
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          lineHeight: "2rem",
                          letterSpacing: ".1rem",
                        }}
                      >
                        {formatIndianCurrency(
                          updates.reduce((accumulator, employee) => {
                            return accumulator + employee.reimbursmentApproved;
                          }, 0)
                        )}
                      </h5>
                    </div>
                    <div className="col-6 col-md-4 p-2">
                      <p
                        className="p-0 m-0 "
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "500",
                          color: "#7C7A7A",
                        }}
                      >
                        Payment Date
                      </p>
                      <h4>
                        7th {monthNames[selectedMonth]} ,{" "}
                        {selectedMonth === 12 ? selectedYear + 1 : selectedYear}
                      </h4>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        background: "rgba(173, 170, 170, 0.1)",
                        width: "fit-content",
                      }}
                      className="d-flex align-items-center gap-2 py-1 px-2 rounded-2"
                    >
                      <MdInfoOutline
                        style={{
                          fontSize: "1.5rem",
                          opacity: "100%",
                          color: "rgba(238, 216, 22, 0.94)",
                        }}
                      />
                      <p
                        style={{
                          color: darkMode
                            ? "rgba(83, 81, 81, 0.65)"
                            : "rgba(236, 231, 231, 0.65)",
                        }}
                        className="p-0 m-0 "
                      >
                        Total payroll for this month has been{" "}
                        {salaryStatus ? salaryStatus : "Not created Yet"}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row my-2">
                <div className="col-12 col-md-4 p-2 rounded-2">
                  <div
                    style={{ background: "rgba(187, 184, 184, 0.2)" }}
                    className="p-2 px-3 rounded-2"
                  >
                    <div
                      className="p-2 px-3 rounded-2 d-flex flex-column align-items-center"
                      style={{
                        background: darkMode
                          ? "rgba(255, 255, 255, 0.94)"
                          : "rgba(27, 26, 26, 0.94)",
                      }}
                    >
                      <p className="my-0">Employee’s State Insurance (ESI) </p>
                      <div className="d-flex align-items-end gap-2 my-2">
                        <h5
                          style={{
                            color: "gold",
                            fontSize: "2rem",
                            fontStyle: "normal",
                            fontWeight: "600",
                            lineHeight: "2.2rem",
                            letterSpacing: ".05rem",
                            padding: "0",
                          }}
                          className="m-0"
                        >
                          {formatIndianCurrency(
                            updates.reduce((accumulator, employee) => {
                              return accumulator + employee.ESIDedeuction;
                            }, 0)
                          )}
                        </h5>
                      </div>
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <span>Last Date to Deposit</span>
                        <span>
                          15th {monthNames[selectedMonth]} ,{" "}
                          {selectedMonth === 12
                            ? selectedYear + 1
                            : selectedYear}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4 p-2 rounded-2">
                  <div
                    style={{ background: "rgba(187, 184, 184, 0.2)" }}
                    className="p-2 px-3 rounded-2"
                  >
                    <div
                      className="p-2 px-3 rounded-2 d-flex flex-column align-items-center"
                      style={{
                        background: darkMode
                          ? "rgba(255, 255, 255, 0.94)"
                          : "rgba(27, 26, 26, 0.94)",
                      }}
                    >
                      <p className="my-0">Employee’s Provident Fund (EPF) </p>
                      <div className="d-flex align-items-end gap-2 my-2">
                        <h5
                          style={{
                            color: "gold",
                            fontSize: "2rem",
                            fontStyle: "normal",
                            fontWeight: "600",
                            lineHeight: "2.2rem",
                            letterSpacing: ".05rem",
                            padding: "0",
                          }}
                          className="m-0"
                        >
                          {formatIndianCurrency(
                            updates.reduce((accumulator, employee) => {
                              return accumulator + employee.PFDeduction;
                            }, 0)
                          )}
                        </h5>
                      </div>
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <span>Last Date to Deposit</span>
                        <span>
                          15th {monthNames[selectedMonth]} ,{" "}
                          {selectedMonth === 12
                            ? selectedYear + 1
                            : selectedYear}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4 p-2 rounded-2">
                  <div
                    style={{ background: "rgba(187, 184, 184, 0.2)" }}
                    className="p-2 px-3 rounded-2"
                  >
                    <div
                      className="p-2 px-3 rounded-2 d-flex flex-column align-items-center"
                      style={{
                        background: darkMode
                          ? "rgba(255, 255, 255, 0.94)"
                          : "rgba(27, 26, 26, 0.94)",
                      }}
                    >
                      <p className="my-0">Tax Deducted at Source (TDS) </p>
                      <div className="d-flex align-items-end gap-2 my-2">
                        <h5
                          style={{
                            color: "gold",
                            fontSize: "2rem",
                            fontStyle: "normal",
                            fontWeight: "600",
                            lineHeight: "2.2rem",
                            letterSpacing: ".05rem",
                            padding: "0",
                          }}
                          className="m-0"
                        >
                          {formatIndianCurrency(
                            updates.reduce((accumulator, employee) => {
                              return accumulator + employee.TDSDeduction;
                            }, 0)
                          )}
                        </h5>
                      </div>
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <span>Last Date to Deposit</span>
                        <span>
                          7th {monthNames[selectedMonth]} ,{" "}
                          {selectedMonth === 12
                            ? selectedYear + 1
                            : selectedYear}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 p-0">
            <div
              className="p-3 rounded-2"
              style={{
                background: "rgba(187, 184, 184, 0.2)",
                height: "fit-content",
                color: darkMode ? "black" : "white",
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <h5>Salaries</h5>
                <Link
                  to={`/${
                    UserType === 1 ? "admin" : UserType === 2 ? "hr" : ""
                  }/salary_Slips_All`}
                  style={{ width: "fit-content" }}
                  className={`btn btn-light d-flex align-items-center gap-1 px-2 py-1 ${
                    darkMode ? "btn-light" : "btn-dark"
                  }`}
                >
                  See All <MdKeyboardArrowRight className="fs-5 my-auto " />
                </Link>
              </div>
              <div
                style={{ background: "rgba(245, 245, 245, 0.49)" }}
                className="d-flex rounded-5 my-2"
              >
                {["All", "Proceed", "Hold", "Paid"].map((status) => (
                  <div
                    key={status}
                    style={{
                      flex: "1",
                      textAlign: "center",
                      border: "1px solid rgba(0,0,0,.1)",
                      borderRadius:
                        status === "All"
                          ? "20px 0 0 20px"
                          : status === "Paid"
                          ? "0 20px 20px 0"
                          : "",
                      background: filter === status ? "#3fc8e4" : "transparent",
                      fontWeight: filter === status ? "600" : "normal",
                      cursor: "pointer",
                    }}
                    className="p-1"
                    onClick={() => setFilter(status)}
                  >
                    {status}
                  </div>
                ))}
              </div>
              <div
                style={{
                  height: "50vh",
                  overflow: "auto",
                  background: darkMode
                    ? "rgba(255, 255, 255, 0.74)"
                    : "rgba(0,0,0,.5)",
                }}
                className="p-2  rounded-2"
              >
                {" "}
                {filteredUpdates.length > 0 ? (
                  <table className="table">
                    <tbody>
                      {filteredUpdates.map((data) => (
                        <tr key={data.id}>
                          <td
                            style={{
                              verticalAlign: "middle",
                              background: "none",
                            }}
                          >
                            <ProfileAvatar
                              imageURL={data.profile}
                              firstName={data.FullName}
                              additional={formatIndianCurrency(
                                data.salaryAfterReimbursment ||
                                  data.salaryAfterPFESIandTDS ||
                                  data.salaryAfterAdvance ||
                                  data.SalaryAfterArrearAmt ||
                                  data.salaryaAfterBonusAndInsentive ||
                                  data.actualTotalSalary
                              )}
                            />
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              background: "none",
                              color: darkMode
                                ? "rgba(14, 14, 14, 0.75)"
                                : "#f2f2f2",
                            }}
                            className="text-center d-none"
                          >
                            <span style={{ fontWeight: "normal" }}>
                              {monthNames[selectedMonth - 1]} {selectedYear}
                            </span>
                          </td>
                          <th
                            style={{
                              verticalAlign: "middle",
                              background: "none",
                            }}
                            className="text-end"
                          >
                            <span
                              className={`py-1 px-2 ${
                                data.status === "Hold"
                                  ? darkMode
                                    ? "badge-danger"
                                    : "badge-danger-dark"
                                  : data.status === "Paid"
                                  ? darkMode
                                    ? "badge-success"
                                    : "badge-success-dark"
                                  : darkMode
                                  ? "badge-warning"
                                  : "badge-warning-dark"
                              }`}
                            >
                              {data.status}
                            </span>
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    className="d-flex align-items-center rounded-2 flex-column justify-content-center gap-4"
                  >
                    <div style={{ height: "20vh", width: "auto" }}>
                      {" "}
                      <img
                        style={{ height: "100%", width: "auto" }}
                        src={SalaryStatusImage}
                        alt="No data found"
                      />
                    </div>

                    <span>No Data Found for this month</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ position: "relative" }}
          className="row mx-auto row-gap-3 mt-2 flex-column-reverse flex-md-row"
        >
          <div
            style={{
              position: isGraphExpanded ? "absolute" : "",
              width: isGraphExpanded ? "100%" : "",
              top: isGraphExpanded ? "0" : "",
              left: isGraphExpanded ? "0" : "",
              zIndex: isGraphExpanded ? "50" : "",
              background: isGraphExpanded ? "white" : "",
            }}
            className="col-12 col-lg-9  p-0"
          >
            <div
              className="py-3 px-3 rounded-2"
              style={{ background: "rgba(187, 184, 184, 0.2)" }}
            >
              <div className="d-flex align-items-center pb-2 justify-content-between">
                <h5>Overview</h5>{" "}
                <span
                  className="d-none fs-3 d-lg-flex"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsGraphExpanded((prev) => !prev)}
                >
                  {!isGraphExpanded ? (
                    <MdOutlineFullscreen />
                  ) : (
                    <MdOutlineFullscreenExit />
                  )}
                </span>
              </div>
              <div
                style={{
                  background: darkMode
                    ? "rgba(230, 227, 227, 0.59)"
                    : "rgba(0, 0, 0, 0.87)",
                }}
                className=" p-2 rounded-2"
              >
                <p>Spending over the year</p>
                <h4>{formatIndianCurrency(Number(totalSpending))}</h4>
                <div className="row row-gap-3 align-items-center justify-content-between pr-2">
                  <div className="col-12 col-md-3 d-flex align-items-center gap-2">
                    <span
                      className={`rounded-5 d-flex gap-2 align-items-center p-2 ${
                        percentageChange > 0
                          ? darkMode
                            ? "badge-success"
                            : "badge-success-dark"
                          : percentageChange < 0
                          ? darkMode
                            ? "badge-danger"
                            : "badge-danger-dark"
                          : darkMode
                          ? "badge-warning"
                          : "badge-warning-dark"
                      }`}
                      style={{
                        width: "fit-content",
                        fontWeight: "500",
                      }}
                    >
                      {percentageChange > 0 ? (
                        <BsGraphUpArrow />
                      ) : percentageChange < 0 ? (
                        <BsGraphDownArrow />
                      ) : (
                        <MdAutoGraph />
                      )}
                      {percentageChange.toFixed(2)}%
                    </span>
                    vs Last Year
                  </div>
                  <div className="col-12 col-md-9 d-flex align-items-center justify-content-start justify-content-md-end  gap-4">
                    <div className="d-flex align-items-center gap-1">
                      <div
                        style={{
                          height: ".5rem",
                          width: ".5rem",
                          background: "#3FC8E4",
                          rotate: "45deg",
                        }}
                      ></div>
                      Current Year
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <div
                        style={{
                          height: ".5rem",
                          width: ".5rem",
                          background: "#5654D4",
                          rotate: "45deg",
                        }}
                      ></div>
                      Previous Year
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <div
                        style={{
                          height: ".8rem",
                          width: ".8rem",
                          background: "green",
                          borderRadius: "50%",
                          border: "1px solid white",
                        }}
                      ></div>
                      Current Month
                    </div>
                  </div>
                </div>
                <div
                  style={{ background: "rgba(243, 243, 243, 0.34)" }}
                  className="px-2 my-2 rounded-2"
                >
                  <div
                    style={{
                      width: "100%",
                      overflowX: "auto", // Ensure horizontal scrolling
                      padding: ".5rem",
                      position: "relative",
                      whiteSpace: "nowrap", // Prevent wrapping
                    }}
                    ref={scrollRef}
                    className="py-3 my-3"
                  >
                    <div
                      style={{ position: "relative" }}
                      className="d-flex align-items-end"
                    >
                      <div>
                        <div
                          className="d-flex align-items-end gap-3"
                          style={{ marginLeft: "3rem" }}
                        >
                          {transformedData.map((data, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-end gap-2"
                            >
                              {/* Current Month Salary Bar */}
                              <div
                                style={{
                                  height: "20rem",
                                  width: "4rem",
                                  background: "rgba(212, 209, 209, 0.15)",
                                  borderRadius: "10px 10px 0 0",
                                  position: "relative",
                                }}
                                className="d-flex align-items-end"
                              >
                                {data.currentMonth === currentMonth && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: ".5rem",
                                      zIndex: "100",
                                      height: ".8rem",
                                      width: ".8rem",
                                      background: "green",
                                      borderRadius: "50%",
                                      left: "50%",
                                      transform: "translate(-50%)",
                                      border: "2px solid white",
                                    }}
                                  ></div>
                                )}
                                <div
                                  style={{
                                    height: `${
                                      (data.currentCombinedSalary /
                                        maxCombinedSalary) *
                                      18
                                    }rem`,
                                    width: "100%",
                                    background: data.currentCombinedSalary
                                      ? "#3FC8E4"
                                      : "rgba(202, 199, 199, 0.23)",
                                    color: data.currentCombinedSalary
                                      ? "white"
                                      : "black",
                                    borderRadius: "10px 10px 0 0",
                                    fontWeight: "400",
                                  }}
                                  className="text-center text-white d-flex flex-column justify-content-end py-2"
                                >
                                  {formatSalary(data.currentCombinedSalary)}
                                </div>
                              </div>

                              {/* Previous Month Salary Bar */}
                              <div
                                style={{
                                  height: "20rem",
                                  width: "4rem",
                                  background: "rgba(212, 209, 209, 0.15)",
                                  borderRadius: "10px 10px 0 0",
                                  position: "relative",
                                }}
                                className="d-flex align-items-end"
                              >
                                <div
                                  style={{
                                    height: `${
                                      (data.previousCombinedSalary /
                                        maxCombinedSalary) *
                                      18
                                    }rem`,
                                    width: "100%",
                                    background: data.previousCombinedSalary
                                      ? "#5654D4"
                                      : "rgba(202, 199, 199, 0.23)",
                                    color: data.previousCombinedSalary
                                      ? "white"
                                      : "black",
                                    borderRadius: "10px 10px 0 0",
                                    fontWeight: "400",
                                  }}
                                  className="text-center d-flex flex-column justify-content-end py-2"
                                >
                                  {formatSalary(data.previousCombinedSalary)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Month Labels */}
                        <div
                          className="d-flex justify-content-center gap-4"
                          style={{ marginLeft: "3rem", marginTop: "1rem" }}
                        >
                          {transformedData.slice(-12).map((data, index) => (
                            <div
                              key={index}
                              style={{
                                width: "8rem",
                                textAlign: "center",
                                fontSize: "12px",
                                fontWeight: "500",
                                color: darkMode ? "black" : "white",
                              }}
                            >
                              {getMonthName(data.currentMonth)} -{" "}
                              {data.currentYear}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 p-0">
            <div className="pl-0 pl-lg-2">
              <div
                className="p-3 rounded-2"
                style={{
                  height: "fit-content",
                  background: "rgba(187, 184, 184, 0.2)",
                }}
              >
                <h5 className="mb-3 d-flex align-items-center justify-content-between">
                  Activity{" "}
                  <div
                    style={{
                      height: "2rem",
                      width: "2rem",
                      fontSize: "1.2rem",
                      background: darkMode
                        ? "rgba(194, 183, 183, 0.6)"
                        : "rgba(32, 31, 31, 0.5)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {activities.filter((item) => item.checked).length}
                  </div>
                </h5>
                <div
                  className="p-2 rounded-2"
                  style={{
                    height: " fit-content",
                    background: darkMode
                      ? "rgba(255, 255, 255, 0.74)"
                      : "rgba(0,0,0,.5)",
                  }}
                >
                  {activities.some((item) => item.checked) ? (
                    <div className="d-flex flex-column gap-2">
                      {activities.map(
                        (item, index) =>
                          item.checked && (
                            <div
                              key={index}
                              className={`d-flex align-items-center  px-2 py-2 gap-3 justify-content-between rounded shadow-sm ${
                                darkMode ? "bg-white" : "bg-dark"
                              }`}
                            >
                              <div className="d-flex align-items-center w-100 px-4 py-3 gap-5 rounded">
                                {item.icon ? (
                                  item.icon
                                ) : (
                                  <RiCheckboxCircleFill className="fs-3 me-2" />
                                )}
                                <span>{item.label}</span>
                              </div>
                              <RiCheckboxCircleFill className="text-success fs-3 me-2" />
                            </div>
                          )
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                      className="d-flex align-items-center rounded-2 flex-column justify-content-center gap-4"
                    >
                      <div style={{ height: "20vh", width: "auto" }}>
                        {" "}
                        <img
                          style={{ height: "100%", width: "auto" }}
                          src={ActivityImage}
                          alt="No data found"
                        />
                      </div>

                      <span>No activity found for this month</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;
