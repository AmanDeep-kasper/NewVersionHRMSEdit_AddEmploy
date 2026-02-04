import React, { useState, useEffect } from "react";
// import "./LeaveApplicationHRTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import BASE_URL from "../../../../Pages/config/config";

import { css } from "@emotion/core";
import {
  Form,
  Button,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownButton
} from "react-bootstrap";

// *************csv & pdf **************//
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import api from "../../../../Pages/config/api";
// *************csv & pdf **************//

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const LeaveApplicationHRTable = (props) => {
  const [leaveApplicationHRData, setLeaveApplicationHRData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  let leaveApplicationHRObj = [];
  let rowDataT = [];

  const loadLeaveApplicationHRData = () => {
    api
      .get(`/api/leave-application-hr/`, {
      })
      .then((response) => {
        leaveApplicationHRObj = response.data;
          
        setLeaveApplicationHRData(response.data);
        setLoading(false);

        rowDataT = [];

        leaveApplicationHRObj.map((data) => {
          let temp = {
            data,
            empID:
              data["employee"] &&
              data["employee"][0] &&
              data["employee"][0]["empID"],
            Name:
              data["employee"] &&
              data["employee"][0] &&
              data["employee"][0]["FirstName"] +
                " " +
                data["employee"][0]["LastName"],
            Leavetype: data["Leavetype"],
            FromDate: data["FromDate"].slice(0, 10),
            ToDate: data["ToDate"].slice(0, 10),
            Reasonforleave: data["Reasonforleave"],
            Status: status(data["Status"])
          };

          rowDataT.push(temp);
        });

        setRowData(rowDataT);

        setTotalLeaves(response.data.length);
        props.updateTotalLeaves(response.data.length);
      })
      .catch((error) => {
          
      });
  };

  // ...

  const onLeaveApplicationHRDelete = (e1, e2) => {
      
    if (window.confirm("Are you sure to delete this record? ") == true) {
      api
        .delete(`/api/leave-application-hr/` + e1 + "/" + e2, {
        })
        .then((res) => {
          loadLeaveApplicationHRData();
        })
        .catch((err) => {
            
        });
    }
  };

  const exportToPDF = () => {
    if (window.confirm("Are you sure to download Leave record? ")) {
      // Set A4 landscape dimensions
      const pdfWidth = 297; // A4 width in mm
      const pdfHeight = 210; // A4 height in mm
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight]
      });

      doc.setFontSize(18);
      doc.text("Employee Leave Details", pdfWidth / 2, 15, "center");
      const headers = [
        "Emp Id",
        "Leave Type",
        "Start Date",
        "End Date",
        "Remarks",
        "Status"
      ];
      const data = rowData.map((row) => [
        row.empID,
        row.Leavetype,
        row.FromDate,
        row.ToDate,
        row.Reasonforleave,
        row.Status,

        "" // Action column - you can customize this based on your requirements
      ]);
      doc.setFontSize(12);
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 25
      });

      doc.save("leaveApplication_data.pdf");
    }
  };

  useEffect(() => {
    loadLeaveApplicationHRData();
  }, []);

  const renderButton = (params) => {
      
    return (
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() =>
          onLeaveApplicationHRDelete(
            params.data.data["employee"][0]["_id"],
            params.data.data["_id"]
          )
        }
      />
    );
  };

  const renderEditButton = (params) => {
      
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => props.onEditLeaveApplicationHR(params.data.data)}
      />
    );
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
    // Add a default case or return a meaningful value for unknown status
    return "Unknown";
  };

  const renderSortIcon = (field) => {
    if (sortColumn === field) {
      return sortDirection === "asc" ? "▴" : "▾";
    }
    return null;
  };

  const sortData = (columnName) => {
    const newSortDirection =
      sortColumn === columnName && sortDirection === "asc" ? "desc" : "asc";

    const sortedData = [...rowData];

    sortedData.sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];

      let comparison = 0;

      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      return newSortDirection === "desc" ? comparison * -1 : comparison;
    });

    setRowData(sortedData);
    setSortColumn(columnName);
    setSortDirection(newSortDirection);
  };

  // Calculate the total length for each status
  const pendingLeaves = rowData.filter(
    (data) => data.Status === "Pending"
  ).length;
  const approvedLeaves = rowData.filter(
    (data) => data.Status === "Approved"
  ).length;
  const rejectedLeaves = rowData.filter(
    (data) => data.Status === "Rejected"
  ).length;

  return (
    <div>
      <div className="container-fluid">
        <div className="row row-gap-4">
          <div className="col-md-4">
            <div
              style={{
                position: "relative",
                color: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                backgroundColor: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--primaryDashMenuColor)"
              }}
              className="position-relative p-2 rounded-3"
            >
              <div className=" d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center  flex-nowrap">
                  <p className="fw-bold my-auto pt-2">New Leave Request</p>
                  <span className="fw-bolder" style={{ fontSize: "35px" }}>
                    {pendingLeaves}
                  </span>
                </div>
                <Link
                  style={{
                    backgroundColor: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)"
                  }}
                  className="text-decoration-none px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold aline-center"
                  to="/hr/leave-application-hr"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              style={{
                position: "relative",
                color: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                backgroundColor: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--primaryDashMenuColor)"
              }}
              className="position-relative p-2 rounded-3"
            >
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center  flex-nowrap">
                  <p className="fw-bold my-auto pt-2">Approved Leaves</p>
                  <span className="fw-bolder" style={{ fontSize: "35px" }}>
                    {approvedLeaves}
                  </span>
                </div>
                <Link
                  style={{
                    backgroundColor: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)"
                  }}
                  className="text-decoration-none px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold aline-center"
                  to="/hr/leaveAccepted"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              style={{
                position: "relative",
                color: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                backgroundColor: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--primaryDashMenuColor)"
              }}
              className="position-relative p-2 rounded-3"
            >
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center  flex-nowrap">
                  <p className="fw-bold my-auto pt-2">Rejected Leaves</p>
                  <span className="fw-bolder" style={{ fontSize: "35px" }}>
                    {rejectedLeaves}
                  </span>
                </div>
                <Link
                  style={{
                    backgroundColor: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)"
                  }}
                  className="text-decoration-none px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold aline-center"
                  to="/hr/leaveRejected"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationHRTable;
