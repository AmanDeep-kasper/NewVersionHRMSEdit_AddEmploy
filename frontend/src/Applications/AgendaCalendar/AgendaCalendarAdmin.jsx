import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTasks, FaUmbrellaBeach, FaUserClock } from "react-icons/fa";
import "./AgendaCalendarAdmin.css";
import AddAgendaForm from "./AddAgendaForm";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api"; // ✅ your axios instance with withCredentials:true

const localizer = momentLocalizer(moment);

const AgendaCalendarAdmin = () => {
  const location = useLocation();
  const routeChecker = location.pathname.split("/")[1];
  const { userData } = useSelector((state) => state.user);
  const email = userData?.Email;
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [isCustomAgendaFormOpen, setIsCustomAgendaFormOpen] = useState(false);
  const { darkMode } = useTheme();

  // ✅ Fetch Tasks (via cookie)
  const fetchTasks = async () => {
    try {
      const response = await api.get("/api/tasks");

      return response.data.map((task) => ({
        id: task._id,
        title: (
          <>
            <FaTasks /> {task.taskID} - {task.Taskname}
          </>
        ),
        start: new Date(task.startDate),
        end: new Date(task.endDate),
        type: "task",
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };

  // ✅ Fetch Leaves (via cookie)
  const fetchLeaves = async () => {
    try {
      const response = await api.post("/api/leave-application-hr/", 
        routeChecker === "hr" ? { hr: email } : { manager: email }
      );

      return response.data.map((leave) => ({
        id: leave._id,
        title: (
          <>
            <FaUserClock /> Leave: {leave.Leavetype} - {leave.FirstName}{" "}
            {leave.LastName}
          </>
        ),
        start: new Date(leave.FromDate),
        end: new Date(leave.ToDate),
        type: "leave",
      }));
    } catch (error) {
      console.error("Error fetching leaves:", error);
      return [];
    }
  };

  // ✅ Fetch Holidays (via cookie)
  const fetchHolidays = async () => {
    try {
      const res = await api.get("/api/holidays");

      return res.data.map((holiday) => ({
        id: holiday._id,
        title: (
          <>
            <FaUmbrellaBeach /> Holiday: {holiday.holidayName}
          </>
        ),
        start: new Date(
          holiday.holidayYear,
          holiday.holidayMonth - 1,
          holiday.holidayDate
        ),
        end: new Date(
          holiday.holidayYear,
          holiday.holidayMonth - 1,
          holiday.holidayDate,
          23,
          59
        ),
        type: "holiday",
      }));
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return [];
    }
  };

  // ✅ Fetch Custom Agendas (via cookie)
  const fetchCustomAgendas = async () => {
    try {
      const response = await api.get("/api/custom-agenda");

      return response.data.map((agenda) => ({
        id: agenda._id,
        title:
          agenda.type +
          " - " +
          agenda.title +
          (agenda.description ? ` - ${agenda.description}` : ""),
        start: new Date(agenda.startDate),
        end: new Date(agenda.endDate),
        type: agenda.type,
      }));
    } catch (error) {
      console.error("Error fetching custom agendas:", error);
      return [];
    }
  };

  // ✅ Fetch All Events
  const fetchAllEvents = async () => {
    const [tasks, holidays, leaves, customAgendas] = await Promise.all([
      fetchTasks(),
      fetchHolidays(),
      fetchLeaves(),
      fetchCustomAgendas(),
    ]);
    setEvents([...tasks, ...holidays, ...leaves, ...customAgendas]);
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  // ✅ Event color styling
  const eventStyleGetter = (event) => {
    const colors = {
      task: "#007bff",
      leave: "#6f42c1",
      holiday: "#28a745",
      Reminder: "#28a745",
    };
    return {
      style: {
        backgroundColor: colors[event.type] || "#333",
        color: "#fff",
        borderRadius: "0",
        padding: "5px",
        fontSize: "14px",
      },
    };
  };

  return (
    <div style={{ position: "relative" }} className="container-fluid">
      <div className="d-flex align-items-center justify-content-between">
        <TittleHeader
          title="Agenda Calendar"
          message={"You can view and add agenda here"}
        />
        <button
          onClick={() => setIsCustomAgendaFormOpen(!isCustomAgendaFormOpen)}
          className="btn btn-primary"
        >
          Add Custom Agenda
        </button>
      </div>

      <div
        style={{
          height: "80vh",
          minHeight: "fit-content",
          background: darkMode
            ? "var(--secondaryDashMenuColor)"
            : "var(--secondaryDashColorDark)",
          color: !darkMode
            ? "var(--secondaryDashMenuColor)"
            : "var(--secondaryDashColorDark)",
        }}
        className="mt-3"
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          views={{ month: true, week: true, day: true, agenda: true }}
          onView={setView}
          eventPropGetter={eventStyleGetter}
          style={{ borderRadius: "0px" }}
          className={darkMode ? "dark-mode-calendar" : "light-mode-calendar"}
        />
      </div>

      {isCustomAgendaFormOpen && (
        <div
          style={{
            position: "absolute",
            top: "-.2rem",
            left: "0",
            zIndex: "1000",
            width: "100%",
            height: "80vh",
          }}
        >
          <AddAgendaForm
            onClose={() => setIsCustomAgendaFormOpen(false)}
            onAgendaAdded={fetchAllEvents}
          />
        </div>
      )}
    </div>
  );
};

export default AgendaCalendarAdmin;
