import React, { useState, useEffect } from "react";
import "./AdminProjectBidTable.css";
import axios from "axios";

import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import Pagination from "../../Utils/Pagination";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import OverLayToolTip from "../../Utils/OverLayToolTip";
import { FiEdit2 } from "react-icons/fi";
import api from "../../Pages/config/api";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const AdminProjectBidTable = (props) => {
  const [projectBidData, setProjectBidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const loadProjectBidData = () => {
    api
      .get(`/api/admin/project-bid`, {
       
      })
      .then((response) => {
        const projectBidData = response.data;
        setProjectBidData(projectBidData);
        setLoading(false);
        setError(null);

        const rowData = projectBidData.map((data) => ({
          data,
          ProjectTitle: data["ProjectTitle"],
          Currency: data["currency"],
          PortalName:
            data["portals"] && data["portals"].length > 0
              ? data["portals"][0]["PortalName"]
              : "N/A", // Set a default value if portals is empty or undefined
          ProjectURL: data["ProjectURL"],
          EstimatedTime: data["EstimatedTime"],
          EstimatedCost: data["EstimatedCost"],
          Remark: data["Remark"],
        }));

        setRowData(rowData);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
        setError("Error loading data.");
      });
  };

  const onProjectBidDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      api
        .delete(`/api/admin/project-bid/${id}`, {
         
        })
        .then(() => {
          loadProjectBidData();
        })
        .catch((err) => {
          console.error("Error deleting record:", err);
        });
    }
  };

  useEffect(() => {
    loadProjectBidData();
  }, []);

  const renderSortIcon = (field) => {
    if (sortColumn === field) {
      return sortDirection === "asc" ? "▴" : "▾";
    }
    return null;
  };

  const sortData = (columnName) => {
    let newSortDirection = sortDirection === "asc" ? "desc" : "asc";

    const sortedData = [...rowData].sort((a, b) => {
      const valueA = String(a[columnName]).toLowerCase();
      const valueB = String(b[columnName]).toLowerCase();

      return newSortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    setRowData(sortedData);
    setSortColumn(columnName);
    setSortDirection(newSortDirection);
  };

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projectBidData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(projectBidData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-between align-items-start mb-3">
        <TittleHeader
          title={"Bidding Details"}
          numbers={projectBidData.length}
          message={"You can view all bids here."}
        />

        <button
          className="btn btn-primary gap-1 d-flex my-auto align-items-center justify-content-center"
          onClick={props.onAddProjectBid}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Add Bid</span>
        </button>
      </div>
      <div id="clear-both" />

      {loading && (
        <div id="loading-bar">
          <RingLoader
            css={override}
            sizeUnit={"px"}
            size={50}
            color={"#0000ff"}
            loading={true}
          />
        </div>
      )}
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
          <table className="table">
            <thead>
              <tr>
                <th
                  style={rowHeadStyle(darkMode)}
                  onClick={() => sortData("ProjectTitle")}
                >
                  S. No {renderSortIcon("ProjectTitle")}
                </th>
                <th
                  style={rowHeadStyle(darkMode)}
                  onClick={() => sortData("ProjectTitle")}
                >
                  Project Title {renderSortIcon("ProjectTitle")}
                </th>
                <th
                  style={rowHeadStyle(darkMode)}
                  onClick={() => sortData("PortalName")}
                >
                  Portal {renderSortIcon("PortalName")}
                </th>
                <th
                  style={rowHeadStyle(darkMode)}
                  onClick={() => sortData("ProjectURL")}
                >
                  Project URL {renderSortIcon("ProjectURL")}
                </th>
                <th
                  style={rowHeadStyle(darkMode)}
                  onClick={() => sortData("EstimatedTime")}
                >
                  Estimated Time {renderSortIcon("EstimatedTime")}
                </th>
                <th
                  style={rowHeadStyle(darkMode)}
                  onClick={() => sortData("EstimatedCost")}
                >
                  Estimated Cost {renderSortIcon("EstimatedCost")}
                </th>
                <th
                  style={rowHeadStyle(darkMode)}
                  onClick={() => sortData("Remark")}
                >
                  Remark {renderSortIcon("Remark")}
                </th>

                <th style={rowHeadStyle(darkMode)} className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((items, index) => (
                <tr key={index}>
                  <td style={rowBodyStyle(darkMode)}>
                    {(index + 1).toString().padStart(2, 0)}
                  </td>
                  <td style={rowBodyStyle(darkMode)}>{items.ProjectTitle}</td>
                  <td style={rowBodyStyle(darkMode)}>
                    {" "}
                    {items.portals && items.portals.length > 0
                      ? items.portals[0].PortalName
                      : "N/A"}
                  </td>
                  <td style={rowBodyStyle(darkMode)}>
                    <a
                      href={items.ProjectURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {items.ProjectURL}
                    </a>
                  </td>
                  <td style={rowBodyStyle(darkMode)}>
                    {items.EstimatedTime} {items.TimePeriod}
                  </td>
                  <td style={rowBodyStyle(darkMode)}>
                    {items.Currency}
                    {items.EstimatedCost}
                  </td>
                  <td style={rowBodyStyle(darkMode)}>
                    <textarea
                      value={items.Remark || "Remark not updated"}
                      readOnly
                      className={`form-control ms-0 ms-md-auto rounded-2 ${
                        darkMode ? "bg-light text-dark" : "bg-dark text-light"
                      }`}
                      style={{ height: "2rem" }}
                    />
                  </td>
                  <td className="text-end" style={rowBodyStyle(darkMode)}>
                    <OverLayToolTip
                      style={{ color: darkMode ? "black" : "white" }}
                      icon={<FiEdit2 className="text-primary" />}
                      onClick={() => props.onEditProjectBid(items)}
                      tooltip={"Edit Role"}
                    />
                    <OverLayToolTip
                      style={{ color: darkMode ? "black" : "white" }}
                      icon={<AiOutlineDelete className="fs-5 text-danger" />}
                      onClick={() => onProjectBidDelete(items._id)}
                      tooltip={"Delete Role"}
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
          filteredDataLength={projectBidData.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminProjectBidTable;
