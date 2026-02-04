import React, { useEffect, useState } from "react";
import { MdOutlineWorkHistory } from "react-icons/md";
import { FiCoffee } from "react-icons/fi";
import {
  IoLogInOutline,
  IoLogOutOutline,
  IoChevronForward,
} from "react-icons/io5";
import { PiOfficeChair } from "react-icons/pi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { useApiRefresh } from "../../../../Context/ApiRefreshContext/ApiRefreshContext";
import api from "../../../../Pages/config/api";
import { FaChevronRight } from "react-icons/fa";

const MyTodaysLoginData = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [empName, setEmpName] = useState(null);

  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();
  const { refresh } = useApiRefresh();
  const userType = userData?.Account;

  const paths = {
    1: "/admin/todaysAttendance",
    2: "/hr/my-attendance",
    3: "/employee/MyAttendance",
    4: "/manager/myAttendance",
  };

  const colors = {
    bg: darkMode ? "#ffffff" : "#171717",
    border: darkMode ? "#e5e7eb" : "#333333",
    text: darkMode ? "#111827" : "#e5e7eb",
    muted: darkMode ? "#6b7280" : "#9ca3af",
    subtleBg: darkMode ? "#f9fafb" : "#1f1f1f",
    cardHover: darkMode ? "#f3f4f6" : "#2d2d2d",
    contentBg: darkMode ? "#f1f5f9" : "#252525",
  };

  useEffect(() => {
    api
      .get(`/api/mytodaylogs`)
      .then((res) => {
        const att = res.data;
        setAttendanceData({
          loginTime: att?.loginTime || "—",
          logoutTime: att?.logoutTime || "—",
          totalBrake: att?.totalBrake || 0,
          totalLoginTime: att?.totalLoginTime || 0,
          status: att?.status || "--",
        });
      })
      .catch((err) => {
        console.error("Attendance fetch failed:", err);
        setAttendanceData(null);
      });
  }, [refresh]);

  const convertMinutesToHoursAndMinutes = (minutes) => {
    const safe = Math.max(0, minutes || 0);
    const hours = Math.floor(safe / 60);
    const mins = safe % 60;
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  };

  const getStatVariant = (title) => {
    if (title.includes("login")) return "success";
    if (title.includes("logout")) return "danger";
    if (title.includes("break")) return "warning";
    return "primary";
  };

  const labelData = [
    {
      icon: <IoLogInOutline size={20} />,
      title: "Today's login time",
      data: attendanceData?.loginTime || "—",
    },
    {
      icon: <IoLogOutOutline size={20} />,
      title: "Today's logout time",
      data: attendanceData?.logoutTime || "—",
    },
    {
      icon: <FiCoffee size={20} />,
      title: "Total break taken",
      data: convertMinutesToHoursAndMinutes(attendanceData?.totalBrake),
    },
    {
      icon: <MdOutlineWorkHistory size={20} />,
      title: "Total login time",
      data: convertMinutesToHoursAndMinutes(attendanceData?.totalLoginTime),
    },
  ];

  if (!attendanceData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center rounded-3 shadow-sm"
        style={{
          height: "18rem",
          background: !darkMode ? "#171717" : "#ffffff",
          border: !darkMode
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "18rem",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        color: colors.text,
        overflow: "hidden",
        boxShadow: darkMode
          ? "0 2px 6px rgba(0,0,0,0.08)"
          : "0 2px 8px rgba(0,0,0,0.14)",
        transition: "all 0.22s ease",
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PiOfficeChair size={20} color={colors.muted} />
          <div>
            <span style={{ fontSize: "15.5px", fontWeight: 600 }}>
              Todays Attendance Logs
            </span>
            {empName && (
              <div
                className="small text-opacity-75"
                style={{ fontSize: "0.78rem" }}
              >
                Hi, {empName}
              </div>
            )}
          </div>
        </div>

        {userType && paths[userType] && (
          <Link
            to={paths[userType]}
            style={{
              color: colors.muted,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "14px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            View <FaChevronRight size={14} />
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="flex-grow-1 px-2 pb-1">
        <div className="row g-4 p-2 h-100">
          {labelData.map((item, index) => {
            const variant = getStatVariant(item.title);
            return (
              <div key={index} className="col-6">
                <div
                  style={{ background: !darkMode ? "#2e2929" : "#f2eaea6c" }}
                  className={` d-flex
                    h-100 p-3 rounded-3
                    bg-opacity-80
                    dark:bg-dark dark:bg-opacity-65
                  
                    d-flex align-items-center mt-2 justify-content-between
                  `}
                >
                  <div>
                    <div
                      className={`fw-bold text-${variant}`}
                      style={{ fontSize: "1.25rem", lineHeight: "1.2" }}
                    >
                      {item.data}
                    </div>
                    <div
                      className="text-secondary"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {item.title}
                    </div>
                  </div>

                  <div
                    className={`align-self-end rounded-circle d-flex align-items-center justify-content-center bg-${variant}-subtle`}
                    style={{ width: "38px", height: "38px" }}
                  >
                    <span className={`text-${variant}`}>{item.icon}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyTodaysLoginData;
