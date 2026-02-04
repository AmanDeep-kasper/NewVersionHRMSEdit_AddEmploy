
import React, { useState } from "react";
import { rowBodyStyle, rowHeadStyle } from "../../../../Style/TableStyle";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Card } from "react-bootstrap";
import { CgEye } from "react-icons/cg";

// Props: date (attendance object for a specific date), darkMode, convertMinutesToHMS
const BreakLogsPopover = ({ date, darkMode, convertMinutesToHMS }) => {
  const [isHovering, setIsHovering] = useState(false);
  const handleClose = () => setIsHovering(false);

  // Robustly handle arrays to prevent React errors
  const breakTimes = Array.isArray(date?.breakTime) ? date.breakTime : [];
  const resumeTimes = Array.isArray(date?.resumeTime) ? date.resumeTime : [];
  // Calculate total break duration in seconds
  function getSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== "string") return 0;
    const [hh, mm, ss] = timeStr.split(":").map(Number);
    return (hh || 0) * 3600 + (mm || 0) * 60 + (ss || 0);
  }

  let totalBreakSeconds = 0;
  for (let i = 0; i < breakTimes.length; i++) {
    if (breakTimes[i] && resumeTimes[i]) {
      totalBreakSeconds += getSeconds(resumeTimes[i]) - getSeconds(breakTimes[i]);
    }
  }

  // If weekoff, holiday, leave, or absent, show --
  const isSpecialDay = ["WO", "HD", "LV"].includes(date?.status) || date?.isOnLeave || date?.isNCNS || date?.isForcedAbsent || date?.isSandwhich;
  if (isSpecialDay || !breakTimes.length || (breakTimes.length === 1 && breakTimes[0] === "00:00")) {
    return <span>--</span>;
  }

  // Format total break as hh:mm:ss
  function formatSecondsToHMS(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return (
      <div style={{ position: "relative", display: "inline-block" }}>
    <span
      style={{cursor:'pointer'}}
      onClick={() => setIsHovering(true)}
    >
      {breakTimes.length} <CgEye/>
    </span>
          {isHovering && (
            <div
              className="attendance-popover-backdrop"
              onMouseLeave={handleClose}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: "1050",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
                background: "rgba(0, 0, 0, 0.4)",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
              }}
            >
              <Card className="m-0 p-0"
                style={{
                  overflowY: "auto",
                }}>
                <Card.Header
                  className={`d-flex justify-content-between align-items-center fw-bold ${darkMode ? "bg-light text-dark" : "bg-dark text-light"
                    }`}
                >
                  <span>Breaks Logs</span>
                  <IoIosCloseCircleOutline className="bi bi-x-lg "
                    style={{ fontSize: "1.2rem" }}
                    onClick={handleClose}
                    title="Close" />
                </Card.Header>
    
                <Card.Body className="p-0"
    
                >
                  <div
                    className="table-responsive"
                    style={{
                      minWidth: "350px",
                      maxWidth: "90vw",
                      maxHeight: "50vh",
                      overflowY: "auto",
                    }}
                    onMouseEnter={e => e.stopPropagation()}
    
                  >
                    {/* <table className="table table-bordered table-striped m-0"> */}
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
                          <th style={rowHeadStyle(darkMode)} className="text-center">
                            Break Time
                          </th>
                          <th style={rowHeadStyle(darkMode)} className="text-center">
                            Resume Time
                          </th>
                          <th style={rowHeadStyle(darkMode)} className="text-center">
                            Total Break
                          </th>
                        </tr>
                      </thead>
                                    <tbody>
                {breakTimes.map((breakTime, index) => (
                  <tr key={index}>
                    <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
                      {breakTime ? breakTime : "--"}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
                      {resumeTimes[index] ? resumeTimes[index] : "--"}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
                      {(breakTime && resumeTimes[index])
                        ? formatSecondsToHMS(getSeconds(resumeTimes[index]) - getSeconds(breakTime))
                        : "--"}
                    </td>
                  </tr>
                ))}
                {/* Show total break at the bottom */}
                <tr>
                  <td colSpan={2} className="text-end fw-bold">Total Break</td>
                  <td className="text-center fw-bold text-success">{formatSecondsToHMS(totalBreakSeconds)}</td>
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


export default BreakLogsPopover;
