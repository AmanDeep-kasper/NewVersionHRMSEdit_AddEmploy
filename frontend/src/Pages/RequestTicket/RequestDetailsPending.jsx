import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import { getTimeAgo } from "../../Utils/GetDayFormatted";
import RequestImage from "../../img/Request/Request.svg";
import toast from "react-hot-toast";
import profile from "../../img/profile.jpg";
import { useSelector } from "react-redux";
import TittleHeader from "../TittleHeader/TittleHeader";
import { MdOutlineAccessTime } from "react-icons/md";
import { HiFlag } from "react-icons/hi2";
import api from "../config/api";


const RequestDetailsPending = () => {
  const { userData } = useSelector((state) => state.user);
  const email = userData?.Email;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateData, setUpdateData] = useState({
    id: "",
    remark: "",
    updatedBy: email,
    status: "",
  });

  const MyEmail = userData?.Email;

  const fetchRequestList = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/requestList`,
        { email },
      );
      const requests = response.data;

      setData(requests);

      // Filter requests with status "Pending" wdssacsa
      const pendingRequests = requests.filter(
        (request) => request.status === "Pending"
      );
    } catch (error) {
      setError("Error loading request data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestList();
  }, [email]);

  const getProfileImage = (email) => {
    if (!selectedRequest) return null;
    if (email === selectedRequest?.to?.email) {
      return selectedRequest.to?.profilePhoto
        ? selectedRequest.to?.profilePhoto
        : profile;
    }
    if (email === selectedRequest?.requestedBy?.email) {
      return selectedRequest.requestedBy?.profilePhoto
        ? selectedRequest.requestedBy?.profilePhoto
        : profile;
    }
    const ccMatch = selectedRequest?.cc?.find((ccObj) => ccObj.email === email);

    return ccMatch
      ? ccMatch.profilePhoto
        ? ccMatch.profilePhoto
        : profile
      : profile; // Use a default image if no match
  };

  const handleRemarkChange = (event) =>
    setUpdateData((prev) => ({
      ...prev,
      id: selectedRequest._id,
      status:
        selectedRequest.status === "Pending" ||
        selectedRequest.status === "Open"
          ? "Close"
          : "Pending",
      remark: event.target.value,
    }));

  const handleSaveRemark = () => {
    api
      .post(`/api/updateRequest`, updateData, {
      })
      .then(() => {
        setData((prevData) =>
          prevData.map((val) => {
            if (val._id === updateData.id) {
              return {
                ...val,
                status: updateData.status,
                reOpen: [
                  ...val.reOpen,
                  { remark: updateData.remark, updatedBy: email },
                ],
              };
            }
            return val;
          })
        );
        setUpdateData({
          id: "",
          remark: "",
          updatedBy: email,
          status: "",
        });
        toast.success(`Request is ${updateData.status}`);
        fetchRequestList();
      })
      .catch((error) => {
        toast.error(`Error updating request data`);

        console.error("Error updating request data", error);
      });
  };

  // Filter requests with status "Pending"
  const pendingRequests = data.filter(
    (request) => request.status === "Pending" || request.status === "Open"
  );

  return (
    <div
      style={{ height: "90vh", overflow: "hidden", position: "relative" }}
      className="container-fluid py-2"
    >
      <div className="mb-2">
        <TittleHeader
          title={"Open Requests"}
          numbers={pendingRequests.length}
          message={"You can view all your pending requests here"}
        />
      </div>
      {pendingRequests.length > 0 ? (
        <div
          style={{ height: "88vh", overflow: "auto" }}
          className="row mx-auto"
        >
          <div style={{ height: "86vh", overflow: "auto" }}>
            <div className="row row-gap-3 pt-3 pb-3">
              {pendingRequests
                .slice()
                .reverse()
                .map((request) => (
                  <div className="col-12 col-md-6 col-lg-3" key={request._id}>
                    <div
                      className="card border-0 shadow-sm"
                      onClick={() => setSelectedRequest(request)}
                      role="button"
                      style={{
                        backgroundColor:
                          selectedRequest?._id === request._id
                            ? darkMode
                              ? "rgba(40, 67, 135, .3)"
                              : "rgba(1, 1, 122,.5)"
                            : !darkMode
                              ? "black"
                              : "white",
                        color: !darkMode ? "white" : "black",
                      }}
                    >
                      <div className="p-2">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center justify-content-between">
                            <span
                              className={
                                darkMode
                                  ? "badge-primary"
                                  : "badge-primary-dark"
                              }
                            >
                              {request.ticketID}
                            </span>
                            <p
                              className={` d-flex align-items-center gap-2 m-0 ${
                                darkMode ? "badge-info" : "badge-info-dark"
                              }`}
                            >
                              <MdOutlineAccessTime className="fs-5" />{" "}
                              {getTimeAgo(request.createdAt)}
                            </p>
                          </div>
                          <div className="d-flex align-items-center">
                            <img
                              className="rounded-circle me-2"
                              src={
                                request.requestedBy.profilePhoto
                                  ? request.requestedBy.profilePhoto
                                  : profile
                              }
                              alt=""
                              style={{ height: "30px", width: "30px" }}
                            />
                            <span>{request.requestedBy.email} ( You )</span>
                          </div>
                          <div
                            className={`d-flex flex-column gap-1  p-2 rounded-2 ${
                              darkMode
                                ? "bg-light text-dark"
                                : "bg-dark text-light"
                            }`}
                          >
                            <h6 className="m-0">Subject : </h6>
                            <p className="ellipsis m-0">{request.subject}</p>
                          </div>
                          <div className="d-flex align-items-center gap-2 my-1">
                            <span
                              className={`${
                                request.status === "Pending" ||
                                request.status === "Open"
                                  ? darkMode
                                    ? "badge-success"
                                    : "badge-success-dark"
                                  : darkMode
                                    ? "badge-danger"
                                    : "badge-danger-dark"
                              }`}
                            >
                              {request.status}
                            </span>
                            <span
                              className={`${
                                request.priority === "Urgent"
                                  ? darkMode
                                    ? "badge-danger"
                                    : "badge-danger-dark"
                                  : request.priority === "High"
                                    ? darkMode
                                      ? "badge-Semidanger"
                                      : "badge-Semidanger-dark"
                                    : request.priority === "Medium"
                                      ? darkMode
                                        ? "badge-primary"
                                        : "badge-primary-dark"
                                      : darkMode
                                        ? "badge-info"
                                        : "badge-info-dark"
                              }`}
                            >
                              <HiFlag /> {request.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {selectedRequest && (
            <div
              style={{
                height: "100%",
                overflow: "auto",
                width: "100%",
                backgroundColor: darkMode ? "rgba(0,0,0,.6)" : "rgba(0,0,0,.6)",
                color: !darkMode ? "white" : "black",
                position: "absolute",
                top: "0",
                left: "0",
              }}
            >
              <div
                key={selectedRequest._id}
                className="rounded-3 shadow p-3 pt-0 border"
                style={{
                  height: "70vh",
                  overflow: "auto",
                  width: "90%",
                  backgroundColor: !darkMode ? "black" : "white",
                  color: !darkMode ? "white" : "black",
                  position: "absolute",
                  top: "10%",
                  left: "50%",
                  transform: "translate(-50%)",
                }}
              >
                <div className="p-2">
                  <div
                    style={{
                      position: "sticky",
                      top: "0rem",
                      zIndex: "1",
                      background: darkMode ? "white" : "black",
                    }}
                    className="d-flex align-items-center py-2 py-3 justify-content-between gap-2"
                  >
                    <div className="d-flex  align-items-center gap-3">
                      <span
                        className={`${
                          darkMode ? "badge-primary" : "badge-primary-dark"
                        }`}
                      >
                        {selectedRequest.ticketID}
                      </span>
                      <span
                        className={`${
                          selectedRequest.status === "Pending" ||
                          selectedRequest.status === "Open"
                            ? darkMode
                              ? "badge-success"
                              : "badge-success-dark"
                            : darkMode
                              ? "badge-danger"
                              : "badge-danger-dark"
                        }`}
                      >
                        {selectedRequest.status}
                      </span>
                      <span
                        className={`${
                          selectedRequest.priority === "Urgent"
                            ? darkMode
                              ? "badge-danger"
                              : "badge-danger-dark"
                            : selectedRequest.priority === "High"
                              ? darkMode
                                ? "badge-Semidanger"
                                : "badge-Semidanger"
                              : selectedRequest.priority === "Medium"
                                ? darkMode
                                  ? "badge-primary"
                                  : "badge-primary-dark"
                                : "badge-info"
                        }`}
                      >
                        <HiFlag /> {selectedRequest.priority}
                      </span>
                      <p
                        className={`d-flex align-items-center gap-2 m-0 ${
                          darkMode ? "badge-info" : "badge-info-dark"
                        }`}
                      >
                        Created At : <MdOutlineAccessTime className="fs-5" />{" "}
                        {getTimeAgo(selectedRequest.createdAt)}
                      </p>
                      <p
                        className={`${
                          darkMode ? "badge-warning" : "badge-warning-dark"
                        } d-flex align-items-center gap-2 m-0`}
                      >
                        Last Updated At :{" "}
                        {getTimeAgo(selectedRequest.updatedAt)}
                      </p>
                    </div>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedRequest(null)}
                    >
                      Close ( X ){" "}
                    </span>
                  </div>
                  <div
                    className={`d-flex flex-column gap-1  p-2 rounded-2 ${
                      darkMode ? "bg-light text-dark" : "bg-dark text-light"
                    }`}
                  >
                    <h6 className="m-0">Subject : </h6>
                    <p className="text-capitalize m-0">
                      {selectedRequest.subject}
                    </p>
                  </div>

                  <hr />
                  <div className="d-flex align-items-center">
                    <img
                      className="rounded-circle me-2"
                      src={selectedRequest.requestedBy.profilePhoto}
                      alt=""
                      style={{ height: "30px", width: "30px" }}
                    />
                    <div className="d-flex flex-column">
                      <span>{selectedRequest.requestedBy.email}</span>{" "}
                      <p className="mb-1">
                        {getTimeAgo(selectedRequest.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 mt-2">
                    <div
                      style={{ height: "1.8rem", width: "1.8rem" }}
                      className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                    >
                      To
                    </div>
                    <p className="m-0">{selectedRequest.to.email}</p>
                  </div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      style={{ height: "1.8rem", width: "1.8rem" }}
                      className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                    >
                      CC
                    </div>
                    <p className="m-0 ">
                      {selectedRequest?.cc?.map((val) => val.email).join(", ")}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontWeight: 600 }}>Request</span>
                    <p>{selectedRequest.remark}</p>
                  </div>
                  <hr />
                  {selectedRequest.reOpen?.length > 0 && (
                    <div className="mt-3 d-flex  flex-column gap-3">
                      <h6 style={{ fontWeight: 600 }}>Request Updates</h6>
                      {selectedRequest.reOpen.map((reopen, index) => (
                        <div
                          key={index}
                          className={`${
                            reopen.updatedBy === MyEmail
                              ? "mt-2 p-y-1 px-3  ms-auto"
                              : "mt-2 p-y-1 px-3  ms-start"
                          }`}
                          style={{ width: "fit-content " }}
                        >
                          <div className="d-flex flex-column gap-1">
                            {reopen.updatedBy === MyEmail ? (
                              <div className="d-flex align-items-center gap-2 justify-content-end">
                                <p
                                  className="m-0"
                                  style={{
                                    padding: ".3rem .5rem",
                                    borderRadius: ".8rem .8rem .0rem .8rem",
                                    background: "#0077b6",
                                    color: "white",
                                  }}
                                >
                                  {reopen.remark}
                                </p>
                                <img
                                  className="rounded-circle border me-2"
                                  src={getProfileImage(reopen.updatedBy)}
                                  alt=""
                                  style={{
                                    height: "2rem",
                                    width: "2rem",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="d-flex align-items-center gap-0 justify-content-start">
                                <img
                                  className="rounded-circle border me-2"
                                  src={getProfileImage(reopen.updatedBy)}
                                  alt=""
                                  style={{
                                    height: "2rem",
                                    width: "2rem",
                                    objectFit: "cover",
                                  }}
                                />
                                <p
                                  className="m-0"
                                  style={{
                                    padding: ".3rem .5rem",
                                    borderRadius: ".8rem .8rem .8rem .0rem",
                                    background: "#90e0ef",
                                    color: "black",
                                  }}
                                >
                                  {reopen.remark}
                                </p>
                              </div>
                            )}

                            {reopen.updatedBy === MyEmail ? (
                              <div className="d-flex align-items-center gap-1 ms-auto">
                                <p
                                  style={{ fontSize: ".8rem" }}
                                  className=" mb-1"
                                >
                                  {getTimeAgo(reopen.updatedAt)}
                                </p>
                                {reopen.updatedBy === MyEmail ? (
                                  <span
                                    style={{
                                      fontSize: ".8rem",
                                      color: "blue",
                                      fontWeight: "600",
                                    }}
                                  >
                                    ( You )
                                  </span>
                                ) : (
                                  <span style={{ fontSize: ".8rem" }}>
                                    {reopen.updatedBy}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="d-flex align-items-center gap-1 ms-auto">
                                {reopen.updatedBy === MyEmail ? (
                                  <span
                                    style={{
                                      fontSize: ".8rem",
                                      color: "blue",
                                      fontWeight: "600",
                                    }}
                                  >
                                    ( You )
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      fontSize: ".8rem",
                                      color: "blue",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {reopen.updatedBy}
                                  </span>
                                )}
                                <p
                                  style={{ fontSize: ".8rem" }}
                                  className="m-0"
                                >
                                  {getTimeAgo(reopen.updatedAt)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-start mt-3">
                    <div className="d-flex flex-column gap-2">
                      <div>
                        <Form>
                          <Form.Group controlId="remark">
                            <Form.Label>Remark</Form.Label>
                            <Form.Control
                              className={`form-control rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              as="textarea"
                              rows={3}
                              value={updateData.remark}
                              onChange={handleRemarkChange}
                              // disabled
                              placeholder={
                                selectedRequest.status === "Pending" ||
                                selectedRequest.status === "Open"
                                  ? "Please enter your message here"
                                  : "This request is closed"
                              }
                            />
                          </Form.Group>
                        </Form>
                      </div>
                      <div>
                        {selectedRequest.status === "Pending" ||
                        selectedRequest.status === "Open" ? (
                          <button
                            className="btn btn-primary"
                            onClick={handleSaveRemark}
                          >
                            Save Changes
                          </button>
                        ) : (
                          " "
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            height: "80vh",
            gap: "14px",
            textAlign: "center",
          }}
        >
          <img
            src={RequestImage}
            alt="No requests available"
            style={{
              width: "18rem",
              maxWidth: "90%",
              opacity: 0.9,
            }}
          />

          <div>
            <div
              style={{
                fontSize: "17px",
                fontWeight: 600,
                marginBottom: "4px",
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              No Requests Available
            </div>

            <div
              style={{
                fontSize: "14px",
                opacity: 0.85,
                lineHeight: 1.5,
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              There are currently no requests to display. New requests will
              appear here once submitted.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetailsPending;
