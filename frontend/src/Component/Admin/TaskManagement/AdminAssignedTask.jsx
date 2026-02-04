import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import toast from "react-hot-toast";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import profile from "../../../img/profile.jpg";
import { useSelector } from "react-redux";
import TaskDetails from "./taskHead/Taskdetails.jsx";
import { FaRegDotCircle, } from "react-icons/fa";
import "./taskmanagement.css"; //
import { GiDuration } from "react-icons/gi";
import { useViewContext } from "../../../Context/ViewContax/viewType.js";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle.js";
import api from "../../../Pages/config/api.js";

const AdminAssignedTask = ({ toggleDisplay }) => {
  const { userData } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [allImage, setAllImage] = useState(null);
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { darkMode } = useTheme();
  const email = userData?.Email;


  console.log(tasks);


  const [updatedTask, setUpdatedTask] = useState({
    id: "",
    Taskname: "",
    description: "",
    startDate: "",
    endDate: "",
    managerEmail: "",
    duration: 0,
    comment: "",
  });
  const [totalAssignedTasks, setTotalAssignedTasks] = useState(0);

  useEffect(() => {
    getPdf();
  }, []);
  const getPdf = async () => {
    const result = await axios.get(`${BASE_URL}/api/getTask`);

    setAllImage(result.data.data);
  };
  function pdfOpener(val) {
    window.open(`${BASE_URL}/${val}`, "_blank", "noreferrer");
  }
  const showPdf = (id) => {
    let require =
      allImage &&
      allImage.filter((val) => {
        return val._id === id;
      });
    if (require[0].pdf.length > 1) {
      require[0].pdf.map((val) => {
        pdfOpener(val);
        console.log(val);
      });
    } else {
      console.log(require[0].pdf);
      window.open(`${BASE_URL}/${require[0].pdf[0]}`, "_blank", "noreferrer");
    }

    console.log(require[0].pdf);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  const calculateRemainingTime = (endDate) => {
    const now = currentTime;
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
      return { delay: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    } else {
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      return { delay: false, days, hours, minutes, seconds };
    }
  };

  useEffect(() => {
    getPdf();
  }, []);
  // const getPdf = async () => {
  //   const result = await axios.get(`${BASE_URL}/api/getTask`);

  //   setAllImage(result.data.data);
  // };
  // const showPdf = (id) => {
  //   let require =
  //     allImage &&
  //     allImage.filter((val) => {
  //       return val._id === id;
  //     });

  //   window.open(`${BASE_URL}/${require[0].pdf}`, "_blank", "noreferrer");
  // };

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`, {
      });
      setTasks(response.data);
      // Update the totalAssignedTasks state with the count of assigned tasks
      const assignedTasksCount = response.data.filter(
        (task) => task.status === "Assigned" && task.adminMail.Email === email
      ).length;
      setTotalAssignedTasks(assignedTasksCount);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
      // Schedule the next update after 1 minute (adjust as needed)
    }
  };

  useEffect(() => {
    fetchData();

    return () => clearTimeout();
  }, []);

  const cancelTask = async (taskId) => {
  try {
    setIsCanceling(true);

    // Prompt the user for cancellation remarks
    const cancellationRemarks = prompt("Enter remarks for task cancellation:");

    if (cancellationRemarks === null) {
      // If the user clicks Cancel in the prompt, do nothing
      setIsCanceling(false);
      return;
    }

    // Update the task status to "Cancelled" in the database
    await api.put(
      `/api/tasks/${taskId}`,
      {
        status: "Cancelled",
        comment: cancellationRemarks,
      },
    );

    // Display success notification
    toast.success("Task canceled successfully!");

    // Update the UI by fetching the latest tasks
    fetchData();
  } catch (error) {
    console.error("Error canceling task:", error.message);
    toast.error("Failed to cancel task. Please try again.");
  } finally {
    setIsCanceling(false);
  }
};


  const updateTask = (taskId) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);

    if (taskToUpdate) {
      setUpdatedTask({
        id: taskToUpdate._id,
        Taskname: taskToUpdate.Taskname,
        description: taskToUpdate.description,
        startDate: taskToUpdate.startDate,
        endDate: taskToUpdate.endDate,
        managerEmail: taskToUpdate.managerEmail,
        duration: taskToUpdate.duration,
        comment: taskToUpdate.comment,
      });

      setShowUpdateModal(true);
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/api/tasks/${updatedTask.id}`, {
        Taskname: updatedTask.Taskname,
        description: updatedTask.description,
        startDate: updatedTask.startDate,
        endDate: updatedTask.endDate,
        managerEmail: updatedTask.managerEmail,
        duration: updatedTask.duration,
        comment: updatedTask.comment,
      });

      // Display success notification
      toast.success("Task updated successfully!");

    
      // Close the update modal
      handleCloseUpdateModal();

      // Update the UI by fetching the latest tasks
      fetchData();
    } catch (error) {
      console.error("Error updating task:", error.message);
      toast.error("Failed to update task. Please try again.");
    }
  };




  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };
  const accountAccess = (value) => {
    switch (value) {
      case 1: {
        return "Admin";
      }
      case 2: {
        return "Hr";
      }
      case 3: {
        return "Employee";
      }
      case 4: {
        return "Manager";
      }
    }
  };

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
    return <TaskDetails task={selectedTask} onBack={handleBack} />;
  }
  const getBadgeClass = (priority) => {
    switch (priority) {
      case "High":
        return "badge-danger";
      case "Medium":
        return "badge-warning";
      case "Low":
        return "badge-success";
      default:
        return "badge-secondary";
    }
  };

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
      {viewType === "card" ? (
        <div className="row p-1">
          {tasks
            .filter(
              (task) =>
                task.status === "Assigned"
              // && task.adminMail.Email === email
            )
            .reverse()
            .map((task) => (
              <div
                className="col-xl-4 p-2"
                onClick={() => handleCardClick(task)}
                style={{ cursor: "pointer" }}
              >
                <div className="card" style={{
                  borderBottom: "2px solid #FF1493", background: darkMode ? "transparent" : "rgb(43, 44, 44)",
                  color: darkMode ? "#3c3c3c" : "#f2f2f2",
                }}>
                  <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5 class="fw-medium">{task.taskID}</h5>
                    <div class="d-flex align-items-center">
                      <span className={`priority-badge ${task.Priority.toLowerCase()}`}>
                        <FaRegDotCircle />   {task.Priority}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center pb-3  ">
                      <div>
                        <h6 className="mb-1">{task.Taskname.slice(0, 50) + "..."}</h6>
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
                    <div className="p-2"
                      style={{
                        background: darkMode ? "#F8F9FA" : "#161515f6",
                        color: darkMode ? "#3c3c3c" : "#f2f2f2",
                      }}>
                      <div className="row align-items-center">
                        <div className="col-6">
                          <span className="fw-medium d-flex align-items-center">
                            <GiDuration />
                            Duration: {task.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="table-responsive my-3 p-0"
          style={{
            borderRadius: "10px", border: "1px solid #E9EAEB", overflowX: "auto", overflowY: "auto", maxHeight: "500px", position: "relative",
          }}  // Set a fixed height for vertical scrolling
        >
          <table className="table table-hover" style={{ minWidth: "800px" }}>
            <thead style={{
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
                    task.status === "Assigned"
                  // && task.adminMail.Email === email
                )
                .reverse()
                .map((task) => (
                  <tr
                    key={task._id} // Ensure a unique key

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
      )}
    </div>
  );
};

export default AdminAssignedTask;
