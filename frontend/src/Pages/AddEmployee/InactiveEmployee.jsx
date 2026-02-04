import React, { useState, useEffect } from "react";
import "./EmployeeTable.css";
import { LuSearch } from "react-icons/lu";
import axios from "axios";
import { RingLoader } from "react-spinners";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFilePdf, FaFilter } from "react-icons/fa";
import { FcNumericalSorting12, FcNumericalSorting21 } from "react-icons/fc";
import BASE_URL from "../config/config";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import Pagination from "../../Utils/Pagination";
import OverLayToolTip from "../../Utils/OverLayToolTip";
import { RiUserAddLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { CgProfile } from "react-icons/cg";
import { FaFileExcel, FaUserPlus } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import ProfileAvatar from "../../Utils/ProfileAvatar/ProfileAvatar";
import CopyToClipboard from "../../Utils/CopyToClipboard/CopyToClipboard";
import TittleHeader from "../TittleHeader/TittleHeader";
import Styles from "../../Style/Scroller.module.css";
import api from "../config/api";

const AdminEmployeeTableInactive = (props) => {
  const location = useLocation();
  const route = location.pathname.split("/")[1];
  const [, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isIdFilterActive] = useState(false);
  const [isIdSortAscending, setIsIdSortAscending] = useState(true);
  const [, setUpcomingBirthdays] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [activeProfile, setActiveProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { darkMode } = useTheme();
  const [showStatusType, setShowStatusType] = useState("");
  const isFilterApplied = selectedFilter !== "";
  const [showModal, setShowModal] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);
  const { userData } = useSelector((state) => state.user);

  const userType = userData.Account;

  const allFields = [
    { key: "empID", label: "Employee ID" },
    { key: "FirstName", label: "First Name" },
    { key: "LastName", label: "Last Name" },
    { key: "PositionName", label: "Position" },
    { key: "Account", label: "Account" },
    { key: "status", label: "Status" },
    { key: "Email", label: "Email" },
    { key: "ContactNo", label: "Contact No" },
  ];

  const handleFieldSelection = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

const loadEmployeeData = () => {
  api
    .get(`${BASE_URL}/api/employee`, {
    })
    .then((response) => {
      if (Array.isArray(response.data)) {
        const filteredEmployees = response.data.filter((data) => {
          if (userType === 1) return true; // Admin sees all
          if (userType === 2) return data.Account !== 1; // HR excludes Admin
          if (userType === 4) return data.Account === 3; // Manager sees only Employees
          return false; // default case
        });

        setEmployeeData(filteredEmployees);
        setLoading(false);
        setRowData([]);

        filteredEmployees.forEach((data) => {
          const temp = {
            data,
            Email: data.Email,
            Password: data.Password,
            Account:
              data.Account === 1
                ? "Admin"
                : data.Account === 2
                ? "HR"
                : data.Account === 3
                ? "Employee"
                : data.Account === 4
                ? "Manager"
                : "",
            RoleName: data.role?.[0]?.RoleName || "",
            FirstName: data.FirstName,
            FullName: `${data.FirstName} ${data.LastName}`,
            LastName: data.LastName,
            DOB: data.DOB?.slice(0, 10),
            ContactNo: data.ContactNo,
            empID: data.empID,
            DepartmentName: data.department?.[0]?.DepartmentName || "",
            PositionName: data.position?.[0]?.PositionName || "",
            DateOfJoining: data.DateOfJoining?.slice(0, 10),
            status: data.status,
            loginStatus: data.loginStatus,
          };

          setRowData((prevData) => [...prevData, temp]);
        });
      } else {
        console.error("Data received is not an array:", response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching employee data:", error);
    });
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
      "Status",
    ];
    const data = rowData
      .filter((data) => showStatusType === "" || data.status === showStatusType)
      .map((row) => [
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
        row.status,
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
  const exportToExcel = () => {
    if (selectedFields.length === 0) {
      alert("Please select at least one field to export.");
      return;
    }

    // Prepare data with selected fields only
    const dataToExport = filteredData.map((item) => {
      const selectedData = {};
      selectedFields.forEach((field) => {
        selectedData[allFields.find((f) => f.key === field).label] =
          item[field];
      });
      return selectedData;
    });

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Create a workbook and save it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "EmployeesData.xlsx");

    // Close modal after export
    setShowModal(false);
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

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

      const timeDiff = dob - today;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 7;
    });

    setUpcomingBirthdays(upcomingBirthdaysData);
  };

  useEffect(() => {
    calculateUpcomingBirthdays();
  }, [rowData]);

  let filteredData = rowData
    .filter((item) => {
      const isMatchingId = isIdFilterActive
        ? item.empID.toLowerCase() === searchInput.toLowerCase()
        : true;

      const isMatching =
        item.FullName.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.empID.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.Email.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.ContactNo.toLowerCase().includes(searchInput.toLowerCase());

      const isMatchingFilter =
        selectedFilter === "" || item.Account === selectedFilter;

      return isMatchingId && isMatching && isMatchingFilter;
    })
    .filter((data) => showStatusType === "" || data.status === showStatusType);

  filteredData = filteredData.sort(sortById);

  const adminCount = rowData
    .filter((data) => data.Account === "Admin")
    .filter(
      (data) => showStatusType === "" || data.status === showStatusType
    ).length;
  const hrCount = rowData
    .filter((data) => data.Account === "HR")
    .filter(
      (data) => showStatusType === "" || data.status === showStatusType
    ).length;
  const managerCount = rowData
    .filter((data) => data.Account === "Manager")
    .filter(
      (data) => showStatusType === "" || data.status === showStatusType
    ).length;
  const employeeCount = rowData
    .filter((data) => data.Account === "Employee")
    .filter(
      (data) => showStatusType === "" || data.status === showStatusType
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
      <div
        style={{
          position: "sticky",
          top: "0",
          zIndex: "3",
        }}
        className="my-auto py-2 mx-1"
      >
        <div className="row m-auto row-gap-4 px-0">
          <div className="col-7  col-md-4 d-flex px-1 px-md-2 gap-2">
            <TittleHeader
              title={"Employees List"}
              message={"You can view and manage employee's from here"}
              numbers={filteredData.length}
            />
          </div>
          <div className="col-5 col-md-4 d-flex position-relative rounded-2">
            <input
              style={{
                width: "100%",
                height: "fit-content",
                paddingLeft: ".5rem",
                paddingRight: "2.5rem",
              }}
              className={`form-control my-auto  ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="text"
              placeholder="Search by name, id, email, contact number"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <LuSearch
              style={{
                position: "absolute",
                top: "50%",
                right: "1.5rem",
                height: "1.2rem",
                width: "1.2rem",
                color: darkMode ? "black" : "white",
                transform: "translateY(-50%)",
                opacity: "40%",
              }}
            />
          </div>
          <div className="col-12 col-md-4 d-flex align-items-center justify-content-end gap-2">
            <button
              onClick={exportToPDF}
              title="Export to Pdf"
              className={`btn   fw-bold rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
            >
              <FaFilePdf className="fs-6 align-items-center text-danger" />
            </button>
            <select
              style={{ width: "8rem" }}
              className={`form-select    rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              onChange={(e) => setShowStatusType(e.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button
              onClick={() => setShowModal(true)}
              title="Export to Xlsx"
              className={`btn   fw-bold rounded-2 ${
                darkMode
                  ? "bg-light text-dark border"
                  : "bg-dark text-light border-0"
              }`}
            >
              <FaFileExcel className="fs-6 align-items-center text-success" />
            </button>

            <div
              className={`rounded-2 ${darkMode ? "border" : "border-0"}`}
              style={{ position: "relative" }}
            >
              <span
                onMouseEnter={() => setActiveProfile("name")}
                onMouseLeave={() => setActiveProfile(null)}
                className={`btn border-0 rounded-2  ${
                  isFilterApplied
                    ? "bg-primary text-white rounded-2"
                    : darkMode
                    ? "bg-light text-dark border"
                    : "bg-dark text-light border-0"
                }`}
              >
                <FaFilter />
                <div
                  style={{
                    position: "absolute",
                    zIndex: "1",
                    right: "0",
                    top: "95%",
                    width: "150px",
                    display: activeProfile === "name" ? "flex" : "none",
                  }}
                  className={`px-2 shadow flex-column py-2 shadow rounded-2 border ${
                    darkMode
                      ? "bg-light text-dark border"
                      : "bg-dark text-light border-0"
                  }`}
                >
                  <div
                    onClick={() => setSelectedFilter("")}
                    style={{ cursor: "pointer" }}
                    className="d-flex flex-nowrap justify-content-between"
                  >
                    All{" "}
                    <span>
                      {
                        rowData.filter((data) => data.status === showStatusType)
                          .length
                      }
                    </span>
                  </div>
                  {userType === 1 && (
                    <div
                      onClick={() => setSelectedFilter("Admin")}
                      style={{ cursor: "pointer" }}
                      className="d-flex flex-nowrap justify-content-between"
                    >
                      Admin <span>{adminCount}</span>
                    </div>
                  )}

                  <div
                    onClick={() => setSelectedFilter("HR")}
                    style={{ cursor: "pointer" }}
                    className="d-flex flex-nowrap justify-content-between"
                  >
                    HR <span>{hrCount}</span>
                  </div>
                  <div
                    onClick={() => setSelectedFilter("Manager")}
                    style={{ cursor: "pointer" }}
                    className="d-flex flex-nowrap justify-content-between"
                  >
                    Manager <span>{managerCount}</span>
                  </div>
                  <div
                    onClick={() => setSelectedFilter("Employee")}
                    style={{ cursor: "pointer" }}
                    className="d-flex flex-nowrap justify-content-between"
                  >
                    Employee <span>{employeeCount}</span>
                  </div>
                  {isFilterApplied && (
                    <div
                      onClick={() => setSelectedFilter("")}
                      style={{ cursor: "pointer" }}
                      className="d-flex btn btn-primary my-1 text-center py-1 rounded-0  flex-nowrap justify-content-center"
                    >
                      Clear Filter
                    </div>
                  )}
                </div>
              </span>
            </div>
            <button
              onClick={handleToggleIdSort}
              title="Sort"
              className={`btn   fw-bold rounded-2 ${
                darkMode
                  ? "bg-light text-dark border"
                  : "bg-dark text-light border-0"
              }`}
            >
              {isIdSortAscending ? (
                <FcNumericalSorting21 className="fs-5" />
              ) : (
                <FcNumericalSorting12 className="fs-5" />
              )}
            </button>
            {(userType === 1 || userType === 2 ) && <button
              className={`btn   fw-bold rounded-2 ${
                darkMode
                  ? "bg-light text-dark border"
                  : "bg-dark text-light border-0"
              }`}
              onClick={props.onAddEmployee}
              title="Add Employee"
            >
              <FaUserPlus className="fs-5 align-items-center text-success" />
            </button>}
          </div>
        </div>
      </div>
      <div id="clear-both" />
      {!loading ? (
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
                  <th style={rowHeadStyle(darkMode)}>#</th>
                  <th style={rowHeadStyle(darkMode)}>User Profile</th>
                  <th style={rowHeadStyle(darkMode)}>Position</th>
                  <th style={rowHeadStyle(darkMode)}>Department</th>
                  <th style={rowHeadStyle(darkMode)}>Account</th>
                  <th className="text-center" style={rowHeadStyle(darkMode)}>
                    Status
                  </th>
                  <th style={rowHeadStyle(darkMode)}>Email</th>
                  <th style={rowHeadStyle(darkMode)}>Contact No</th>

                  <th style={rowHeadStyle(darkMode)} className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((items, index) => (
                  <tr key={index}>
                   <td style={rowBodyStyle(darkMode)}>
  {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, 0)}
</td>
                    <td style={rowBodyStyle(darkMode)}>
                      <ProfileAvatar
                        firstName={items?.FullName}
                        imageURL={items?.data?.profile?.image_url}
                        additional={items?.empID}
                      />
                    </td>
                    <td
                      // className="border-0 py-2"
                      style={rowBodyStyle(darkMode)}
                    >
                      {items.PositionName}
                    </td>
                    <td
                      // className="border-0 py-2"
                      style={rowBodyStyle(darkMode)}
                    >
                      {items.DepartmentName}
                    </td>
                    <td
                      // className="border-0 py-2"
                      style={rowBodyStyle(darkMode)}
                    >
                      {items.Account}
                    </td>
                    <td
                      style={rowBodyStyle(darkMode)}
                      className={
                        items.status === "active"
                          ? "text-success text-center  py-2 text-capitalize"
                          : "text-danger  text-center py-2 text-capitalize"
                      }
                    >
                      {items.status === "active" ? (
                        <span
                          className={`${
                            darkMode
                              ? "badge-success border"
                              : "badge-success-dark"
                          }`}
                        >
                          {items.status}
                        </span>
                      ) : (
                        <span
                          className={`${
                            darkMode
                              ? "badge-danger border"
                              : "badge-danger-dark"
                          }`}
                        >
                          {items.status}
                        </span>
                      )}
                    </td>
                    <td
                      // className="border-0 py-2"
                      style={rowBodyStyle(darkMode)}
                    >
                      <CopyToClipboard content={items.Email} />
                      {items.Email}
                    </td>
                    <td
                      // className="border-0 py-2"
                      style={rowBodyStyle(darkMode)}
                    >
                      {items.ContactNo}
                    </td>

                    <td
                      // className="border-0 py-2"
                      style={rowBodyStyle(darkMode)}
                    >
                      <div
                        style={{ width: "fit-content" }}
                        className="d-flex w-100 justify-content-end  gap-2 align-items-center"
                      >
                        <OverLayToolTip
                          style={{ color: darkMode ? "black" : "white" }}
                          icon={<CgProfile className="fs-5" />}
                          onClick={() => props.onEmpInfo(items.data)}
                          tooltip={"Info Profile"}
                        />
                        <OverLayToolTip
                          style={{ color: darkMode ? "black" : "white" }}
                          icon={<RiUserAddLine className="fs-5" />}
                          onClick={() => props.onEditEmployee(items.data)}
                          tooltip={"Edit Profile"}
                        />
                      </div>
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
            filteredDataLength={filteredData.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <div id="loading-bar">
          <RingLoader
            sizeUnit={"px"}
            size={50}
            color={"#0000ff"}
            loading={true}
          />
        </div>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select to Export</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap gap-4  ">
            {allFields.map((field) => (
              <div
                key={field.key}
                className="d-flex align-items-center  p-1 px-2 gap-2"
              >
                <input
                  type="checkbox"
                  id={field.key}
                  className="text-primary bg-primary"
                  checked={selectedFields.includes(field.key)}
                  onChange={() => handleFieldSelection(field.key)}
                />
                <label className="form-check-label" htmlFor={field.key}>
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-danger"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button className=" btn btn-primary" onClick={exportToExcel}>
            Export
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminEmployeeTableInactive;
