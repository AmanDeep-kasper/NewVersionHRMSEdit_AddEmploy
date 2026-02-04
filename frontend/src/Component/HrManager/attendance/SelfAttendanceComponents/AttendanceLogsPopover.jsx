import React, { useState } from "react";
import { rowBodyStyle, rowHeadStyle } from "../../../../Style/TableStyle";
import { Card } from "react-bootstrap";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CgEye } from "react-icons/cg";

const AttendanceLogsPopover = ({ date, darkMode, convertMinutesToHMS }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  const loginTimes = Array.isArray(date?.loginTime) ? date.loginTime : [];
  const logoutTimes = Array.isArray(date?.logoutTime) ? date.logoutTime : [];
  const logData = Array.isArray(date?.LogData) ? date.LogData : [];

  // If weekoff, holiday, leave, absent → show --
  const isSpecialDay =
    ["WO", "HD", "LV"].includes(date?.status) ||
    date?.isOnLeave ||
    date?.isNCNS ||
    date?.isForcedAbsent ||
    date?.isSandwhich;

  if (
    isSpecialDay ||
    !loginTimes.length ||
    (loginTimes.length === 1 && loginTimes[0] === "00:00")
  ) {
    return <span>--</span>;
  }

  // ✅ TOTAL LOGIN (minutes)
  const totalLoginMinutes = logData.reduce(
    (sum, val) => sum + (Number(val) || 0),
    0,
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* CLICK TO OPEN */}
      <span style={{ cursor: "pointer" }} onClick={() => setIsOpen(true)}>
        {loginTimes.length} <CgEye />
      </span>

      {isOpen && (
        <div
          className="attendance-popover-backdrop"
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1050,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.4)",
            padding: "1rem",
          }}
        >
          <Card
            className="m-0 p-0"
            style={{ overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card.Header
              className={`d-flex justify-content-between align-items-center fw-bold ${
                darkMode ? "bg-light text-dark" : "bg-dark text-light"
              }`}
            >
              <span>Attendance Logs</span>
              <IoIosCloseCircleOutline
                style={{ fontSize: "1.2rem", cursor: "pointer" }}
                onClick={handleClose}
                title="Close"
              />
            </Card.Header>

            <Card.Body className="p-0">
              <div
                className="table-responsive"
                style={{
                  minWidth: "350px",
                  maxWidth: "90vw",
                  maxHeight: "50vh",
                  overflowY: "auto",
                }}
              >
                <table className="table table-bordered table-striped m-0">
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      background: darkMode ? "#343a40" : "#f8f9fa",
                    }}
                  >
                    <tr>
                      <th
                        style={rowHeadStyle(darkMode)}
                        className="text-center"
                      >
                        Login
                      </th>
                      <th
                        style={rowHeadStyle(darkMode)}
                        className="text-center"
                      >
                        Logout
                      </th>
                      <th
                        style={rowHeadStyle(darkMode)}
                        className="text-center"
                      >
                        Total Login
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loginTimes.map((loginTime, index) => (
                      <tr key={index}>
                        <td
                          style={rowBodyStyle(darkMode)}
                          className="text-center"
                        >
                          {loginTime || "--"}
                        </td>
                        <td
                          style={rowBodyStyle(darkMode)}
                          className="text-center"
                        >
                          {logoutTimes[index] || "--"}
                        </td>
                        <td
                          style={rowBodyStyle(darkMode)}
                          className="text-center"
                        >
                          {logData[index]
                            ? convertMinutesToHMS(logData[index])
                            : "0 Hrs 0 Min"}
                        </td>
                      </tr>
                    ))}

                    {/* ✅ TOTAL ROW */}
                    <tr>
                      <td colSpan={2} className="text-end fw-bold">
                        Total Login
                      </td>
                      <td className="text-center fw-bold text-success">
                        {convertMinutesToHMS(totalLoginMinutes)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AttendanceLogsPopover;
