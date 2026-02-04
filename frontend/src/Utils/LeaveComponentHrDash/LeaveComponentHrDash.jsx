import React, { useEffect, useState } from "react";
import { IoCalendarClearOutline } from "react-icons/io5";
import { CgArrowLongRightC } from "react-icons/cg";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../Pages/config/api";
import { getFormattedDateWTY } from "../GetDayFormatted";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const LeaveComponentHrDash = () => {
  const [latestLeaves, setLatestLeaves] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);

  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);

  const paths = {
    1: "/admin/leaveApplication",
    2: "/hr/leaveApplication",
    3: "/manager/leaveApplication",
  };

  useEffect(() => {
    api
      .get("/api/leave-application-hr/dashboard")
      .then((res) => {
        setLatestLeaves(res.data.latestLeaves || []);
        setPendingCount(res.data.pendingLeaves || 0);
        setUpcomingCount(res.data.upcomingLeaves || 0);
        setWeeklyCount(res.data.weeklyLeaves || 0);
      })
      .catch(console.error);
  }, []);

  const totalActive = pendingCount + upcomingCount;
  const gaugeOffset =
    totalActive === 0 ? 125.6 : 125.6 - (125.6 * pendingCount) / totalActive;

  const colors = {
    bg: darkMode ? "#ffffff" : "#171717",
    border: darkMode ? "#e5e7eb" : "#333333",
    text: darkMode ? "#111827" : "#e5e7eb",
    muted: darkMode ? "#6b7280" : "#9ca3af",
    subtleBg: darkMode ? "#f9fafb" : "#1f1f1f",
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        height: "18rem",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        color: colors.text,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: colors.subtleBg,
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <IoCalendarClearOutline size={18} color={colors.muted} />
          <span style={{ fontWeight: 600 }}>Employee Leave Overview</span>
        </div>

        <Link
          to={paths[userData?.Account]}
          className="d-flex align-items-center gap-1 text-decoration-none"
          style={{ color: colors.muted, fontSize: "14px" }}
        >
          View <FaChevronRight size={12} />
        </Link>
      </div>

      {/* Metrics Section */}
      <div className="d-flex px-3 py-2 gap-3">
        {/* Gauge */}
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ width: "45%" }}
        >
          <svg viewBox="0 0 100 50" style={{ width: "100%", height:'100px' }}>
            {/* Background arc */}
            <path
              d="M 10,50 A 40,40 0 1,1 90,50"
              stroke={darkMode ? "#897e827b" : "#92a1c1"}
              strokeWidth="10"
              fill="none"
            />

            {/* Active arc */}
            <path
              d="M 10,50 A 40,40 0 1,1 90,50"
              stroke="#3b82f6"
              strokeWidth="10"
              fill="none"
              strokeDasharray="125.6"
              strokeDashoffset={gaugeOffset}
              strokeLinecap="round" // ✅ smoother look
            />
          </svg>

          <div className="text-center mt-n5">
            <div style={{ fontSize: "22px", fontWeight: 700 }}>
              {totalActive}
            </div>
            <div style={{ fontSize: "11px", color: colors.muted }}>
              ACTIVE LEAVES
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="d-flex flex-column justify-content-center gap-2 w-100">
          <div className="d-flex justify-content-between">
            <span className="fw-semibold">Pending</span>
            <span>{pendingCount}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="fw-semibold">Upcoming</span>
            <span>{upcomingCount}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="fw-semibold">This Week</span>
            <span>{weeklyCount}</span>
          </div>
        </div>
      </div>

      {/* Leave List */}
      <div className="px-3 pb-2" style={{ overflowY: "auto" }}>
        {latestLeaves.length ? (
          latestLeaves.map((leave) => (
            <div
              key={leave._id}
              className="d-flex justify-content-between align-items-start mb-2 p-2 rounded"
              style={{
                background: colors.subtleBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div>
                <div
                  className="d-flex align-items-center gap-1 text-muted"
                  style={{ fontSize: "12px" }}
                >
                  {getFormattedDateWTY(leave.FromDate)}
                  <CgArrowLongRightC />
                  {getFormattedDateWTY(leave.ToDate)}
                </div>
                <div style={{ fontWeight: 600 }}>{leave.employeeName}</div>
              </div>

              <div className="d-flex flex-column gap-1 align-items-end">
                <span
                  className="badge"
                  style={{
                    background: leave.Leavetype.includes("Paid")
                      ? "#dbeafe"
                      : "#fee2e2",
                    color: leave.Leavetype.includes("Paid")
                      ? "#1e40af"
                      : "#991b1b",
                  }}
                >
                  {leave.Leavetype.replace(" Leave", "")}
                </span>

                <span
                  className="badge"
                  style={{
                    background: leave.Status === "1" ? "#fef3c7" : "#dcfce7",
                    color: leave.Status === "1" ? "#92400e" : "#166534",
                  }}
                >
                  {leave.Status === "1" ? "Pending" : "Approved"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div
            className="text-center  mt-2 rounded"
            style={{
              background: colors.subtleBg,
              color: colors.muted,
              border: `1px dashed ${colors.border}`,
              padding:'1.3rem 1rem '
            }}
          >
            No Pending or Upcoming Leave Requests
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveComponentHrDash;
