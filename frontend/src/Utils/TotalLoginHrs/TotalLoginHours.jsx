import React, { useEffect, useState } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api";
import { useApiRefresh } from "../../Context/ApiRefreshContext/ApiRefreshContext";

const TotalLoginHours = () => {
  const { darkMode } = useTheme();

  const [viewMode, setViewMode] = useState("monthly");
  const [grossLogin, setGrossLogin] = useState(0);
  const [totalBreak, setTotalBreak] = useState(0);
  const [netLogin, setNetLogin] = useState(0);
  const [loading, setLoading] = useState(false);
   const { refresh } = useApiRefresh();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const { data } = await api.get("/api/monthly-Attendance-Summary", {
          params: {
            year,
            month,
            viewMode,
          },
        });

        const summary = data?.summary || {};

        setGrossLogin(Number(summary.grossLogin) || 0);
        setTotalBreak(Number(summary.totalBreak) || 0);
        setNetLogin(Number(summary.netLogin) || 0);
      } catch (error) {
        console.error("Failed to load attendance summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [refresh, viewMode]);

  const formatMinutes = (minutes = 0) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs} Hrs ${mins} Min`;
  };

  return (
    <div
      className="d-flex flex-column gap-2"
      style={{ color: darkMode ? "#000" : "#fff" }}
    >
      {/* View Selector */}
      <select
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value)}
        className={
          darkMode
            ? "form-select bg-white text-black border-0 py-1"
            : "form-select bg-dark text-white border-0 py-1"
        }
        style={{ width: "fit-content" }}
      >
        <option value="monthly">This Month Log</option>
        <option value="yearly">This Year Log</option>
      </select>

      {/* Stats */}
      <div className="d-flex gap-2 mt-2">
        <Stat
          label="Gross"
          value={formatMinutes(grossLogin)}
          darkMode={darkMode}
          variant="primary"
          loading={loading}
        />
        <Stat
          label="Break"
          value={formatMinutes(totalBreak)}
          darkMode={darkMode}
          variant="warning"
          loading={loading}
        />
        <Stat
          label="Net"
          value={formatMinutes(netLogin)}
          darkMode={darkMode}
          variant="success"
          loading={loading}
        />
      </div>
    </div>
  );
};

/* ---------------------------------- */
/* Small reusable stat component      */
/* ---------------------------------- */
const Stat = ({ label, value, variant, darkMode, loading }) => {
  return (
    <div
      className={`px-3 py-1 rounded-2 d-flex gap-1 align-items-center ${
        darkMode ? `badge-${variant}` : `badge-${variant}-dark`
      }`}
      style={{
        border: darkMode ? "1px solid #dadada" : "1px solid #938f99",
      }}
    >
      <strong>{label} :</strong>
      <span>{loading ? "—" : value}</span>
    </div>
  );
};

export default TotalLoginHours;
