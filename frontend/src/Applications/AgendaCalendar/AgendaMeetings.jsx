import React, { useState, useEffect } from "react";
import axios from "axios";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import Styles from "../../Style/Scroller.module.css";
import { formatDateAndTime } from "../../Utils/GetDayFormatted";

const AgendaMeetings = () => {
  const [agendas, setAgendas] = useState([]);
  const { darkMode } = useTheme();

  // ✅ Setup axios to include cookies automatically
  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // ✅ important for cookies
  });

  // ✅ Fetch Custom Agendas using cookies instead of localStorage
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
    .filter((agenda) => agenda.type === "Meeting")
    .sort((a, b) => {
      const today = new Date();
      const startA = new Date(a.startDate);
      const endA = new Date(a.endDate);
      const startB = new Date(b.startDate);
      const endB = new Date(b.endDate);

      const statusA = today < startA ? 2 : today >= startA && today <= endA ? 0 : 1;
      const statusB = today < startB ? 2 : today >= startB && today <= endB ? 0 : 1;

      return statusA - statusB;
    });

  return (
    <div className="container-fluid ">
      <div className="mb-3">
        <TittleHeader
          title={"Agenda Meetings"}
          message={"You can view all your meeting created as agenda"}
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
                <th style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}>
                  S. No
                </th>
                <th style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}>
                  Title
                </th>
                <th style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}>
                  Description
                </th>
                <th style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}>
                  Start Date
                </th>
                <th style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}>
                  End Date
                </th>
                <th style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}>
                  Type
                </th>
                <th style={{ ...rowHeadStyle(darkMode), position: "sticky", top: "-.5rem" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAgendas.map((agenda, index) => (
                <tr key={agenda._id}>
                  <td style={{ ...rowBodyStyle(darkMode) }}>
                    {(index + 1).toString().padStart(2, 0)}
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
        "No Meeting Found"
      )}
    </div>
  );
};

export default AgendaMeetings;
