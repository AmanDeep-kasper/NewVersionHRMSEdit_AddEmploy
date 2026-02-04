import React, { useEffect, useState } from "react";
import { LuPartyPopper } from "react-icons/lu";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import { getTimeAgo } from "../../Utils/GetDayFormatted";
import { Link } from "react-router-dom";
import MessagePlaceholder from "../../img/Report/noreportPlaceHolder.svg";
import { HiFlag } from "react-icons/hi2";
import { FaChevronRight, FaExclamationCircle } from "react-icons/fa";
import api from "../config/api";

const RequestTicketCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  const email = userData?.Email;
  const UserType = userData?.Account;

  useEffect(() => {
    const fetchRequestList = async () => {
      try {
        const res = await api.post("/api/requestProfiles", { email });
        setData(res.data || []);
      } catch (err) {
        console.error("Request load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestList();
  }, [email]);

  const pendingRequests = data.filter(
    (r) => r.status?.toLowerCase() === "pending"
  );

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
      case "urgent":
        return !darkMode ? "#ef4444" : "#dc2626"; // red
      case "medium":
        return !darkMode ? "#f59e0b" : "#d97706"; // amber
      case "low":
        return !darkMode ? "#10b981" : "#059669"; // emerald
      default:
        return !darkMode ? "#6b7280" : "#4b5563"; // gray
    }
  };

  const getStatusColor = (status) => {
    if (status?.toLowerCase() === "pending") {
      return !darkMode ? "#f59e0b" : "#fbbf24"; // amber/yellow for pending
    }
    return !darkMode ? "#6b7280" : "#9ca3af";
  };

  const colors = {
    bg: !darkMode ? "#1f1f1f" : "#ffffff",
    border: !darkMode ? "#333333" : "#e5e7eb",
    text: !darkMode ? "#e5e7eb" : "#1f2937",
    muted: !darkMode ? "#9ca3af" : "#6b7280",
    cardHover: !darkMode ? "#2d2d2d" : "#f9fafb",
    subtleBg: !darkMode ? "#252525" : "#f8fafc",
  };

  return (
    <div
      style={{
        height: "18rem",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        color: colors.text,
        overflow: "hidden",

        // Soft, minimal elevation
        boxShadow: !darkMode
          ? "0 2px 6px rgba(0,0,0,0.10)"
          : "0 2px 4px rgba(0,0,0,0.10)",

        transition: "all 0.25s ease",
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
          <LuPartyPopper size={20} color={colors.muted} />
          <span style={{ fontSize: "15.5px", fontWeight: 600 }}>
            Pending Team Requests
          </span>
          {pendingRequests.length > 0 && (
            <span
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "999px",
                background: getStatusColor("pending") + "33",
                color: getStatusColor("pending"),
                fontWeight: 500,
              }}
            >
              {pendingRequests.length}
            </span>
          )}
        </div>

        <Link
          to={`/${
            UserType === 1 ? "admin/requestReceived" : "manager/teamRequestOpen"
          }`}
          style={{
            color: colors.muted,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "14px",
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
          View All <FaChevronRight size={14} />
        </Link>
      </div>

      {/* Content */}
      <div style={{ height: "calc(100% - 54px)", overflowY: "auto" }}>
        {loading ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.muted,
              fontSize: "14px",
            }}
          >
            Loading pending requests...
          </div>
        ) : pendingRequests.length === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: colors.muted,
              gap: 16,
              padding: "0 24px",
              textAlign: "center",
            }}
          >
            <img
              src={MessagePlaceholder}
              alt="No pending requests"
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
                No Pending Requests
              </div>
              <div style={{ fontSize: "13px", maxWidth: "260px" }}>
                Team member issues & requests will appear here once submitted
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "6px 0" }}>
            {pendingRequests.slice(0, 3).map((r) => (
              <div
                key={r.ticketID}
                style={{
                  padding: "12px 18px",
                  borderBottom: `1px solid ${colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  transition: "all 0.18s ease",
                  cursor: "pointer",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.cardHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Requester */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flex: 1,
                  }}
                >
                  {r.profile?.profilePhoto ? (
                    <img
                      src={r.profile.profilePhoto}
                      alt={r.profile.name}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `2px solid ${
                          getPriorityColor(r.priority) + "44"
                        }`,
                        boxShadow: `0 0 0 3px ${
                          getPriorityColor(r.priority) + "11"
                        }`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: !darkMode ? "#374151" : "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.muted,
                        fontWeight: 600,
                        fontSize: "17px",
                        border: `2px solid ${
                          getPriorityColor(r.priority) + "44"
                        }`,
                      }}
                    >
                      {r.profile?.name?.charAt(0) || "?"}
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14.5px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "180px",
                      }}
                    >
                      {r.profile?.name || "Unknown Employee"}
                    </div>
                    <div
                      style={{
                        fontSize: "12.5px",
                        color: colors.muted,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "180px",
                      }}
                    >
                      {r.profile?.email || "—"}
                    </div>
                  </div>
                </div>

                {/* Issue hint / Ticket info */}
                <div
                  style={{
                    flex: 1.3,
                    fontSize: "13.5px",
                    color: colors.text,
                    opacity: 0.9,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <FaExclamationCircle
                      size={14}
                      color={getPriorityColor(r.priority)}
                    />
                    <span style={{ fontWeight: 500 }}>#{r.ticketID}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: colors.muted,
                      marginTop: 3,
                    }}
                  >
                    {getTimeAgo(r.createdAt)}
                  </div>
                </div>

                {/* Priority Badge */}
                <div style={{ minWidth: 90, textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 10px",
                      borderRadius: "999px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      background: `${getPriorityColor(r.priority)}22`,
                      color: getPriorityColor(r.priority),
                      border: `1px solid ${getPriorityColor(r.priority)}55`,
                    }}
                  >
                    <HiFlag size={14} />
                    {r.priority || "Normal"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestTicketCard;
