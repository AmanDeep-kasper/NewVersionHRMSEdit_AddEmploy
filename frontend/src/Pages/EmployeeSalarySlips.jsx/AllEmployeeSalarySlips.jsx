import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoEye } from "react-icons/go";

import TittleHeader from "../TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { formatIndianCurrency } from "../../Utils/CurrencySymbol/formatIndianCurrency";
import api from "../config/api";

import SalaryPlaceHolder from "../../img/salary.svg";

const AllEmployeeSalarySlips = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user); 
  

  const UserType = userData?.Account;

  const [payrollData, setPayrollData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" }),
  );
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;
  const currentYear = new Date().getFullYear();

  /* ---------------- Fetch Salary Slips ---------------- */

  useEffect(() => {
    api
      .get("/api/getSalarySlips")
      .then((res) => {
        if (!res.data || typeof res.data !== "object") {
          setPayrollData([]);
          return;
        }

        const formatted = Object.entries(res.data).flatMap(([year, months]) =>
          months.map((entry) => ({
            ...entry,
            year,
          })),
        );

        setPayrollData(formatted);
      })
      .catch(() => setPayrollData([]));
  }, []);

  /* ---------------- Helpers ---------------- */

  const onViewSalary = (employeeObjID, year, month) => {
    navigate(
      `/${
        UserType === 1 ? "admin" : UserType === 2 ? "hr" : ""
      }/View_Salary_Slip/All/${employeeObjID}/${year}/${month}`,
    );
  };

  /* ---------------- Safe Filter ---------------- */

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return payrollData.filter((entry) => {
      const fullName = (entry.FullName || "").toLowerCase();
      const empId = (entry.empID || "").toLowerCase();
      const pan = (entry.PanNumber || "").toLowerCase();

      return (
        (fullName.includes(query) ||
          empId.includes(query) ||
          pan.includes(query)) &&
        String(entry.year) === String(selectedYear) &&
        entry.month === selectedMonth &&
        entry.isPayslipSentChecked
      );
    });
  }, [payrollData, searchQuery, selectedMonth, selectedYear]);

  /* ---------------- Pagination ---------------- */

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirst, indexOfLast);

  /* ---------------- UI ---------------- */

  return (
    <div className="container-fluid p-3">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <TittleHeader
          title="Employee Salary Slips"
          message="View and manage salary slips for all employees."
        />

        <div className="d-flex gap-2 mt-3 mt-md-0">
          {/* Month */}
          <select
            className={`form-select ${
              darkMode ? "bg-light text-dark" : "bg-dark text-light"
            }`}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) =>
              new Date(0, i).toLocaleString("default", { month: "long" }),
            ).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            className={`form-select ${
              darkMode ? "bg-light text-dark" : "bg-dark text-light"
            }`}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {Array.from({ length: 10 }, (_, i) => currentYear - i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ),
            )}
          </select>

          {/* Search */}
          <input
            type="text"
            className={`form-control ${
              darkMode ? "bg-light text-dark" : "bg-dark text-light"
            }`}
            placeholder="Search by Name, Employee ID, or PAN"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minWidth: "260px" }}
          />
        </div>
      </div>

      {/* Table */}
      {currentRecords.length ? (
        <div
          className="table-responsive rounded-3"
          style={{
            maxHeight: "70vh",
            border: "1px solid #e5e7eb",
          }}
        >
          <table className="table table-hover align-middle mb-0">
            <thead
              className="sticky-top"
              style={{
                background: darkMode ? "#f9fafb" : "#1f2937",
                color: darkMode ? "#111827" : "#f9fafb",
              }}
            >
              <tr style={{ fontSize: "13px" }}>
                <th>#</th>
                <th>Employee</th>
                <th className="text-center">Emp ID</th>
                <th className="text-center">PAN</th>
                <th className="text-center">Period</th>
                <th className="text-center">Total Salary</th>
                <th className="text-center">Status</th>
                <th className="text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((entry, index) => (
                <tr key={index}>
                  <td>{(index + 1).toString().padStart(2, "0")}</td>
                  <td className="fw-semibold">{entry.FullName || "—"}</td>
                  <td className="text-center">{entry.empID || "—"}</td>
                  <td className="text-center text-uppercase">
                    {entry.PanNumber || "—"}
                  </td>
                  <td className="text-center">
                    {entry.month} {entry.year}
                  </td>
                  <td className="text-center fw-semibold">
                    {formatIndianCurrency(
                      entry.salaryAfterReimbursment ||
                        entry.SalaryAfterDeduction ||
                        entry.salaryAfterAdvance ||
                        entry.SalaryAfterArrearAmt ||
                        entry.salaryaAfterBonusAndInsentive ||
                        entry.actualTotalSalary ||
                        0,
                    )}
                  </td>
                  <td className="text-center">{entry.status || "—"}</td>
                  <td className="text-center">
                    <GoEye
                      onClick={() =>
                        onViewSalary(entry.employeeId, entry.year, entry.month)
                      }
                      className="fs-4"
                      style={{
                        cursor: "pointer",
                        color: "#2563eb",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div
          className={`d-flex flex-column align-items-center justify-content-center rounded-3 text-center ${
            darkMode ? "bg-light text-dark" : "bg-dark text-light"
          }`}
          style={{
            height: "70vh",
            padding: "24px",
          }}
        >
          <img
            src={SalaryPlaceHolder}
            alt="No salary slips available"
            style={{
              height: "160px",
              opacity: 0.85,
              marginBottom: "12px",
            }}
          />

          <div style={{ maxWidth: "420px" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Salary Slips Not Available
            </div>

            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                opacity: 0.85,
              }}
            >
              Salary slips have not been generated for the selected period.
              Please process payroll or select a different month and year.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEmployeeSalarySlips;
