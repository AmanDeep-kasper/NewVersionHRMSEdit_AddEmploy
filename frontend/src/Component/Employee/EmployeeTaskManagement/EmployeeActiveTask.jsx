import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import RequestImage from "../../../img/Request/Request.svg";
import { toast } from "react-hot-toast";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useNavigate } from "react-router-dom";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import { getFormattedDate, getTimeAgo } from "../../../Utils/GetDayFormatted";
import profile from "../../../img/profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { addDetails } from "../../../redux/slices/messageSlice";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import EmpTaskDetails from "./TaskContainer/EmpTaskDetails";
import { useViewContext } from "../../../Context/ViewContax/viewType";
import { GiDuration } from "react-icons/gi";
import { FaRegDotCircle } from "react-icons/fa";
import api from "../../../Pages/config/api";
const EmployeeActiveTask = () => {
  const dispatch = useDispatch();
  const { socket } = useContext(AttendanceContext);
  const { userData } = useSelector((state) => state.user);
  const { setMessageData } = useContext(AttendanceContext);
  const [empData, setEmpData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [allImage, setAllImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const email = userData?.Email;
  const name = `${userData?.FirstName} ${userData?.LastName}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);
  const id = userData?._id;
  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await api.get(
          `/api/personal-info/` + id,
          
        );
        setEmpData(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Error fetching personal info. Please try again later.");
      }
    };
    getPdf();
    loadPersonalInfoData();
  }, [id]);
  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`, {
        
      });
      setTasks(response.data);
      let fildata = response.data.filter(
        (task) =>
          task.status === "Pending" &&
          task.employees.some(
            (taskemp) => taskemp.empemail === email && taskemp === "Accepted"
          )
      );
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const getPdf = async () => {
    const result = await axios.get(`${BASE_URL}/api/getTask`);

    setAllImage(result.data.data);
  };

  const showPdf = (id) => {
    const require = allImage?.find((val) => val._id === id);
    if (require) {
      window.open(`${BASE_URL}/${require.pdf}`, "_blank", "noreferrer");
    }
  };

  const calculateProgress = (task) => {
    const totalEmployees =
      task.employees.length -
      task.employees.filter((emp) => emp.empTaskStatus === "Rejected").length;
    const completedTasks = task.employees.filter(
      (emp) => emp.empTaskStatus === "Completed"
    ).length;

    return (completedTasks / totalEmployees) * 100;
  };

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
                  taskemp.empTaskStatus === "Accepted"
              )
          ).length > 0 ? (
          viewType === "card" ? (
            <div className="row p-1">
              {email &&
                tasks
                  .filter(
                    (task) =>
                      task.status === "Pending" &&
                      task.employees.some(
                        (taskemp) =>
                          taskemp.employee.Email === email &&
                          taskemp.empTaskStatus === "Accepted"
                      )
                  )
                  .reverse()
                  .map((task, index) => (
                    <div
                      className="col-xl-4 p-2"
                      onClick={() => handleCardClick(task)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="card"
                        style={{ borderBottom: "2px solid #FF6347", background: darkMode ? "transparent" : "rgb(43, 44, 44)",
                          color: darkMode ? "#3c3c3c" : "#f2f2f2", }}
                      >
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
                                <span className="mb-1 d-block">
                                  Project Lead
                                </span>
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
                              <div className="col-6">
                                <div>
                                  <div className="d-flex align-items-center justify-content-between mb-1">
                                    <small className="">
                                      {`${calculateProgress(task).toFixed(
                                        0
                                      )}% Completed`}
                                    </small>
                                  </div>
                                  <div className="progress progress-xs">
                                    <div
                                      className="progress-bar bg-info"
                                      role="progressbar"
                                      style={{
                                        width: `${calculateProgress(
                                          task
                                        ).toFixed(0)}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex align-items-center justify-content-between p-2 mt-2">
                            <p className="my-auto">
                              Created At: {getTimeAgo(task.createdAt)}
                            </p>
                            <p className="my-auto">
                              Latest Updated At: {getTimeAgo(task.updatedAt)}
                            </p>
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
                  {email &&
                    tasks
                      .filter(
                        (task) =>
                          task.status === "Pending" &&
                          task.employees.some(
                            (taskemp) =>
                              taskemp.employee.Email === email &&
                              taskemp.empTaskStatus === "Accepted"
                          )
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

export default EmployeeActiveTask;
