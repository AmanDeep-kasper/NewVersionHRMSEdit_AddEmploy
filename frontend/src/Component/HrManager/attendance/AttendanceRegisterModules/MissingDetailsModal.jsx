import React from "react";
import PropTypes from "prop-types";
import { rowBodyStyle, rowHeadStyle } from "../../../../Style/TableStyle";

const MissingDetailsModal = ({ missingDetails, setMissingDetails, darkMode }) => (
  <div
    style={{
      position: "absolute",
      top: "25%",
      left: "50%",
      zIndex: "1000",
      transform: "translate(-50%)",
    }}
    className="alert alert-warning mt-3"
  >
    <h5>Missing Employee Details</h5>
    <p>The following employees are missing required details:</p>
    <div
      style={{
        height: "fit-content",
        maxHeight: "60vh",
        overflow: "auto",
        position: "relative",
        border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
      }}
      className="scroller mb-2 rounded-2"
    >
      <table className="table table-bordered table-hover mb-0">
        <thead>
          <tr>
            <th style={rowHeadStyle(darkMode)}>#</th>
            <th style={rowHeadStyle(darkMode)}>Employee Name</th>
            <th style={rowHeadStyle(darkMode)}>Employee ID</th>
            <th style={rowHeadStyle(darkMode)}>Missing Fields</th>
          </tr>
        </thead>
        <tbody>
          {missingDetails.map((emp, index) => (
            <tr key={index}>
              <td style={rowBodyStyle(darkMode)}>
                {(index + 1).toString().padStart(2, 0)}
              </td>
              <td style={rowBodyStyle(darkMode)} className="text-capitalize">
                {emp.name}
              </td>
              <td style={rowBodyStyle(darkMode)}>{emp.id}</td>
              <td style={rowBodyStyle(darkMode)} className="text-danger">
                {emp.missing}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <button
      className="btn btn-success"
      onClick={() => setMissingDetails([])}
    >
      Okay I Understand
    </button>
  </div>
);

MissingDetailsModal.propTypes = {
  missingDetails: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      missing: PropTypes.string,
    })
  ).isRequired,
  setMissingDetails: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default MissingDetailsModal;