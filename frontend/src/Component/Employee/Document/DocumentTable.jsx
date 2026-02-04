import React, { useEffect, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import { MdDelete, MdOndemandVideo } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { FaFileExcel, FaFilePdf, FaPlus, FaRegImage } from "react-icons/fa";
import SearchLight from "../../../img/Attendance/SearchLight.svg";
import { useSelector } from "react-redux";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { useLocation } from "react-router-dom";
import { FcDocument } from "react-icons/fc";
import api from "../../../Pages/config/api";

const DocumentTable = (props) => {
  const [showDownloadbtn, setShowDownloadbtn] = useState(null);
  const { userData } = useSelector((state) => state.user);
  const [documents, setDocuments] = useState([]);
  const { darkMode } = useTheme();
  const location = useLocation().pathname.split("/")[2];
  const email =
    location === "employee"
      ? sessionStorage.getItem("personal_email")
      : userData?.Email;

  useEffect(() => {
    fetchDocuments();
  }, [props.table === true]);

const fetchDocuments = async () => {
  try {
    const response = await api.post(
      `/documents`,
      { email },
    );

    setDocuments(response.data);
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

const deleteDocument = async (documentId) => {
  try {
    await api.delete(`/delete-document/${documentId}`, {
    });

    fetchDocuments(); // Refresh list after deletion
    toast.success("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting document:", error);
    toast.error("Failed to delete document");
  }
};


  const confirmDelete = (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(documentId);
    }
  };

  const isSupportedFormat = (file) => {
    // Ensure it's a string and check file extensions
    if (typeof file !== "string") return false;
    const supportedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return supportedExtensions.some((ext) => file.toLowerCase().endsWith(ext));
  };

  console.log(documents.map((data) => data.files));

  // Function to categorize and assign icons
  const categorizeFiles = (files) => {
    if (!files) return []; // Return an empty array if files is undefined

    // Ensure files is an array (in case it's a single URL as a string)
    const filesArray = Array.isArray(files) ? files : files.split(",");

    return filesArray.map((url) => {
      const extension = url.split(".").pop().toLowerCase(); // Extract file extension

      let category = "Other";
      let icon = <FcDocument className="fs-1" />; // Default icon

      if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension)) {
        category = "Image";
        icon = <FaRegImage className="fs-1 text-primary" />;
      } else if (extension === "pdf") {
        category = "Pdf";
        icon = <FaFilePdf className="fs-1 text-danger" />;
      } else if (["xls", "xlsx", "csv"].includes(extension)) {
        category = "Excel";
        icon = <FaFileExcel className="fs-1 text-success" />;
      } else if (["mp4", "avi", "mov", "mkv"].includes(extension)) {
        category = "Video";
        icon = <MdOndemandVideo className="fs-1 text-warning" />;
      }

      return { url, category, icon };
    });
  };

  return (
    <div className="container-fluid py-2">
      <div>
        <div className="d-flex justify-content-between">
          <TittleHeader
            title={"Uploaded Documents"}
            numbers={documents.length}
            message={"You can add or view uploaded documents "}
          />

          <div className="py-1">
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
              onClick={props.onAddDocument}
            >
              <FaPlus />
              <span className="d-none d-md-flex">Upload Documents</span>
            </button>
          </div>
        </div>

        <div
          className="mt-2"
          style={{
            overflow: "hidden auto",
            height: "100%",
            scrollbarWidth: "thin",
          }}
        >
          {documents.length > 0 ? (
            <div className="d-flex flex-wrap gap-3">
              {documents.reverse().map((data, index) => (
                <div style={{ height: "190px", width: "200px" }}>
                  <div
                    key={index}
                    onMouseEnter={() => setShowDownloadbtn(index)}
                    onMouseLeave={() => setShowDownloadbtn(null)}
                    className=" d-flex  flex-column gap-2 px-2 text-capitalize py-1 shadow-sm rounded-2"
                    style={{
                      height: "190px",
                      width: "200px",
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--secondaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--secondaryDashMenuColor)",
                      border: "none",
                    }}
                  >
                    <div
                      style={{
                        height: "150px",
                        width: "100%",
                        overflow: "hidden",
                        background:
                          data.files && isSupportedFormat(data.files)
                            ? `url(${data.files})`
                            : "#f0f0f0",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        opacity: "85%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#888",
                        fontSize: "16px",
                      }}
                      className="m-auto position-relative"
                    >
                      {!data?.files ? (
                        <span>No Preview Available</span>
                      ) : (
                        categorizeFiles(data.files).map((file, index) => (
                          <div key={index}>{file.icon}</div>
                        ))
                      )}
                      <div
                        style={{
                          height: "100%",
                          width: "100%",
                          position: "absolute",
                          top: "0",
                          left: "0",
                          background: darkMode
                            ? "var( --secondaryDashMenuColor)"
                            : "var(--secondaryDashColorDark)",
                          color: darkMode
                            ? "var(--secondaryDashColorDark)"
                            : "var( --primaryDashMenuColor)",
                          display: showDownloadbtn === index ? "flex" : "none",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <a
                          target="_blank"
                          href={data.files[0]} // Ensure this points to a valid URL (first file in the array)
                          style={{ height: "40px", width: "40px" }}
                          className="btn p-0 btn bg-white text-primary shadow d-flex"
                          rel="noopener noreferrer" // For security
                        >
                          <IoEye className="m-auto fs-4" />
                        </a>

                        <a
                          href={data.files[0]} // Same URL for the download
                          download={data.files[0].split("/").pop()} // Extract filename from the URL
                          style={{ height: "40px", width: "40px" }}
                          className="btn p-0 btn bg-white text-primary shadow d-flex"
                        >
                          <IoMdDownload className="m-auto fs-4" />
                        </a>
                      </div>
                      {userData.Account === 1 ||
                        (userData.Account === 2 && (
                          <div
                            style={{
                              height: "1.5rem",
                              width: "1.5rem",
                              position: "absolute",
                              bottom: "0",
                              right: "0",
                              opacity: "100%",
                              cursor: "pointer",
                              borderRadius: "5px 0 0 0px",
                            }}
                            className={`d-flex shadow-sm align-items-center justify-content-center text-danger  ${
                              darkMode
                                ? "bg-light border border-black"
                                : "bg-dark border border-light"
                            }`}
                            onClick={() => confirmDelete(data._id)}
                          >
                            <MdDelete
                              className="ml-1"
                              style={{ fontSize: "1.1rem" }}
                            />
                          </div>
                        ))}
                      {Date.now() - new Date(data.createdAt).getTime() <=
                        6 * 60 * 1000 && (
                        <div
                          style={{
                            height: "1.5rem",
                            width: "1.5rem",
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                            opacity: "100%",
                            cursor: "pointer",
                            borderRadius: "5px 0 0 0px",
                          }}
                          className={`d-flex shadow-sm align-items-center justify-content-center text-danger  ${
                            darkMode
                              ? "bg-light border border-black"
                              : "bg-dark border border-light"
                          }`}
                          onClick={() => confirmDelete(data._id)}
                        >
                          <MdDelete
                            className="ml-1"
                            style={{ fontSize: "1.1rem" }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p
                        style={{
                          fontSize: ".9rem",
                          color: darkMode
                            ? "var(--secondaryDashColorDark)"
                            : "var( --primaryDashMenuColor)",
                        }}
                        className="m-0"
                      >
                        {data.title}
                      </p>{" "}
                    </div>
                  </div>
                </div>
              ))}
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
                alt="No documents uploaded"
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
                  No Documents Uploaded
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
                  Required employee documents have not been uploaded yet. Please
                  upload the necessary documents to complete the profile.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentTable;
