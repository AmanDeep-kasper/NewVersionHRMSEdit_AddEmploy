import React, { useState, useEffect } from "react";
import axios from "axios";

import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { RingLoader } from "react-spinners";
import profileImg from "../../../img/profile.jpg";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import SearchLight from "../../../img/Attendance/SearchLight.svg";
import Pagination from "../../../Utils/Pagination";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import api from "../../../Pages/config/api";

const AllEmpLeaves = (props) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { darkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    api
      .get(`/api/getAllLeave`, {
      })
      .then((response) => {
        const leaveApplicationHRObj = response.data;
        setLoading(false);

        const rowDataT = leaveApplicationHRObj.map((data) =>
          data.profile !== null
            ? {
                empID: data.empID,
                Name: data.FirstName + " " + data.LastName,
                Leavetype: data.Leavetype,
                sickLeave: data.sickLeave,
                paidLeave: data.paidLeave,
                casualLeave: data.casualLeave,
                paternityLeave: data.paternityLeave,
                maternityLeave: data.maternityLeave,
                profilePic: data.profile.image_url,
              }
            : {
                empID: data.empID,
                Name: data.FirstName + " " + data.LastName,
                Leavetype: data.Leavetype,
                sickLeave: data.sickLeave,
                paidLeave: data.paidLeave,
                casualLeave: data.casualLeave,
                paternityLeave: data.paternityLeave,
                maternityLeave: data.maternityLeave,
                profilePic: null,
              }
        );

        setRowData(rowDataT);
        setFilteredData(rowDataT);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    const filtered = rowData.filter((item) =>
      item.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery]);

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
      <div className="d-flex justify-content-between align-items-center py-3">
        <TittleHeader
          title={"Leaves Balance"}
          message={
            "You can view consolidated leave balances of the employee here."
          }
        />
        <div className="searchholder p-0 d-flex position-relative">
          <input
            style={{ height: "100%", width: "100%" }}
            className="form-control border rounded-2 py-2"
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div id="clear-both" />
      {!loading ? (
        <div
          style={{
            minHeight: "80vh",
            maxHeight: "80vh",
            overflow: "auto",
            width: "100%",
          }}
          className="mb-2"
        >
          {filteredData.length > 0 ? (
            <>
              <div
                style={{
                  // maxHeight: "68vh",
                  overflow: "auto",
                  position: "relative",
                }}
                className="table-responsive p-2 mb-3"
              >
                <table className="table" style={{ fontSize: ".9rem" }}>
                  <thead>
                    <tr>
                      <th style={rowHeadStyle(darkMode)}>Profile</th>
                      <th style={rowHeadStyle(darkMode)}>Employee Name</th>
                      <th style={rowHeadStyle(darkMode)}>Emp ID</th>

                      <th style={rowHeadStyle(darkMode)}>Sick Leave</th>
                      <th style={rowHeadStyle(darkMode)}>Paid Leave</th>
                      <th style={rowHeadStyle(darkMode)}>Casual Leave</th>
                      <th style={rowHeadStyle(darkMode)}>Paternity Leave</th>
                      <th style={rowHeadStyle(darkMode)}>Maternity Leave</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((data, index) => (
                      <tr key={index}>
                        <td style={rowBodyStyle(darkMode)}>
                          <img
                            src={data.profilePic || profileImg}
                            alt="Profile"
                            style={{
                              height: "30px",
                              width: "30px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td style={rowBodyStyle(darkMode)}>{data.Name}</td>
                        <td style={rowBodyStyle(darkMode)}>{data.empID}</td>
                        <td style={rowBodyStyle(darkMode)}>{data.sickLeave}</td>
                        <td style={rowBodyStyle(darkMode)}>{data.paidLeave}</td>
                        <td style={rowBodyStyle(darkMode)}>
                          {data.casualLeave}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {data.paternityLeave}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {data.maternityLeave}
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
                src={SearchLight}
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
                User not found.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div id="loading-bar">
          <RingLoader size={50} color="#0000ff" loading={true} />
        </div>
      )}
    </div>
  );
};

export default AllEmpLeaves;
