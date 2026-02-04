import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiArrowLongRight, HiOutlineCalendarDays } from "react-icons/hi2";
import { MdOutlineAddTask, MdPriorityHigh } from "react-icons/md";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api";
import TaskImage from "../../img/Task/ActiveTask.svg";
import "./TaskDash.css";

const TaskDashManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  const scrollRef = useRef(null);

  const colors = {
    bg: !darkMode ? "#1f1f1f" : "#ffffff",
    border: !darkMode ? "#333333" : "#e5e7eb",
    text: !darkMode ? "#e5e7eb" : "#1f2937",
    muted: !darkMode ? "#9ca3af" : "#6b7280",
    cardHover: !darkMode ? "#2d2d2d" : "#f9fafb",
    subtleBg: !darkMode ? "#252525" : "#f8fafc",
  };

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("complete")) return !darkMode ? "#10b981" : "#059669";
    if (s.includes("progress") || s.includes("ongoing"))
      return !darkMode ? "#f59e0b" : "#d97706";
    if (s.includes("delay") || s.includes("overdue"))
      return !darkMode ? "#ef4444" : "#dc2626";
    if (s.includes("assign") || s.includes("assigned"))
      return !darkMode ? "#3b82f6" : "#2563eb";
    return !darkMode ? "#6b7280" : "#9ca3af";
  };

  const getPriorityColor = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "high") return !darkMode ? "#ef4444" : "#dc2626";
    if (p === "medium") return !darkMode ? "#f59e0b" : "#d97706";
    if (p === "low") return !darkMode ? "#10b981" : "#059669";
    return colors.muted;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/tasksbyManager");
        setTasks(res.data || []);
      } catch (err) {
        console.error("Tasks load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 340; // card width + gap + buffer
    const behavior = "smooth";
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior,
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const sanitizedDesc = (html = "") => {
    if (!html) return "No description provided";
    const text = html
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 100 ? text.slice(0, 97) + "..." : text;
  };

  const calculateProgress = (task) => {
    if (!task.employees?.length) return 0;
    const valid = task.employees.filter((e) => e.emptaskStatus !== "Rejected");
    const completed = valid.filter((e) => e.emptaskStatus === "Completed");
    return valid.length
      ? Math.round((completed.length / valid.length) * 100)
      : 0;
  };

  return (
    <div
      style={{
        height: "18rem",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        color: colors.text,
        overflow: "hidden",
        boxShadow: !darkMode
          ? "0 2px 6px rgba(0,0,0,0.10)"
          : "0 2px 4px rgba(0,0,0,0.10)",
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
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
          to="/manager/managerTask"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <MdOutlineAddTask size={20} color={colors.muted} />
          </div>
          <span style={{ fontSize: "15.5px", fontWeight: 600 }}>
            Team Tasks
          </span>
          {tasks.length > 0 && (
            <span
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "999px",
                background: getStatusColor("In Progress") + "22",
                color: getStatusColor("In Progress"),
                fontWeight: 500,
              }}
            >
              {tasks.length}
            </span>
          )}
        </Link>
        {!loading && tasks.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 12,
              zIndex: 10,
              justifyContent: "space-between",
              padding: "0 10px",
              marginTop: 2,
            }}
          >
            <button
              onClick={() => scroll("left")}
              style={{
                height: "32px",
                width: "32px",
                borderRadius: "50%",
                color: !darkMode ? "#e5e7eb" : "#1f2937",
                border: "none",
                fontSize: "18px",
                background: !darkMode ? "#333333" : "#e5e7eb",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              title="Previous tasks"
            >
              ←
            </button>

            <button
              onClick={() => scroll("right")}
              style={{
                borderRadius: "50%",
                height: "32px",
                width: "32px",
                color: !darkMode ? "#e5e7eb" : "#1f2937",
                border: "none",
                background: !darkMode ? "#333333" : "#e5e7eb",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              title="Next tasks"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Scroll container + navigation buttons wrapper */}
      <div style={{ position: "relative", height: "calc(100% - 54px)" }}>
        <div
          ref={scrollRef}
          className="horizontal-task-scroll"
          style={{
            height: "100%",
            padding: "16px 18px",
            overflowX: "auto",
            overflowY: "hidden",
            display: "flex",
            gap: 16,
            scrollBehavior: "smooth",
          }}
        >
          {loading ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.muted,
                fontSize: "14px",
                minWidth: "100%",
              }}
            >
              Loading team tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: colors.muted,
                gap: 16,
                minWidth: "100%",
                textAlign: "center",
              }}
            >
              <img
                src={TaskImage}
                alt="No tasks"
                style={{
                  height: 90,
                  opacity: !darkMode ? 0.75 : 0.6,
                  filter: !darkMode ? "brightness(0.9)" : "none",
                }}
              />
              <div>
                <div
                  style={{ fontSize: "15px", fontWeight: 500, marginBottom: 6 }}
                >
                  No Active Tasks
                </div>
                <div style={{ fontSize: "13px", maxWidth: "260px" }}>
                  Team tasks will appear here once created
                </div>
              </div>
            </div>
          ) : (
            tasks.slice(0, 8).map((task) => {
              const progress = calculateProgress(task);
              const statusColor = getStatusColor(task.status);
              const priorityColor = getPriorityColor(task.Priority);

              return (
                <div
                  key={task._id || task.taskID}
                  className="task-card"
                  style={{
                    width: "320px",
                    minWidth: "320px",
                    height: "calc(100% - 8px)",
                    background: colors.cardHover,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    transition: "all 0.18s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = darkMode
                      ? "0 8px 20px rgba(0,0,0,0.25)"
                      : "0 8px 20px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Task ID + Title + Badges */}
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "15.5px",
                          color: statusColor,
                        }}
                      >
                        {task.taskID || "—"}
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "15px",
                          lineHeight: 1.3,
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {task.Taskname || "Untitled Task"}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span
                        style={{
                          padding: "3px 9px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: `${statusColor}22`,
                          color: statusColor,
                          border: `1px solid ${statusColor}44`,
                        }}
                      >
                        {task.status || "—"}
                      </span>

                      <span
                        style={{
                          padding: "3px 9px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: `${priorityColor}22`,
                          color: priorityColor,
                          border: `1px solid ${priorityColor}44`,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MdPriorityHigh size={12} /> {task.Priority || "—"}
                      </span>

                      {task.department && (
                        <span
                          style={{
                            padding: "3px 9px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 500,
                            background: colors.muted + "22",
                            color: colors.muted,
                          }}
                        >
                          {task.department}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "12px",
                      color: colors.muted,
                    }}
                  >
                    <HiOutlineCalendarDays size={14} />
                    <span>{formatDate(task.startDate)}</span>
                    <HiArrowLongRight size={14} />
                    <span>{formatDate(task.endDate)}</span>
                    <span>{task.duration} Days</span>
                  </div>

                  {/* Progress bar + stats */}
                  <div style={{ marginTop: "auto" }}>
                    <div
                      style={{
                        height: 6,
                        background: darkMode ? "#374151" : "#e5e7eb",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          background: statusColor,
                          borderRadius: 999,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 6,
                        fontSize: "11.5px",
                        color: colors.muted,
                      }}
                    >
                      <span>
                        {task.employees?.length || 0} assignee
                        {task.employees?.length !== 1 ? "s" : ""}
                      </span>
                      <span style={{ color: statusColor, fontWeight: 600 }}>
                        {progress}%
                      </span>
                    </div>
                  </div>

                  {/* Last update */}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDashManager;
