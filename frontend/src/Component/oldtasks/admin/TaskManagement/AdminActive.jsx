import React, { useState, useEffect, useContext } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import axios from "axios";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdCancel,
  MdEdit,
  MdOutlineCancel,
} from "react-icons/md";
import ActiveTask from "../../../img/Task/ActiveTask.svg";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BsFiletypeDoc } from "react-icons/bs";
import BASE_URL from "../../../Pages/config/config";
import toast from "react-hot-toast";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";

import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import AvatarGroup from "../../../Pages/AvatarGroup/AvatarGroup";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import { useNavigate } from "react-router-dom";
import profile from "../../../img/profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { addDetails } from "../../../redux/slices/messageSlice";
import api from "../../../../Pages/config/api";

const AdminActive = () => {
  const [tasks, setTasks] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const email = userData?.Email;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [allImage, setAllImage] = useState(null);
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { darkMode } = useTheme();
  const [flash, setFlash] = useState(false);
  const { setMessageData } = useContext(AttendanceContext);
  const navigate = useNavigate();
  const [updatedTask, setUpdatedTask] = useState({
    id: "",
    Taskname: "",
    description: "",
    startDate: "",
    endDate: "",
    managerEmail: "",
    duration: 0,
    comment: 0,
  });
  const [totalAssignedTasks, setTotalAssignedTasks] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000); // Update every second
  //   return () => clearInterval(interval);
  // }, []);

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
 const getPdf = async () => {
  try {
    const result = await api.get("/api/getTask"); // ✅ No BASE_URL needed
    setAllImage(result.data.data);
  } catch (error) {
    console.error("Error fetching PDF data:", error.message);
  }
};


  const showPdf = (id) => {
    let require =
      allImage &&
      allImage.filter((val) => {
        return val._id === id;
      });

    window.open(`${BASE_URL}/${require[0].pdf}`, "_blank", "noreferrer");
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`, {
       
      });

      setTasks(response.data);

      // Update the totalAssignedTasks state with the count of assigned tasks
      const assignedTasksCount = response.data.filter(
        (task) => task.status === "Pending" && task.adminMail.Email === email
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

    if (cancellationRemarks === null || cancellationRemarks.trim() === "") {
      // If user clicks Cancel or enters empty remarks
      toast.error("Cancellation remarks are required!");
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

    // Refresh the task list
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

  const navigateHandler = (taskId, to, task) => {
    dispatch(
      addDetails({
        taskId: task._id,
        to: [to.Email],
        task: task.adminMail.profile ? task.adminMail.profile : null,
        name,
        taskName: task.Taskname,
      })
    );

    navigate("/admin/admin_manager");
  };

  // const handleUpdate = async () => {
  //   try {
  //     await axios.put(`${BASE_URL}/api/tasks/${updatedTask.id}`, {
  //       Taskname: updatedTask.Taskname,
  //       description: updatedTask.description,
  //       startDate: updatedTask.startDate,
  //       endDate: updatedTask.endDate,
  //       managerEmail: updatedTask.managerEmail,
  //       duration: updatedTask.duration,
  //       comment: updatedTask.comment,
  //     });

  //     // Display success notification
  //     toast.success("Task updated successfully!");

  //     // Close the update modal
  //     handleCloseUpdateModal();

  //     // Update the UI by fetching the latest tasks
  //     fetchData();
  //   } catch (error) {
  //     console.error("Error updating task:", error.message);
  //     toast.error("Failed to update task. Please try again.");
  //   }
  // };

  const handleUpdate = async () => {
    try {
      await api.put(
        `/api/tasks/${updatedTask.id}`,
        {
          Taskname: updatedTask.Taskname,
          description: updatedTask.description,
          startDate: updatedTask.startDate,
          endDate: updatedTask.endDate,
          managerEmail: updatedTask.managerEmail,
          duration: updatedTask.duration,
          comment: updatedTask.comment,
        },
      );

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

  const calculateProgress = (task) => {
    const totalEmployees =
      task.employees.length -
      task.employees.filter((emp) => emp.empTaskStatus === "Rejected").length;
    const completedTasks = task.employees.filter(
      (emp) => emp.empTaskStatus === "Completed"
    ).length;
    return (completedTasks / totalEmployees) * 100;
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const images = [
    "https://i.pinimg.com/originals/07/33/ba/0733ba760b29378474dea0fdbcb97107.png",
    "https://th.bing.com/th/id/OIP.JOHFjMBnZGE-SOXzMSxdRwAAAA?w=402&h=467&rs=1&pid=ImgDetMain",
    "https://www.uscareerinstitute.edu/images/accounting-AAS-outcomes.jpg",
    "https://localist-images.azureedge.net/photos/43897493381666/square_300/51e7610f317e68641dedf4c24787c5056937a657.jpg",
    "https://drscdn.500px.org/photo/81956917/q%3D80_m%3D1000/v2?sig=fa09099be5e5d95d537e9656700fc1f56e29f00fd5dcccc8241aca59e4a60632",
    "https://www.tejgaoncollege.edu.bd/wp-content/uploads/2022/04/Tanjida-Akter.jpg",
  ];

  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "100",
    padding: ".5rem",
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
  return (
    <div className="container-fluid py-2">
      <TittleHeader
        title={"Active Task"}
        numbers={totalAssignedTasks}
        message={"You can view all assigned task status here."}
      />
      {loading && (
        <div
          style={{ width: "100%", height: "100%" }}
          className="d-flex aline-center gap-2"
        >
          <div
            className="spinner-grow bg-primary"
            style={{ width: "1rem", height: "1rem" }}
            role="status"
          ></div>

          <span className="text-primary fw-bold">Loading...</span>
        </div>
      )}
      {tasks.filter(
        (task) => task.status === "Pending" && task.adminMail.Email === email
      ).length > 0 ? (
        <div className="row mx-auto">
          {tasks
            .filter(
              (task) =>
                task.status === "Pending" && task.adminMail.Email === email
            )
            .reverse()
            .map((task, index) => (
              <div
                key={task._id}
                style={{
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
                className="col-12 col-md-6 col-lg-4 p-2"
              >
                <div
                  style={{
                    border: !darkMode
                      ? "1px solid var(--primaryDashMenuColor)"
                      : "1px solid var(--secondaryDashColorDark)",
                  }}
                  className="task-hover-effect p-2"
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 style={{wordWrap:"anywhere"}}>{task.Taskname}</h5>
                    <button className="btn btn-primary">{task.status}</button>
                  </div>
                  <hr />
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        style={{
                          height: "30px",
                          width: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        src={
                          task.adminMail.profile
                            ? task.adminMail.profile.image_url
                            : profile
                        }
                        alt=""
                      />{" "}
                      <div className="d-flex flex-column">
                        <span>{task.adminMail.Email}</span>
                        <span>{accountAccess(task.adminMail.Account)}</span>
                      </div>
                    </div>

                    <span
                      style={{
                        border: darkMode
                          ? "1px solid var(--primaryDashColorDark)"
                          : "1px solid var(--primaryDashMenuColor)",
                      }}
                      className="px-2 py-1 text-center"
                    >
                      {task.department}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        style={{
                          height: "30px",
                          width: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        src={
                          task.managerEmail.profile
                            ? task.managerEmail.profile.image_url
                            : profile
                        }
                        alt=""
                      />{" "}
                      <div className="d-flex flex-column">
                        <span>{task.managerEmail.Email}</span>
                        <span>{accountAccess(task.managerEmail.Account)}</span>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="my-3 d-flex flex-column gap-1">
                    <h6>Task Description</h6>
                    <span style={{wordWrap:"anywhere"}}>{task.description}</span>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between gap-3 my-2">
                      <span className="d-flex flex-column">
                        <h6>Task Duration</h6>
                        <span style={{ width: "fit-content" }}>
                          {task.duration} days
                        </span>
                      </span>{" "}
                      <span className="d-flex flex-column">
                        <h6>Start Date</h6>{" "}
                        <span style={{ width: "fit-content" }}>
                          {getFormattedDate(task.startDate)}
                        </span>
                      </span>
                      <span className="d-flex flex-column">
                        <h6>End Date</h6>{" "}
                        <span style={{ width: "fit-content" }}>
                          {getFormattedDate(task.endDate)}
                        </span>
                      </span>
                    </div>
                    <div style={{ maxWidth: "100%" }}>
                      <div className="d-flex align-items-center justify-content-between my-3">
                        <AvatarGroup images={task.employees} />
                        <div
                          className="d-flex"
                          style={{
                            width: "4rem",
                            height: "4rem",
                            borderRadius: "50%",
                          }}
                        >
                          <CircularProgressbar
                            className="fw-bold"
                            value={calculateProgress(task)}
                            text={`${calculateProgress(task).toFixed(0)}%`}
                            styles={buildStyles({
                              pathColor: "#28a745",
                              textColor: "#28a745",
                            })}
                          />
                        </div>
                      </div>
                      <span
                        style={{ cursor: "pointer" }}
                        onMouseEnter={() => setTimeinfo("name")}
                        onMouseLeave={() => setTimeinfo(false)}
                        onClick={() => toggleTaskDetails(task._id)}
                      >
                        {expandedTaskId === task._id ? (
                          <span>
                            View Less <MdArrowDropUp className="fs-4" />
                          </span>
                        ) : (
                          <span>
                            {" "}
                            View Details <MdArrowDropDown className="fs-4" />
                          </span>
                        )}
                      </span>
                    </div>
                    {expandedTaskId === task._id && (
                      <>
                        {" "}
                        <div
                          style={{
                            maxWidth: "100%",
                            overflow: "auto",
                          }}
                        >
                          <table striped bordered hover>
                            <thead>
                              <tr>
                                <th style={rowHeadStyle}>S. No </th>
                                <th style={rowHeadStyle}> Name</th>
                                <th style={rowHeadStyle}> Email</th>
                                <th style={rowHeadStyle}> Designation</th>
                                <th style={rowHeadStyle}> Task Status</th>
                                <th style={rowHeadStyle}> Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {task.employees.map((taskemp, i) => (
                                <tr key={i}>
                                  <td
                                    style={{
                                      verticalAlign: "middle",
                                      whiteSpace: "pre",
                                      backgroundColor:
                                        taskemp.empTaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : taskemp.empTaskStatus === "Rejected"
                                          ? "rgba(214, 92, 44, 0.636)"
                                          : "inherit",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var(--primaryDashMenuColor)",
                                      border: "none",
                                      padding: ".5rem",
                                    }}
                                  >
                                    {i + 1}
                                  </td>
                                  <td
                                    style={{
                                      verticalAlign: "middle",
                                      whiteSpace: "pre",
                                      backgroundColor:
                                        taskemp.empTaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : taskemp.empTaskStatus === "Rejected"
                                          ? "rgba(214, 92, 44, 0.636)"
                                          : "inherit",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var(--primaryDashMenuColor)",
                                      border: "none",
                                      padding: ".5rem",
                                    }}
                                  >
                                    {`${taskemp.employee.FirstName} ${taskemp.employee.LastName}`}
                                  </td>
                                  <td
                                    style={{
                                      verticalAlign: "middle",
                                      whiteSpace: "pre",
                                      backgroundColor:
                                        taskemp.empTaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : taskemp.empTaskStatus === "Rejected"
                                          ? "rgba(214, 92, 44, 0.636)"
                                          : "inherit",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var(--primaryDashMenuColor)",
                                      border: "none",
                                      padding: ".5rem",
                                    }}
                                  >
                                    {taskemp.employee.Email}
                                  </td>
                                  <td
                                    style={{
                                      verticalAlign: "middle",
                                      whiteSpace: "pre",
                                      backgroundColor:
                                        taskemp.empTaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : taskemp.empTaskStatus === "Rejected"
                                          ? "rgba(214, 92, 44, 0.636)"
                                          : "inherit",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var(--primaryDashMenuColor)",
                                      border: "none",
                                      padding: ".5rem",
                                    }}
                                  >
                                    {taskemp.employee.position[0].PositionName}
                                  </td>
                                  <td
                                    style={{
                                      verticalAlign: "middle",
                                      whiteSpace: "pre",
                                      backgroundColor:
                                        taskemp.empTaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : taskemp.empTaskStatus === "Rejected"
                                          ? "rgba(214, 92, 44, 0.636)"
                                          : "inherit",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var(--primaryDashMenuColor)",
                                      border: "none",
                                      padding: ".5rem",
                                    }}
                                  >
                                    {taskemp.empTaskStatus}
                                  </td>
                                  <td
                                    style={{
                                      verticalAlign: "middle",
                                      whiteSpace: "pre",
                                      backgroundColor:
                                        taskemp.empTaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : taskemp.empTaskStatus === "Rejected"
                                          ? "rgba(214, 92, 44, 0.636)"
                                          : "inherit",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var(--primaryDashMenuColor)",
                                      border: "none",
                                      padding: ".5rem",
                                    }}
                                  >
                                    {taskemp.empTaskComment}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="d-flex flex-column my-2">
                          Remarks
                          <span>{task.comment}</span>
                        </div>
                        {/* <div className="d-flex flex-column gap-1 mt-2 ">
                            <span className="mb-2">Remaining Time</span>
                            <div className="d-flex gap-2 RemainingTimeHandel justify-content-between ">
                              {calculateRemainingTime(task.endDate).delay ? (
                                <div>
                                  <div className="text-center d-none ">
                                    <div className="form-control fw-bold p-0">
                                      {calculateRemainingTime(task.endDate).days}
                                    </div>
                                    <div>Day</div>
                                  </div>
                                  <span
                                    className={`border px-2 py-1 border-danger ${
                                      flash ? "flash" : ""
                                    }`}
                                  >
                                    Please finish the task as soon as you can, as
                                    it's running late.
                                  </span>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <div
                                    className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                    style={{
                                      boxShadow: "0 0 5px 2px gray inset",
                                      height: "30px",
                                      minWidth: "30px",
                                    }}
                                  >
                                    {calculateRemainingTime(task.endDate).days}{" "}
                                  </div>{" "}
                                  <div>Day</div>
                                </div>
                              )}
                              {calculateRemainingTime(task.endDate).delay ? (
                                <div className="text-center d-none">
                                  <div
                                    className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                    style={{
                                      boxShadow: "0 0 5px 2px gray inset",
                                      height: "30px",
                                      minWidth: "30px",
                                    }}
                                  >
                                    {calculateRemainingTime(task.endDate).hours}{" "}
                                  </div>{" "}
                                  <div>Min</div>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <div
                                    className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                    style={{
                                      boxShadow: "0 0 5px 2px gray inset",
                                      height: "30px",
                                      minWidth: "30px",
                                    }}
                                  >
                                    {calculateRemainingTime(task.endDate).hours}{" "}
                                  </div>{" "}
                                  <div>Hrs</div>
                                </div>
                              )}
                              {calculateRemainingTime(task.endDate).delay ? (
                                <div className="text-center d-none">
                                  <div
                                    className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                    style={{
                                      boxShadow: "0 0 5px 2px gray inset",
                                      height: "30px",
                                      minWidth: "30px",
                                    }}
                                  >
                                    {calculateRemainingTime(task.endDate).minutes}{" "}
                                  </div>{" "}
                                  <div>Min</div>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <div
                                    className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                    style={{
                                      boxShadow: "0 0 5px 2px gray inset",
                                      height: "30px",
                                      minWidth: "30px",
                                    }}
                                  >
                                    {calculateRemainingTime(task.endDate).minutes}{" "}
                                  </div>{" "}
                                  <div>Min</div>
                                </div>
                              )}
                            </div>
                          </div> */}
                        <hr />
                        <div className="d-flex flex-column gap-2 my-2">
                          Action
                          <div className="d-flex gap-3  just"></div>
                        </div>
                      </>
                    )}
                    {expandedTaskId === task._id && (
                      <div>
                        <div className="d-flex flex-column my-2">
                          <h6>Remarks</h6>
                          <span>{task.comment}</span>
                        </div>
                        <hr />
                        <span className="d-flex flex-column gap-1">
                          <h6>Time Left</h6>
                          <span>
                            <div
                              style={{
                                display:
                                  expandedTaskId === task._id ? "flex" : "none",
                              }}
                            >
                              <div className="d-flex gap-2 justify-content-between">
                                {calculateRemainingTime(task.endDate).delay ? (
                                  <div className="">
                                    <span className=" rounded-5 border border-danger  my-auto  p-1 px-2">
                                      Please finish the task as soon as you can,
                                      as it's running late.
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="text-center">
                                      <div
                                        className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                        style={{
                                          boxShadow: "0 0 5px 2px gray inset",
                                          height: "30px",
                                          minWidth: "30px",
                                        }}
                                      >
                                        {
                                          calculateRemainingTime(task.endDate)
                                            .days
                                        }
                                      </div>
                                      <div>Day</div>
                                    </div>
                                    <div className="text-center">
                                      <div
                                        className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                        style={{
                                          boxShadow: "0 0 5px 2px gray inset",
                                          height: "30px",
                                          minWidth: "30px",
                                        }}
                                      >
                                        {
                                          calculateRemainingTime(task.endDate)
                                            .hours
                                        }
                                      </div>
                                      <div>Hrs</div>
                                    </div>
                                    <div className="text-center">
                                      <div
                                        className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                        style={{
                                          boxShadow: "0 0 5px 2px gray inset",
                                          height: "30px",
                                          minWidth: "30px",
                                        }}
                                      >
                                        {
                                          calculateRemainingTime(task.endDate)
                                            .minutes
                                        }
                                      </div>
                                      <div>Min</div>
                                    </div>
                                    <div className="text-center">
                                      <div
                                        className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                        style={{
                                          boxShadow: "0 0 5px 2px gray inset",
                                          height: "30px",
                                          minWidth: "30px",
                                        }}
                                      >
                                        {
                                          calculateRemainingTime(task.endDate)
                                            .seconds
                                        }
                                      </div>
                                      <div>Sec</div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </span>
                        </span>
                        <div className="d-flex flex-column gap-2 my-2">
                          Action
                          <div
                            style={{ height: "fit-content" }}
                            className="d-flex pt-3 gap-2"
                          >
                            {allImage && allImage.length > 0 && (
                              <button
                                className="btn btn-info d-flex justify-center aline-center gap-2"
                                onClick={() => showPdf(task._id)}
                              >
                                <BsFiletypeDoc />
                                View Docs
                              </button>
                            )}
                            <button
                              className="btn btn-primary d-flex justify-center aline-center gap-2"
                              onClick={() => updateTask(task._id)}
                            >
                              <MdEdit />
                              Update Task
                            </button>
                            <button
                              className="btn btn-primary d-flex justify-center aline-center gap-2"
                              onClick={() =>
                                navigateHandler(
                                  task._id,
                                  task.managerEmail,
                                  task
                                )
                              }
                            >
                              <MdEdit />
                              Ask Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div
          className="d-flex flex-column gap-3 align-items-center justify-content-center"
          style={{ height: "80vh" }}
        >
          <img
            style={{ width: "15rem", height: "auto" }}
            src={ActiveTask}
            alt=""
          />
          <p style={{ color: !darkMode ? "white" : "black" }}>
            Sorry, there are no tasks assigned yet.
          </p>
        </div>
      )}

      <Modal
        show={showUpdateModal}
        fullscreen={false}
        onHide={handleCloseUpdateModal}
      >
        <Modal.Header closeButton>
          <h6>Update Task</h6>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex flex-column gap-3">
            <Form.Group controlId="formTaskName">
              <Form.Label>Task Name</Form.Label>
              <input
                className="form-control rounded-0"
                type="text"
                value={updatedTask.Taskname}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, Taskname: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <textarea
                className="form-control rounded-0"
                as="textarea"
                value={updatedTask.description}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <div className="row">
              <Form.Group className="col-12 col-md-6" controlId="startDate">
                <Form.Label>Start Date </Form.Label>
                <input
                  className="form-control rounded-0"
                  type="date"
                  value={updatedTask.startDate}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      startDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="col-12 col-md-6" controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <input
                  className="form-control rounded-0"
                  type="date"
                  value={updatedTask.endDate}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      endDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="col-12" controlId="comment">
                <Form.Label>Remarks</Form.Label>
                <input
                  className="form-control rounded-0"
                  type="text"
                  value={updatedTask.comment}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      comment: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>

            <Button variant="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminActive;
