import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { AiOutlineUser } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../Pages/config/api";
import MessagePlaceholder from "../../img/Report/noreportPlaceHolder.svg";
import { FaChevronRight } from "react-icons/fa";

/* ============================
   MAIN COMPONENT
============================ */

const EmployeeStatus = () => {
  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);
  const userType = userData?.Account;

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("absent");

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const res = await api.get("/api/dashboard-attendance");
        setAttendanceData(res.data || []);
      } catch (err) {
        console.error("Attendance fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
    const interval = setInterval(loadAttendance, 60000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- HELPERS ---------------- */

  const getMinutes = (time) => {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const getPrimaryStatus = (emp) => {
    const attn = emp.attendance || {};

    if (!attn.loginTime?.[0]) return "absent";
    if (attn.status?.toLowerCase() === "break") return "break";

    const startTime = attn.shifts?.startTime;
    const loginTime = attn.loginTime?.[0];

    if (startTime && loginTime) {
      if (getMinutes(loginTime) > getMinutes(startTime) + 15) {
        return "halfday";
      }
    }

    return "present";
  };

  /* ---------------- GROUP DATA ---------------- */

  const groupedData = useMemo(() => {
    const groups = {
      absent: [],
      halfday: [],
      break: [],
      present: [],
    };

    attendanceData.forEach((emp) => {
      const status = getPrimaryStatus(emp);
      groups[status].push(emp);
    });

    return groups;
  }, [attendanceData]);

  const tabs = [
    { id: "absent", title: "Absent", color: "#dc2626" },
    { id: "halfday", title: "Half Day", color: "#d97706" },
    { id: "break", title: "On Break", color: "#059669" },
    { id: "present", title: "Present", color: "#16a34a" },
  ];

  const colors = {
    bg: darkMode ? "#ffffff" : "#171717",
    card: darkMode ? "#ffffff" : "#1f1f1f",
    subtleBg: darkMode ? "#f9fafb" : "#262626",
    border: darkMode ? "#e5e7eb" : "#333333",
    text: darkMode ? "#111827" : "#e5e7eb",
    muted: darkMode ? "#6b7280" : "#9ca3af",
  };

  return (
    <div
      style={{
        height: "37rem",
        background: colors.bg,
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${colors.border}`,
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AiOutlineUser size={20} color={colors.muted} />
          <span style={{ fontSize: "15.5px", fontWeight: 600, color: colors.text }}>
            Employee Status
          </span>
        </div>

        <Link
          to={
            userType === 1
              ? "/admin/todaysAttendance"
              : userType === 2
                ? "/hr/todaysAttendance"
                : "/manager/todaysAttendance"
          }
          style={{
            color: colors.muted,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          View Board <FaChevronRight size={14} />
        </Link>
      </div>

      {/* TABS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          padding: "12px",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px",
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                background: isActive ? `${tab.color}15` : colors.card,
                color: isActive ? tab.color : colors.text,
                fontWeight: isActive ? 600 : 500,
                fontSize: 13,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span>{tab.title}</span>
              <span
                style={{
                  background: tab.color,
                  color: "#fff",
                  fontSize: 11,
                  padding: "2px 10px",
                  borderRadius: 12,
                }}
              >
                {groupedData[tab.id].length}
              </span>
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 12 }}>
        <StatusColumn
          title={tabs.find((t) => t.id === activeTab)?.title}
          color={tabs.find((t) => t.id === activeTab)?.color}
          data={groupedData[activeTab]}
          loading={loading}
          colors={colors}
          type={activeTab}
        />
      </div>
    </div>
  );
};

export default EmployeeStatus;

/* ============================
   STATUS COLUMN
============================ */

const StatusColumn = ({ title, color, data, loading, colors, type }) => (
  <div
    style={{
      background: colors.card,
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      style={{
        padding: "12px 16px",
        borderBottom: `1px solid ${colors.border}`,
        background: `${color}12`,
        color:`${colors.text}`,
        fontWeight: 600,
      }}
    >
      {title} ({data.length})
    </div>

    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "8px 4px",
      }}
    >
      {loading ? (
        <div className="text-center py-5" style={{ color: colors.muted }}>
          Loading employee status...
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-5">
          <img src={MessagePlaceholder} height={70} alt="No data" />
          <div className="mt-3" style={{ color: colors.muted }}>
            No {title?.toLowerCase()} employees today
          </div>
        </div>
      ) : (
        data.map((emp) => (
          <EmployeeCard
            key={emp.userId}
            emp={emp}
            type={type}
            colors={colors}
          />
        ))
      )}
    </div>
  </div>
);

/* ============================
   EMPLOYEE CARD
============================ */

const EmployeeCard = ({ emp, type, colors }) => {
  const badgeMap = {
    absent: "#dc2626",
    halfday: "#d97706",
    break: "#059669",
    present: "#16a34a",
  };

  return (
    <div
      style={{
        margin: "6px 8px",
        padding: "10px 12px",
        borderRadius: 10,
        background: colors.subtleBg,
        border: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: `${colors.bg}`,
          color: `${colors.text}`,
          border: `2px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {emp.FirstName?.[0]}
        {emp.LastName?.[0]}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: `${colors.text}` }}>
          {emp.FirstName} {emp.LastName}
        </div>
        <div style={{ fontSize: 12, color: colors.muted }}>
          {emp.department?.[0]?.DepartmentName || "Department N/A"}
        </div>
      </div>

      <span
        style={{
          background: badgeMap[type],
          color: "#fff",
          fontSize: 11,
          padding: "4px 12px",
          borderRadius: 20,
          textTransform: "capitalize",
        }}
      >
        {type}
      </span>
    </div>
  );
};
