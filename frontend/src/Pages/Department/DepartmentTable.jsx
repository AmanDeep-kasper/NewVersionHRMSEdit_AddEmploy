import React, { useState, useEffect } from "react";
import "./DepartmentTable.css";
import axios from "axios";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import Position from "../../img/Position/Position.svg";
import BASE_URL from "../config/config";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import OverLayToolTip from "../../Utils/OverLayToolTip";
import { FiEdit2 } from "react-icons/fi";
import Pagination from "../../Utils/Pagination";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import api from "../config/api";

const DepartmentTable = ({ onAddDepartment, onEditDepartment }) => {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadDepartmentData();
  }, []);

  const loadDepartmentData = () => {
    api
      .get(`/api/department`, 
        
      )
      .then((response) => {
        setDepartmentData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDepartmentDelete = (id) => {
    if (window.confirm("Are you sure to delete this record ? ")) {
      api
        .delete(`/api/department/${id}`,
        )
        .then(() => {
          loadDepartmentData();
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.status === 403) {
            window.alert(err.response.data);
          }
        });
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
  const currentItems = departmentData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(departmentData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container-fluid mb-3">
      <div className="d-flex justify-content-between py-2">
        <div className="my-auto">
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
              fontWeight: "600",
            }}
            className=" m-0"
          >
            Department Details ({departmentData.length})
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className=" m-0"
          >
            You can see all department's list here
          </p>
        </div>
        <button
          className="btn btn-primary gap-1 d-flex  my-auto align-items-center justify-content-center"
          onClick={onAddDepartment}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Create Department</span>
        </button>
      </div>
      <div
        style={{
          color: darkMode
            ? "var(--secondaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
          overflow: "auto",
          maxHeight: "80vh",
          position: "relative",
        }}
      >
        {departmentData.length > 0 ? (
          <>
            <div>
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
                        <th style={rowHeadStyle(darkMode)}>S. No.</th>
                        <th style={rowHeadStyle(darkMode)}>Company</th>
                        <th style={rowHeadStyle(darkMode)}>Department</th>
                        <th style={rowHeadStyle(darkMode)} className="text-end">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((items, index) => (
                        <tr key={index}>
                          <td
                            style={rowBodyStyle(darkMode)}
                            className="text-capitalize"
                          >
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td
                            style={rowBodyStyle(darkMode)}
                            className="text-capitalize"
                          >
                            {items.company[0].CompanyName}
                          </td>
                          <td
                            style={rowBodyStyle(darkMode)}
                            className="text-capitalize"
                          >
                            {items.DepartmentName}
                          </td>
                          <td
                            style={rowBodyStyle(darkMode)}
                            className="text-capitalize text-end"
                          >
                            <OverLayToolTip
                              style={{ color: darkMode ? "black" : "white" }}
                              icon={<FiEdit2 className="text-primary" />}
                              onClick={() => onEditDepartment(items)}
                              tooltip={"Edit Department"}
                            />
                            <OverLayToolTip
                              style={{ color: darkMode ? "black" : "white" }}
                              icon={
                                <AiOutlineDelete className="fs-5 text-danger" />
                              }
                              onClick={() => onDepartmentDelete(items._id)}
                              tooltip={"Delete Department"}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              handlePaginationPrev={handlePaginationPrev}
              handlePaginationNext={handlePaginationNext}
              setCurrentPage={setCurrentPage}
              filteredDataLength={departmentData.length}
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
              wordSpacing: "5px",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <img
              style={{
                height: "auto",
                width: "20%",
              }}
              src={Position}
              alt="img"
            />
            <p
              className="text-center w-75 mx-auto"
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var( --primaryDashMenuColor)",
              }}
            >
              Department not created yet, to create new role click on "+ Create
              Department" button.
            </p>
          </div>
        )}
      </div>
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default DepartmentTable;
