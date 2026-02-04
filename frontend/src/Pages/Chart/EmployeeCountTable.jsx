import React, { useState, useEffect } from "react";
import "./EmployeeCount.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "jspdf-autotable";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../config/api";

const EmployeeCountTable = (props) => {
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  const loadEmployeeData = () => {
    api
      .get(`/api/employee`, {
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRowData([]);
          response.data.forEach((data) => {
            let temp = {
              data,
              Email: data["Email"],
              Password: data["Password"],
              Account:
                data["Account"] === 1
                  ? "Admin"
                  : data["Account"] === 2
                  ? "HR"
                  : data["Account"] === 3
                  ? "Employee"
                  : data["Account"] === 4
                  ? "Manager"
                  : "",
              RoleName: data["role"][0] ? data["role"][0]["RoleName"] : "",
              loginStatus: data["loginStatus"],
            };
            setRowData((prevData) => [...prevData, temp]);
          });
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
          
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const adminCount = rowData.filter((data) => data.Account === "Admin").length;
  const managerCount = rowData.filter(
    (data) => data.Account === "Manager"
  ).length;

  const hrCount = rowData.filter((data) => data.Account === "HR").length;
  const employeeCount = rowData.filter(
    (data) => data.Account === "Employee"
  ).length;

  return (
    <div className="container-fluid  ">
      <div
        style={{ height: "220px", width: "100%", position: "relative" }}
        className="EmpcountCard shadow row justify-content-center py-0 gap-0 my-4  mx-0"
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            left: 0,
            height: "220px",
            width: "100%",
            background: darkMode
              ? "var( --primaryDashMenuColor)"
              : "var(--primaryDashColorDark)",
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var( --primaryDashMenuColor)",
          }}
          className="EmpcountCardBG-card-inner rounded-1"
        >
          <div className="pl-4 pr-1 h-100 py-1 d-flex flex-column justify-content-center align-items-center px-3">
            <div className="d-flex h-75 flex-column justify-content-evenly align-items-start w-100">
              <span className="d-flex justify-content-between align-items-center w-100">
                Admin <b>{adminCount}</b>
              </span>
              <span className="d-flex justify-content-between align-items-center w-100">
                Hr <b>{hrCount}</b>
              </span>
              <span className="d-flex justify-content-between align-items-center w-100">
                Manager <b>{managerCount}</b>
              </span>
              <span className="d-flex justify-content-between align-items-center w-100">
                Employee <b>{employeeCount}</b>
              </span>
            </div>
            {/* <span className="bg-light w-100 text-center rounded-5 py-0  mb-2">
              <Link style={{ textDecoration: "none" }}>
                {" "}
                <span>View User List</span>
              </Link>
            </span> */}
          </div>
        </div>
        <div
          style={{
            background: darkMode
              ? "var(--primaryDashMenuColor)"
              : "var(--primaryDashColorDark)",
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="EmpcountCardBG col-4  w-100 rounded-3 d-flex justify-content-center align-items-center shadow-sm"
        >
          <div
            style={{
              height: "130px",
              width: "130px",
              border: "5px solid #4bd3f2b3",
              boxShadow: "0px 0px 5px 20px #4bd1efa2",
              position: "relative",
              zIndex: 2,
            }}
            className="rounded-circle d-flex justify-content-center align-items-center  flex-column fw-bold"
          >
            {rowData.length} <span>Total Users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCountTable;
