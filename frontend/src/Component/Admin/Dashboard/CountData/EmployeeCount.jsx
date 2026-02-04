import React, { useState, useEffect } from "react";
// import "./EmployeeTable.css";
import BASE_URL from "../../../../Pages/config/config";
import api from "../../../../Pages/config/api";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/core";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoIosArrowDroprightCircle } from "react-icons/io";

import { Link } from "react-router-dom";

// *************csv & pdf **************//
import jsPDF from "jspdf";
import "jspdf-autotable";
// import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
// *************csv & pdf **************//

const AdminEmployeeTable = (props) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isIdFilterActive, setIsIdFilterActive] = useState(false);
  const [isIdSortAscending, setIsIdSortAscending] = useState(true);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");

  const loadEmployeeData = () => {
    api
      .get(`/api/employee`, {
        
      })
      .then((response) => {
        // Ensure that response.data is an array
        if (Array.isArray(response.data)) {
          setEmployeeData(response.data);
          setLoading(false);

          // Clear the state arrays
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
              FirstName: data["FirstName"],
              MiddleName: data["MiddleName"],
              LastName: data["LastName"],
              DOB: data["DOB"].slice(0, 10),
              ContactNo: data["ContactNo"],
              // EmployeeCode: data["EmployeeCode"],
              empID: data["empID"],
              DepartmentName: data["department"][0]
                ? data["department"][0]["DepartmentName"]
                : "",
              PositionName: data["position"][0]
                ? data["position"][0]["PositionName"]
                : "",
              DateOfJoining: data["DateOfJoining"].slice(0, 10),
            };

            // Use set function to update state
            setRowData((prevData) => [...prevData, temp]);
          });
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
          
      });
  };

  const onEmployeeDelete = (e) => {
    if (window.confirm("Are you sure to delete this record? ")) {
      api
        .delete(`/api/employee/${e}`, {
         
        })
        .then(() => {
          loadEmployeeData();
        })
        .catch((err) => {
            
        });
    }
  };

  const exportToPDF = () => {
    window.confirm("Are you sure to download Employee record? ");
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210],
    });

    doc.setFontSize(18);
    doc.text("Employee Details", 297 / 2, 15, "center");
    const headers = [
      "Emp Id",
      "Email",
      "Account Access",
      "First Name",
      "Last Name",
      "DOB",
      "ContactNo",
      "Role",
      "Position",
      "Department",
      "D.O.J",
    ];
    const data = rowData.map((row) => [
      row.empID,
      row.Email,
      row.Account,
      row.FirstName,
      row.LastName,
      row.DOB,
      row.ContactNo,
      row.RoleName,
      row.PositionName,
      row.DepartmentName,
      row.DateOfJoining,
      "",
    ]);
    doc.setFontSize(12);
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
    });

    doc.save("employee_data.pdf ");
  };

  const renderInfoButton = (params) => {
    if (params.data && params.data.data) {
      return (
        <div>
          <FontAwesomeIcon
            icon={faInfoCircle}
            onClick={() => props.onEmpInfo(params.data.data)}
          />
        </div>
      );
    }
    return null;
  };

  const renderButton = (params) => {
    if (params.data && params.data.data && params.data.data["_id"]) {
      return (
        <FontAwesomeIcon
          icon={faTrash}
          onClick={() => onEmployeeDelete(params.data.data["_id"])}
        />
      );
    }
    return null;
  };

  const renderEditButton = (params) => {
    if (params.data && params.data.data) {
      return (
        <FontAwesomeIcon
          icon={faEdit}
          onClick={() => props.onEditEmployee(params.data.data)}
        />
      );
    }
    return null;
  };

  const getBackgroundColor = (accountType) => {
    switch (accountType) {
      case "Admin":
        return "#8EAC50";
      case "HR":
        return "#0079FF";
      case "Employee":
        return "purple";
      case "Manager":
        return "red";
      default:
        return "#FF9B50";
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleToggleIdSort = () => {
    setIsIdSortAscending(!isIdSortAscending);
  };

  const sortById = (a, b) => {
    const idA = a.empID.toLowerCase();
    const idB = b.empID.toLowerCase();

    if (isIdSortAscending) {
      return idA.localeCompare(idB);
    } else {
      return idB.localeCompare(idA);
    }
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const calculateUpcomingBirthdays = () => {
    const today = new Date();
    const upcomingBirthdaysData = rowData.filter((employee) => {
      const dob = new Date(employee.DOB);
      dob.setFullYear(today.getFullYear());

      // Check if the upcoming birthday is within the next 7 days
      const timeDiff = dob - today;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 7;
    });

    setUpcomingBirthdays(upcomingBirthdaysData);
  };

  useEffect(() => {
    calculateUpcomingBirthdays();
  }, [rowData]);

  let filteredData = rowData.filter((item) => {
    const isMatchingId = isIdFilterActive
      ? item.empID.toLowerCase() === searchInput.toLowerCase()
      : true;

    const isMatchingFirstName = item.FirstName.toLowerCase().includes(
      searchInput.toLowerCase()
    );

    return isMatchingId && isMatchingFirstName;
  });

  filteredData = filteredData.sort(sortById);

  // Calculate the total length for each status
  const adminCount = filteredData.filter(
    (data) => data.Account === "Admin"
  ).length;
  const hrCount = filteredData.filter((data) => data.Account === "HR").length;
  const managerCount = filteredData.filter(
    (data) => data.Account === "Manager"
  ).length;
  const employeeCount = filteredData.filter(
    (data) => data.Account === "Employee"
  ).length;

  return (
    <div>
      <div className="container-fluid">
        <div className="row row-gap-4">
          <div className="col-md-3">
            <div
              style={{ backgroundColor: "#FED2AA" }}
              className=" DashboardCard position-relative"
            >
              <div className=" d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total <br /> Admins
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {adminCount}
                  </span>
                </p>
                <Link
                  className="moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
                  to="/admin/employee"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div
              style={{ backgroundColor: "#DFFFD8" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total <br /> HR{" "}
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {hrCount}
                  </span>
                </p>
                <Link
                  className="moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
                  to="/admin/employee"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* <div className="row row-gap-4"></div> */}
          <div className="col-md-3">
            <div
              style={{ backgroundColor: "#FEBBCC" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total <br /> Manager
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {managerCount}
                  </span>
                </p>
                <Link
                  className="moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
                  to="/admin/employee"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              style={{ backgroundColor: "#BCCEF8" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total <br /> Employee
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {employeeCount}
                  </span>
                </p>
                <Link
                  className="moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
                  to="/admin/employee"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-9"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeeTable;
