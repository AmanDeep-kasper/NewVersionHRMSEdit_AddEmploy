import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import moment from "moment";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { getTimeAgo } from "../../Utils/GetDayFormatted";
import RequestImage from "../../img/Request/Request.svg";
import BASE_URL from "../config/config";
import toast from "react-hot-toast";
import profile from "../../img/profile.jpg";
import { useSelector } from "react-redux";
import api from "./";

const RequestRaised = () => {
  const { userData } = useSelector((state) => state.user);
  const email = userData?.Email;
  const [data, setData] = useState([]);
  const { darkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    id: "",
    remark: "",
    updatedBy: email,
    status: "",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);

  const MyEmail = userData?.Email;

  const fetchRequests = async () => {
    try {
      const response = await api.post(
        `${BASE_URL}/api/requestRaised`,
        { email },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      );
      const fetchedData = response.data;
      const pendingRequests = fetchedData.filter(
        (request) => request.status === "Pending"
      );
      setData(pendingRequests);
    } catch (error) {
      console.error("Error loading request data", error);
    }
  };

  // UseEffect to fetch data
  useEffect(() => {
    fetchRequests();
  }, [email]);

  const handleCloseModal = () => setShowModal(false);

  const handleShowModal = (req) => {
    setUpdateData((prev) => ({
      ...prev,
      id: req._id,
      status: req.status === "Close" ? "Pending" : "Close",
    }));
    setShowModal(true);
  };

  const handleRemarkChange = (event) =>
    setUpdateData((prev) => ({ ...prev, remark: event.target.value }));

  const handleSaveRemark = () => {
    axios
      .post(`${BASE_URL}/api/updateRequest`, updateData, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then(() => {
        data.forEach((val) => {
          if (val._id === updateData.id) {
            val.status = updateData.status;
            val.reOpen.push({
              remark: updateData.remark,
              updatedBy: email,
              updatedAt: new Date(),
            });
          }
        });
        setUpdateData({
          id: "",
          remark: "",
          updatedBy: email,
          status: "",
        });
        toast.success(`Request is ${updateData.status}`);

        fetchRequests();
      })
      .catch((error) => {
        toast.error(`Error updating request data`);

        console.error("Error updating request data", error);
      });
    handleCloseModal();
  };

  const isCompleteButtonDisabled = (val) => {
    if (val) {
      const updatedAtTime = moment(val.updatedAt);
      const currentTime = moment();
      return currentTime.diff(updatedAtTime, "hours") > 72;
    }
  };

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
      : profile;
  };
  return (
    <div
      style={{ height: "90vh", overflow: "hidden", position: "relative" }}
      className="container-fluid py-2"
    >
      {data.length > 0 ? (
        <div style={{ height: "88vh", overflow: "auto" }}>
          <h5
            className="my-2 mb-3"
            style={{ color: !darkMode ? "white" : "gray", fontWeight: 600 }}
          >
            Pending Request's ( {data.length} )
          </h5>
          <div style={{ height: "86vh", overflow: "auto" }}>
            <div className="row row-gap-3">
              {data
                .slice()
                .reverse()
                .map((request) => (
                  <div className="col-12 col-md-6 col-lg-4" key={request._id}>
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
                      <div className="py-1 px-2">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="badge-primary">
                              {request.ticketID}
                            </span>
                            <p className="mb-1">
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
                          <h6 className="my-1 mb-2 ellipsis">
                            {request.subject}
                          </h6>
                          <div className="d-flex align-items-center gap-2 my-1">
                            <span
                              className={`${
                                request.status === "Pending"
                                  ? "badge-success"
                                  : "badge-danger"
                              }`}
                            >
                              {request.status}
                            </span>
                            <span className="badge bg-danger">
                              {request.priority}
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
                className="rounded-3 shadow p-3 border"
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
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge-primary">
                        {selectedRequest.ticketID}
                      </span>
                      <span
                        className={`${
                          selectedRequest.status === "Pending"
                            ? "badge-success"
                            : "badge-danger"
                        }`}
                      >
                        {selectedRequest.status}
                      </span>
                      <span className="badge-danger">
                        {selectedRequest.priority}
                      </span>
                    </div>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedRequest(null)}
                    >
                      Close ( X ){" "}
                    </span>
                  </div>
                  <h5 className="text-capitalize my-2">
                    <strong> Subject:</strong> {selectedRequest.subject}
                  </h5>

                  <hr />
                  <div className="d-flex align-items-center">
                    <img
                      className="rounded-circle me-2"
                      src={
                        selectedRequest.requestedBy.profilePhoto
                          ? selectedRequest.requestedBy.profilePhoto
                          : profile
                      }
                      alt=""
                      style={{ height: "30px", width: "30px" }}
                    />
                    <div className="d-flex flex-column">
                      <span>{selectedRequest.requestedBy.email} ( You )</span>{" "}
                      <p className=" mb-1">
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
                      {selectedRequest.cc?.map((val) => val.email).join(", ")}
                    </p>
                  </div>

                  <div>
                    <div>
                      <span style={{ fontWeight: 600 }}>Request</span>
                      <p>{selectedRequest.remark}</p>
                    </div>
                    <p>Last Updated as on {selectedRequest.updatedAt}</p>
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
                                    border: "1px solid gray",
                                    background: "purple",
                                    color: "white",
                                  }}
                                >
                                  {reopen.remark}
                                </p>
                                <img
                                  className="rounded-circle me-2"
                                  src={getProfileImage(reopen.updatedBy)}
                                  alt=""
                                  style={{
                                    height: "2rem",
                                    width: "2rem",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="d-flex align-items-center gap-0 justify-content-start">
                                <img
                                  className="rounded-circle me-2"
                                  src={getProfileImage(reopen.updatedBy)}
                                  alt=""
                                  style={{
                                    height: "2rem",
                                    width: "2rem",
                                    objectFit: "contain",
                                  }}
                                />
                                <p
                                  className="m-0"
                                  style={{
                                    padding: ".3rem .5rem",
                                    borderRadius: ".8rem .8rem .8rem .0rem",
                                    border: "1px solid gray",
                                    background: "purple",
                                    color: "white",
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
                          {/* <div className="d-flex align-items-center">
                          <img
                            className="rounded-circle me-2"
                            src={getProfileImage(reopen.updatedBy)}
                            alt=""
                            style={{ height: "30px", width: "30px" }}
                          />
                         
                        </div> */}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-start mt-3">
                    {selectedRequest.status === "Pending" ? (
                      <Button
                        variant="primary"
                        onClick={() => handleShowModal(selectedRequest)}
                      >
                        Close
                      </Button>
                    ) : selectedRequest.status === "Close" ? (
                      <Button
                        variant="secondary"
                        onClick={() => handleShowModal(selectedRequest)}
                        disabled={isCompleteButtonDisabled(
                          selectedRequest.reOpen[
                            selectedRequest.reOpen.length - 1
                          ],
                        )}
                      >
                        Reopen
                      </Button>
                    ) : null}
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="remark">
              <Form.Label>Remark</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updateData.remark}
                onChange={handleRemarkChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveRemark}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case "Close":
      return "btn-success";
    case "Pending":
      return "btn-warning";
    default:
      return "btn-secondary";
  }
};

export default RequestRaised;
