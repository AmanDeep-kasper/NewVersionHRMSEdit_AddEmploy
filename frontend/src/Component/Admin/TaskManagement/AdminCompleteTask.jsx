import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import profile from "../../../img/profile.jpg";
import TaskDetails from "./taskHead/Taskdetails";
import { useViewContext } from "../../../Context/ViewContax/viewType";
import { GiDuration } from "react-icons/gi";
import { useSelector } from "react-redux";
import { FaRegDotCircle } from "react-icons/fa";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import api from "../../../Pages/config/api";

const AdminCompleteTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);
  const email = userData?.Email;
  const { viewType } = useViewContext();
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchData = async (controller) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/tasks`, {
        params: { status: "Completed" },
        signal: controller?.signal,
      });
      setTasks(response.data);
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Error fetching completed tasks:", error.message);
        setError("Error fetching completed tasks. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller); // initial fetch

    const intervalId = setInterval(() => fetchData(controller), 60000); // refresh every 1 minute

    return () => {
      controller.abort(); // cancel Axios request on unmount
      clearInterval(intervalId); // clear interval
    };
  }, []);

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const accountAccess = (value) => {
    switch (value) {
      case 1: return "Admin";
      case 2: return "Hr";
      case 3: return "Employee";
      case 4: return "Manager";
      default: return "Unknown";
    }
  };

  const handleCardClick = (task) => setSelectedTask(task);
  const handleBack = () => setSelectedTask(null);

  const calculateProgress = (task) => {
    const totalEmployees =
      task.employees.length -
      task.employees.filter((emp) => emp.empTaskStatus === "Rejected").length;
    const completedTasks = task.employees.filter(
      (emp) => emp.empTaskStatus === "Completed"
    ).length;
    return (completedTasks / totalEmployees) * 100;
  };

  const sanitizedDesc = (description) => {
    if (!description) return "";
    return description
      .replace(/<img[^>]*>/g, "")
      .replace(/<iframe[^>]*>/g, "")
      .replace(/<h[12][^>]*>.*?<\/h[12]>/gi, "")
      .replace(/<script[^>]*>.*?<\/script>/gi, "");
  };

  if (selectedTask) {
    return <TaskDetails task={selectedTask} onBack={handleBack} />;
  }

  return (
    <div className="">
      {viewType === "card" ? (
        <div className="row p-1">
          {tasks
            .filter((task) => task.status === "Completed")
            .reverse()
            .map((task) => (
              <div
                className="col-xl-4 p-2"
                key={task._id}
                onClick={() => handleCardClick(task)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="card"
                  style={{
                    borderBottom: "2px solid #148158",
                    background: darkMode ? "transparent" : "rgb(43, 44, 44)",
                    color: darkMode ? "#3c3c3c" : "#f2f2f2",
                  }}
                >
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5 className="text-info fw-medium">{task.taskID}</h5>
                    <div className="d-flex align-items-center">
                      <span className={`priority-badge ${task.Priority.toLowerCase()}`}>
                        <FaRegDotCircle /> {task.Priority}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center pb-3">
                      <h6 className="mb-1">
                        {task.Taskname.length > 60
                          ? task.Taskname.slice(0, 60) + "..."
                          : task.Taskname}
                      </h6>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 mb-3">
                        <span className="d-block">Start Date</span>
                        <p>{getFormattedDate(task.startDate)}</p>
                      </div>
                      <div className="col-sm-4 mb-3">
                        <span className="d-block">End Date</span>
                        <p>{getFormattedDate(task.endDate)}</p>
                      </div>
                      <div className="col-sm-4 mb-3">
                        <span className="d-block">Project Lead</span>
                        <h6 className="fw-normal d-flex align-items-center">
                          <img
                            className="avatar avatar-xs rounded-circle me-1"
                            src={
                              task.managerEmail?.profile?.image_url || profile
                            }
                            alt="Img"
                          />
                          {task.managerEmail.FirstName}
                        </h6>
                      </div>
                    </div>
                    <div
                      className="p-2"
                      style={{
                        background: darkMode ? "#F8F9FA" : "#161515f6",
                        color: darkMode ? "#3c3c3c" : "#f2f2f2",
                      }}
                    >
                      <div className="row align-items-center">
                        <div className="col-6">
                          <span className="fw-medium d-flex align-items-center">
                            <GiDuration />
                            Duration: {task.duration}
                          </span>
                        </div>
                        {/* <div className="col-6">
                          <div>
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <small>
                                {`${calculateProgress(task).toFixed(0)}% Completed`}
                              </small>
                            </div>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-info"
                                role="progressbar"
                                style={{
                                  width: `${calculateProgress(task).toFixed(0)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div
          className="table-responsive my-3 p-0"
          style={{
            borderRadius: "10px",
            border: "1px solid #E9EAEB",
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "500px",
          }}
        >
          <table className="table table-hover" style={{ minWidth: "800px" }}>
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: darkMode ? "#333" : "#fff",
                zIndex: 1000,
              }}
            >
              <tr>
                <th style={rowHeadStyle(darkMode)}>Task Name</th>
                <th style={rowHeadStyle(darkMode)}>Description</th>
                <th style={rowHeadStyle(darkMode)}>Start Date</th>
                <th style={rowHeadStyle(darkMode)}>End Date</th>
                <th style={rowHeadStyle(darkMode)}>Assigned By</th>
              </tr>
            </thead>
            <tbody>
              {tasks
                .filter(
                  (task) =>
                    task.status === "Completed" &&
                    task.adminMail?.Email === email
                )
                .reverse()
                .map((task) => (
                  <tr key={task._id}>
                    <td style={rowBodyStyle(darkMode)}>
                      <span
                        onClick={() => handleCardClick(task)}
                        style={{
                          cursor: "pointer",
                          color: "rgba(18, 41, 216, 1)",
                          fontWeight: "500",
                        }}
                      >
                        {task.Taskname.slice(0, 30)}
                        {task.Taskname.length > 30 && "..."}
                      </span>
                    </td>
                    <td style={rowBodyStyle(darkMode)}>
                      <div
                        className="text-start flex-wrap d-flex"
                        dangerouslySetInnerHTML={{
                          __html: sanitizedDesc(
                            task.description.length > 60
                              ? task.description.slice(0, 60) + "..."
                              : task.description
                          ),
                        }}
                      />
                    </td>
                    <td style={rowBodyStyle(darkMode)}>
                      {getFormattedDate(task.startDate)}
                    </td>
                    <td style={rowBodyStyle(darkMode)}>
                      {getFormattedDate(task.endDate)}
                    </td>
                    <td style={rowBodyStyle(darkMode)}>
                      {task.adminMail?.Email}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCompleteTask;