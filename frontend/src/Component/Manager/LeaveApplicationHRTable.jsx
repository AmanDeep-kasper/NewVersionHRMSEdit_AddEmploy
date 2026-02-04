import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { LuSearch } from "react-icons/lu";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import LeaveLight from "../../img/Leave/LeaveLight.svg";
import LeaveDark from "../../img/Leave/LeaveDark.svg";
import BASE_URL from "../../Pages/config/config";
import Pagination from "../../Utils/Pagination";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import OverLayToolTip from "../../Utils/OverLayToolTip";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import ProfileAvatar from "../../Utils/ProfileAvatar/ProfileAvatar";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import api from "../../Pages/config/api";

const LeaveApplicationHRTable = (props) => {
  const { userData } = useSelector((state) => state.user);
  const [rowData, setRowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { darkMode } = useTheme();
  const email = userData?.Email;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const formatDate = (dateString) => {
    if (!dateString) return;
    const dateParts = dateString.split("-");
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  };

  const loadLeaveApplicationHRData = () => {
    api
      .post(
        `/api/leave-application-hr/`,
        { manager: email },
       
      )
      .then((response) => {
        const leaveApplicationHRObj = response.data;
        function formatDateFull(dateString) {
          const date = new Date(dateString);
          const formattedDate = date.toLocaleDateString("en-CA");
          let hours = date.getHours();
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12;
          const formattedTime = `${hours}:${minutes} ${ampm}`;
          return `${formattedDate} ${formattedTime}`;
        }
        const rowDataT = leaveApplicationHRObj.map((data) => {
          return {
            data,
            empID: data?.empID,
            FirstName: data?.FirstName,
            LastName: data?.LastName,
            profile: data?.profile,
            Name: data?.FirstName + " " + data?.LastName,
            Leavetype: data?.Leavetype,
            leaveDuration: data?.leaveDuration,
            CreatedOn: formatDateFull(data?.createdOn),
            FromDate: formatDate(data["FromDate"]?.slice(0, 10)),
            ToDate: formatDate(data["ToDate"]?.slice(0, 10)),
            Days: calculateDays(data?.FromDate, data?.ToDate),
            Reasonforleave: data?.Reasonforleave,
            Status: status(data?.Status),
            empObjID: data?.empObjID,
            reportHr: data?.reportHr,
            reportManager: data?.reportManager,
          };
        });

        setRowData(
          rowDataT.filter(
            (data) => data.Status === "Pending" || data.Status === 1
          )
        );
        setFilteredData(
          rowDataT.filter(
            (data) => data.Status === "Pending" || data.Status === 1
          )
        );
      })
      .catch((error) => {});
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
    if (!endDate) return 0.5;
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
        .catch((err) => {});
    }
  };

  const exportToPDF = () => {
    if (window.confirm("Are you sure to download Pending Leave record?")) {
      const pdfWidth = 297;
      const pdfHeight = 210;
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      doc.setFontSize(18);
      doc.text("Employee Pending Leave Details", pdfWidth / 2, 15, "center");

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

      // Filter only rejected leaves
      const PendingLeaves = filteredData.filter(
        (row) => row.Status === "Pending"
      );

      const data = PendingLeaves.map((row) => [
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

      doc.save("Pending_leaveApplication_data.pdf");
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
      <div className="d-flex flex-column justify-between">
        <div className="d-flex justify-content-between aline-items-center">
          <TittleHeader
            title={"Leaves Request "}
            numbers={filteredData.length}
            message={"You can see all new leave requests here"}
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
                  color: "gray",
                  opacity: "50%",
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
            <div>
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
                <table className="table" style={{ fontSize: ".9rem" }}>
                  <thead>
                    <tr>
                      <th style={rowHeadStyle(darkMode)}>Employee Name</th>
                      <th style={rowHeadStyle(darkMode)}>Emp ID</th>
                      <th style={rowHeadStyle(darkMode)}>Leave Type</th>
                      <th style={rowHeadStyle(darkMode)}>Start Date</th>
                      <th style={rowHeadStyle(darkMode)}>End Date</th>
                      <th style={rowHeadStyle(darkMode)}>Created at</th>
                      <th style={rowHeadStyle(darkMode)}>Days</th>
                      <th style={rowHeadStyle(darkMode)}>Status</th>
                      <th style={rowHeadStyle(darkMode)}>Remarks</th>
                      <th className="text-end" style={rowHeadStyle(darkMode)}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td style={rowBodyStyle(darkMode)} className="py-1">
                            <ProfileAvatar
                              imageURL={data?.profile}
                              firstName={data.FirstName}
                              lastName={data.LastName}
                            />
                          </td>

                          <td style={rowBodyStyle(darkMode)}>{data.empID}</td>
                          <td style={rowBodyStyle(darkMode)}>
                            {data.Leavetype === "unPaid Leave" ? "Un-Paid Leave" : data.Leavetype} ( {data.leaveDuration} )
                          </td>
                          <td style={rowBodyStyle(darkMode)}>
                            {data.FromDate}
                          </td>
                          <td style={rowBodyStyle(darkMode)}>{data.ToDate}</td>
                          <td style={rowBodyStyle(darkMode)}>
                            <span>{data.CreatedOn}</span>
                          </td>
                              <td className="text-center" style={rowBodyStyle(darkMode)}>
                                <span>{data.leaveDuration === "Full Day" ? data.Days : data.Days/2 }</span>
                              </td>
                          <td style={rowBodyStyle(darkMode)}>
                            <span
                              className={`${
                                darkMode
                                  ? "badge-warning border"
                                  : "badge-warning-dark"
                              }`}
                            >
                              {data.Status}
                            </span>
                          </td>
                          <td style={rowBodyStyle(darkMode)}>
                            <textarea
                              value={
                                data.Reasonforleave ||
                                (data.Status === "2"
                                  ? "Approved"
                                  : "Not Updated")
                              }
                              readOnly
                              className={`form-control ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark"
                                  : "bg-dark text-light"
                              }`}
                              style={{ height: "2rem", minWidth:"230px" }}
                            />
                          </td>
                          <td
                            className="text-end"
                            style={rowBodyStyle(darkMode)}
                          >
                            <OverLayToolTip
                              style={{ color: darkMode ? "black" : "white" }}
                              icon={<FiEdit2 className="text-primary" />}
                              onClick={() =>
                                props.onEditLeaveApplicationHR(
                                  data.data,
                                  data.Days
                                )
                              }
                              tooltip={"Edit Leave"}
                            />
                            <OverLayToolTip
                              style={{ color: darkMode ? "black" : "white" }}
                              icon={
                                <AiOutlineDelete className="fs-5 text-danger" />
                              }
                              onClick={() =>
                                onLeaveApplicationHRDelete(
                                  data.empObjID,
                                  data.data["_id"]
                                )
                              }
                              tooltip={"Delete Leave"}
                            />
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

export default LeaveApplicationHRTable;
