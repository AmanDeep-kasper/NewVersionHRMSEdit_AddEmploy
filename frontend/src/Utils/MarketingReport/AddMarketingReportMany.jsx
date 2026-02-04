import React, { useState } from "react";
import DataTable from "react-data-table-component";
import Papa from "papaparse";
import { rowHeadStyle } from "../../Style/TableStyle";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import BASE_URL from "../../Pages/config/config";
import toast from "react-hot-toast";
import { FaRegPaste } from "react-icons/fa6";
import FormatfilePath from "../../Files/ReportFormat.xlsx";
import { MdOutlineFileDownload } from "react-icons/md";
import { PiMicrosoftExcelLogoLight } from "react-icons/pi";
import api from "../../Pages/config/api";

const AddMarketingReportMany = ({ onClick }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);

  const UserID = userData._id;

  const customStyles = (darkMode) => ({
    headCells: {
      style: {
        fontWeight: "bold",
        textTransform: "uppercase",
        paddingTop: ".2rem",
        paddingBottom: ".2rem",
        whiteSpace: "pre",
        ...rowHeadStyle(darkMode),
      },
    },
  });

  const expectedHeaders = [
    "datePosted",
    "domain",
    "liveUrl",
    "anchorTag",
    "title",
    "description",
    "targetedPage",
    "da",
    "pa",
    "ss",
    "backLinkType",
    "statusType",
    "remarks",
  ];

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("Text");

    const parsedData = Papa.parse(pastedData, {
      delimiter: "\t",
      skipEmptyLines: true,
    });

    if (parsedData && parsedData.data.length > 0) {
      const [headerRow, ...rows] = parsedData.data;

      const formattedData = rows.map((row) => {
        const rowObject = {};
        expectedHeaders.forEach((header, index) => {
          rowObject[header] = row[index] || "";
        });
        rowObject["user"] = UserID;
        return rowObject;
      });

      setTableData(formattedData);

      const cols = expectedHeaders.map((header) => ({
        name: header,
        selector: (row) => {
          if (header === "datePosted" && row[header]) {
            const formattedDate = new Date(row[header]).toLocaleDateString();
            return formattedDate;
          }
          return row[header] || "";
        },
        sortable: true,
      }));
      setColumns(cols);
    } else {
      toast.error("Invalid or empty data pasted. Please check your input.");
    }
  };

 const handleUpload = async () => {
  try {

    const response = await api.get(`/api/marketingReports/uploadMany`, {
      method: "POST",
      body: JSON.stringify({
        data: tableData, // Send as objects
      }),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("Data uploaded successfully!");
      setTableData([]);
    } else {
      toast.error(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error uploading data:", error);
    toast.error("Failed to upload data");
  }
};

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center gap-2">
        {tableData.length > 0 && (
          <button className="btn btn-primary" onClick={handleUpload}>
            Upload to Database
          </button>
        )}
        <button
          style={{ width: "fit-content" }}
          className="btn mx-3 px-4 btn-danger"
          onClick={onClick}
        >
          Cancel ( Esc Key)
        </button>
        <a
          target="_blank"
          download={true}
          href={FormatfilePath}
          className="btn btn-success d-flex align-items-center gap-2"
        >
          <span className="d-flex align-items-center">
            <PiMicrosoftExcelLogoLight className="fs-5" /> Format
          </span>
          <MdOutlineFileDownload className="fs-5" />
        </a>
      </div>
      <div
        className={`${
          darkMode ? "bg-light text-dark border" : "bg-dark text-light border-0"
        }`}
        onPaste={handlePaste}
        style={{
          border: "1px dashed #ccc",
          marginTop: "20px",
          textAlign: "center",
          borderRadius: "10px",
          cursor: "crosshair",
        }}
      >
        {tableData.length <= 0 && (
          <div style={{ position: "relative" }} className="py-5">
            <h5 style={{ fontWeight: "normal" }}>Paste your excel data here</h5>
            <FaRegPaste className="fs-2 my-2" />
            <p
              style={{ position: "absolute", bottom: "-.5rem", left: "1rem" }}
              className="text-danger "
            >
              Date should be in (MM-DD-YYYY) format in your excel file
            </p>
          </div>
        )}
      </div>
      <div>
        {tableData.length <= 0 && (
          <div className="py-3">
            <p className="text-danger text-center fw-bold">
              Data Must be pasted in this format only{" "}
              <sup className="text-danger">*</sup>
            </p>
            <div style={{ maxWidth: "100%", overflow: "auto" }}>
              <table className="table">
                <thead>
                  <tr style={rowHeadStyle(darkMode)}>
                    <th style={rowHeadStyle(darkMode)}>Posted Date</th>
                    <th style={rowHeadStyle(darkMode)}>Domain</th>
                    <th style={rowHeadStyle(darkMode)}>Live URL</th>
                    <th style={rowHeadStyle(darkMode)}>Anchor Tag</th>
                    <th style={rowHeadStyle(darkMode)}>Title</th>
                    <th style={rowHeadStyle(darkMode)}>Description</th>
                    <th style={rowHeadStyle(darkMode)}>Targeted Page</th>
                    <th style={rowHeadStyle(darkMode)}>DA</th>
                    <th style={rowHeadStyle(darkMode)}>PA</th>
                    <th style={rowHeadStyle(darkMode)}>SS</th>
                    <th style={rowHeadStyle(darkMode)}>Backlink Type</th>
                    <th style={rowHeadStyle(darkMode)}>Status Type</th>
                    <th style={rowHeadStyle(darkMode)}>Remarks</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        )}

        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            height: "60vh",
            border: "1px solid rgba(0,0,0,.1)",
          }}
        >
          {tableData.length > 0 ? (
            <DataTable
              columns={columns}
              data={tableData.map((row, index) => ({
                id: index + 1,
                ...row,
              }))}
              pagination
              highlightOnHover
              customStyles={customStyles(darkMode)}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "30vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: darkMode ? "black" : "white",
              }}
            >
              <p style={{ color: "#888" }}>No data pasted yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMarketingReportMany;
