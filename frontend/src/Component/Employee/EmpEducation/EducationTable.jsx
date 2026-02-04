import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { FaPlus, FaRegEdit, FaTrash } from "react-icons/fa";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import SearchLight from "../../../img/Attendance/SearchLight.svg";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import OverLayToolTip from "../../../Utils/OverLayToolTip";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import { useLocation } from "react-router-dom";
import api from "../../../Pages/config/api";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const EducationTable = (props) => {
  const { userData } = useSelector((state) => state.user);
  const location = useLocation().pathname.split("/")[2];
  const id =
    location === "employee"
      ? sessionStorage.getItem("personal_id")
      : userData?._id;

  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();
  const loadEducationData = () => {
    api
      .get(`/api/education/` + id, {})
      .then((response) => {
        const educationObj = response.data;

        setEducationData(educationObj);
        setLoading(false);

        const rowDataT = educationObj.education.map((data) => ({
          data,
          SchoolUniversity: data["SchoolUniversity"],
          Degree: data["Degree"],
          Grade: data["Grade"],
          PassingOfYear: data["PassingOfYear"],
        }));

        setRowData(rowDataT);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    loadEducationData();
  }, [id]);

  const onEducationDelete = (e1, e2) => {
    if (window.confirm("Are you sure to delete this record? ")) {
      api
        .delete(`/api/education/${e1}/${e2}`, {})
        .then(() => {
          loadEducationData();
          toast.success("Education record deleted successfully!"); // Show success toast
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error deleting education record."); // Show error toast
        });
    }
  };

  const renderEditButton = (params) => {
    if (props.back) {
      return <React.Fragment />;
    }
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => props.onEditEducation(params.data.data)}
      />
    );
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between my-2">
        <TittleHeader
          title={" Educational Details"}
          numbers={rowData.length}
          message={"You can view education details here."}
        />

        <div className="py-1">
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            onClick={props.onAddEducation}
          >
            <FaPlus />
            <span className="d-none d-md-flex">Add Details</span>
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
              className="mb-2 rounded-2"
            >
              <table className="table mb-0 table-hover">
                <thead>
                  <tr>
                    <th style={rowHeadStyle(darkMode)}>School/University</th>
                    <th style={rowHeadStyle(darkMode)}>Degree</th>
                    <th style={rowHeadStyle(darkMode)}>Grade / %</th>
                    <th style={rowHeadStyle(darkMode)}>Passing Year</th>
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
                        {items.SchoolUniversity}
                      </td>
                      <td
                        style={rowBodyStyle(darkMode)}
                        className="text-capitalize"
                      >
                        {items.Degree}
                      </td>
                      <td
                        style={rowBodyStyle(darkMode)}
                        className="text-capitalize"
                      >
                        {items.Grade}
                      </td>
                      <td
                        style={rowBodyStyle(darkMode)}
                        className="text-capitalize"
                      >
                        {items.PassingOfYear}
                      </td>
                      <td style={rowBodyStyle(darkMode)}>
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <OverLayToolTip
                            onClick={() => props.onEditEducation(items.data)}
                            tooltip={"Edit"}
                            icon={<FaRegEdit className="text-primary" />}
                          />
                          <OverLayToolTip
                            onClick={() =>
                              onEducationDelete(
                                items.data["_id"],
                                items.data["_id"],
                              )
                            }
                            tooltip={"Delete"}
                            icon={<FaTrash className="text-danger" />}
                          />
                        </div>
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
              gap: "18px",
              padding: "0 24px",
            }}
          >
            <img
              src={SearchLight}
              alt="No education details"
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
                Education Details Not Available
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
                Education information has not been added for this employee yet.
                Please add educational qualifications to complete the profile.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationTable;
