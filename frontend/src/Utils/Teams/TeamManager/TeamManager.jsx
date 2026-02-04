import React, { useEffect, useState } from "react";
import api from "../../../Pages/config/api";
import { useSelector } from "react-redux";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { AiOutlineTeam } from "react-icons/ai";
import { FaChevronRight, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import NoTeam from "../../../img/Team/NoTeam.svg";

const TeamManager = () => {
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const reportingManager = userData?.Email;
  const userType = userData?.Account;
  const myId = userData?._id;

  useEffect(() => {
    api
      .get("/api/today-team")
      .then((res) => setTeam(res.data || []))
      .catch((err) => console.error("Failed to load team:", err))
      .finally(() => setLoading(false));
  }, []);
  

  const myReportingManager = team.find((d) => d.userId === myId)?.reportManager;

  // Status styles – consistent across light/dark mode
  const statusConfig = {
    Present: {
      label: "Present",
      color: !darkMode ? "#34d399" : "#059669",
      bg: !darkMode ? "#064e3b40" : "#d1fae540",
    },
    Late: {
      label: "Late",
      color: !darkMode ? "#fbbf24" : "#d97706",
      bg: !darkMode ? "#78350f40" : "#fef3c740",
    },
    "Half Day": {
      label: "Half Day",
      color: !darkMode ? "#f59e0b" : "#c2410c",
      bg: !darkMode ? "#92400e40" : "#fef3c740",
    },
    Absent: {
      label: "Absent",
      color: !darkMode ? "#f87171" : "#dc2626",
      bg: !darkMode ? "#7f1d1d40" : "#fee2e240",
    },
  };

  const getAttendanceStatus = (loginTime, shifts, backendStatus) => {
    // Prefer backend-computed status when available and meaningful
    if (backendStatus && backendStatus !== "--" && backendStatus !== "logout") {
      const normalized =
        backendStatus.charAt(0).toUpperCase() +
        backendStatus.slice(1).toLowerCase();
      return statusConfig[normalized] || statusConfig.Absent;
    }

    // Fallback: calculate based on time
    if (!loginTime || !shifts?.startTime) {
      return statusConfig.Absent;
    }

    const shiftStart = new Date(`1970-01-01T${shifts.startTime}:00`);
    const login = new Date(`1970-01-01T${loginTime}`);

    const lateThreshold = new Date(shiftStart);
    lateThreshold.setMinutes(shiftStart.getMinutes() + 15);

    const halfDayThreshold = new Date(shiftStart);
    halfDayThreshold.setHours(shiftStart.getHours() + 7);

    if (login <= shiftStart) return statusConfig.Present;
    if (login <= lateThreshold) return statusConfig.Late;
    if (login <= halfDayThreshold) return statusConfig["Half Day"];
    return statusConfig.Absent;
  };

  const getMyTeam = () => {
    if ([1, 2].includes(userType)) return team.filter((t) => t.Account === 2);
    if (userType === 3)
      return team.filter((t) => t.reportManager === myReportingManager);
    if (userType === 4)
      return team.filter((t) => t.reportManager === reportingManager);
    return [];
  };

  const myTeam = getMyTeam();

  // Theme colors
  const colors = {
    bg: !darkMode ? "#1f1f1f" : "#ffffff",
    border: !darkMode ? "#333333" : "#e5e7eb",
    text: !darkMode ? "#e5e7eb" : "#1f2937",
    muted: !darkMode ? "#9ca3af" : "#6b7280",
    subtle: !darkMode ? "#252525" : "#f8fafc",
    hover: !darkMode ? "#2d2d2d" : "#f9fafb",
    shadow: !darkMode
      ? "0 2px 6px rgba(0,0,0,0.10)"
      : "0 2px 4px rgba(0,0,0,0.10)",
  };

  if (loading) {
    return (
      <div
        style={{
          height: "18rem",
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: colors.shadow,
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${colors.border}`,
            background: colors.subtle,
          }}
        >
          <div
            style={{
              height: 20,
              width: 140,
              background: colors.muted + "30",
              borderRadius: 6,
            }}
          />
        </div>
        <div
          style={{
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: colors.muted + "30",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: 16,
                    width: "65%",
                    background: colors.muted + "30",
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    height: 12,
                    width: "45%",
                    background: colors.muted + "20",
                    borderRadius: 6,
                  }}
                />
              </div>
              <div
                style={{
                  height: 28,
                  width: 90,
                  background: colors.muted + "30",
                  borderRadius: 999,
                }}
              />
            </div>
          ))}
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
        boxShadow: colors.shadow,
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
          background: colors.subtle,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AiOutlineTeam size={20} color={colors.muted} />
          <span style={{ fontSize: "15.5px", fontWeight: 600 }}>My Team</span>
          <span
            style={{
              fontSize: "12px",
              padding: "3px 9px",
              borderRadius: "999px",
              background: colors.muted + "22",
              color: colors.muted,
              fontWeight: 500,
            }}
          >
            {myTeam.length}
          </span>
        </div>

        <Link
          to="/manager/todaysAttendance"
          style={{
            color: colors.muted,
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: "13.5px",
            textDecoration: "none",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.text;
            e.currentTarget.style.transform = "translateX(2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.muted;
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          View All <FaChevronRight size={12} />
        </Link>
      </div>

      {/* Content */}
      <div style={{ height: "calc(100% - 54px)", overflowY: "auto" }}>
        {myTeam.length === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: colors.muted,
              gap: 16,
              padding: "0 32px",
              textAlign: "center",
            }}
          >
            <img
              src={NoTeam}
              alt="No team members"
              style={{
                height: 70,
                opacity: !darkMode ? 0.75 : 0.6,
                filter: !darkMode ? "brightness(0.9)" : "none",
              }}
            />
            <div>
              <div
                style={{ fontSize: "15px", fontWeight: 500, marginBottom: 6 }}
              >
                No Team Members Found
              </div>
              <div style={{ fontSize: "13px", maxWidth: "260px" }}>
                Your team members and their today's attendance status will
                appear here
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "2px 0" }}>
            {myTeam.map((emp) => {
              const status = getAttendanceStatus(
                emp.attendance?.loginTime,
                emp.attendance?.shifts,
                emp.attendance?.logStatus,
              );

              return (
                <div
                  key={emp.userId}
                  style={{
                    padding: "10px 18px",
                    borderBottom: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    transition: "background 0.18s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = colors.hover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Avatar + Info */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: colors.muted + "30",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: colors.muted,
                        flexShrink: 0,
                      }}
                    >
                      {emp.profile?.image_url ? (
                        <img
                          src={emp.profile.image_url}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        `${emp.FirstName?.[0] || ""}${emp.LastName?.[0] || ""}`
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "14.5px",
                          lineHeight: 1.2,
                        }}
                      >
                        {emp.FirstName} {emp.LastName}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: colors.muted,
                          lineHeight: 1.3,
                        }}
                      >
                        {emp.position.charAt(0).toUpperCase() +
                          emp.position.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Time + Shift Name */}
                  <div style={{ minWidth: 110, textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "13px",
                        color: colors.muted,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        justifyContent: "flex-end",
                      }}
                    >
                      <FaClock size={11} />
                      {emp.attendance?.loginTime?.slice(0, 5) || "—"}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: `${colors.muted}99`,
                        marginTop: 1,
                      }}
                    >
                      Shift :{emp.shift?.startTime || "—"}-{" "}
                      {emp.shift?.endTime || "—"}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{ minWidth: 95, textAlign: "right" }}>
                    <span
                      style={{
                        padding: "5px 11px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: status.bg,
                        color: status.color,
                        border: `1px solid ${status.color}40`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManager;
