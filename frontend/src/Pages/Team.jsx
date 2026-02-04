import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "./config/config";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "../Context/TheamContext/ThemeContext";
import { rowBodyStyle, rowHeadStyle } from "../Style/TableStyle";
import Pagination from "../Utils/Pagination";
import TittleHeader from "./TittleHeader/TittleHeader";
import { useSelector } from "react-redux";
import ProfileAvatar from "../Utils/ProfileAvatar/ProfileAvatar";
import { useLocation } from "react-router-dom";
import api from "./config/api";

const Table = () => {
  const location = useLocation();
  const managerMail = location.state?.email;
  const { userData } = useSelector((state) => state.user);
  const email = userData?.Email;
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const Account = (value) => {
    switch (value) {
      case 1:
        return "Admin";
      case 2:
        return "Hr";
      case 3:
        return "Employee";
      default:
        return "Manager";
    }
  };

  useEffect(() => {
    api
      .post(
        `/api/employeeTeam`,
        { email: managerMail === null ? email : managerMail },
      )
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEmployeeData(response.data);
          setLoading(false);
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Filter employees based on search query
  const filteredEmployees = employeeData.filter((employee) =>
    [
      (employee.FirstName + " " + employee.LastName).toLowerCase(),
      employee.empID.toString().toLowerCase(),
      employee.Email.toLowerCase(),
      employee.ContactNo.toString(),
    ].some((field) => field.includes(searchQuery.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredEmployees.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="container-fluid">
      <div className="mb-2 d-flex align-items-center justify-content-between">
        <TittleHeader
          title="Employee List"
          numbers={filteredEmployees.length}
          message={`You can view all team members of: ( ${managerMail} )`}
        />
        <input
          type="text"
          style={{ width: "20rem" }}
          className={`form-control ms-0 ms-md-auto rounded-2 ${
            darkMode
              ? "bg-light text-dark border dark-placeholder"
              : "bg-dark text-light border-0 light-placeholder"
          }`}
          placeholder="Search by Name, ID, Email, or Contact No"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {!loading ? (
        <>
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
                  <th style={rowHeadStyle(darkMode)}>Employee Name</th>
                  <th style={rowHeadStyle(darkMode)}>ID</th>
                  <th style={rowHeadStyle(darkMode)}>Position</th>
                  <th style={rowHeadStyle(darkMode)}>Department</th>
                  <th style={rowHeadStyle(darkMode)}>Account</th>
                  <th style={rowHeadStyle(darkMode)}>Status</th>
                  <th style={rowHeadStyle(darkMode)}>Email</th>
                  <th style={rowHeadStyle(darkMode)}>Contact No</th>
                  <th style={rowHeadStyle(darkMode)}>Login Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((employee) => (
                  <tr key={employee._id}>
                    <td style={rowBodyStyle(darkMode)}>
                      <ProfileAvatar
                        imageURL={employee?.profile?.image_url}
                        firstName={employee?.FirstName}
                        lastName={employee?.LastName}
                      />
                    </td>
                    <td style={rowBodyStyle(darkMode)}>{employee.empID}</td>
                    <td style={rowBodyStyle(darkMode)}>
                      {employee.position[0]?.PositionName}
                    </td>
                    <td style={rowBodyStyle(darkMode)}>
                      {employee.department[0]?.DepartmentName}
                    </td>
                    <td style={rowBodyStyle(darkMode)}>
                      {Account(employee.Account)}
                    </td>
                    <td
                      className="text-capitalize"
                      style={rowBodyStyle(darkMode)}
                    >
                      <span
                        className={
                          employee.status === "active"
                            ? darkMode
                              ? "badge-success"
                              : "badge-success-dark"
                            : darkMode
                            ? "badge-danger"
                            : "badge-danger-dark"
                        }
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td style={rowBodyStyle(darkMode)}>{employee.Email}</td>
                    <td style={rowBodyStyle(darkMode)}>{employee.ContactNo}</td>
                    <td style={rowBodyStyle(darkMode)}>
                      {employee.loginStatus}
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
            filteredDataLength={filteredEmployees.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Table;
