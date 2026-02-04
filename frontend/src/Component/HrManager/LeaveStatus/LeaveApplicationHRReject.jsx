import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { LuSearch } from "react-icons/lu";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";
import { useLocation } from "react-router-dom";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import LeaveLight from "../../../img/Leave/LeaveLight.svg";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import LeaveDark from "../../../img/Leave/LeaveDark.svg";
import Pagination from "../../../Utils/Pagination";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import api from "../../../Pages/config/api";

const LeaveApplicationHRTable = (props) => {
  const location = useLocation();
  const routeChecker = location.pathname.split("/")[1];
  const { userData } = useSelector((state) => state.user);
  const [leaveApplicationHRData, setLeaveApplicationHRData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { darkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const email = userData?.Email;

  const loadLeaveApplicationHRData = () => {
    api
      .post(
        `/api/leave-application-hr/`,
        routeChecker === "hr" ? { hr: email } : { manager: email },
      )
      .then((response) => {
        const leaveApplicationHRObj = response.data;
        setLeaveApplicationHRData(leaveApplicationHRObj);
        setLoading(false);

        const rowDataT = leaveApplicationHRObj.map((data) => {
          return {
            data,
            empID: data?.empID,
            FirstName: data?.FirstName,
            LastName: data?.LastName,
            Name: data?.FirstName + " " + data?.LastName,
            Leavetype: data?.Leavetype,
            FromDate: data?.FromDate?.slice(0, 10),
            ToDate: data?.ToDate?.slice(0, 10),
            CreatedOn: data?.createdOn,
            leaveDuration: data?.leaveDuration,
            Days: calculateDays(data?.FromDate, data?.ToDate),
            Reasonforleave: data?.Reasonforleave,
            Status: status(data?.Status),
            updatedBy: data?.updatedBy,
            reasonOfRejection: data?.reasonOfRejection,
            profile: data.profile,
          };
        });

        setRowData(
          rowDataT.filter(
            (data) => data.Status === "Rejected" || data.Status === 3
          )
        );
        setFilteredData(
          rowDataT.filter(
            (data) => data.Status === "Rejected" || data.Status === 3
          )
        );
      })
      .catch((error) => { });
  };

  useEffect(() => {
    loadLeaveApplicationHRData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery]);

  const filterData = () => {
    const filtered = rowData.filter((item) => {
      return item.Name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(filtered);
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end dates
    return diffDays;
  };

  const onLeaveApplicationHRDelete = (e1, e2) => {
    if (window.confirm("Are you sure to delete this record? ")) {
      api
        .delete(`/api/leave-application-hr/` + e1 + "/" + e2, {
        })
        .then((res) => {
          loadLeaveApplicationHRData();
        })
        .catch((err) => { });
    }
  };

  const exportToPDF = () => {
    if (window.confirm("Are you sure to download Leave record? ")) {
      const pdfWidth = 297; // A4 width in mm
      const pdfHeight = 210; // A4 height in mm
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      doc.setFontSize(18);
      doc.text("Employee Leave Details", pdfWidth / 2, 15, "center");
      const headers = [
        "Emp Id",
        "Leave Type",
        "Start Date",
        "End Date",
        "Remarks",
        "Days",
        "Status",
      ];
      const data = filteredData.map((row) => [
        row.empID,
        row.Leavetype,
        row.FromDate,
        row.ToDate,
        row.Days,
        row.Reasonforleave,
        row.Status,
      ]);
      doc.setFontSize(12);
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 25,
      });

      doc.save("leaveApplication_data.pdf");
    }
  };

  const status = (s) => {
    if (s == 1) {
      return "Pending";
    }
    if (s == 2) {
      return "Approved";
    }
    if (s == 3) {
      return "Rejected";
    }
  };
  const RejectedLeaves = filteredData.filter(
    (data) => data.Status === "Rejected"
  ).length;

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column justify-between m-0 mt-2">
        <div className="d-flex justify-content-between aline-items-center">
          <TittleHeader
            title={"Rejected Leaves"}
            numbers={filteredData.length}
            message={"You can see all rejected leave requests here"}
          />

          <div className="d-flex gap-2 justify-content-between py-3">
            <button
              className="btn btn-danger rounded-2 py-0 shadow-sm d-flex justify-center  aline-center gap-2"
              onClick={exportToPDF}
            >
              <BsFillFileEarmarkPdfFill className="fs-6" />
              <p className="my-auto d-none d-md-flex fs-6">PDF</p>
            </button>
            <div className="searchholder p-0 d-flex  position-relative">
              <input
                style={{
                  height: "100%",
                  width: "100%",
                  paddingLeft: "15%",
                }}
                className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                  }`}
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <LuSearch
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "5%",
                  color: darkMode ? "black" : "white",
                  opacity: "40%",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div id="clear-both" />

      <div>
        <div>
          {currentItems.length > 0 ? (
            <>
              <div>
                <div
                  style={{
                    height: "fit-content",
                    maxHeight: "70vh",
                    overflow: "auto",
                    position: "relative",
                    border: darkMode
                      ? "var(--borderLight)"
                      : "var(--borderDark)",
                  }}
                  className="scroller mb-2 rounded-2"
                >
                  <table className="table mb-0 table-hover">
                    <thead>
                      <tr>
                        <th style={rowHeadStyle(darkMode)}>User Profile</th>
                        <th style={rowHeadStyle(darkMode)}>Leave Type</th>
                        <th style={rowHeadStyle(darkMode)}>Start Date</th>
                        <th style={rowHeadStyle(darkMode)}>End Date</th>
                        <th style={rowHeadStyle(darkMode)}>Created On</th>
                        <th style={rowHeadStyle(darkMode)}>Days</th>
                        <th style={rowHeadStyle(darkMode)}>Status</th>
                        <th style={rowHeadStyle(darkMode)}>Remarks</th>
                        <th style={rowHeadStyle(darkMode)}>Rejected By</th>
                        <th className="text-end" style={rowHeadStyle(darkMode)}>
                          Rejection Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems
                        .sort(
                          (a, b) =>
                            new Date(b.CreatedOn).getTime() -
                            new Date(a.CreatedOn).getTime()
                        )
                        .map((data, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={rowBodyStyle(darkMode)}
                                className="text-capitalize px-0 py-1"
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <div
                                    className="mx-1 d-flex align-items-center justify-content-center"
                                    style={{
                                      height: "30px",
                                      width: "30px",
                                      borderRadius: "50%",
                                      backgroundColor: "#ccc",
                                      color: "white",
                                      fontWeight: "bold",
                                      overflow: "hidden",
                                      objectFit: "cover",
                                    }}
                                  >
                                    {data.profile ? (
                                      <img
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          borderRadius: "50%",
                                          objectFit: "cover",
                                        }}
                                        src={data.profile}
                                        alt=""
                                      />
                                    ) : (
                                      <span>
                                        {data?.FirstName[0].toUpperCase()}
                                        {data?.LastName[0].toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <div className="d-flex flex-column">
                                    <span style={{ fontSize: ".9rem" }}>
                                      {data.empID}
                                    </span>
                                    <span>{data.Name}</span>
                                  </div>
                                </div>
                              </td>
                              <td
                                className="text-capitalize"
                                style={rowBodyStyle(darkMode)}
                              >
                               {data.Leavetype === "unPaid Leave" ? "Un-Paid Leave" : data.Leavetype} ( {data.leaveDuration} )
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                {data.FromDate}
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                {data.ToDate}
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                {!data.CreatedOn ? (
                                  <span>--</span>
                                ) : (
                                  <span>
                                    {getFormattedDate(data.CreatedOn)}
                                  </span>
                                )}
                              </td>
                              <td className="text-center" style={rowBodyStyle(darkMode)}>
                                <span>{data.leaveDuration === "Full Day" ? data.Days : data.Days / 2}</span>
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                <span
                                  className={`${darkMode
                                      ? "badge-danger border"
                                      : "badge-danger-dark"
                                    }`}
                                >
                                  {data.Status}
                                </span>
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                <textarea
                                  value={
                                    data.Reasonforleave || "reasion not updated"
                                  }
                                  readOnly
                                  className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                                      ? "bg-light text-dark"
                                      : "bg-dark text-light"
                                    }`}
                                  style={{ height: "2rem", minWidth:'230px' }}
                                />
                              </td>
                              <td className="text-center" style={rowBodyStyle(darkMode)}>
                                {data.data.updatedBy ? data.data.updatedBy : "System"}
                              </td>
                              <td
                                className="text-end"
                                style={rowBodyStyle(darkMode)}
                              >
                                <textarea
                                  value={
                                    data.data.reasonOfRejection ||
                                    "Rejection reason is not updated"
                                  }
                                  readOnly
                                  className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                                      ? "bg-light text-dark"
                                      : "bg-dark text-light"
                                    }`}
                                  style={{ height: "2rem" , minWidth:'230px'}}
                                />
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
                filteredDataLength={filteredData.length}
                itemsPerPage={itemsPerPage}
              />
            </>
          ) : (
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
                  width: "25%",
                }}
                src={darkMode ? LeaveDark : LeaveLight}
                alt="img"
              />
              <p
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var( --primaryDashMenuColor)",
                }}
              >
                No Leave requests found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationHRTable;
