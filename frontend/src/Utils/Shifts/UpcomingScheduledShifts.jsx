import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Spinner, Alert } from "react-bootstrap";
import BASE_URL from "../../Pages/config/config";
import toast from "react-hot-toast";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import Styles from "../../Style/Scroller.module.css";
import api from "../../Pages/config/api";

const UpcomingScheduledShifts = () => {
  const [scheduledShifts, setScheduledShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

useEffect(() => {
  // ✅ Fetch Scheduled Shift Updates
  const fetchScheduledShifts = async () => {
    try {
      const res = await api.get(
        `/api/employees/scheduled-shifts`,
      );
      setScheduledShifts(res.data);
    } catch (error) {
      toast.error("Error fetching scheduled shifts");
      console.error("❌ Error fetching scheduled shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchScheduledShifts();
}, []);

  return (
    <div className="container-fluid">
      <div className="mb-3">
      <TittleHeader
        title="Upcoming Scheduled Shifts"
        message={"You can view upcoming scheduled shifts"}
      />
      </div>

      {loading ? (
        <div className="text-center mt-3">
          <Spinner animation="border" />
        </div>
      ) : scheduledShifts.length === 0 ? (
        <Alert variant="info" className="mt-3">
          No upcoming shift updates scheduled.
        </Alert>
      ) : (
        <div
          style={{
            height: "fit-content",
            maxHeight: "75vh",
            overflow: "auto",
            position: "relative",
            border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
          }}
          className={`rounded-2 ${Styles.scroller}`}
        >
          <table className="table">
            <thead>
              <tr>
                <th style={rowHeadStyle(darkMode)}>#</th>
                <th style={rowHeadStyle(darkMode)}>Employee</th>
                <th style={rowHeadStyle(darkMode)}>New Shift</th>
                <th style={rowHeadStyle(darkMode)}>Effective Date</th>
              </tr>
            </thead>
            <tbody>
  {scheduledShifts
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort(
      (a, b) =>
        new Date(a?.scheduledShiftChange?.effectiveDate || 0) -
        new Date(b?.scheduledShiftChange?.effectiveDate || 0)
    )
    .map((shift, index) => (
      <tr key={shift._id}>
        <td style={rowBodyStyle(darkMode)}>{index + 1}</td>
        <td style={rowBodyStyle(darkMode)}>
          {shift?.FirstName || "N/A"} {shift?.LastName || ""}
        </td>
        <td style={rowBodyStyle(darkMode)}>
          {shift?.scheduledShiftChange?.shift?.name || "N/A"} (
          {shift?.scheduledShiftChange?.shift?.startTime || "N/A"} -{" "}
          {shift?.scheduledShiftChange?.shift?.endTime || "N/A"})
        </td>
        <td style={rowBodyStyle(darkMode)}>
          {shift?.scheduledShiftChange?.effectiveDate
            ? new Date(shift.scheduledShiftChange.effectiveDate).toLocaleDateString()
            : "N/A"}
        </td>
      </tr>
    ))}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpcomingScheduledShifts;
