import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import api from "../../../../Pages/config/api";
import { LuPartyPopper } from "react-icons/lu";
import birthday from "../../../../img/Team/birthday.svg";

const UpcomingBirthdays = () => {
  const [employees, setEmployees] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const { darkMode } = useTheme();

  // 🔹 Fetch birthday board data
  useEffect(() => {
    api
      .get("/api/birthday-board")
      .then((res) => setEmployees(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Birthday API error:", err));
  }, []);

  // 🔹 Calculate upcoming birthdays
  useEffect(() => {
    if (!employees.length) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const list = employees
      .map((emp) => {
        if (!emp.DOB) return null;

        const dob = new Date(emp.DOB);
        let nextBirthday = new Date(
          today.getFullYear(),
          dob.getMonth(),
          dob.getDate(),
        );

        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        const days = Math.ceil((nextBirthday - today) / 86400000);

        return {
          id: emp.empID || emp._id,
          name: `${emp.FirstName || ""} ${emp.LastName || ""}`.trim(),
          role: emp.PositionName || "—",
          dob: emp.DOB,
          avatar: emp.image_url || null,
          days,
          isToday: days === 0,
          isTomorrow: days === 1,
          label:
            days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`,
        };
      })
      .filter(Boolean)
      .filter((i) => i.days >= 0 && i.days <= 90)
      .sort((a, b) => a.days - b.days)
      .slice(0, 10);

    setUpcoming(list);
  }, [employees]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

  // 🎨 Theme colors (all keys defined)
  const colors = {
    bg: darkMode ? "#ffffff" : "#171717",
    border: darkMode ? "#e5e7eb" : "#333333",
    text: darkMode ? "#111827" : "#e5e7eb",
    muted: darkMode ? "#6b7280" : "#9ca3af",
    subtleBg: darkMode ? "#f9fafb" : "#1f1f1f",
    card: darkMode ? "#ffffff" : "#1c1c1c",

    textSecondary: darkMode ? "#6b7280" : "#9ca3af",
    today: "#16a34a",
    tomorrow: "#2563eb",
    soon: "#f59e0b",
  };

  const getLabelStyle = (p) => {
    if (p.isToday) return { color: colors.today, fontWeight: 700 };
    if (p.isTomorrow) return { color: colors.tomorrow, fontWeight: 600 };
    if (p.days <= 7) return { color: colors.soon };
    return { color: colors.textSecondary };
  };

  return (
    <div
      style={{
        height: "18rem",
        display: "flex", 
        flexDirection: "column", 
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        color: colors.text,
        overflow: "hidden",
        boxShadow: darkMode
          ? "0 2px 6px rgba(0,0,0,0.08)"
          : "0 2px 8px rgba(0,0,0,0.14)",
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
            Upcoming Birthdays
          </span>
        </div>
        <span>{upcoming.length}</span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {upcoming.length === 0 ? (
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
              src={birthday}
              alt="No upcoming birthdays"
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
                No Upcoming Birthdays 🎉
              </div>

              <div style={{ fontSize: "13px", maxWidth: "260px" }}>
                There are no team birthdays in the next 60 days. When someone’s
                special day is near, it’ll show up here 🎂
              </div>
            </div>
          </div>
        ) : (
          upcoming.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderBottom: `1px solid ${colors.border}`,
                background: colors.card,
              }}
            >
              {/* Avatar */}
              <div style={{ marginRight: "0.75rem" }}>
                {p.avatar ? (
                  <img
                    src={p.avatar}
                    alt={p.name}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "#f472b6",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {p.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>
                  {p.role}
                </div>
              </div>

              {/* Date */}
              <div style={{ textAlign: "right" }}>
                <div style={getLabelStyle(p)}>
                  {p.isToday && <span style={{ marginRight: 6 }}>🎉</span>}
                  {p.label}
                </div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>
                  {formatDate(p.dob)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingBirthdays;
