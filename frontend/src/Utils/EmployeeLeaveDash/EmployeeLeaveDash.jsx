import React, { useEffect, useState } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchPersonalInfo } from "../../redux/slices/personalInfoSlice";
import { Link } from "react-router-dom";
import api from "../../Pages/config/api";
import LeavePlaceHolder from "../../img/Leave/LeavePlaceHolder.svg";
import { IoTimerOutline } from "react-icons/io5";
import { LuBaby } from "react-icons/lu";
import { BsCurrencyRupee } from "react-icons/bs";
import { LiaCapsulesSolid } from "react-icons/lia";
import { MdInfoOutline, MdOutlineSick } from "react-icons/md";
import {
  X,
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";


const EmployeeLeaveDash = () => {
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [pendingLeave, setPendingLeave] = useState([]);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);
  const { empData } = useSelector((state) => state.personalInfo);
  const dispatch = useDispatch();

  const employeeId = userData?._id;
  const gender = empData?.Gender;

  // Colors
  const colors = {
    bg: !darkMode ? "#1f1f1f" : "#ffffff",
    border: !darkMode ? "#333333" : "#e5e7eb",
    text: !darkMode ? "#e5e7eb" : "#1f2937",
    muted: !darkMode ? "#9ca3af" : "#6b7280",
    card: !darkMode ? "#252525" : "#f8fafc",
    cardHover: !darkMode ? "#2d2d2d" : "#f1f5f9",
    subtle: !darkMode ? "#171717" : "#f9fafb",
    primary: "#3b82f6",
    success: !darkMode ? "#34d399" : "#10b981",
    danger: !darkMode ? "#f87171" : "#ef4444",
  };

  const loadPendingLeaves = async () => {
    try {
      const res = await api.get("/api/getmyLeave");
      setPendingLeave(res.data);
    } catch (err) {
      console.error("Leave fetch failed:", err);
    }
  };
  

  useEffect(() => {
    loadPendingLeaves();
  }, []);

  console.log(pendingLeave);

  useEffect(() => {
    if (employeeId) dispatch(fetchPersonalInfo(employeeId));
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (!employeeId) return;

    api
      .post("/api/getLeave", { id: employeeId })
      .then((res) => {
        const formatted = res.data
          .map((item) => {
            const [typeKey, totalKey] = Object.keys(item);
            const leaveType = typeKey.replace(/([A-Z])/g, " $1").trim();

            return {
              leaveType,
              rawType: typeKey,
              balance: item[typeKey],
              total: item[totalKey],
              taken: item[totalKey] - item[typeKey],
            };
          })
          .filter((leave) => {
            const type = (leave.rawType || "").toLowerCase();

            // remove both maternity and paternity for all users
            if (type.includes("maternity")) return false;
            if (type.includes("paternity")) return false;

            return true;
          });


        setLeaveBalance(formatted);
      })
      .catch((err) => console.error("Leave fetch failed:", err));
  }, [employeeId, gender]);

 const getLeaveIcon = (type) => {
   const lower = type.toLowerCase();
   if (lower.includes("paid"))
     return { icon: BsCurrencyRupee, bg: "#dcfce7", color: "#16a34a" };
   if (lower.includes("casual"))
     return { icon: IoTimerOutline, bg: "#fee2e2", color: "#dc2626" };
   if (lower.includes("paternity"))
     return { icon: LuBaby, bg: "#dbeafe", color: "#2563eb" };
   if (lower.includes("maternity"))
     return { icon: LuBaby, bg: "#f3e8ff", color: "#7c3aed" };
   return { icon: LiaCapsulesSolid, bg: "#fef3c7", color: "#d97706" };
 };

 // New: Calculate days until fromDate
 const getDaysUntil = (fromDateStr) => {
   const today = new Date(); // current date ~ Jan 15, 2026
   const from = new Date(fromDateStr);
   const diffTime = from - today;
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   return diffDays;
 };
  // Filter only pending leaves (assuming status "1" = pending)
  const pendingLeaves = pendingLeave.filter((l) => l.status === "1");

  const hasPending = pendingLeaves.length > 0;

  const paths = {
    1: "/admin/todaysAttendance",
    2: "/hr/createLeave",
    3: "/employee/leaveApplication",
    4: "/manager/createLeave",
  };

  const userType = userData?.Account || 3;
  const applyLeavePath = paths[userType] || "/employee/leaveApplication";

  return (
    <div
      style={{
        height: "18rem",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        color: colors.text,
        overflow: "hidden",
        boxShadow: !darkMode
          ? "0 4px 12px rgba(0,0,0,0.18)"
          : "0 4px 12px rgba(0,0,0,0.08)",
        transition: "all 0.22s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: `1px solid ${colors.border}`,
          background: colors.subtle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        {showPendingModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "16px",
            }}
            onClick={() => setShowPendingModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: colors.card,
                borderRadius: "16px",
                width: "100%",
                maxWidth: "520px",
                maxHeight: "90vh",
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
                boxShadow: "0 30px 80px rgba(0,0,0,.35)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "18px 22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: `1px solid ${colors.border}`,
                  background: colors.subtle,
                }}
              >
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                  Pending Leave Requests
                </h3>

                <button
                  onClick={() => setShowPendingModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: colors.muted,
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
                {pendingLeaves.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: colors.muted,
                      padding: "60px 0",
                      fontSize: "15px",
                    }}
                  >
                    <CheckCircle2
                      size={40}
                      style={{ marginBottom: 12, opacity: 0.5 }}
                    />
                    <div>No pending leave requests</div>
                  </div>
                ) : (
                  pendingLeaves.map((leave) => {
                    const daysUntil = getDaysUntil(leave.fromDate);
                    const isSoon = daysUntil <= 7 && daysUntil > 0;
                    const isPast = daysUntil < 0;

                    const statusColor = isPast
                      ? colors.danger
                      : isSoon
                        ? colors.warning
                        : colors.primary;

                    return (
                      <div
                        key={leave.leaveId}
                        style={{
                          background: colors.subtle,
                          borderRadius: "14px",
                          padding: "16px",
                          marginBottom: "14px",
                          border: `1px solid ${colors.border}`,
                          transition: "0.25s",
                        }}
                      >
                        {/* Leave Type + Badge */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          <div style={{ fontSize: "15px", fontWeight: 600 }}>
                            {leave.leaveType}
                          </div>

                          <div
                            style={{
                              padding: "4px 10px",
                              fontSize: "12px",
                              borderRadius: "999px",
                              background: `${statusColor}22`,
                              color: statusColor,
                              fontWeight: 600,
                            }}
                          >
                            {isPast
                              ? "Expired"
                              : isSoon
                                ? "Urgent"
                                : "Upcoming"}
                          </div>
                        </div>

                        {/* Dates */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "12px",
                            fontSize: "13px",
                            color: colors.muted,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <CalendarDays size={16} />
                            <span>
                              {new Date(leave.fromDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}{" "}
                              –{" "}
                              {new Date(leave.toDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <Clock size={16} />
                            <span>
                              {new Date(leave.appliedOn).toLocaleDateString(
                                "en-IN",
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Warning */}
                        <div
                          style={{
                            marginTop: "12px",
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: statusColor,
                          }}
                        >
                          <AlertTriangle size={16} />
                          {isPast
                            ? `Started ${Math.abs(daysUntil)} days ago`
                            : isSoon
                              ? `Starts in ${daysUntil} day${
                                  daysUntil === 1 ? "" : "s"
                                }`
                              : `Starts in ${daysUntil} days`}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "16px 20px",
                  borderTop: `1px solid ${colors.border}`,
                  background: colors.subtle,
                  textAlign: "right",
                }}
              >
                <button
                  onClick={() => setShowPendingModal(false)}
                  style={{
                    padding: "10px 22px",
                    background: colors.primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MdOutlineSick size={20} color={colors.muted} />
          <span style={{ fontSize: "15.5px", fontWeight: 600 }}>
            Leave Balance
          </span>

          {leaveBalance.length > 0 && (
            <span
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "999px",
                background: colors.primary + "22",
                color: colors.primary,
                fontWeight: 500,
              }}
            >
              {leaveBalance.length}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Pending Alert Button */}
          {hasPending && (
            <button
              onClick={() => setShowPendingModal(true)}
              style={{
                position: "relative",
                background: colors.warning + "33",
                color: colors.warning,
                border: `1px solid ${colors.warning + "88"}`,
                borderRadius: "10px",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <MdInfoOutline size={16} />
              {pendingLeaves.length} Pending
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 18,
                  height: 18,
                  background: colors.danger,
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "11px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {pendingLeaves.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          height: "calc(100% - 54px)",
          overflowY: "auto",
          padding: "12px 16px",
        }}
      >
        {leaveBalance.length === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              color: colors.muted,
              textAlign: "center",
            }}
          >
            <img
              src={LeavePlaceHolder}
              alt="No leave balance"
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
                No Leave Balance Found
              </div>
              <div style={{ fontSize: "13px", maxWidth: "260px" }}>
                Your leave entitlements will appear here
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 16,
              }}
            >
              {leaveBalance.slice(0, 3).map((leave) => {
                const { icon: Icon, bg, color } = getLeaveIcon(leave.leaveType);

                return (
                  <div
                    key={leave.rawType}
                    style={{
                      padding: "6px 10px",
                      background: colors.card,
                      borderRadius: "12px",
                      border: `1px solid ${colors.border}`,
                      transition: "all 0.18s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = colors.cardHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = colors.card)
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          background: bg,
                          color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.25rem",
                        }}
                      >
                        <Icon />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>
                        {leave.leaveType
                          .replace(/leave/gi, "")
                          .trim()
                          .replace(/^./, (c) => c.toUpperCase())}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        color: colors.muted,
                      }}
                    >
                      <div>
                        Balance:{" "}
                        <span
                          style={{ color: colors.success, fontWeight: 600 }}
                        >
                          {leave.balance}
                        </span>
                      </div>
                      <div>
                        Taken:{" "}
                        <span style={{ color: colors.danger, fontWeight: 600 }}>
                          {leave.taken}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 4th cell = Apply for Leave button */}
              <div
                style={{
                  // padding: "6px 10px",
                  background: colors.card,
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  transition: "all 0.18s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = colors.cardHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = colors.card)
                }
              >
                <Link
                  to={applyLeavePath}
                  style={{
                    background: colors.primary,
                    color: "white",
                    fontWeight: 600,
                    fontSize: "14.5px",
                    height: "100%",
                    borderRadius: "10px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    width: "100%",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.primary;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Apply for Leave
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeaveDash;
