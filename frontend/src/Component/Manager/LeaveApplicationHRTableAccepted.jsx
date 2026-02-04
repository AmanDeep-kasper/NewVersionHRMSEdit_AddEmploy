import React, { useState, useEffect } from "react";
import axios from "axios";
import { css } from "@emotion/core";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { LuSearch } from "react-icons/lu";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import LeaveLight from "../../img/Leave/LeaveLight.svg";
import LeaveDark from "../../img/Leave/LeaveDark.svg";
import BASE_URL from "../../Pages/config/config";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import Pagination from "../../Utils/Pagination";
import { useSelector } from "react-redux";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import ProfileAvatar from "../../Utils/ProfileAvatar/ProfileAvatar";
import Styles from "../../Style/Scroller.module.css";
import { useLocation } from "react-router-dom";
import api from "../../Pages/config/api";

const LeaveApplicationHRTableAccepted = (props) => {
  const [leaveApplicationHRData, setLeaveApplicationHRData] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { darkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const email = userData?.Email;
  const formatDate = (dateString) => {
    if (!dateString) return;
    const dateParts = dateString.split("-");
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  };
const location = useLocation();
  const routeChecker = location.pathname.split("/")[1];
  console.log("Filtered Data:", filteredData);
  console.log("Row Data:", rowData);

  // const loadLeaveApplicationHRData = () => {
  //   axios
  //     .post(
  //       `${BASE_URL}/api/leave-application-hr/`,
  //       // { manager: email },
  //       {
  //         headers: {
  //           authorization: localStorage.getItem("token") || "",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       const leaveApplicationHRObj = response.data;

  //       setLeaveApplicationHRData(leaveApplicationHRObj);
  //       setLoading(false);
  //       function formatDateFull(dateString) {
  //         const date = new Date(dateString);
  //         const formattedDate = date.toLocaleDateString("en-CA");
  //         let hours = date.getHours();
  //         const minutes = date.getMinutes().toString().padStart(2, "0");
  //         const ampm = hours >= 12 ? "PM" : "AM";
  //         hours = hours % 12 || 12;
  //         const formattedTime = `${hours}:${minutes} ${ampm}`;
  //         return `${formattedDate} ${formattedTime}`;
  //       }
  //       const rowDataT = leaveApplicationHRObj.map((data) => {
  //         return {
  //           data,
  //           empID: data?.empID,
  //           FirstName: data?.FirstName,
  //           LastName: data?.LastName,
  //           Name: data?.FirstName + " " + data?.LastName,
  //           Leavetype: data?.Leavetype,
  //           CreatedOn: formatDateFull(data?.createdOn),
  //           FromDate: formatDate(data["FromDate"]?.slice(0, 10)),
  //           ToDate: formatDate(data["ToDate"]?.slice(0, 10)),
  //           Days: calculateDays(data?.FromDate, data?.ToDate),
  //           Reasonforleave: data?.Reasonforleave,
  //           Status: status(data?.Status),
  //           empObjID: data?.empObjID,
  //           reportHr: data?.reportHr,
  //           profile: data.profile.image_url,
  //           reportManager: data?.reportManager,
  //         };
  //       });

  //       setRowData(
  //         rowDataT.filter(
  //           (data) => data.Status === "Approved" || data.Status === 2
  //         )
  //       );
  //       setFilteredData(
  //         rowDataT.filter(
  //           (data) => data.Status === "Approved" || data.Status === 2
  //         )
  //       );
  //     })
  //     .catch((error) => {});
  // };
  
  
  const loadLeaveApplicationHRData = () => {
    api
      .post(
        `/api/leave-application-hr/`,
        routeChecker === "hr" ? { hr: email } : { manager: email },
        
      )
      .then((response) => {
        const leaveApplicationHRObj = response.data;

        const rowDataT = leaveApplicationHRObj.map((data) => {
          return {
            data,
            empID: data?.empID,
            FirstName: data?.FirstName,
            LastName: data?.LastName,
            Name: data?.FirstName + " " + data?.LastName,
            Leavetype: data?.Leavetype,
            FromDate: formatDate(data["FromDate"]?.slice(0, 10)),
            ToDate: formatDate(data["ToDate"]?.slice(0, 10)),
            Days: calculateDays(data?.FromDate, data?.ToDate),
            Reasonforleave: data?.Reasonforleave,
            CreatedOn: data?.createdOn,
            leaveDuration: data?.leaveDuration,
            Status: status(data?.Status),
            updatedBy: data?.updatedBy,
            reasonOfRejection: data?.reasonOfRejection,
            profile: data.profile,
          };
        });

        setRowData(
          rowDataT.filter(
            (data) => data.Status === "Approved" || data.Status === 2
          )
        );
        setFilteredData(
          rowDataT.filter(
            (data) => data.Status === "Approved" || data.Status === 2
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
      return (item.FirstName + " " + item.LastName)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
    setFilteredData(filtered);
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
        .catch((err) => {});
    }
  };

  const exportToPDF = () => {
    if (window.confirm("Are you sure to download Approved Leave record?")) {
      const pdfWidth = 297;
      const pdfHeight = 210;
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      doc.setFontSize(18);
      doc.text("Employee Approved Leave Details", pdfWidth / 2, 15, "center");

      const headers = [
        "Emp Id",
        "Leave Type",
        "Start Date",
        "End Date",
        "Days",
        "CreatedOn",
        "Remarks",
        "Status",
      ];

      const ApprovedLeaves = filteredData.filter(
        (row) => row.Status === "Approved"
      );

      const data = ApprovedLeaves.map((row) => [
        row.empID,
        row.Leavetype,
        row.FromDate,
        row.ToDate,
        row.Days,
        row.CreatedOn,
        row.Reasonforleave,
        row.Status,
      ]);

      doc.setFontSize(12);
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 25,
      });

      doc.save("Approved_leaveApplication_data.pdf");
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

  const approvedLeaves = filteredData.filter(
    (data) => data.Status === "Approved"
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
      <div className="d-flex flex-column justify-between m-0 mt-3">
        <div className="d-flex justify-content-between aline-items-center">
          <TittleHeader
            title={"Approved Leaves"}
            numbers={approvedLeaves}
            message={"You can see all new leave requests here"}
          />

          <div className="d-flex gap-2 justify-content-between py-3">
            <button
              className="btn btn-danger rounded-0 py-0 shadow-sm d-flex justify-center  aline-center gap-2"
              onClick={exportToPDF}
            >
              <BsFillFileEarmarkPdfFill className="fs-6" />
              <p className="my-auto d-none d-md-flex fs-6">PDF</p>
            </button>
            <div className="searchholder p-0 d-flex  position-relative">
              <input
                style={{
                  paddingLeft: "15%",
                }}
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
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
                  color: !darkMode ? "white" : "black",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div id="clear-both" />

      <div>
        <div>
          {filteredData.length > 0 ? (
            <div>
              <div
                style={{
                  height: "fit-content",
                  maxHeight: "75vh",
                  overflow: "auto",
                  position: "relative",
                  border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
                }}
                className={`rounded-2 ${Styles.scroller}`}
              >
                <table className="table mb-0 table-hover">
                  <thead>
                    <tr>
                      <th style={rowHeadStyle(darkMode)}>Employee Name</th>
                      <th style={rowHeadStyle(darkMode)}>Emp ID</th>
                      <th style={rowHeadStyle(darkMode)}>Leave Type</th>
                      <th style={rowHeadStyle(darkMode)}>Start Date</th>
                      <th style={rowHeadStyle(darkMode)}>End Date</th>
                      <th style={rowHeadStyle(darkMode)}>Created On</th>
                      <th style={rowHeadStyle(darkMode)}>Days</th>
                      <th style={rowHeadStyle(darkMode)}>Status</th>
                      <th style={rowHeadStyle(darkMode)}>Remarks</th>
                      <th className="text-end" style={rowHeadStyle(darkMode)}>
                        Approver
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td style={rowBodyStyle(darkMode)} className="py-1">
                            <ProfileAvatar
                              imageURL={data.profile}
                              firstName={data.FirstName}
                              lastName={data.LastName}
                            />
                          </td>
                          <td style={rowBodyStyle(darkMode)}>{data.empID}</td>
                          <td style={rowBodyStyle(darkMode)}>
                            {data.Leavetype}
                          </td>
                          <td style={rowBodyStyle(darkMode)}>
                            {data.FromDate}
                          </td>
                          <td style={rowBodyStyle(darkMode)}>{data.ToDate}</td>
                          <td style={rowBodyStyle(darkMode)}>
                            <span>{data.CreatedOn}</span>
                          </td>
                          <td style={rowBodyStyle(darkMode)}>
                            <span>{data.Days}</span>
                          </td>
                          <td style={rowBodyStyle(darkMode)}>
                            <span
                              className={`${
                                darkMode
                                  ? "badge-success border"
                                  : "badge-success-dark border"
                              }`}
                            >
                              {data.Status}
                            </span>
                          </td>
                          <td style={rowBodyStyle(darkMode)}>
                            <textarea
                              value={data.Reasonforleave || "Not Updated"}
                              readOnly
                              className={`form-control ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark"
                                  : "bg-dark text-light"
                              }`}
                              style={{ height: "2rem" }}
                            />
                          </td>
                          <td
                            className="text-end"
                            style={rowBodyStyle(darkMode)}
                          >
                            {data.data.updatedBy}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
            </div>
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

export default LeaveApplicationHRTableAccepted;
