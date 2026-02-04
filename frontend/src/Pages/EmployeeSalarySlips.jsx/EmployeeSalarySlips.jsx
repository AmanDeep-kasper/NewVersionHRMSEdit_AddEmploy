import React, { useEffect, useState } from "react";
import TittleHeader from "../TittleHeader/TittleHeader";
import { useSelector } from "react-redux";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { formatIndianCurrency } from "../../Utils/CurrencySymbol/formatIndianCurrency";
import { GoEye } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import salary from "../../img/salary.svg";
import api from "../config/api";

const EmployeeSalarySlips = () => {
  const navigate = useNavigate();
  const [payrollData, setPayrollData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "year",
    direction: "desc",
  });
  const { userData } = useSelector((state) => state.user);
  const employeeId = userData?._id;
  const userType = userData?.Account;
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!employeeId) return;

    const fetchSalarySlips = async () => {
      try {
        const response = await api.get(`/api/getSalarySlips/${employeeId}`);

        const formattedData = Object.entries(response.data).flatMap(
          ([year, months]) => months.map((entry) => ({ ...entry, year })),
        );

        setPayrollData(formattedData);
      } catch (error) {
        // ✅ Handle salary not found (404)
        if (error.response?.status === 404) {
          setPayrollData([]); // triggers placeholder UI
        } else {
          console.error("Failed to fetch salary slips:", error);
        }
      }
    };

    fetchSalarySlips();
  }, [employeeId]);

  const sortData = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedData = [...payrollData].sort((a, b) => {
      if (key === "month") {
        const monthOrder = [
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

        return direction === "asc"
          ? monthOrder.indexOf(a[key]) - monthOrder.indexOf(b[key])
          : monthOrder.indexOf(b[key]) - monthOrder.indexOf(a[key]);
      } else {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      }
    });
    setPayrollData(sortedData);
    setSortConfig({ key, direction });
  };

  const monthToNumber = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const OnViewSalary = (year, month) => {
    navigate(
      `/${userType === 1 ? "admin" : userType === 2 ? "hr" : userType === 3 ? "employee" : "manager"}/View_Salary_Slip/${year}/${month}`,
    );
  };

  return (
    <div className="container-fluid">
      <TittleHeader
        title="Salary Slips"
        message="You can view your Salary Slips here"
      />
      {payrollData.filter((data) => data.isPayslipSentChecked).length > 0 ? (
        <div
          style={{
            height: "fit-content",
            maxHeight: "75vh",
            overflow: "auto",
            position: "relative",
            border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
          }}
          className="scroller mb-2 rounded-2 my-3"
        >
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                {[
                  "year",
                  "month",
                  "totalPayableDays",
                  "actualTotalSalary",
                  "bonusAmount",
                  "incentive’Amount",
                  "ArrearAmountPay",
                  "advanceAmountPay",
                  "ESIDeduction",
                  "PFDeduction",
                  "TDSDeduction",
                  "ReimbursementApproved",
                  "salaryAfterReimbursement",
                  "status",
                ].map((key) => (
                  <th
                    key={key}
                    onClick={() => sortData(key)}
                    style={{ ...rowHeadStyle(darkMode), cursor: "pointer" }}
                    className="sortable text-capitalize"
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}
                    {sortConfig.key === key
                      ? sortConfig.direction === "asc"
                        ? " ↑"
                        : " ↓"
                      : ""}
                  </th>
                ))}
                <th style={rowHeadStyle(darkMode)}>View</th>
              </tr>
            </thead>
            <tbody>
              {payrollData
                .filter((data) => data.isPayslipSentChecked)
                .map((entry, index) => (
                  <tr key={index}>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {entry.year}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {entry.month}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {entry.totalPayableDays}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {formatIndianCurrency(entry.actualTotalSalary)}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {formatIndianCurrency(entry.bonusAmount)}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {formatIndianCurrency(entry.insentiveAmount)}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {formatIndianCurrency(entry.ArrearAmountPay)}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {formatIndianCurrency(entry.advanceAmountPay)}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {formatIndianCurrency(entry.ESIDedeuction)}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {formatIndianCurrency(entry.PFDeduction)}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {formatIndianCurrency(entry.TDSDeduction)}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {formatIndianCurrency(entry.reimbursmentApproved)}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {formatIndianCurrency(entry.salaryAfterReimbursment)}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {entry.status}
                    </td>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      <GoEye
                        onClick={() => OnViewSalary(entry.year, entry.month)}
                        className={`d-flex align-items-center p-1 fs-3 ${darkMode ? "badge-success border" : "badge-success-dark"}`}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={`container-fluid d-flex align-items-center flex-column justify-content-center my-2 `}
          style={{
            height: "80vh",
            width: "100%",
            gap: "18px",
            background: darkMode
              ? "rgba(255, 255, 255, 0.85)"
              : "rgba(0, 0, 0, 0.65)",
            color: darkMode ? "#111827" : "#f9fafb",
          }}
        >
          <div
            style={{
              height: "160px",
              maxWidth: "240px",
              opacity: 0.9,
            }}
          >
            <img
              src={salary}
              alt="Salary not processed"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div style={{ textAlign: "center", maxWidth: "420px" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Salary Not Processed
            </div>

            <div
              style={{
                fontSize: "14px",
                opacity: 0.85,
                lineHeight: 1.6,
              }}
            >
              Your salary for the selected period has not been processed yet.
              Please contact the HR department for further information.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalarySlips;
