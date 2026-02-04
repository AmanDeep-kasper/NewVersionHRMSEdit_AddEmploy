import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import "./WorkExperienceTable.css";
import SearchLight from "../../../img/Attendance/SearchLight.svg";
import BASE_URL from "../../../Pages/config/config.js";
import { useTheme } from "../../../Context/TheamContext/ThemeContext.js";
import OverLayToolTip from "../../../Utils/OverLayToolTip.jsx";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader.jsx";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa6";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle.js";
import { useLocation } from "react-router-dom";
import api from "../../../Pages/config/api.js";
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const WorkExperienceTable = (props) => {
  const [workExperienceData, setWorkExperienceData] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const location = useLocation().pathname.split("/")[2];
  const id =
    location === "employee"
      ? sessionStorage.getItem("personal_id")
      : userData?._id;
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  // Removed const from here
  let workExperienceObj = [];
  let rowDataT = [];
  const loadWorkExperienceData = () => {
    api
      .get(`/api/work-experience/` + id, {
      })
      .then((response) => {
        workExperienceObj = response.data;

        setWorkExperienceData(response.data);
        setLoading(false);
        rowDataT.length = 0;

        workExperienceObj.workExperience.map((data) => {
          const duration = calculateDuration(data["FromDate"], data["ToDate"]); // Calculate the duration

          let temp = {
            data,
            CompanyName: data["CompanyName"],
            Designation: data["Designation"],
            FromDate: data["FromDate"].slice(0, 10),
            ToDate: data["ToDate"].slice(0, 10),
            Duration: duration, // Add duration to the row data
          };

          rowDataT.push(temp);
        });
        setRowData(rowDataT);
      })
      .catch((error) => {
        // Handle errors
      });
  };

  const onWorkExperienceDelete = (e1, e2) => {
    if (window.confirm("Are you sure to delete this record? ") === true) {
      api
        .delete(`/api/work-experience/` + e1 + "/" + e2, {
        })
        .then((res) => {
          loadWorkExperienceData();
        })
        .catch((err) => {});
    }
  };

  useEffect(() => {
    loadWorkExperienceData();
  }, []);

  // Corrected function declaration
  const renderButton = (params) => {
    if (props.back) {
      return <React.Fragment />;
    }
    return (
      <FontAwesomeIcon
        icon={FaTrash}
        onClick={() =>
          onWorkExperienceDelete(props.data["_id"], params.data.data["_id"])
        }
      />
    );
  };

  // Corrected function declaration
  const renderEditButton = (params) => {
    if (props.back) {
      return <React.Fragment />;
    }
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => props.onEditWorkExperience(params.data.data)}
      />
    );
  };

  const calculateDuration = (fromDate, toDate) => {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();

    let duration = `${years} year`;

    if (months > 0) {
      duration += ` and ${months} month`;
    }

    return duration;
  };

  return (
    <div className="container-fluid">
      <div id="table-outer-div-scroll">
        <div className="d-flex justify-content-between my-2">
          <TittleHeader
            title={"Work Experience"}
            numbers={rowData.length}
            message={"You can view work experience details here."}
          />

          <div className="py-1">
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
              onClick={() => props.onAddWorkExperience(loadWorkExperienceData)}
            >
              <FaPlus />
              <span className="d-none d-md-flex">Add Experience</span>
            </button>
          </div>
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
          {rowData.length > 0 ? (
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
                      <th style={rowHeadStyle(darkMode)}>Company Name</th>
                      <th style={rowHeadStyle(darkMode)}>Designation</th>
                      <th style={rowHeadStyle(darkMode)}>From Date</th>
                      <th style={rowHeadStyle(darkMode)}>To Date</th>
                      <th style={rowHeadStyle(darkMode)}>Duration</th>{" "}
                      <th style={rowHeadStyle(darkMode)} className="text-end">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData.map((items, index) => (
                      <tr key={index}>
                        <td
                          style={rowBodyStyle(darkMode)}
                          className="text-capitalize"
                        >
                          {items.CompanyName}
                        </td>
                        <td
                          style={rowBodyStyle(darkMode)}
                          className="text-capitalize"
                        >
                          {items.Designation}
                        </td>
                        <td
                          style={rowBodyStyle(darkMode)}
                          className="text-capitalize"
                        >
                          {items.FromDate}
                        </td>
                        <td
                          style={rowBodyStyle(darkMode)}
                          className="text-capitalize"
                        >
                          {items.ToDate}
                        </td>
                        <td style={rowBodyStyle(darkMode)} className="">
                          {items.Duration}{" "}
                          {/* Display the calculated duration */}
                        </td>
                        <td style={rowBodyStyle(darkMode)} className="text-end">
                          {/* <OverLayToolTip
                          onClick={() => props.onEditWorkExperience(items.data)}
                          tooltip={"Edit"}
                          icon={<FaRegEdit className="text-primary fs-5" />}
                        /> */}
                          <OverLayToolTip
                            onClick={() =>
                              onWorkExperienceDelete(id, items.data._id)
                            }
                            tooltip={"Delete"}
                            icon={<FaTrash className="text-danger fs-6" />}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center"
              style={{
                height: "65vh",
                width: "100%",
                gap: "20px",
                padding: "0 24px",
              }}
            >
              <img
                src={SearchLight}
                alt="No work experience"
                style={{
                  width: "160px",
                  maxWidth: "80%",
                  opacity: 0.9,
                }}
              />

              <div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                  }}
                >
                  Work Experience Not Available
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.6,
                    maxWidth: "420px",
                    opacity: 0.85,
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                  }}
                >
                  No work experience details have been added for this employee
                  yet. Please add previous employment information to keep
                  records complete.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceTable;
