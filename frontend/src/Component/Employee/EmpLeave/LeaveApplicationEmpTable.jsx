import React, { useEffect, useState } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { FaPlus } from "react-icons/fa6";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import LeaveBalance from "../../HrManager/LeaveStatus/LeaveBalance";
import api from "../../../Pages/config/api";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const LeaveApplicationEmpTable = (props) => {
  const [leaveApplicationEmpData, setLeaveApplicationEmpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const userId = props.data && props.data._id;
  const { darkMode } = useTheme();

  const loadLeaveApplicationEmpData = () => {
    api
      .get(`/api/leave-application-emp/${props.data["_id"]}`, {
      })
      .then((response) => {
        const leaveApplicationEmpObj = response.data;

        setLeaveApplicationEmpData(response.data);
        setLoading(false);

        const newRowsData = leaveApplicationEmpObj.leaveApplication.map(
          (data) => {
            return {
              data,
              Leavetype: data["Leavetype"],
              FromDate: data["FromDate"].slice(0, 10),
              ToDate: data["ToDate"].slice(0, 10),
              Reasonforleave: data["Reasonforleave"],
              Status: data["Status"],
              updatedBy: data["updatedBy"],
              reasonOfRejection: data["reasonOfRejection"],
            };
          }
        );

        setRowData(newRowsData);

        props.updateTotalLeaves(newRowsData.length);
      })
      .catch((error) => {});
  };

  const onLeaveApplicationEmpDelete = (e1, e2) => {
    if (window.confirm("Are you sure to delete this record? ")) {
      api
        .delete(`/api/leave-application-emp/${e1}/${e2}`, {
        })
        .then((res) => {
          loadLeaveApplicationEmpData();
        })
        .catch((err) => {});
    }
  };

  const status = (s) => {
    if (s == 1) {
      return "Pending";
    }
    if (s == 2) {
      return "Approved";
    }
    if (s == 3) {
      return "Rejected";
    }
    return "Unknown Status";
  };

  const onEdit = (data) => {
    if (data["Status"] === 1) {
      props.onEditLeaveApplicationEmp(data);
    } else {
      window.alert(
        "You cannot edit the application after it's approved or rejected"
      );
    }
  };

  useEffect(() => {
    loadLeaveApplicationEmpData();
  }, [props.leaveRequestDone]);

  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "1",
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--primaryDashMenuColor)",
    border: "none",
  };

  return (
    <div className="container-fluid py-2">
      <LeaveBalance />
      <div className="container-fluid ">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <TittleHeader
            title={"Leave Application"}
            message={"You can view all your leave request here"}
          />
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            variant="primary"
            id="add-button"
            onClick={props.onAddLeaveApplicationEmp}
          >
            <FaPlus />
            <span className="d-none d-md-flex">Add Leave Request</span>
          </button>
        </div>

        <div id="clear-both" />
        {!loading ? (
          <div style={{ maxHeight: "76vh" }} className="border">
            {rowData > 0 ? (
              <div
                style={{
                  // maxHeight: "68vh",
                  overflow: "auto",
                  position: "relative",
                }}
                className="table-responsive p-2 mb-3"
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th style={rowHeadStyle}>Profile</th>
                      <th style={rowHeadStyle}>Leave Type</th>
                      <th style={rowHeadStyle}>Start Date</th>
                      <th style={rowHeadStyle}>End Date</th>
                      <th style={rowHeadStyle}>Remarks</th>
                      <th style={rowHeadStyle}>Status</th>
                      <th style={rowHeadStyle}>Updated By</th>
                      <th style={rowHeadStyle}>Reason of Rejection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData.map((data, index) => (
                      <tr key={index}>
                        <td style={rowBodyStyle} className="py-1">
                          {/* <div style={{ height: "35px", width: "35px" }}>
                            <img
                              style={{
                                height: "100%",
                                width: "100%",
                                borderRadius: "50%",
                                overflow: "hidden",
                                objectFit: "cover"
                              }}
                              src={
                                data?.data?.profile?.image_url
                                  ? data?.data?.profile?.image_url
                                  : "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                              }
                              alt=""
                            />
                          </div> */}
                          <div
                            className="mx-auto d-flex align-items-center justify-content-center"
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
                            {data?.data?.profile?.image_url ? (
                              <img
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                                src={data?.data?.profile?.image_url}
                                alt=""
                              />
                            ) : (
                              <span>
                                {data?.EmployeeName?.split(" ")
                                  .map((name) => name[0])
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={rowBodyStyle}>{data.Leavetype}</td>
                        <td style={rowBodyStyle}>{data.FromDate}</td>
                        <td style={rowBodyStyle}>{data.ToDate}</td>
                        <td style={rowBodyStyle}>{data.Reasonforleave}</td>
                        <td style={rowBodyStyle}>{status(data.Status)}</td>
                        <td style={rowBodyStyle}>{data.updatedBy}</td>
                        <td style={rowBodyStyle}>{data.reasonOfRejection}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>123</>
            )}
          </div>
        ) : (
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
      </div>
    </div>
  );
};

export default LeaveApplicationEmpTable;
