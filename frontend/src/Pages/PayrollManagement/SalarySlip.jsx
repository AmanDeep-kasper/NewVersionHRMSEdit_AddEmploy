import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../../img/KasperLogo1.png";
import {
  formatIndianCurrency,
  numberToWords,
} from "../../Utils/CurrencySymbol/formatIndianCurrency";
import { IoPrintOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFormattedDate } from "../../Utils/GetDayFormatted";
import TittleHeader from "../TittleHeader/TittleHeader";
import api from "../config/api";

const SalarySlip = () => {
  const slipRef = useRef();
  const { year, month } = useParams();
  const [payrollData, setPayrollData] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const employeeId = userData?._id;
  const [loading, setLoading] = useState(false);
  const [copmanyDetails, setCopmanyDetails] = useState([]);
  const [empData, setEmpData] = useState([]);

  useEffect(() => {
    if (!employeeId) return;

    api
      .get(`/api/getSalarySlips/${employeeId}`, {
         
        })
      .then((response) => {
        const formattedData = Object.entries(response.data).flatMap(
          ([year, months]) => months.map((entry) => ({ ...entry, year }))
        );
        setPayrollData(formattedData);
      });
  }, [employeeId]);

  const companyName = copmanyDetails?.CompanyName;
  const address = copmanyDetails?.Address;
  const postalCode = copmanyDetails?.PostalCode;
  const email = copmanyDetails?.Email;
  const cinNo = copmanyDetails?.CINNo;
  const panNo = copmanyDetails?.PanNo;
  const cityName = copmanyDetails?.city?.[0]?.CityName;
  const stateName = copmanyDetails?.city?.[0]?.state?.[0]?.StateName;
  const countryName =
    copmanyDetails?.city?.[0]?.state?.[0]?.country?.[0]?.CountryName;
  const EmployeeName = empData?.FirstName + " " + empData?.LastName;

  const handleDownloadPDF = async () => {
    setLoading(true)
    const input = slipRef.current;
    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 10; // Define margin size
    const imgWidth = 210 - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    pdf.save(`Salary_Slip_${EmployeeName}.pdf`);
    setLoading(false)
  };

  const fetchCompanyDetails = async () => {
    const response = await api.get(`/api/CompanyDetails`, {
        });
    setCopmanyDetails(response.data[0]);
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);


  const fetchEmployeeDetails = async () => {
    const response = await api.get(`/api/employee/${employeeId}`, {
        });
    setEmpData(response.data[0]);
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const getNextMonthName = (currentMonth) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    if (!currentMonth) return null;

    const index = months.findIndex(
      (m) => m.toLowerCase().startsWith(currentMonth.toLowerCase())
    );

    if (index === -1) return null;

    return months[(index + 1) % 12]; // Wrap around after December
  };


  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between">
        <TittleHeader
          title={`Salary for the Month of ${month} ${year}`}
          message={"You can view and download your salary"}
        />

        <span
          title="Print"
          className="d-flex align-items-center bg-light border rounded-2 p-2 mt-4"
          onClick={handleDownloadPDF}
          style={{ cursor: "pointer" }}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2"></span>
          ) : (
            <IoPrintOutline className="fs-4 me-2" />
          )}
          {loading ? "Generating PDF..." : "Print / Download"}
        </span>
      </div>
      {payrollData.length > 0 ? (
        <div
          ref={slipRef}
          className="p-2 max-w-4xl mx-auto rounded-lg my-3 bg-white"
        >
          {payrollData
            ?.filter((data) => data.isPayslipSentChecked)
            .filter((data) => data.year === year && data.month === month)
            .length >= 1 ? (
            <div>
              {payrollData
                ?.filter((data) => data.isPayslipSentChecked)
                .filter((data) => data.year === year && data.month === month)
                .map((data) => (
                  <div key={data.month} className="p-3 rounded-md">
                    <div className="flex justify-between items-center border-b pb-4">
                      <div className="d-flex align-items-start justify-content-between">
                        <div>
                          <div className="d-flex align-items-end gap-2">
                            <div
                              style={{
                                height: "3rem",
                                width: "3rem",
                                scale: "1.2",
                              }}
                            >
                              <img
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                                src={Logo}
                                alt=""
                              />
                            </div>
                            <div>
                              <h3 className="my-0 font-bold">
                                {companyName}
                              </h3>
                            </div>
                          </div>
                          <div>
                            <p className="my-0 ml-1">{address}</p>
                            <p className="my-0 ml-1">
                              {cityName} , {stateName} , {countryName} -{" "}
                              {postalCode}
                            </p>
                          </div>
                          <div>
                            <p className="my-0 ml-1">
                              CIN No: {cinNo} | PAN No: {panNo}
                            </p>
                          </div>
                          <div>
                            <p className="my-0 ml-1">Email : {email}</p>
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <p className="my-0">Salary Slip Period</p>
                          <h4
                            style={{ borderLeft: "5px solid #007aff" }}
                            className="badge-info fs-5 fw-bold py-2"
                          >
                            {month} , {year}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Employee Details Section */}
                    <div className="my-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5>Employee Details</h5>
                      </div>

                      <div
                        style={{ lineHeight: "1.9rem" }}
                        className="d-flex border p-2 rounded-2 align-items-start gap-4"
                      >
                        <div
                          style={{ width: "50%" }}
                          className="d-flex align-items-start justify-content-between"
                        >
                          <div>
                            <div style={{ border: "none" }}>Name</div>
                            <div style={{ border: "none" }}>Designation</div>
                            <div style={{ border: "none" }}>Department</div>
                            <div style={{ border: "none" }}>
                              Employee Code
                            </div>
                            <div style={{ border: "none" }}>Joining Date</div>
                            <div style={{ border: "none" }}>
                              Work Location
                            </div>
                          </div>
                          <div style={{ fontWeight: "500" }}>
                            <div
                              className="text-end"
                              style={{ border: "none" }}
                            >
                              {data.FullName || "N/A"}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none" }}
                            >
                              {data?.designationName || "N/A"}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none" }}
                            >
                              {data?.departmentName || "N/A"}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none" }}
                            >
                              {data?.empID || "N/A"}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none" }}
                            >
                              {data?.doj ? getFormattedDate(data.doj) : "N/A"}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none" }}
                            >
                              {data?.workLocation || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{ width: "50%" }}
                          className="d-flex align-items-start justify-content-between"
                        >
                          <div>
                            <div style={{ border: "none" }}>Pan Number</div>
                            <div style={{ border: "none" }}>UAN Number</div>
                            <div style={{ border: "none" }}>Bank Account</div>
                            <div style={{ border: "none" }}>IFSC Code</div>
                            <div style={{ border: "none" }}>Bank</div>
                            <div style={{ border: "none" }}>Payable Date</div>
                          </div>
                          <div style={{ fontWeight: "500" }}>
                            <div
                              className="text-end text-capitalize"
                              style={{ border: "none" }}
                            >
                              {data?.PanNumber || "N/A"}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none" }}
                            >
                              {data?.UanNumber || "N/A"}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none" }}
                            >
                              {data?.BankAccount || "N/A"}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none" }}
                            >
                              {data?.BankIFSC || "N/A"}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none" }}
                            >
                              {data?.BankName || "N/A"}
                            </div>
                            <div className="text-end" style={{ border: "none" }}>
                              10th {getNextMonthName(month) || "N/A"}, {year || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Earning Details Section */}
                    <div className="my-3">
                      <h5>Earning Details</h5>

                      <div
                        style={{ lineHeight: "1.9rem" }}
                        className="d-flex border rounded-2 p-2 my-2 align-items-start gap-4"
                      >
                        <div
                          style={{ width: "50%" }}
                          className="d-flex align-items-start justify-content-between"
                        >
                          <div style={{ width: "100%" }}>
                            <div
                              style={{
                                border: "none",
                                fontWeight: "600",
                                borderBottom: "1px dashed rgba(0,0,0,.2)",
                              }}
                            >
                              Earnings
                            </div>
                            <div style={{ border: "none" }}>Basic Salary</div>
                            <div style={{ border: "none" }}>
                              House Rent Allowance
                            </div>
                            <div style={{ border: "none" }}>
                              Conv. Allowance
                            </div>
                            <div style={{ border: "none" }}>
                              Other Allowance
                            </div>
                            <div
                              style={{
                                border: "none",
                                fontWeight: "500",
                                borderTop: "1.5px solid rgba(0,0,0, .5)",
                                borderBottom: "1.5px solid rgba(0,0,0, .5)",
                                width: "fit-content",
                                paddingRight: "1rem",
                              }}
                            >
                              Gross Salary
                            </div>
                            <div style={{ border: "none" }}>
                              Additional Earnings:
                            </div>
                            <div style={{ border: "none" }}>Bonus</div>
                            <div style={{ border: "none" }}>Incentive</div>
                            <div style={{ border: "none" }}>
                              Advance Salary
                            </div>
                            <div style={{ border: "none" }}>
                              Arrear In Salary
                            </div>
                            <div
                              style={{
                                border: "none",
                                fontWeight: "500",
                                borderTop: "1.5px solid rgba(0,0,0, .5)",
                                borderBottom: "1.5px solid rgba(0,0,0, .5)",
                                width: "fit-content",
                                paddingRight: "1rem",
                              }}
                            >
                              Taxable Gross Earnings
                            </div>
                          </div>
                          <div>
                            <div
                              className="text-end"
                              style={{
                                border: "none",
                                fontWeight: "600",
                                borderBottom: "1px dashed rgba(0,0,0,.2)",
                                whiteSpace: "pre",
                              }}
                            >
                              Amount in (₹)
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.actualBasic)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.actualHRA)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.actualConvenyance)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.actualOthers)}
                            </div>
                            <div
                              className="text-end ms-auto"
                              style={{
                                border: "none",
                                fontWeight: "500",
                                borderTop: "1.5px solid rgba(0,0,0, .5)",
                                borderBottom: "1.5px solid rgba(0,0,0, .5)",
                                width: "fit-content",
                                paddingLeft: "1rem",
                                whiteSpace: "pre",
                              }}
                            >
                              {formatIndianCurrency(data.actualTotalSalary)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.bonusAmount)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.insentiveAmount)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.advanceAmountPay)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.ArrearAmountPay)}
                            </div>
                            <div
                              className="text-end ms-auto"
                              style={{
                                border: "none",
                                fontWeight: "500",
                                borderTop: "1.5px solid rgba(0,0,0, .5)",
                                borderBottom: "1.5px solid rgba(0,0,0, .5)",
                                width: "fit-content",
                                paddingLeft: "1rem",
                                whiteSpace: "pre",
                              }}
                            >
                              {formatIndianCurrency(
                                data.actualTotalSalary +
                                data.bonusAmount +
                                data.insentiveAmount +
                                data.advanceAmountPay +
                                data.ArrearAmountPay
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{ width: "50%" }}
                          className="d-flex align-items-start justify-content-between"
                        >
                          <div style={{ width: "100%" }}>
                            <div
                              style={{
                                border: "none",
                                fontWeight: "600",
                                borderBottom: "1px dashed rgba(0,0,0,.2)",
                                whiteSpace: "pre",
                              }}
                            >
                              Deductions
                            </div>
                            <div
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              Employee State Insurance
                            </div>
                            <div
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              Employee Providend Fund
                            </div>
                            <div
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              Tax Deducted at Source
                            </div>
                            <div
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              Advance Salary
                            </div>
                            <div
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              Arrear In Salary
                            </div>
                            <div
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              style={{
                                border: "none",
                                fontWeight: "500",
                                borderTop: "1.5px solid rgba(0,0,0, .5)",
                                borderBottom: "1.5px solid rgba(0,0,0, .5)",
                                width: "fit-content",
                                paddingRight: "1rem",
                                whiteSpace: "pre",
                              }}
                            >
                              Total Deduction
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                border: "none",
                                fontWeight: "600",
                                borderBottom: "1px dashed rgba(0,0,0,.2)",
                                whiteSpace: "pre",
                              }}
                              className="text-end"
                            >
                              Amount in (₹)
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.ESIDedeuction)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.PFDeduction)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.TDSDeduction)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.advanceAmountDeduct)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              {formatIndianCurrency(data.ArrearAmountDeduct)}
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              className="text-end"
                              style={{ border: "none", whiteSpace: "pre" }}
                            >
                              &nbsp;
                            </div>
                            <div
                              className="text-end ms-auto"
                              style={{
                                border: "none",
                                fontWeight: "500",
                                borderTop: "1.5px solid rgba(0,0,0, .5)",
                                borderBottom: "1.5px solid rgba(0,0,0, .5)",
                                width: "fit-content",
                                paddingLeft: "1rem",
                                whiteSpace: "pre",
                              }}
                            >
                              {formatIndianCurrency(
                                data.ESIDedeuction +
                                data.PFDeduction +
                                data.TDSDeduction +
                                data.advanceAmountDeduct +
                                data.ArrearAmountDeduct
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{ lineHeight: "1.9rem " }}
                      className="d-flex border rounded-2 p-2 my-2 align-items-start gap-4 "
                    >
                      <div
                        style={{ width: "50%" }}
                        className="d-flex align-items-start justify-content-between "
                      >
                        <div style={{ width: "100%" }}>
                          <div
                            style={{
                              border: "none",
                              fontWeight: "600",
                              borderBottom: "1px dashed rgba(0,0,0,.2)",
                            }}
                          >
                            Reimbursment
                          </div>
                          <div style={{ border: "none" }}>Reimbursment </div>
                          <div
                            style={{
                              border: "none",
                              fontWeight: "500",
                              borderTop: "1.5px solid rgba(0,0,0, .5)",
                              borderBottom: "1.5px solid rgba(0,0,0, .5)",
                              width: "fit-content",
                              paddingRight: "1rem",
                            }}
                          >
                            Total Deduction
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              border: "none",
                              fontWeight: "600",
                              borderBottom: "1px dashed rgba(0,0,0,.2)",
                              whiteSpace: "pre",
                            }}
                            className="text-end"
                          >
                            Amount in (₹)
                          </div>
                          <div
                            className="text-end"
                            style={{ border: "none", whiteSpace: "pre" }}
                          >
                            {formatIndianCurrency(data.reimbursmentApproved)}
                          </div>
                          <div
                            className="text-end ms-auto"
                            style={{
                              border: "none",
                              fontWeight: "500",
                              borderTop: "1.5px solid rgba(0,0,0, .5)",
                              borderBottom: "1.5px solid rgba(0,0,0, .5)",
                              width: "fit-content",
                              paddingLeft: "1rem",
                              whiteSpace: "pre",
                            }}
                          >
                            {formatIndianCurrency(data.reimbursmentApproved)}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{ width: "50%" }}
                        className="d-flex align-items-start flex-column justify-content-between "
                      >
                        <div className="d-flex align-itesm-center  w-100 justify-content-between">
                          <div>Net Payable</div>
                          <div>
                            {formatIndianCurrency(
                              data.salaryAfterReimbursment
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-itesm-center justify-content-between w-100">
                          <div> Reimbursment</div>
                          <div>
                            {formatIndianCurrency(data.reimbursmentApproved)}
                          </div>
                        </div>
                        <h6 className="mt-2 badge-success text-center  p-2 w-100 text-xl  fs-5 font-bold text-green-600">
                          Total Net Pay:{" "}
                          {formatIndianCurrency(
                            data.salaryAfterReimbursment +
                            data.reimbursmentApproved
                          )}
                        </h6>
                      </div>
                    </div>

                    <div>
                      <b style={{ fontWeight: "500" }}>
                        Total Net Pay in Words
                      </b>{" "}
                      :{" "}
                      <span>
                        {numberToWords(
                          data.salaryAfterReimbursment +
                          data.reimbursmentApproved
                        )}
                      </span>
                    </div>

                    <div
                      style={{ color: "rgba(0,0,0,.5)" }}
                      className="text-center mt-5 mb-2"
                    >
                      *** This is a system-generated payslip from Munc Payroll
                      and does not require a signature. ***
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div
              className="container-fluid d-flex align-items-center justify-content-center"
              style={{ height: "80vh", width: "100%" }}
            >
              Salary Not Prepared
            </div>
          )}
        </div>
      ) : (
        <div
          className="container-fluid d-flex align-items-center justify-content-center"
          style={{ height: "80vh", width: "100%" }}
        >
          Salary Not Prepared
        </div>
      )}
    </div>
  );
};

export default SalarySlip;
