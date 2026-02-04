import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowLongRight, HiOutlineCalendarDays } from "react-icons/hi2";
import { MdOutlineAddTask, MdPriorityHigh } from "react-icons/md";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { getTimeAgo } from "../GetDayFormatted";
import TaskImage from "../../img/Task/ActiveTask.svg";
import { useMyTasks } from "../../services/api/taskApi";
import "./TaskDash.css";

const TaskDash = () => {
  const { darkMode } = useTheme();
  const { data: tasks = [], isLoading, isError } = useMyTasks();

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const colors = {
    bg: darkMode ? "#ffffff" : "#1f1f1f",
    border: darkMode ? "#e5e7eb" : "#333333",
    text: darkMode ? "#1f2937" : "#e5e7eb",
    muted: darkMode ? "#6b7280" : "#9ca3af",
    card: darkMode ? "#f9fafb" : "#2d2d2d",
    cardHover: darkMode ? "#f3f4f6" : "#3a3a3a",
    subtle: darkMode ? "#f8fafc" : "#252525",
  };

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("complete")) return darkMode ? "#059669" : "#10b981";
    if (s.includes("progress") || s.includes("ongoing"))
      return darkMode ? "#d97706" : "#f59e0b";
    if (s.includes("delay") || s.includes("overdue"))
      return darkMode ? "#dc2626" : "#ef4444";
    if (s.includes("assign") || s.includes("assigned"))
      return darkMode ? "#2563eb" : "#3b82f6";
    return colors.muted;
  };

  const getPriorityColor = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "high") return darkMode ? "#dc2626" : "#ef4444";
    if (p === "medium") return darkMode ? "#d97706" : "#f59e0b";
    if (p === "low") return darkMode ? "#059669" : "#10b981";
    return colors.muted;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const shortText = (text = "", max = 110) =>
    text.length > max ? text.slice(0, max - 3) + "..." : text;

  const cleanDescription = (html = "") => {
    if (!html) return "No description provided";
    const text = html
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return shortText(text, 100);
  };

  const calculateProgress = (task) => {
    if (!task.employees?.length) return 0;
    const valid = task.employees.filter((e) => e.empTaskStatus !== "Rejected");
    const completed = valid.filter(
      (e) => e.empTaskStatus === "Completed",
    ).length;
    return valid.length ? Math.round((completed / valid.length) * 100) : 0;
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 340; // ≈ card width + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Update scroll arrow visibility
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      checkScroll();
      ref.addEventListener("scroll", checkScroll);
      return () => ref.removeEventListener("scroll", checkScroll);
    }
  }, [tasks]);

  // Optional: horizontal mouse wheel scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY * 1.5;
      }
    };
    const ref = scrollRef.current;
    if (ref) ref.addEventListener("wheel", handleWheel, { passive: false });
    return () => ref?.removeEventListener("wheel", handleWheel);
  }, []);

  const pendingTasks = tasks.filter(
    (t) => t.status?.toLowerCase() === "assigned",
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl p-4 skeleton" style={{ height: "17.5rem" }} />
    );
  }

  if (isError) {
    return (
      <div style={{ color: "tomato", padding: "2rem", textAlign: "center" }}>
        Failed to load your tasks
      </div>
    );
  }

  return (
    <div
      style={{
        height: "17.5rem",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        color: colors.text,
        overflow: "hidden",
        boxShadow: darkMode
          ? "0 4px 12px rgba(0,0,0,0.08)"
          : "0 4px 12px rgba(0,0,0,0.10)",
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
          background: colors.subtle || colors.bg,
        }}
      >
        <Link
          to="/employee/task"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: colors.text,
          }}
        >
          <MdOutlineAddTask size={20} color={colors.muted} />
          <span style={{ fontSize: "15.5px", fontWeight: 600 }}>
            My Pending Tasks
          </span>
          {pendingTasks.length > 0 && (
            <span
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "999px",
                background: getStatusColor("Assigned") + "22",
                color: getStatusColor("Assigned"),
                fontWeight: 500,
              }}
            >
              {pendingTasks.length}
            </span>
          )}
        </Link>

        {pendingTasks.length > 0 && (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              style={{
                opacity: canScrollLeft ? 1 : 0.4,
                cursor: canScrollLeft ? "pointer" : "not-allowed",
              }}
              aria-label="Scroll left"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              style={{
                opacity: canScrollRight ? 1 : 0.4,
                cursor: canScrollRight ? "pointer" : "not-allowed",
              }}
              aria-label="Scroll right"
            >
              <FaChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ height: "calc(100% - 54px)", position: "relative" }}>
        {pendingTasks.length === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: colors.muted,
              gap: 16,
            }}
          >
            <img
              src={TaskImage}
              alt="No pending tasks"
              style={{ height: 100, opacity: darkMode ? 0.7 : 0.85 }}
            />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "15px", fontWeight: 500 }}>
                No Pending Tasks
              </div>
              <div
                style={{ fontSize: "13px", maxWidth: "240px", marginTop: 4 }}
              >
                Assigned tasks will appear here
              </div>
            </div>
          </div>
        ) : (
          <div
            ref={scrollRef}
            style={{
              height: "100%",
              padding: "16px 18px",
              overflowX: "auto",
              overflowY: "hidden",
              display: "flex",
              gap: 16,
              scrollBehavior: "smooth",
            }}
            className="hide-scrollbar"
          >
            {pendingTasks.slice(0, 6).map((task) => {
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
                  {/* Title + Badges */}
                  <div>
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
                          padding: "3px 10px",
                          borderRadius: "999px",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          background: `${statusColor}22`,
                          color: statusColor,
                          border: `1px solid ${statusColor}44`,
                        }}
                      >
                        {task.status || "—"}
                      </span>

                      {task.Priority && (
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: "999px",
                            fontSize: "11.5px",
                            fontWeight: 600,
                            background: `${priorityColor}22`,
                            color: priorityColor,
                            border: `1px solid ${priorityColor}44`,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <MdPriorityHigh size={13} /> {task.Priority}
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDash;
