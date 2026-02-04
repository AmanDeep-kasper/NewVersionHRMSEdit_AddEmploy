import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import "./SalaryTable.css";
import { LuSearch } from "react-icons/lu";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import TittleHeader from "../TittleHeader/TittleHeader";
import OverLayToolTip from "../../Utils/OverLayToolTip";
import Pagination from "../../Utils/Pagination";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import ProfileAvatar from "../../Utils/ProfileAvatar/ProfileAvatar";
import { formatIndianCurrency } from "../../Utils/CurrencySymbol/formatIndianCurrency";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import SalaryImage from "../../img/Payroll/Salary.svg"
import Styles from "../../Style/Scroller.module.css";
import api from "../../Pages/config/api";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const AdminSalaryTable = (props) => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { darkMode } = useTheme();

  const loadSalaryData = useCallback(async () => {
    try {
      const response = await api.get(`/api/salary`, 
       
      );

      const rowDataT = response.data.map((data) => ({
        data,
        empID: data.empID,
        profile: data.profile,
        EmployeeName: `${data.FirstName} ${data.LastName}`,
        FirstName: data.FirstName,
        LastName: data.LastName,
        PositionName: data.position[0]?.PositionName || "N/A",
        BasicSalary: data.salary[0]?.BasicSalary || 0,
        HRASalary: data.salary[0]?.HRASalary || 0,
        ConvenyanceAllowance: data.salary[0]?.ConvenyanceAllowance || 0,
        otherAllowance: data.salary[0]?.otherAllowance || 0,
        totalSalary: data.salary[0]?.totalSalary || 0,
      }));

      setSalaryData(rowDataT);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching salary data:", error);
    }
  }, []);

  const onSalaryDelete = (e) => {
    if (window.confirm("Are you sure to delete this record? ")) {
      api
        .delete(`/api/salary/${e}`, {
          
        })
        .then((res) => {
          loadSalaryData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    loadSalaryData();
  }, [loadSalaryData]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const sortedAndFilteredData = salaryData
    .slice()
    .filter((item) =>
      item.EmployeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Calculate index of the last and first item for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Generate array of page numbers
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(sortedAndFilteredData.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Function to export salary data to Excel
  const exportToExcel = () => {
    if (salaryData.length === 0) {
      alert("No data to export!");
      return;
    }

    // Define the data for the Excel sheet
    const exportData = salaryData.map((item, index) => ({
      "S.No": index + 1,
      "Employee ID": item.empID,
      "Employee Name": item.EmployeeName,
      "Position Name": item.PositionName,
      "Basic Salary": item.BasicSalary,
      HRA: item.HRASalary,
      "Conveyance Allowance": item.ConvenyanceAllowance,
      "Other Allowances": item.otherAllowance,
      "Total Salary": item.totalSalary,
    }));

    // Create a worksheet and a workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Data");

    // Convert the workbook to a binary Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save the file
    saveAs(data, `Salary_Data_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportToPDF = () => {
    if (salaryData.length === 0) {
      alert("No data to export!");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" }); // Landscape mode
    doc.text("Salary Data Report", 14, 15);

    const tableColumn = [
      "S.No",
      "Employee ID",
      "Employee Name",
      "Position Name",
      "Basic Salary",
      "HRA",
      "Conveyance Allowance",
      "Other Allowances",
      "Total Salary",
    ];

    const tableRows = salaryData.map((item, index) => [
      index + 1,
      item.empID,
      item.EmployeeName,
      item.PositionName,
      item.BasicSalary,
      item.HRASalary,
      item.ConvenyanceAllowance,
      item.otherAllowance,
      item.totalSalary,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
    });

    doc.save(`Salary_Data_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="container-fluid">
      <div
        style={{
          background: darkMode
            ? "var(--secondaryDashMenuColor)"
            : "var(--secondaryDashColorDark)",
          color: darkMode
            ? "var(--secondaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
        }}
        className="row mb-3 py-1 mt-2"
      >
        <div className="my-auto d-flex justify-content-between">
          <TittleHeader
            title={"Salary Details"}
            message={"You can view or create employees salary here."}
          />
          <div className="d-flex align-items-center gap-2">
            <div className="searchholder d-none d-md-flex d-flex my-auto position-relative">
              <input
                style={{
                  height: "100%",
                  width: "100%",
                  paddingLeft: "2.2rem",
                }}
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchInputChange}
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
            <span
              style={{ cursor: "pointer" }}
              className="btn btn-success my-auto d-flex align-items-center"
              title="Export to PDF"
              onClick={exportToExcel}
            >
              Excel
            </span>

            <span
              style={{ cursor: "pointer" }}
              className="btn btn-danger my-auto d-flex align-items-center"
              title="Export to PDF"
              onClick={exportToPDF}
            >
              PDF
            </span>

            <span
              className="btn btn-primary my-auto d-flex align-items-center"
              onClick={props.onAddSalary}
            >
              + Add Salary
            </span>
          </div>
        </div>
      </div>
      <div className="searchholder d-block d-md-none  d-flex position-relative">
        <input
          style={{
            height: "100%",
            width: "100%",
            paddingLeft: "15%",
          }}
          className="form-control"
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <LuSearch
          className="text-black"
          style={{ position: "absolute", top: "30%", left: "5%" }}
        />
      </div>
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
      <div className="row">
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
              className= {`rounded-2 ${Styles.scroller}`}
            >
              <table className="table mb-0 table-hover">
                <thead>
                  <tr style={{ position: "sticky", top: "0", zIndex: "3" }}>
                    <th
                      style={{
                        ...rowHeadStyle(darkMode),
                        position: "sticky",
                        top: "-.5rem",
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        ...rowHeadStyle(darkMode),
                        position: "sticky",
                        top: "-.5rem",
                      }}
                    >
                      User Profile
                    </th>
                    <th
                      className="text-center"
                      style={{
                        ...rowHeadStyle(darkMode),
                        position: "sticky",
                        top: "-.5rem",
                      }}
                    >
                      Designation
                    </th>
                    <th
                      className="text-center"
                      style={{
                        ...rowHeadStyle(darkMode),
                        position: "sticky",
                        top: "-.5rem",
                      }}
                    >
                      <MdOutlineCurrencyRupee /> Basic Salary
                    </th>
                    <th
                      className="text-center"
                      style={{
                        ...rowHeadStyle(darkMode),
                        position: "sticky",
                        top: "-.5rem",
                      }}
                    >
                      <MdOutlineCurrencyRupee /> HRA
                    </th>
                    <th
                      className="text-center"
                      style={{
                        ...rowHeadStyle(darkMode),
                        position: "sticky",
                        top: "-.5rem",
                      }}
                    >
                      <MdOutlineCurrencyRupee /> Conveyance
                    </th>  
                    <th
                      className="text-center"
                      style={{
                        ...rowHeadStyle(darkMode),
                        position: "sticky",
                        top: "-.5rem",
                      }}
                    >
                      <MdOutlineCurrencyRupee /> Other Allowances
                    </th>
                    <th
                      className="text-center"
                      style={{
                        ...rowHeadStyle(darkMode),
                        position: "sticky",
                        top: "-.5rem",
                        background: darkMode
                          ? "rgba(211, 229, 248, 1)"
                          : "rgba(48, 95, 104, 1)",
                      }}
                    >
                      <MdOutlineCurrencyRupee /> Total Salary
                    </th>
                    
                    <th
                      style={rowHeadStyle(darkMode)}
                      className="py-2 fw-normal text-end border-0"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr className="stickey-top" key={index}>
                      <td
                        style={{
                          ...rowBodyStyle(darkMode),
                        }}
                      >
                        {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, 0)}
                      </td>
                      <td
                        style={{
                          ...rowBodyStyle(darkMode),
                        }}
                      >
                        <ProfileAvatar
                          firstName={item?.FirstName}
                          lastName={item?.LastName}
                          imageURL={item?.data?.profile?.image_url}
                          additional={item.empID}
                        />
                      </td>
                      <td
                        className="text-center"
                        style={{
                          ...rowBodyStyle(darkMode),
                        }}
                      >
                        {item.PositionName}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          ...rowBodyStyle(darkMode),
                        }}
                      >
                        {formatIndianCurrency(item.BasicSalary)}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          ...rowBodyStyle(darkMode),
                        }}
                      >
                        {formatIndianCurrency(item.HRASalary)}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          ...rowBodyStyle(darkMode),
                        }}
                      >
                        {formatIndianCurrency(item.ConvenyanceAllowance)}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          ...rowBodyStyle(darkMode),
                        }}
                      >
                        {formatIndianCurrency(item.otherAllowance)}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          ...rowBodyStyle(darkMode),
                          background: darkMode
                            ? "rgba(237, 244, 251, 1)"
                            : "rgba(48, 95, 104, 0.48)",
                        }}
                      >
                        {formatIndianCurrency(item.totalSalary)}
                      </td>
                      
                      <td
                        style={rowBodyStyle(darkMode)}
                        className="border-0 text-end"
                      >
                        <OverLayToolTip
                          style={{ color: darkMode ? "black" : "white" }}
                          icon={<FiEdit2 className="text-primary" />}
                          onClick={() => props.onEditSalary(item.data)}
                          tooltip={"Edit Salary"}
                        />
                        <OverLayToolTip
                          style={{ color: darkMode ? "black" : "white" }}
                          icon={
                            <AiOutlineDelete className="fs-5 text-danger" />
                          }
                          onClick={() => onSalaryDelete(item.data._id)}
                          tooltip={"Delete Salary"}
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
              filteredDataLength={salaryData.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        ) : (
          <div style={{height:'80vh', width:'100%',  background: darkMode
            ? "rgba(233, 225, 225, 0.69)"
            : "rgba(70, 65, 65, 0.57)",}} className="rounded-2 d-flex align-items-center justify-content-center flex-column gap-3">
            
            <div style={{height:'25vh', width:'auto'}}> <img style={{height:'100%', width:'auto'}} src={SalaryImage} alt="no data found" /> </div>
            
           <span style={{color : darkMode ? "black" : "white"}}> Salary data not found 
            </span></div>
        )}
      </div>
    </div>
  );
};

export default AdminSalaryTable;
