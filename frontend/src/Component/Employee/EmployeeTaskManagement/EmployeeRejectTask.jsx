import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import RequestImage from "../../../img/Request/Request.svg";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import profile from "../../../img/profile.jpg";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import EmpTaskDetails from "./TaskContainer/EmpTaskDetails";
import { useViewContext } from "../../../Context/ViewContax/viewType";
import { GiDuration } from "react-icons/gi";
import { FaRegDotCircle } from "react-icons/fa";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import api from "../../../Pages/config/api";

const EmployeeRejectTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useSelector((state) => state.user);

  const email = userData?.Email;
  const { darkMode } = useTheme();

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`, {
        params: { status: "Completed" },
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching completed tasks:", error.message);
      setError("Error fetching completed tasks. Please try again later.");
    } finally {
      setLoading(false);
      // Schedule the next update after 1 minute (adjust as needed
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  // ---------------task view and card-----------------------//
  const [selectedTask, setSelectedTask] = useState(null); // To track the selected task
  const { viewType } = useViewContext();
  const handleCardClick = (task) => {
    setSelectedTask(task); // Set the selected task to navigate to details
  };

  const handleBack = () => {
    setSelectedTask(null); // Reset the selected task to go back
  };

  if (selectedTask) {
    // Render TaskDetails if a task is selected
    return <EmpTaskDetails task={selectedTask} onBack={handleBack} />;
  }
  const ShortedText = (text) => {
    return text; // No length restriction or truncation
  };

  const sanitizedDesc = (description) => {
    if (!description) return "";

    return ShortedText(
      description
        .replace(/<img[^>]*>/g, "")
        .replace(/<iframe[^>]*>/g, "")
        .replace(/<h1[^>]*>.*?<\/h1>/gi, "")
        .replace(/<h2[^>]*>.*?<\/h2>/gi, "")
        .replace(/<script[^>]*>.*?<\/script>/gi, "")
    );
  };
  return (
    <div className="">
      {tasks && tasks.length > 0 ? (
        email &&
          tasks.filter(
            (task) =>
              task.status === "Pending" &&
              task.employees.some(
                (taskemp) =>
                  taskemp.employee.Email === email &&
                  taskemp.empTaskStatus === "Rejected"
              )
          ).length > 0 ? (
          viewType === "card" ? (
            <div className="row p-1">
              {tasks
                .filter((task) =>
                  task.employees.some(
                    (taskemp) =>
                      taskemp.employee.Email === email &&
                      taskemp.empTaskStatus === "Rejected"
                  )
                )
                .reverse()

                .map((task) => (
                  <div
                    className="col-xl-4 p-2"
                    onClick={() => handleCardClick(task)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card" style={{ borderBottom: "2px solid #BF1722",
background: darkMode ? "transparent" : "rgb(43, 44, 44)",
                    color: darkMode ? "#3c3c3c" : "#f2f2f2",
                        }}>
                      <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                        <h5 class=" fw-medium">{task.taskID}</h5>
                        <div class="d-flex align-items-center">
                          <span
                            // className={`badge ${getBadgeClass(task.Priority)}`}
                            className={`priority-badge ${task.Priority.toLowerCase()}`}

                          >
                            <FaRegDotCircle /> {task.Priority}
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center pb-3  ">
                          <div>
                            {/* <h6 className="mb-1">{task.Taskname}</h6> */}
                            <h6 className="mb-1">{task.Taskname.slice(0, 60) + "..."}</h6>

                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="mb-3">
                              <span className="mb-1 d-block">Start Date</span>
                              <p className="">
                                {" "}
                                {getFormattedDate(task.startDate)}
                              </p>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="mb-3">
                              <span className="mb-1 d-block">End Date</span>
                              <p className="">
                                {" "}
                                {getFormattedDate(task.endDate)}
                              </p>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="mb-3">
                              <span className="mb-1 d-block">Project Lead</span>
                              <h6 className="fw-normal d-flex align-items-center">
                                <img
                                  className="avatar avatar-xs rounded-circle me-1"
                                  src={
                                    task.managerEmail.profile
                                      ? task.managerEmail.profile.image_url
                                      : profile
                                  }
                                  alt="Img"
                                />
                                {task.managerEmail.FirstName}{" "}
                                {task.managerEmail.LastName}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="p-2"style={{
                        background: darkMode ? "#F8F9FA" : "#161515f6",
                        color: darkMode ? "#3c3c3c" : "#f2f2f2",}}>
                          <div className="row align-items-center">
                            <div className="col-6">
                              <span className="fw-medium d-flex align-items-center">
                                <GiDuration />
                                Duration: {task.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-2 my-2">
                          <div
                            className={`${darkMode
                              ? "p-2 py-2 badge-danger"
                              : "p-2 py-2 badge-danger-dark"
                              }`}
                          >
                            {email &&
                              task.employees
                                .filter(
                                  (taskemp) =>
                                    taskemp.employee.Email === userData.Email
                                )
                                .map((taskemp, i) => (
                                  <div key={i}>
                                    <h6>Task Rejection Remarks</h6>
                                    <p className="my-auto">
                                      You have rejected this task.
                                    </p>
                                    <p className="my-auto">
                                      <b>Comment : </b>{" "}
                                      {taskemp?.empTaskComment || ""}
                                    </p>
                                  </div>
                                ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="table-responsive my-3 p-0" style={{ borderRadius: "10px", border: "1px solid #E9EAEB", overflowX: "auto", }}>
              <table className="table table-hover" style={{ position: "relative" }}>
                <thead style={{ position: "sticky", top: 0, background: darkMode ? "#333" : "#fff", zIndex: 1000 }}>
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
                        task.managerEmail.Email === email
                    )
                    .reverse()
                    .map((task) => (
                      <tr
                        key={task._id}

                      >
                        <td style={rowBodyStyle(darkMode)}> <span onClick={() => handleCardClick(task)}
                          style={{ cursor: "pointer", color: 'rgba(18, 41, 216,1)', fontWeight: '500' }}>{task.Taskname.slice(0, 30)}{task.Taskname.length > 30 && "..."}</span></td>
                        <td style={rowBodyStyle(darkMode)}>
                          {" "}
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
                        <td style={rowBodyStyle(darkMode)}>{getFormattedDate(task.startDate)}</td>
                        <td style={rowBodyStyle(darkMode)}>{getFormattedDate(task.endDate)}</td>
                        <td style={rowBodyStyle(darkMode)}>{task.adminMail.Email}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div
            className="d-flex flex-column gap-3 align-items-center justify-content-center"
            style={{ height: "80vh" }}
          >
            <img
              style={{ width: "15rem", height: "auto" }}
              src={RequestImage}
              alt="No tasks found"
            />
            <p
              style={{
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              There is no task found at this moment.
            </p>
          </div>
        )
      ) : (
        <div
          className="d-flex flex-column gap-3 align-items-center justify-content-center"
          style={{ height: "80vh" }}
        >
          <img
            style={{ width: "15rem", height: "auto" }}
            src={RequestImage}
            alt="No tasks found"
          />
          <p
            style={{
              color: darkMode
                ? "var(--primaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
          >
            There is no task found at this moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeRejectTask;
