import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/react"; // Fix import error
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import LeaveBalance from "../../Component/HrManager/LeaveStatus/LeaveBalance";
import TittleHeader from "../TittleHeader/TittleHeader";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import Pagination from "../../Utils/Pagination";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../Utils/GetDayFormatted";
import SalaryImage from "../../img/Payroll/Salary.svg";
import api from "../config/api";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const LeaveApplicationEmpTable = (props) => {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  // console.log(rowData)

  const loadLeaveApplicationEmpData = async () => {
    try {
      setLoading(true);

      // console.log(`${BASE_URL}/api/leaves/${userData._id}`);
      const response = await api.get(`/api/leaves/${userData._id}`);
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveApplicationEmpData();
  }, []);

  const status = (s) => {
    switch (String(s)) {
      case "1":
        return "Pending";
      case "2":
        return "Approved";
      case "3":
        return "Rejected";
      default:
        return "Unknown Status";
    }
  };

  const onEdit = (data) => {
    if (String(data.Status) === "1") {
      props.onEditLeaveApplicationEmp(data);
    } else {
      window.alert(
        "You cannot edit the application after it's approved or rejected",
      );
    }
  };

  const handlePaginationNext = () => setCurrentPage((prevPage) => prevPage + 1);
  const handlePaginationPrev = () => setCurrentPage((prevPage) => prevPage - 1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(rowData)
    ? rowData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(rowData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const calculateDays = (startDate, endDate) => {
    if (!endDate || startDate === endDate) return 1; // Full day case
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="container-fluid py-2 pb-5">
      <LeaveBalance />
      <div className="container-fluid">
        <div className="d-flex justify-content-between py-2">
          <TittleHeader
            title={"Your Leave Application"}
            numbers={rowData.length}
            message={"You can view your applied leaves here."}
          />
          <button
            className="btn btn-primary my-auto"
            onClick={() =>
              props.onAddLeaveApplicationEmp(loadLeaveApplicationEmpData)
            }
          >
            <FontAwesomeIcon icon={faPlus} id="plus-icon" /> Apply Leave
          </button>
        </div>

        {loading ? (
          <div id="loading-bar">
            <RingLoader
              css={override}
              size={50}
              color={"#0000ff"}
              loading={true}
            />
          </div>
        ) : rowData.length > 0 ? (
          <div>
            <div
              style={{
                height: "100%",
                maxHeight: "35vh",
                overflow: "auto",
                position: "relative",
                border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
              }}
              className="scroller mb-2 rounded-2"
            >
              <table className="table mb-0 table-hover">
                <thead>
                  <tr>
                    <th style={rowHeadStyle(darkMode)}>Leave Type</th>
                    <th style={rowHeadStyle(darkMode)}>From</th>
                    <th style={rowHeadStyle(darkMode)}>To</th>
                    <th style={rowHeadStyle(darkMode)}>Days</th>
                    <th style={rowHeadStyle(darkMode)}>Type</th>
                    <th style={rowHeadStyle(darkMode)}>Created At</th>
                    <th style={rowHeadStyle(darkMode)}>Remarks</th>
                    <th style={rowHeadStyle(darkMode)}>Status</th>
                    <th style={rowHeadStyle(darkMode)}>Update By</th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      Reason for Rejection
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...currentItems]
                    .sort(
                      (a, b) =>
                        new Date(b.CreatedOn).getTime() -
                        new Date(a.CreatedOn).getTime(),
                    )
                    .reverse()
                    .map((data, index) => (
                      <tr key={index}>
                        <td style={rowBodyStyle(darkMode)}>
                          {data.Leavetype === "unPaid Leave"
                            ? "Un-Paid Leave"
                            : data.Leavetype}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {getFormattedDate(data.FromDate)}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {data.ToDate
                            ? getFormattedDate(data.ToDate)
                            : "Half Day Only"}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {data.leaveDuration === "Half Day"
                            ? 0.5
                            : calculateDays(data.FromDate, data.ToDate)}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {data.leaveDuration}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {getFormattedDate(data.createdOn)}
                        </td>
                        <td
                          style={{ ...rowBodyStyle(darkMode), width: "300px" }}
                        >
                          <textarea
                            value={data.Reasonforleave || ""}
                            readOnly
                            className={`form-control ms-0 ms-md-auto rounded-2 ${
                              darkMode
                                ? "bg-light text-dark"
                                : "bg-dark text-light"
                            }`}
                            style={{ height: "2rem", minWidth: "230px" }}
                          />
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          <span
                            className={`${
                              status(data.Status) === "Pending"
                                ? darkMode
                                  ? "badge-warning border"
                                  : "badge-warning-dark"
                                : status(data.Status) === "Approved"
                                  ? darkMode
                                    ? "badge-success border"
                                    : "badge-success-dark"
                                  : status(data.Status) === "Rejected"
                                    ? darkMode
                                      ? "badge-danger border"
                                      : "badge-danger-dark"
                                    : darkMode
                                      ? "badge-warning border"
                                      : "badge-warning-dark"
                            }`}
                          >
                            {status(data.Status)}
                          </span>
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {data.Status == "3" && !data.updatedBy
                            ? "System"
                            : data.updatedBy || "Not Updated"}
                        </td>
                        <td className="text-end" style={rowBodyStyle(darkMode)}>
                          <textarea
                            value={
                              data.reasonOfRejection ||
                              (data.Status === "2" ? "Approved" : "Not Updated")
                            }
                            readOnly
                            className={`form-control ms-0 ms-md-auto rounded-2 ${
                              darkMode
                                ? "bg-light text-dark"
                                : "bg-dark text-light"
                            }`}
                            style={{ height: "2rem", minWidth: "230px" }}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              handlePaginationPrev={handlePaginationPrev}
              handlePaginationNext={handlePaginationNext}
              setCurrentPage={setCurrentPage}
              filteredDataLength={rowData.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        ) : (
          <div
            className="rounded-2 d-flex flex-column align-items-center justify-content-center text-center"
            style={{
              height: "80vh",
              width: "100%",
              gap: "18px",
              padding: "0 24px",
              background: darkMode
                ? "rgba(255, 255, 255, 0.85)"
                : "rgba(0, 0, 0, 0.65)",
            }}
          >
            <div
              style={{
                height: "180px",
                opacity: 0.9,
              }}
            >
              <img
                src={SalaryImage}
                alt="No leave requests"
                style={{
                  height: "100%",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "6px",
                  color: darkMode ? "#111827" : "#f9fafb",
                }}
              >
                No Leave Requests Found
              </div>

              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  maxWidth: "420px",
                  opacity: 0.85,
                  color: darkMode ? "#374151" : "#e5e7eb",
                }}
              >
                There are currently no leave requests to display. Submitted
                leave requests will appear here once available.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApplicationEmpTable;
