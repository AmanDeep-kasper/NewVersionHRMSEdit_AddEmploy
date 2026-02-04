import React, { useContext, useEffect, useState } from "react";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { FaChevronRight } from "react-icons/fa";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTimeAgo } from "../GetDayFormatted"; // adjusted path — check if correct
import NoticeImg from "../../img/Notice/NoticeImg.svg";
import profileimage from "../../img/profile.jpg";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import api from "../../Pages/config/api"; // adjust path if needed

const AdminNews = () => {
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();
  const { socket } = useContext(AttendanceContext);

  const userType = userData?.Account;

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── FETCH LAST NOTICE ───────────────────────────────────────
  const loadLastNotice = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/notice/last");
      setNotice(res.data || null);
    } catch (err) {
      console.error("Notice fetch error:", err);
      setNotice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLastNotice();
  }, []);

  // ── SOCKET LISTENERS ────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const notificationSound = new Audio("/sounds/notice.mp3");

    socket.on("notice", (data) => {
      setNotice(data);
      notificationSound.play().catch((err) => console.log("Sound error:", err));
    });

    socket.on("noticeDelete", () => {
      loadLastNotice();
    });

    return () => {
      socket.off("notice");
      socket.off("noticeDelete");
    };
  }, [socket]);

  // ── HELPERS ─────────────────────────────────────────────────
  const shortenText = (text = "") =>
    text.length > 320 ? text.slice(0, 320) + "…" : text;

  const sanitizedNotice = (html = "") =>
    shortenText(
      html
        .replace(/<img[^>]*>/g, "")
        .replace(/<iframe[^>]*>/g, "")
        .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, "")
        .replace(/<script[^>]*>.*?<\/script>/gi, "")
        .replace(/<style[^>]*>.*?<\/style>/gi, "")
    );

  const isNoticeWithin24Hours = (createdAt) => {
    if (!createdAt) return false;
    const now = Date.now();
    const noticeTime = new Date(createdAt).getTime();
    return now - noticeTime <= 24 * 60 * 60 * 1000;
  };

  const isRecentNotice = notice && isNoticeWithin24Hours(notice.createdAt);

  const paths = {
    1: "/admin/NoticeBoard",
    2: "/hr/NoticeBoard",
    3: "/employee/NoticeBoard",
    4: "/manager/NoticeBoard",
  };

  // ── COLORS & STYLES ─────────────────────────────────────────
  const colors = {
    bg: darkMode ? "#ffffff" : "#171717",
    border: darkMode ? "#e5e7eb" : "#333333",
    text: darkMode ? "#111827" : "#e5e7eb",
    muted: darkMode ? "#6b7280" : "#9ca3af",
    subtleBg: darkMode ? "#f9fafb" : "#1f1f1f",
    cardHover: darkMode ? "#f3f4f6" : "#2d2d2d",
    contentBg: darkMode ? "#f1f5f9" : "#252525",
  };

  // ── RENDER ──────────────────────────────────────────────────
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
          <HiOutlineBellAlert size={20} color={colors.muted} />
          <span style={{ fontSize: "15.5px", fontWeight: 600 }}>
            Latest Notice
          </span>
          {isRecentNotice && (
            <span
              style={{
                fontSize: "11.5px",
                padding: "2px 8px",
                borderRadius: "999px",
                background: darkMode ? "#dbeafe" : "#1e40af22",
                color: darkMode ? "#1d4ed8" : "#60a5fa",
                fontWeight: 500,
              }}
            >
              New
            </span>
          )}
        </div>

        <Link
          to={paths[userType] || "/"}
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
          View Board <FaChevronRight size={14} />
        </Link>
      </div>

      {/* Content Area */}
      <div style={{ height: "calc(100% - 54px)", overflow: "hidden" }}>
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
            Loading latest notice...
          </div>
        ) : !isRecentNotice ? (
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
              src={NoticeImg}
              alt="No notices"
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
                No Recent Notices
              </div>
              <div style={{ fontSize: "13px", maxWidth: "280px" }}>
                Important announcements will appear here when published
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "16px 18px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Creator + Download */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={notice.creatorProfile?.image_url || profileimage}
                alt="creator"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${colors.border}`,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "14.5px" }}>
                  {notice.creator || "Admin"}
                </div>
                <div style={{ fontSize: "12.5px", color: colors.muted }}>
                  {notice.creatorPosition || "—"} •{" "}
                  {getTimeAgo(notice.createdAt)}
                </div>
              </div>

              {notice.attachments && (
                <a
                  href={notice.attachments}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: colors.muted, transition: "color 0.2s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colors.text)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colors.muted)
                  }
                >
                  <IoCloudDownloadOutline size={22} />
                </a>
              )}
            </div>

            {/* Notice Content */}
            <div
              style={{
                flex: 1,
                background: colors.contentBg,
                borderRadius: "10px",
                padding: "14px 16px",
                fontSize: "14px",
                lineHeight: 1.5,
                overflowY: "auto",
                position: "relative",
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizedNotice(notice.notice),
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNews;
