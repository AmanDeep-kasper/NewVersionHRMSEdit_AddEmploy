import React, { useState, useRef } from "react";
import "./KasperCalendar.css";

const KasperCalendar = ({ holidays, year, month, darkMode }) => {
  const calendarRef = useRef(null);
  const [hover, setHover] = useState(null);
  const [popoverPos, setPopoverPos] = useState({});
  const [hoveredDay, setHoveredDay] = useState(null);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const colors = {
    text: !darkMode ? "#f8fafc" : "#0f172a",
    muted: !darkMode ? "#94a3b8" : "#64748b",
    weekend: !darkMode ? "#fca5a5" : "#dc2626",
    holiday: "#ef4444",
    bg: !darkMode ? "#0f172a" : "#ffffff",
    cellHover: !darkMode ? "#1e293b" : "#e2e8f0",
    holidayBg: !darkMode ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)",
    weekendBg: !darkMode ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.18)",
  };

  

  const generateDays = () => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let saturdayCount = 0;

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`e-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dow = date.getDay();
      
      const today = new Date();
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      const isSunday = dow === 0;
      const isSaturday = dow === 6;
      if (isSaturday) saturdayCount++;

      const isSecondOrFourth =
        isSaturday && (saturdayCount === 2 || saturdayCount === 4);

      const isWeekend = isSunday || isSecondOrFourth;

      const dayHolidays = holidays.filter(
        (h) =>
          Number(h.holidayDate) === day &&
          Number(h.holidayMonth) === month + 1 &&
          Number(h.holidayYear) === year
      );

      const isHoliday = dayHolidays.length > 0;

      days.push(
        <div
          key={day}
          className="calendar-day"
          style={{ color: colors.text }}
          onMouseLeave={() => setHover(null)}
        >
          <div
            onMouseEnter={() => setHoveredDay(day)}
            onMouseLeave={() => setHoveredDay(null)}
            style={{
              background:
                isToday || hoveredDay === day
                  ? "rgba(37,99,235,0.18)" // light blue
                  : isWeekend
                  ? colors.weekendBg
                  : isHoliday
                  ? colors.holidayBg
                  : "transparent",

              color:
                isToday || hoveredDay === day
                  ? "#2563eb" // blue
                  : isWeekend
                  ? colors.weekend
                  : isHoliday
                  ? colors.holiday
                  : colors.text,

              height: "22px",
              width: "22px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: isToday ? 700 : isHoliday ? 600 : 400,
              // boxShadow: isToday ? "0 4px 10px rgba(37,99,235,0.35)" : "none",
              transition: "0.2s",
            }}
          >
            {day}
          </div>

          {isHoliday && <span className="holiday-dot" />}
          {isToday && <span className="today-dot" />}
        </div>
      );
    }

    return days;
  };

  return (
    <div
      style={{
        background: colors.bg,
        borderRadius: "12px",
      }}
    >
      <div className="calendar-header" style={{ color: colors.muted }}>
        {dayNames.map((d) => (
          <div key={d} className="calendar-day">
            {d}
          </div>
        ))}
      </div>

      <div
        className="calendar-container"
        ref={calendarRef}
        style={{ background: colors.bg }}
      >
        {generateDays()}
      </div>
    </div>
  );
};

export default KasperCalendar;
