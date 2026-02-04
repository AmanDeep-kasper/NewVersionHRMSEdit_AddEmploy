import React, { useEffect, useRef, useState } from "react";
import Logo from "../../img/KasperLogo1.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  formatIndianCurrency,
  numberToWords,
} from "../../Utils/CurrencySymbol/formatIndianCurrency";
import { IoPrintOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { getFormattedDate } from "../../Utils/GetDayFormatted";
import TittleHeader from "../TittleHeader/TittleHeader";
import api from "../config/api";

const SalarySlipAll = () => {
  const slipRef = useRef();
  const { employeeId, year, month } = useParams();

  const [payrollData, setPayrollData] = useState([]);
  const [companyDetails, setCompanyDetails] = useState({});
  const [empData, setEmpData] = useState({});
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  /* ================= FETCH SALARY ================= */
  useEffect(() => {
    if (!employeeId) return;

    const fetchSalary = async () => {
      try {
        const res = await api.get(`/api/getSalarySlips/${employeeId}`);

        const formatted = Object.entries(res.data).flatMap(([yr, months]) =>
          months.map((m) => ({ ...m, year: yr }))
        );

        setPayrollData(formatted);
      } catch (err) {
        if (err.response?.status === 404) {
          setPayrollData([]);
        } else {
          console.error("Salary fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [employeeId]);

  /* ================= FETCH COMPANY ================= */
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get("/api/CompanyDetails");
        setCompanyDetails(res.data?.[0] || {});
      } catch (err) {
        console.error("Company fetch error:", err);
      }
    };
    fetchCompany();
  }, []);

  /* ================= FETCH EMPLOYEE ================= */
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/api/employee/${employeeId}`);
        setEmpData(res.data?.[0] || {});
      } catch (err) {
        console.error("Employee fetch error:", err);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  /* ================= PDF ================= */
  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    const canvas = await html2canvas(slipRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 10;
    const imgWidth = 210 - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    pdf.save(`Salary_Slip_${empData?.FirstName || "Employee"}.pdf`);

    setPdfLoading(false);
  };

  /* ================= FILTER PAYSLIP ================= */
  const slipData = payrollData
    .filter((d) => d.isPayslipSentChecked)
    .filter((d) => d.year === year && d.month === month);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div
        className="container-fluid d-flex align-items-center justify-content-center"
        style={{ height: "80vh" }}
      >
        Loading Salary Slip...
      </div>
    );
  }

  /* ================= NO SALARY ================= */
  if (!slipData.length) {
    return (
      <div
        className="container-fluid d-flex align-items-center justify-content-center"
        style={{ height: "80vh" }}
      >
        Salary Not Prepared
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between">
        <TittleHeader
          title={`Salary for the Month of ${month} ${year}`}
          message="You can view and download your salary"
        />

        <span
          className="d-flex align-items-center bg-light border rounded-2 p-2 mt-4"
          onClick={handleDownloadPDF}
          style={{ cursor: "pointer" }}
        >
          {pdfLoading ? (
            <span className="spinner-border spinner-border-sm me-2"></span>
          ) : (
            <IoPrintOutline className="fs-4 me-2" />
          )}
          {pdfLoading ? "Generating PDF..." : "Print / Download"}
        </span>
      </div>

      <div ref={slipRef} className="bg-white rounded-2 my-3 p-3">
        {slipData.map((data, idx) => (
          <div key={idx}>
            <h4 className="text-center mb-3">Salary Slip</h4>

            <div className="d-flex justify-content-between mb-3">
              <img src={Logo} alt="Logo" height={50} />
              <div>
                <b>{companyDetails.CompanyName}</b>
                <div>{companyDetails.Address}</div>
              </div>
            </div>

            <hr />

            <p>
              <b>Employee:</b> {data.FullName}
            </p>
            <p>
              <b>Employee Code:</b> {data.empID}
            </p>
            <p>
              <b>Designation:</b> {data.designationName}
            </p>
            <p>
              <b>Department:</b> {data.departmentName}
            </p>
            <p>
              <b>Joining Date:</b>{" "}
              {data.doj ? getFormattedDate(data.doj) : "N/A"}
            </p>

            <hr />

            <p>
              <b>Gross Salary:</b>{" "}
              {formatIndianCurrency(data.actualTotalSalary)}
            </p>
            <p>
              <b>Total Deduction:</b>{" "}
              {formatIndianCurrency(
                data.ESIDedeuction + data.PFDeduction + data.TDSDeduction
              )}
            </p>

            <p className="fw-bold">
              Net Pay: {formatIndianCurrency(data.salaryAfterReimbursment)}
            </p>

            <p>
              <b>In Words:</b> {numberToWords(data.salaryAfterReimbursment)}
            </p>

            <hr />

            <p className="text-center text-muted">
              *** This is a system-generated payslip ***
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalarySlipAll;
