import React, { useState } from "react";
import styled from "styled-components";
import { FiUploadCloud } from "react-icons/fi";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import { useLocation } from "react-router-dom";
import api from "../../../Pages/config/api";

const DropArea = styled.div`
  background-position: center;
  background-size: cover;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  text-align: center;
  overflow: hidden;
`;

const DocumentUploadForm = (props) => {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useSelector((state) => state.user);

  const location = useLocation().pathname.split("/")[2];
  const email =
    location === "employee"
      ? sessionStorage.getItem("personal_email")
      : userData?.Email;

  const { darkMode } = useTheme();

 const handleDocumentSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();
  formData.append("title", title);
  formData.append("email", email);
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  if (files.length === 0) {
    setLoading(false);
    toast.error("Please select documents");
    return;
  }

  try {
    const response = await api.post(`/upload`, formData, {
      
    });

    setTitle("");
    setFiles([]);
    toast.success("Document uploaded successfully");
    props.onFormClose();
  } catch (error) {
    console.error("Error uploading documents:", error);
    toast.error("Failed to upload documents");
  } finally {
    setLoading(false);
  }
};


  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="container-fluid" style={{ position: "relative" }}>
      <form onSubmit={handleDocumentSubmit}>
        <h6
          className="mb-4"
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
        >
          Upload Your Documents
        </h6>
        <div style={{ height: "100%" }}>
          <div style={{ height: "100%" }}>
            <div className="row gap-4">
              <div className="col-12">
                <label>Document Title</label>
                <input
                  required
                  className={`form-control  rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  placeholder="Please enter title of the document"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {files.length < 1 && (
              <div>
                <div
                  style={{ overflow: "hidden" }}
                  className={`my-2  position-relative rounded-2 d-flex ${
                    darkMode ? "bg-light" : "bg-dark"
                  }`}
                >
                  <DropArea
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{ cursor: "pointer" }}
                    className="mx-auto w-100 d-flex flex-column justify-content-center align-items-center"
                  >
                    <input
                      onChange={handleFileChange}
                      className="rounded-5 opacity-0"
                      style={{
                        minHeight: "100%",
                        minWidth: "100%",
                        position: "absolute",
                        cursor: "pointer",
                      }}
                      type="file"
                      id="fileInput"
                      name="fileInput"
                      accept=".pdf, .jpg, .jpeg, .png, .webp"
                      required
                    />
                    <FiUploadCloud
                      style={{ cursor: "pointer" }}
                      className="fs-1 text-primary"
                    />
                    <span
                      style={{ cursor: "pointer" }}
                      className="fw-bold text-primary"
                    >
                      Drag file or Select file{" "}
                    </span>
                  </DropArea>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  {" "}
                  <p>File Size : 200KB - 2MB</p>{" "}
                  <p>File Type : .pdf, .jpeg, .jpg, .png, .webp</p>
                </div>
              </div>
            )}
            {files.length > 0 && (
              <div className="my-2">
                <h6>Selected Files:</h6>
                <table className="table">
                  <thead>
                    <th className="py-2" style={rowHeadStyle(darkMode)}>
                      Name
                    </th>
                    <th className="py-2" style={rowHeadStyle(darkMode)}>
                      Size (in KB)
                    </th>
                    <th className="py-2" style={rowHeadStyle(darkMode)}>
                      Type
                    </th>
                    <th
                      className="py-2 text-end"
                      style={rowHeadStyle(darkMode)}
                    >
                      Action
                    </th>
                  </thead>
                  {files.map((file, index) => (
                    <tbody>
                      <tr key={index}>
                        <td style={rowBodyStyle(darkMode)}>{file.name}</td>
                        <td style={rowBodyStyle(darkMode)}>
                          {(file.size / 1024).toFixed(2)}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>{file.type} </td>
                        <td style={rowBodyStyle(darkMode)}>
                          <div className="d-flex align-items-center justify-content-end">
                            <button
                              type="button"
                              className="btn  p-2  btn-sm btn-danger"
                              onClick={() => removeFile(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
            )}

            {loading && (
              <div className="d-flex justify-content-center my-3">
                <ClipLoader
                  color={darkMode ? "#000" : "#fff"}
                  loading={loading}
                  size={35}
                />
              </div>
            )}
            <div className=" d-flex align-items-center gap-2 mt-3 mx-1 justify-content-between">
              {files.length > 0 &&
                (title === "" ? (
                  <button type="submit" className="btn btn-primary" disabled>
                    Submit
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center gap-3">
                        <span>Uploading</span>{" "}
                        <div class="spinner-border text-primary" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <span>Submit</span>
                    )}
                  </button>
                ))}
              <button
                type="reset"
                className="btn ms-auto btn-danger"
                onClick={props.onFormClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocumentUploadForm;
