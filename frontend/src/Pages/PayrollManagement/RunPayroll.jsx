import React, { useEffect, useState } from "react";
import TittleHeader from "../TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BoardBGSVG from "./Images/PayrollFrame001.svg";
import NoticeCalenderImage from "./Images/PayrollFrame002.svg";
import { MdFormatListBulleted, MdOutlineFileDownload } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { Link, useNavigate } from "react-router-dom";
import { formatIndianCurrency } from "../../Utils/CurrencySymbol/formatIndianCurrency";
import axios from "axios";
import BASE_URL from "../config/config";
import { formatDateAndTime } from "../../Utils/GetDayFormatted";
import toast from "react-hot-toast";
import { TbLockCog } from "react-icons/tb";
import { LuFileCog } from "react-icons/lu";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import api from "../config/api";

const RunPayroll = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [payrollData, setPayrollData] = useState([]);
  const [openSetting, setOpenSetting] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const UserType = userData.Account;
  const [searchTerm, setSearchTerm] = useState("");

  console.log("UserType in RunPayroll:", payrollData);

  const handleStatusUpdate = async (year, month) => {
    try {
      const response = await api.put(`/api/update-salary-status`, {
        year,
        month,
        status: "inprogress",
      } );

      console.log("API Response:", response.data); // Debugging

      if (response.status === 200) {
        toast.success("Salary status updated to 'in progress'!");

        if (UserType === 1 || UserType === 2) {
          const userRole = UserType === 1 ? "admin" : "hr";
          navigate(
            `/${userRole}/Payroll_Processing?year=${year}&month=${month}`
          );
        } else {
          console.warn("Invalid UserType for navigation:", UserType);
        }
      }
    } catch (error) {
      console.error("Error updating salary status:", error);
      toast.error("Failed to update status.");
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      const response = await api.get(`/api/payroll`, 
         
        );
      setPayrollData(response.data);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
    }
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

  const filteredPayrollData = payrollData
    .reverse()
    .map((payroll) => ({
      ...payroll,
      years: payroll.years.map((year) => ({
        ...year,
        months: year.months.filter((month) =>
          month.PayrollName.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      })),
    }))
    .filter((payroll) => payroll.years.some((year) => year.months.length > 0));

  const exportToExcel = () => {
    const data = [];

    filteredPayrollData.forEach((payroll) => {
      payroll.years.forEach((year) => {
        year.months.forEach((month) => {
          data.push({
            "Payroll Name": month.PayrollName,
            "No. of Employees": month?.EmployeeAttandanceData.length || 0,
            Paid:
              month?.EmployeeAttandanceData?.filter(
                (data) => data.status === "Paid"
              ).length || 0,
            "In Process":
              month?.EmployeeAttandanceData?.filter(
                (data) => data.status === "Proceed"
              ).length || 0,
            "On Hold":
              month?.EmployeeAttandanceData?.filter(
                (data) => data.status === "Hold"
              ).length || 0,
            Period: `${monthNames[month.month - 1]} ${year.year}`,
            Status: month.SalaryStatus,
            "Total Amount": formatIndianCurrency(
              month.EmployeeAttandanceData.reduce(
                (accumulator, emp) =>
                  accumulator +
                  (Number(emp.salaryAfterReimbursment) ||
                    Number(emp.salaryAfterPFESIandTDS) ||
                    Number(emp.salaryAfterAdvance) ||
                    Number(emp.SalaryAfterArrearAmt) ||
                    Number(emp.salaryaAfterBonusAndInsentive) ||
                    Number(emp.actualTotalSalary) ||
                    0),
                0
              )
            ),
            "Date Created": formatDateAndTime(month.SalaryCreatedAt),
            "Processed Date":
              formatDateAndTime(
                month?.EmployeeAttandanceData[
                  month?.EmployeeAttandanceData.length - 1
                ]?.updatedAt
              ) || "Not Processed",
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Data");

    XLSX.writeFile(workbook, "Payroll_Report.xlsx");
  };

  return (
    <div
      className={`container-fluid ${darkMode ? "text-black" : "text-light"}`}
    >
      <TittleHeader title={"Run Payroll"} message={"Review your employee's"} />

      {payrollData.reverse().map((payroll, index) =>
        payroll.years.map((year, yearIndex) =>
          year.months
            .filter((month) => month.SalaryStatus === "created")
            .map((month, monthIndex) => (
              <div
                key={`${index}-${yearIndex}-${monthIndex}`}
                style={{
                  backgroundImage: `url(${BoardBGSVG})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right",
                  backgroundSize: "15%",
                  border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
                  background: darkMode ? "#fafdff" : "rgba(57,74,86,1)",
                }}
                className="d-flex align-items-center rounded-2 my-3 gap-4 p-3"
              >
                <div style={{ height: "6rem", width: "6rem" }}>
                  <img
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "contain",
                    }}
                    src={NoticeCalenderImage}
                    alt="calender"
                  />
                </div>
                <div className="d-flex flex-column gap-3">
                  <h5>
                    Salary for the month of : {monthNames[month.month - 1]}
                    {year.year}
                    <span
                      style={{ marginLeft: "1rem" }}
                      className={
                        darkMode
                          ? "badge-info border py-1 px-3"
                          : "badge-info-dark py-1 px-3"
                      }
                    >
                      Late
                    </span>
                  </h5>
                  <div className="d-flex flex-column gap-2">
                    <h6 className="my-0">Ready to Process Payroll?</h6>
                    <div className="d-flex flex-column gap-1">
                      <p className="my-0">
                        Ensure all employee data is updated before running
                        payroll. Check settings or start processing now
                      </p>
                      <button
                        style={{ width: "fit-content" }}
                        className="btn btn-primary"
                        onClick={() =>
                          handleStatusUpdate(year.year, month.month)
                        }
                      >
                        Create Payroll
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )
      )}

      <div
        className="d-flex align-items-center my-4 gap-4 p-0 "
        style={{
          borderBottom: darkMode ? "var(--borderLight)" : "var(--borderDark)",
        }}
      >
        <div className="d-flex align-items-center gap-4">
          <span
            onClick={() => setOpenSetting(false)}
            style={{ borderBottom: "2px solid blue", cursor: "pointer" }}
            className="d-flex align-items-center gap-2 rounded-0 p-0 pb-1 px-1"
          >
            <MdFormatListBulleted />
            Paytoll List
          </span>

          <span
            onClick={() => setOpenSetting(true)}
            className="d-flex align-items-center gap-2 rounded-0 p-0 pb-1 px-1"
            style={{ borderBottom: "2px solid transparent", cursor: "pointer" }}
          >
            <IoSettingsOutline />
            Paytoll Setting
          </span>
        </div>
      </div>
      {!openSetting ? (
        payrollData.length > 0 ? (
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="my-0">
                {payrollData.length.toString().padStart(2, 0)} Total Payroll
              </h6>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  style={{
                    position: "relative",
                    height: "2.5rem",
                    width: "200px",
                  }}
                >
                  <input
                    placeholder="Search by Payroll Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="search"
                    className={`form-control ms-0 ms-md-auto rounded-2 ${
                      darkMode
                        ? "bg-light text-dark border dark-placeholder"
                        : "bg-dark text-light border-0 light-placeholder"
                    }`}
                    style={{
                      position: "absolute",
                      top: "0",
                      // height: "0",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                  <HiMiniMagnifyingGlass
                    className="fs-5"
                    style={{
                      position: "absolute",
                      right: ".5rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "gray",
                      opacity: "50%",
                    }}
                  />
                </div>
                <button
                  className={`btn border d-flex align-items-center gap-2 ${
                    darkMode ? "text-black" : "text-light"
                  }`}
                  onClick={exportToExcel}
                >
                  <MdOutlineFileDownload />
                  Export
                </button>
              </div>
            </div>
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
              <table className="table mt-0 mb-0 table-hover">
                <thead>
                  <tr>
                    <th style={rowHeadStyle(darkMode)}>Payroll Name</th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      No's of Employee
                    </th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      Paid
                    </th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      In Process
                    </th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      On Hold
                    </th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      Period
                    </th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      Status
                    </th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      Total Amount
                    </th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      Date Created
                    </th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      Processed Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayrollData.map((payroll, index) =>
                    payroll.years.map((year, yearIndex) =>
                      year.months.map((month, monthIndex) => (
                        <tr key={`${index}-${yearIndex}-${monthIndex}`}>
                          {/* Payroll Name */}
                          <td style={rowBodyStyle(darkMode)}>
                            <Link
                              style={{
                                textDecoration: "none",
                                fontWeight: "500",
                              }}
                              to={`/${
                                UserType === 1 ? "admin" : "hr"
                              }/Payroll_Processing?year=${year.year}&month=${
                                month.month
                              }`}
                            >
                              {month.PayrollName}
                            </Link>
                          </td>
                          <td
                            className="text-end"
                            style={rowBodyStyle(darkMode)}
                          >
                            {(month?.EmployeeAttandanceData.length)
                              .toString()
                              .padStart(2, 0)}
                          </td>
                          <td
                            className="text-end"
                            style={rowBodyStyle(darkMode)}
                          >
                            {month?.EmployeeAttandanceData?.filter(
                              (data) => data.status === "Paid"
                            ).length || 0}
                          </td>
                          <td
                            className="text-end"
                            style={rowBodyStyle(darkMode)}
                          >
                            {month?.EmployeeAttandanceData?.filter(
                              (data) => data.status === "Proceed"
                            ).length || 0}
                          </td>
                          <td
                            className="text-end"
                            style={rowBodyStyle(darkMode)}
                          >
                            {month?.EmployeeAttandanceData?.filter(
                              (data) => data.status === "Hold"
                            ).length || 0}
                          </td>
                          <td
                            className="text-end"
                            style={rowBodyStyle(darkMode)}
                          >
                            {monthNames[month.month - 1]} {year.year}
                          </td>

                          {/* Status */}
                          <td
                            className="text-end"
                            style={rowBodyStyle(darkMode)}
                          >
                            <div className="d-flex align-items-center justify-content-end">
                              <span
                                className={`${
                                  month.SalaryStatus === "inprogress"
                                    ? darkMode
                                      ? "badge-warning"
                                      : "badge-warning-dark"
                                    : month.SalaryStatus === "created"
                                    ? darkMode
                                      ? "badge-primary"
                                      : "badge-primary-dark"
                                    : darkMode
                                    ? "badge-success"
                                    : "badge-success-dark"
                                }`}
                              >
                                {month.SalaryStatus}
                              </span>
                            </div>
                          </td>

                          {/* Total Amount */}
                          <td
                            className="text-end"
                            style={rowBodyStyle(darkMode)}
                          >
                            {formatIndianCurrency(
                              month.EmployeeAttandanceData.reduce(
                                (accumulator, emp) =>
                                  accumulator +
                                  (Number(emp.salaryAfterReimbursment) ||
                                    Number(emp.salaryAfterPFESIandTDS) ||
                                    Number(emp.salaryAfterAdvance) ||
                                    Number(emp.SalaryAfterArrearAmt) ||
                                    Number(emp.salaryaAfterBonusAndInsentive) ||
                                    Number(emp.actualTotalSalary) ||
                                    0),
                                0
                              )
                            )}
                          </td>

                          {/* Date Created */}
                          <td
                            className="text-end text-uppercase"
                            style={rowBodyStyle(darkMode)}
                          >
                            {formatDateAndTime(month.SalaryCreatedAt)}
                          </td>

                          {/* Processed Date */}
                          <td
                            className="text-end text-uppercase"
                            style={rowBodyStyle(darkMode)}
                          >
                            {formatDateAndTime(
                              month?.EmployeeAttandanceData[
                                month?.EmployeeAttandanceData.length - 1
                              ].updatedAt
                            ) || "Not Processed"}
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div
            className={`d-flex align-items-start justify-content-center  flex-column gap-3 rounded-2 p-4 ${
              darkMode ? "badge-warning" : "badge-warning-dark"
            }`}
            style={{ height: "fit-content", width: "100%" }}
          >
            <div className="d-flex align-items-center gap-3">
              <LuFileCog className="fs-3" />
              <h6 className="m-0">Data Not Available </h6>
            </div>
            <p style={{ fontSize: ".9rem", opacity: "60%" }} className="m-0">
              Attendance data is unavailable. Please create payroll data
              manually.
            </p>
            <Link to="/hr/AttendanceRegister" className="btn btn-primary">
              Go To Attendance Register
            </Link>
          </div>
        )
      ) : (
        <div
          className={`d-flex align-items-start justify-content-center  flex-column gap-3 rounded-2 p-4 ${
            darkMode ? "badge-danger" : "badge-danger-dark"
          }`}
          style={{ height: "fit-content", width: "100%" }}
        >
          <div className="d-flex align-items-center gap-3">
            <TbLockCog className="fs-3" />
            <h6 className="m-0">Settings are Locked</h6>
          </div>
          <p style={{ fontSize: ".9rem", opacity: "60%" }} className="m-0">
            Settings modification is unavailable as you are using the demo
            version.
          </p>
        </div>
      )}
    </div>
  );
};

export default RunPayroll;
