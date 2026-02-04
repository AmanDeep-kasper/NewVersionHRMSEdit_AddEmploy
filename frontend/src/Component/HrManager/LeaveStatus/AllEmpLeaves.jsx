import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import Pagination from "../../../Utils/Pagination";
import { RingLoader } from "react-spinners";
import BASE_URL from "../../../Pages/config/config";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { IoIosFemale, IoIosMale } from "react-icons/io";
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
        const leaveApplicationHRObj = response.data.filter((val) => {
          return val.Account === 3;
        });
        setLoading(false);

        const rowDataT = leaveApplicationHRObj.map((data) =>
          data.profile !== null
            ? {
                empID: data.empID,
                Name: data.FirstName + " " + data.LastName,
                FirstName: data.FirstName,
                LastName: data.LastName,
                Leavetype: data.Leavetype,
                sickLeave: data.sickLeave,
                paidLeave: data.paidLeave,
                casualLeave: data.casualLeave,
                paternityLeave: data.paternityLeave,
                maternityLeave: data.maternityLeave,
                profilePic: data.profile.image_url,
                Gender: data.Gender,
              }
            : {
                empID: data.empID,
                Name: data.FirstName + " " + data.LastName,
                FirstName: data.FirstName,
                LastName: data.LastName,
                Leavetype: data.Leavetype,
                sickLeave: data.sickLeave,
                paidLeave: data.paidLeave,
                casualLeave: data.casualLeave,
                paternityLeave: data.paternityLeave,
                maternityLeave: data.maternityLeave,
                profilePic: null,
                Gender: data.Gender,
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
      <div className="d-flex justify-content-between align-items-center mt-2">
        <TittleHeader
          title={"Leaves Balance"}
          message={"You can view employee's leave balance here"}
        />
        <div className="searchholder p-0 d-flex position-relative">
          <input 
            style={{ height: "100%", width: "100%" }}
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
        </div>
      </div>
      <div id="clear-both" />
      {!loading ? (
        <div className="mt-2">
          <div>
            <div
              style={{
                height: "fit-content",
                maxHeight: "70vh",
                overflow: "auto",
                position: "relative",
                border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
              }}
              className="scroller mb-2 rounded-2"
            >
              <table className="table mb-0 table-hover">
                <thead>
                  <tr>
                    <th style={rowHeadStyle(darkMode)}>User Profile</th>
                    <th className="text-center" style={rowHeadStyle(darkMode)}>
                      Gender
                    </th>
                    <th className="text-center" style={rowHeadStyle(darkMode)}>
                      Sick Leave
                    </th>
                    <th className="text-center" style={rowHeadStyle(darkMode)}>
                      Paid Leave
                    </th>
                    <th className="text-center" style={rowHeadStyle(darkMode)}>
                      Casual Leave
                    </th>
                    <th className="text-center" style={rowHeadStyle(darkMode)}>
                      Paternity Leave
                    </th>
                    <th className="text-center" style={rowHeadStyle(darkMode)}>
                      Maternity Leave
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((data, index) => (
                    <tr key={index}>
                      <td style={rowBodyStyle(darkMode)}>
                        <div className="d-flex align-items-center gap-2 ">
                          <div
                            className="mx-1 d-flex align-items-center justify-content-center"
                            style={{
                              height: "30px",
                              width: "30px",
                              borderRadius: "50%",
                              backgroundColor: "#ccc",
                              color: "white",
                              fontWeight: "bold",
                              overflow: "hidden",
                              objectFit: "cover",
                            }}
                          >
                            {data.profilePic ? (
                              <img
                                src={data.profilePic}
                                alt="Profile"
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span>
                                {data?.FirstName[0].toUpperCase()}
                                {data?.LastName[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="d-flex flex-column text-capitalize">
                            <span style={{ fontSize: ".9rem" }}>
                              {data.empID}
                            </span>
                            <span>{data.Name}</span>
                          </div>
                        </div>
                      </td>
                      <td
                        className="text-center"
                        style={rowBodyStyle(darkMode)}
                      >
                        {data.Gender === "male" ? (
                          <span
                            className={`${
                              darkMode
                                ? "badge-primary border py-1"
                                : "badge-primary-dark py-1"
                            }`}
                            style={{ background: "#2a52be" }}
                          >
                            <IoIosMale /> Male
                          </span>
                        ) : (
                          <span
                            className={`${
                              darkMode
                                ? "badge-pink border py-1"
                                : "badge-pink-dark py-1"
                            }`}
                          >
                            <IoIosFemale /> Female
                          </span>
                        )}
                      </td>
                      <td
                        className="text-center"
                        style={rowBodyStyle(darkMode)}
                      >
                        {data.sickLeave}
                      </td>
                      <td
                        className="text-center"
                        style={rowBodyStyle(darkMode)}
                      >
                        {data.paidLeave}
                      </td>
                      <td
                        className="text-center"
                        style={rowBodyStyle(darkMode)}
                      >
                        {data.casualLeave}
                      </td>
                      <td
                        className="text-center"
                        style={rowBodyStyle(darkMode)}
                      >
                        {data.paternityLeave}
                      </td>
                      <td
                        className="text-center"
                        style={rowBodyStyle(darkMode)}
                      >
                        {data.maternityLeave}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          <RingLoader size={50} color="#0000ff" loading={true} />
        </div>
      )}
    </div>
  );
};

export default AllEmpLeaves;
