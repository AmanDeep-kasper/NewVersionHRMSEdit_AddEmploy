import React, { useEffect, useState, useRef } from "react";
import api from "../../Pages/config/api";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import KasperCalendar from "../KasperCalendar/KasperCalendar";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
} from "react-icons/fa";

const HolidayDash = () => {
  const { darkMode } = useTheme();
  const popupRef = useRef(null);

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showHolidayList, setShowHolidayList] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchHolidays = async (year, month) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/holidays/month?year=${year}&month=${month + 1}`
      );
      setHolidays(res.data || []);
    } catch (error) {
      console.error("Holiday fetch error:", error);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowHolidayList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const colors = {
    bg: !darkMode ? "#0f172a" : "#ffffff",
    border: !darkMode ? "#1e293b" : "#e2e8f0",
    text: !darkMode ? "#f8fafc" : "#0f172a",
    muted: !darkMode ? "#94a3b8" : "#64748b",
    holidayBg: !darkMode ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
    holidayText: "#ef4444",
  };

  return (
    <div
      style={{
        height: "18rem",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        color: colors.text,
        boxShadow: !darkMode
          ? "0 2px 6px rgba(0,0,0,0.10)"
          : "0 2px 4px rgba(0,0,0,0.10)",
      }}
      className="d-flex flex-column p-3"
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div style={{ fontSize: "15px", fontWeight: 600, color: "#3b82f6" }}>
          {monthNames[currentMonth]} {currentYear}
        </div>
        <div className="d-flex align-items-center gap-3 position-relative">
          <FaRegCalendarAlt
            size={16}
            style={{ cursor: "pointer", color: "#3b82f6" }}
            onClick={() => setShowHolidayList((prev) => !prev)}
          />
          <div className="d-flex align-items-center gap-3 position-relative">
            <FaChevronLeft
              size={16}
              style={{ cursor: "pointer", color: colors.muted }}
              onClick={goToPrevMonth}
            />

            <FaChevronRight
              size={16}
              style={{ cursor: "pointer", color: colors.muted }}
              onClick={goToNextMonth}
            />

            {/* Holiday dropdown */}
            {showHolidayList && (
              <div
                ref={popupRef}
                style={{
                  position: "absolute",
                  top: "32px",
                  right: "0",
                  width: "260px",
                  maxHeight: "220px",
                  overflowY: "auto",
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                  zIndex: 100,
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: colors.text,
                  }}
                >
                  {monthNames[currentMonth]} Holidays
                </div>

                {holidays.length === 0 ? (
                  <div style={{ fontSize: "12px", color: colors.muted }}>
                    No holidays this month
                  </div>
                ) : (
                  holidays.map((h) => (
                    <div
                      key={h._id}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        background: colors.holidayBg,
                        color: colors.holidayText,
                        marginBottom: "6px",
                      }}
                    >
                      <div>
                        <strong>
                          {h.holidayDate} {monthNames[h.holidayMonth - 1]}{" "}
                        </strong>{" "}
                        – {h.holidayName}
                      </div>
                      <div>({h.holidayType})</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ flex: 1 }}>
        {loading ? (
          <div className="h-100 d-flex align-items-center justify-content-center">
            <span style={{ color: colors.muted }}>Loading holidays...</span>
          </div>
        ) : (
          <KasperCalendar
            holidays={holidays}
            year={currentYear}
            month={currentMonth}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

export default HolidayDash;
