import React, { useEffect, useState, useContext } from "react";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../Pages/config/config";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { MdRemoveCircleOutline } from "react-icons/md";
import profileimage from "../../img/profile.jpg";
import toast from "react-hot-toast";
import { getTimeAgo } from "../GetDayFormatted";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { GoScreenFull } from "react-icons/go";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";
import { FcDeleteRow } from "react-icons/fc";
import { RiDeleteBinLine } from "react-icons/ri";
import api from "../../Pages/config/api";
const NoticeBoard = () => {
  const { userData } = useSelector((state) => state.user);
  const location = useLocation();
  const route = location.pathname.split("/")[1];
  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const [notice, setNotice] = useState([]);
  const { darkMode } = useTheme();
  const { socket } = useContext(AttendanceContext);
  const id = userData?._id;
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadEmployeeData = () => {
    api
      .get(`/api/notice/${id}`, {
      })
      .then((response) => {
        setNotice(response.data.reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("notice", (data) => {
        loadEmployeeData();
      });
      socket.on("noticeDelete", (data) => {
        if (data) {
          loadEmployeeData();
        }
      });
    }
  }, [socket]);

  const pdfHandler = (path) => {
    window.open(`${BASE_URL}/${path}`, "_blank", "noreferrer");
  };

  const deleteHandler = async (id, creator) => {
  try {

    await api.post(
      `/api/noticeDelete`,
      { noticeId: id, creator }, // ✅ Include creator if required
    );

    toast.success("Notice deleted successfully.");
    loadEmployeeData(); // ✅ Refresh the list after delete
  } catch (error) {
    console.error("Error deleting notice:", error);
    toast.error("Failed to delete notice. Please try again.");
  }
};


  const handleShowModal = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
    setShowModal(false);
  };

  return (
    <>
      {notice.length > 0 ? (
        <div className="mx-auto row row-gap-1 rounded-0 position-relative">
          {notice.map((val) => (
            <div key={val.noticeId} className="col-12 col-md-6 col-lg-4 p-2">
              <div
                className="d-flex flex-column shadow-sm rounded p-2 justify-content-start gap-2 position-relative"
                style={{
                  backgroundColor: darkMode
                    ? "var(--secondaryDashMenuColor)"
                    : "var(--secondaryDashColorDark)",
                  minHeight: "16rem",
                  maxHeight: "16rem",
                  overflow: "hidden",
                  border: darkMode
                    ? "1px solid rgba(223, 220, 220, 0.95)"
                    : "1px solid rgba(39, 36, 36, 0.95)",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{ color: darkMode ? "black" : "white" }}
                    className="d-flex align-items-center justify-content-between w-100"
                  >
                    <ProfileAvatar
                      imageURL={
                        val.creatorProfile
                          ? val.creatorProfile.image_url
                          : profileimage
                      }
                      firstName={val.creator}
                      additional={val.creatorPosition}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: ".5rem",
                        right: ".5rem",
                        fontSize: ".9rem",
                      }}
                      className="d-flex flex-column"
                    >
                      <span className="m-0 mx-1">
                        {getTimeAgo(val.createdAt)}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {/* Download Attachment */}
                      {val.attachments !== null && (
                        <a
                          title="Download Attachment"
                          target="blank"
                          style={{
                            background: darkMode ? "#2f99ea4a" : "#2c2cf341",
                            color: darkMode ? "#572be8f0" : "#c8c2feed",
                            height: "1.8rem",
                            width: "1.8rem",
                          }}
                          className="btn d-flex align-items-center justify-content-center mr-3 rounded-5 p-0"
                          href={val.attachments}
                          download={true}
                        >
                          <IoCloudDownloadOutline className="fs-5" />
                        </a>
                      )}

                      {/* Delete Notice Button */}
                      {(route === "hr" || route === "manager") &&
                      val.creator === name ? (
                        <RiDeleteBinLine
                          title="Remove Notice"
                          style={{                            
                            height: "1.5rem",
                            width: "1.5rem",
                          }}
                          className="text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHandler(val._id, val.creator);
                          }}
                        />
                      ) : route === "admin" ? (
                        <MdRemoveCircleOutline
                          title="Remove Notice"
                          style={{
                            background: darkMode ? "#ea2f2f49" : "#f32c2c41",
                            color: darkMode ? "#e82b2bef" : "#fc6b6bec",
                            height: "1.8rem",
                            width: "1.8rem",
                          }}
                          className="btn d-flex align-items-center justify-content-center rounded-5 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHandler(val._id, val.creator);
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                <Modal show={showModal} onHide={handleCloseModal} centered>
                  <Modal.Body
                    className={
                      darkMode ? "bg-light text-dark" : "bg-dark text-light"
                    }
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <span>{selectedNotice?.creator || "Notice"}</span>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={handleCloseModal}
                      >
                        Close ( x )
                      </span>
                    </div>
                    <hr />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedNotice?.notice,
                      }}
                    />
                  </Modal.Body>
                </Modal>
                <div
                  style={{
                    color: darkMode ? "black" : "white",
                    height: "9rem",
                    overflow: "auto",
                    padding: ".5rem",
                    borderRadius: "5px",
                    background: darkMode
                      ? "rgba(204, 201, 201, 0.27)"
                      : "rgba(58, 56, 56, 0.5)",
                  }}
                  dangerouslySetInnerHTML={{ __html: val.notice }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: ".5rem",
                    left: ".5rem",
                    cursor: "pointer",
                  }}
                  className={`btn d-flex align-items-center gap-2 ${
                    darkMode ? "text-dark" : "text-white"
                  }`}
                  onClick={() => handleShowModal(val)}
                >
                  <GoScreenFull className="fs-5" /> Expand
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="d-flex flex-column gap-3 align-items-center justify-content-center"
          style={{ height: "80vh" }}
        >
          <p>No notices found at this moment.</p>
        </div>
      )}
    </>
  );
};

export default NoticeBoard;
