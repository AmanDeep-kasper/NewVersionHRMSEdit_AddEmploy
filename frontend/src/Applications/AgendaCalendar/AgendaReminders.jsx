import React, { useState, useEffect } from "react";
import axios from "axios";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import Styles from "../../Style/Scroller.module.css";
import { formatDateAndTime } from "../../Utils/GetDayFormatted";

const AgendaReminders = () => {
  const [agendas, setAgendas] = useState([]);
  const { darkMode } = useTheme();

  // ✅ Create axios instance with credentials enabled
  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Send cookies automatically
  });

  // ✅ Fetch Custom Agendas (using cookies)
  const fetchCustomAgendas = async () => {
    try {
      const response = await api.get(`/api/custom-agenda`);
      setAgendas(response.data);
    } catch (error) {
      console.error("Error fetching custom agendas:", error);
    }
  };

  useEffect(() => {
    fetchCustomAgendas();
  }, []);

  const getStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start)
      return (
        <span className={`${darkMode ? "badge-primary" : "badge-primary-dark"}`}>
          Upcoming
        </span>
      );
    if (today >= start && today <= end)
      return (
        <span className={`${darkMode ? "badge-success" : "badge-success-dark"}`}>
          Ongoing
        </span>
      );
    return (
      <span className={`${darkMode ? "badge-danger" : "badge-danger-dark"}`}>
        Expired
      </span>
    );
  };

  const sortedAgendas = agendas
    .filter((agenda) => agenda.type === "Reminder")
    .sort((a, b) => {
      const now = new Date();
      const aStart = new Date(a.startDate);
      const bStart = new Date(b.startDate);
      const aEnd = new Date(a.endDate);
      const bEnd = new Date(b.endDate);

      const aStatus = aStart > now ? 1 : aEnd >= now ? 0 : -1;
      const bStatus = bStart > now ? 1 : bEnd >= now ? 0 : -1;

      if (aStatus !== bStatus) return bStatus - aStatus;
      return bStart - aStart;
    });

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <TittleHeader
          title="Agenda Reminders"
          message="You can view all your reminders created as agenda"
        />
      </div>

      {sortedAgendas.length > 0 ? (
        <div
          style={{
            height: "fit-content",
            maxHeight: "75vh",
            overflow: "auto",
            position: "relative",
            border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
          }}
          className={`rounded-2 ${Styles.scroller}`}
        >
          <table className="table mb-0 table-hover">
            <thead>
              <tr>
                <th
                  style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}
                >
                  S. No
                </th>
                <th
                  style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}
                >
                  Title
                </th>
                <th
                  style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}
                >
                  Description
                </th>
                <th
                  style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}
                >
                  Start Date
                </th>
                <th
                  style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}
                >
                  End Date
                </th>
                <th
                  style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}
                >
                  Type
                </th>
                <th
                  style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAgendas.map((agenda, index) => (
                <tr key={agenda._id}>
                  <td style={{ ...rowBodyStyle(darkMode) }}>
                    {(index + 1).toString().padStart(2, "0")}
                  </td>
                  <td style={{ ...rowBodyStyle(darkMode) }}>{agenda.title}</td>
                  <td style={{ ...rowBodyStyle(darkMode) }}>
                    <textarea
                      value={agenda.description || "description not updated"}
                      readOnly
                      className={`form-control ms-0 ms-md-auto rounded-2 ${
                        darkMode ? "bg-light text-dark" : "bg-dark text-light"
                      }`}
                      style={{ height: "2rem" }}
                    />
                  </td>
                  <td style={{ ...rowBodyStyle(darkMode) }}>
                    {formatDateAndTime(agenda.startDate)}
                  </td>
                  <td style={{ ...rowBodyStyle(darkMode) }}>
                    {formatDateAndTime(agenda.endDate)}
                  </td>
                  <td style={{ ...rowBodyStyle(darkMode) }}>{agenda.type}</td>
                  <td style={{ ...rowBodyStyle(darkMode) }}>
                    {getStatus(agenda.startDate, agenda.endDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        "No Reminders Found"
      )}
    </div>
  );
};

export default AgendaReminders;
