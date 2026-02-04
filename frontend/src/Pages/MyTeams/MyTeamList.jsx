import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import { TbUsersGroup } from "react-icons/tb";
import { FaChevronRight } from "react-icons/fa";
import { MdClose, MdKeyboardArrowRight } from "react-icons/md";
import api from "../config/api";

/* ───────────────── Utilities ───────────────── */

const stringToSoftColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const r = (hash & 0x7f) + 80;
  const g = ((hash >> 8) & 0x7f) + 80;
  const b = ((hash >> 16) & 0x7f) + 80;

  return `rgb(${r}, ${g}, ${b})`;
};

const getInitials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "?";

/* ───────────────── Main Component ───────────────── */

const MyTeamList = () => {
  const navigate = useNavigate();
  const { setManagerMail } = useContext(AttendanceContext);
  const { darkMode } = useTheme();

  const [teamData, setTeamData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    api.get("/api/team-board").then((res) => {
      setTeamData(res.data || {});
    });
  }, []);

  const openDepartment = async (dept) => {
    try {
      setSelectedDepartment(dept);
      setShowModal(true);
      setLoadingMembers(true);

      const res = await api.get(`/api/department/${dept}`);
      setDepartmentMembers(res.data || []);
    } catch {
      setDepartmentMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const navigateTeam = (member) => {
    setManagerMail(member.Email);
    navigate("/admin/managerTeam", { state: { email: member.Email } });
  };

  const colors = {
    bg: darkMode ? "#ffffff" : "#171717",
    border: darkMode ? "#e5e7eb" : "#2f2f2f",
    text: darkMode ? "#111827" : "#e5e7eb",
    muted: darkMode ? "#6b7280" : "#9ca3af",
    card: darkMode ? "#f9fafb" : "#1f1f1f",
    subtleBg: darkMode ? "#f3f4f6" : "#121212",
    accent: darkMode ? "#374151" : "#9ca3af",
  };

  return (
    <div
      style={{
        height: "18rem",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        color: colors.text,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: colors.subtleBg,
        }}
      >
        <TbUsersGroup size={20} color={colors.muted} />
        <span style={{ fontWeight: 600 }}>My Teams</span>
        <span
          style={{
            fontSize: 12,
            padding: "2px 8px",
            borderRadius: 20,
            background: darkMode ? "#e5e7eb" : "#2a2a2a",
            color: colors.muted,
          }}
        >
          {Object.keys(teamData).length}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: 10, overflowY: "auto", height: "100%" }}>
        {Object.entries(teamData).map(([dept, data]) => (
          <DepartmentCard
            key={dept}
            dept={dept}
            members={data.members}
            colors={colors}
            onClick={() => openDepartment(dept)}
          />
        ))}
      </div>

      <TeamCustomModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={selectedDepartment}
        darkMode={darkMode}
        members={departmentMembers}
        loading={loadingMembers}
        onViewMember={navigateTeam}
        colors={colors}
      />
    </div>
  );
};

/* ───────────────── Department Card ───────────────── */

const DepartmentCard = ({ dept, members, colors, onClick }) => {
  const visible = members.slice(0, 5);
  const remaining = members.length - 5;

  return (
    <div
      onClick={onClick}
      style={{
        padding: 12,
        marginBottom: 8,
        background: colors.card,
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
        cursor: "pointer",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <span style={{ fontWeight: 600 }}>{dept}</span>
        <span style={{ fontSize: 13, color: colors.muted }}>
          {members.length} <FaChevronRight />
        </span>
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        {visible.map((m, i) => (
          <Avatar
            key={i}
            name={`${m.FirstName}${m.LastName}`}
            first={m.FirstName}
            last={m.LastName}
            index={i}
            colors={colors}
          />
        ))}
        {remaining > 0 && (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: colors.muted,
              color: "#fff",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: -10,
            }}
          >
            +{remaining}
          </div>
        )}
      </div>
    </div>
  );
};

/* ───────────────── Avatar ───────────────── */

const Avatar = ({ name, first, last, index }) => (
  <div
    style={{
      width: 30,
      height: 30,
      borderRadius: "50%",
      background: stringToSoftColor(name),
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 600,
      marginLeft: index ? -10 : 0,
    }}
  >
    {getInitials(first, last)}
  </div>
);

/* ───────────────── Modal ───────────────── */

const TeamCustomModal = ({
  show,
  onClose,
  title,
  darkMode,
  members,
  loading,
  onViewMember,
  colors,
}) => {
  if (!show) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.bg,
          borderRadius: 16,
          width: "min(460px, 95vw)",
          maxHeight: "80vh",
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: colors.subtleBg,
          }}
        >
          <div >
            <div style={{ fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: 12, color: colors.muted }}>
              {members.length} members
            </div>
          </div>
          <MdClose size={20} onClick={onClose} style={{ cursor: "pointer" }} />
        </div>

        <div style={{ maxHeight: "65vh", overflowY: "auto" }}>
          {loading ? (
            <div className="text-center p-4" style={{ color: colors.muted }}>
              Loading members…
            </div>
          ) : (
            members.map((m, i) => (
              <div
                key={i}
                onClick={() => onViewMember(m)}
                style={{
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom:
                    i < members.length - 1
                      ? `1px solid ${colors.border}`
                      : "none",
                  cursor: "pointer",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <Avatar
                    name={`${m.FirstName}${m.LastName}`}
                    first={m.FirstName}
                    last={m.LastName}
                  />
                  <span style={{ fontWeight: 500 }}>
                    {m.FirstName} {m.LastName}
                  </span>
                </div>
                <MdKeyboardArrowRight size={20} color={colors.muted} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeamList;
