import React, { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import profile from "../../../img/profile.jpg";
import { useSelector } from "react-redux";
import { useViewContext } from "../../../Context/ViewContax/viewType";
import { GiDuration } from "react-icons/gi";
import ManagerTaskDetails from "./taskContainer/ManagerTaskDetails";
import RequestImage from "../../../img/Request/Request.svg";
import api from "../../../Pages/config/api";
import { FaRegDotCircle } from "react-icons/fa";

const ManagerNewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const { darkMode } = useTheme();
  const { viewType } = useViewContext();
  const { userData } = useSelector((state) => state.user);

  const { socket } = useContext(AttendanceContext);

  const email = userData?.Email;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/api/tasks");
        setTasks(res.data || []);
      } catch (err) {
        console.error("Failed to load tasks", err);
        toast.error("Could not load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const assignedTasks = tasks.filter(
    (task) => task?.status === "Assigned" && task?.managerEmail?.Email === email
  );

  const handleCardClick = (task) => setSelectedTask(task);
  const handleBack = () => setSelectedTask(null);

  if (selectedTask) {
    return <ManagerTaskDetails task={selectedTask} onBack={handleBack} />;
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (assignedTasks.length === 0) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{ minHeight: "70vh", padding: "2rem" }}
      >
        <img
          src={RequestImage}
          alt="No tasks"
          style={{
            width: "min(280px, 80%)",
            height: "auto",
            marginBottom: "1.5rem",
          }}
        />
        <h5
          className="mb-2 fw-semibold"
          style={{ color: !darkMode ? "#e0e0e0" : "#333" }}
        >
          No Assigned Tasks
        </h5>
        <p className="text-muted mb-0" style={{ maxWidth: "420px" }}>
          You don't have any pending tasks assigned to you at the moment.
        </p>
      </div>
    );
  }

  const getPriorityStyle = (priority) => {
    const map = {
      High: { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" },
      Medium: { bg: "#fef3c7", color: "#d97706", border: "#fcd34d" },
      Low: { bg: "#ecfdf5", color: "#059669", border: "#6ee7b7" },
    };
    return (
      map[priority] || { bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" }
    );
  };

  return (
    <div className="container-fluid px-0 px-md-3 py-3">
      {viewType === "card" ? (
        <div className="row g-3">
          {assignedTasks
            .slice()
            .reverse()
            .map((task) => {
              const priorityStyle = getPriorityStyle(task.Priority);

              return (
                <div key={task._id} className="col-lg-6 col-xl-4">
                  <div
                    className="card h-100 shadow-sm border-0 task-card"
                    onClick={() => handleCardClick(task)}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      background: !darkMode ? "#1f2937" : "#ffffff",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = !darkMode
                        ? "0 12px 24px rgba(0,0,0,0.4)"
                        : "0 12px 24px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 1px 3px rgba(0,0,0,0.1)";
                    }}
                  >
                    <div
                      className="card-header d-flex justify-content-between align-items-center px-4 py-3"
                      style={{
                        background: !darkMode ? "#111827" : "#f8fafc",
                        borderBottom: `1px solid ${
                          !darkMode ? "#374151" : "#e2e8f0"
                        }`,
                      }}
                    >
                      <h6
                        className="mb-0 fw-semibold text-truncate"
                        style={{ maxWidth: "65%" }}
                      >
                        {task.taskID}
                      </h6>

                      <span
                        className="badge rounded-pill px-3 py-2 fw-medium d-flex align-items-center gap-1"
                        style={{
                          backgroundColor: priorityStyle.bg,
                          color: priorityStyle.color,
                          border: `1px solid ${priorityStyle.border}`,
                        }}
                      >
                        <FaRegDotCircle size={14} />
                        {task.Priority}
                      </span>
                    </div>

                    <div className="card-body px-4 pb-4 pt-3 d-flex flex-column">
                      <h5
                        className="card-title mb-3 fw-semibold"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {task.Taskname}
                      </h5>

                      <div className="row g-3 mb-4 small text-muted">
                        <div className="col-6">
                          <div className="fw-medium mb-1">Start</div>
                          <div>{getFormattedDate(task.startDate)}</div>
                        </div>
                        <div className="col-6">
                          <div className="fw-medium mb-1">Due</div>
                          <div>{getFormattedDate(task.endDate)}</div>
                        </div>
                      </div>

                      <div
                        className="mt-auto d-flex align-items-center gap-2 pt-3 border-top"
                        style={{
                          borderTopColor: !darkMode ? "#4b5563" : "#e5e7eb",
                        }}
                      >
                        <GiDuration size={18} className="text-primary" />
                        <span className="fw-medium">{task.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        // ────────────────────────────────────────────────
        //                   TABLE VIEW
        // ────────────────────────────────────────────────
        <div
          className="table-responsive rounded-3 shadow-sm"
          style={{
            border: !darkMode ? "1px solid #374151" : "1px solid #e2e8f0",
          }}
        >
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr style={{ background: !darkMode ? "#111827" : "#f8fafc" }}>
                <th className="ps-4 py-3">Task</th>
                <th className="py-3">Start Date</th>
                <th className="py-3">Due Date</th>
                <th className="py-3">Duration</th>
                <th className="py-3">Priority</th>
              </tr>
            </thead>
            <tbody>
              {assignedTasks
                .slice()
                .reverse()
                .map((task) => {
                  const priorityStyle = getPriorityStyle(task.Priority);

                  return (
                    <tr
                      key={task._id}
                      onClick={() => handleCardClick(task)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="ps-4 py-3">
                        <div className="fw-semibold">{task.Taskname}</div>
                        <div className="small text-muted mt-1">
                          {task.taskID}
                        </div>
                      </td>
                      <td className="py-3">
                        {getFormattedDate(task.startDate)}
                      </td>
                      <td className="py-3">{getFormattedDate(task.endDate)}</td>
                      <td className="py-3">{task.duration}</td>
                      <td className="py-3">
                        <span
                          className="badge rounded-pill px-3 py-2"
                          style={{
                            backgroundColor: priorityStyle.bg,
                            color: priorityStyle.color,
                            border: `1px solid ${priorityStyle.border}`,
                          }}
                        >
                          {task.Priority}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerNewTask;
