import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdOutlineCancel,
} from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../Pages/config/config";
import AssignTask from "../../../img/Task/AssignTask.svg";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { RiAttachmentLine } from "react-icons/ri";
import { IoIosArrowRoundForward, IoMdDoneAll } from "react-icons/io";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import { PiInfoLight } from "react-icons/pi";
import profile from "../../../img/profile.jpg";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api";
const ManagerNewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empData, setEmpData] = useState(null);
  const [status, setStatus] = useState({ accepted: false, rejected: false });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [allImage, setAllImage] = useState(null);
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [, setIsAccepted] = useState(false);
  const [, setIsRejected] = useState(false);
  const { userData } = useSelector((state) => state.user);

  const { darkMode } = useTheme();

  const taskId = uuidv4();
  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const email = userData?.Email;
  const id = userData?._id;

  const { socket } = useContext(AttendanceContext);

  const loadEmployeeData = () => {
    api
      .get(`/api/particularEmployee/${id}`, {
        
      })
      .then((response) => {
        setEmpData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

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

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`, {
      });

      setTasks(response.data);
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

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/api/getTask`);
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching PDF data:", error.message);
    }
  };

  const showPdf = (id) => {
    const require = allImage?.find((val) => val._id === id);
    if (require) {
      window.open(`${BASE_URL}/${require.pdf}`, "_blank", "noreferrer");
    }
  };

  // const handleTaskAction = async (taskID, taskName, adminMail, action) => {
  //   const actionMapping = {
  //     accept: {
  //       setStatus: setStatus,
  //       statusKey: "accepted",
  //       newStatus: "Pending",
  //       message: "Accepted",
  //       toastMessage: "Task Accepted successfully!"
  //     },
  //     reject: {
  //       setStatus: setStatus,
  //       statusKey: "rejected",
  //       newStatus: "Rejected",
  //       message: "Rejected",
  //       toastMessage: "Task Rejected"
  //     }
  //   };

  //   const actionConfig = actionMapping[action];
  //   if (!actionConfig) return;

  //   const { setStatus, statusKey, newStatus, message, toastMessage } =
  //     actionConfig;
  //   setStatus((prev) => ({ ...prev, [statusKey]: true }));

  //   const remark = prompt(`Enter remarks for ${message} Task:`);

  //   if (remark === null) {
  //     setStatus((prev) => ({ ...prev, [statusKey]: false }));
  //     return;
  //   }

  //   try {
  //     await axios.put(`${BASE_URL}/api/tasks/${taskID}`, {
  //       status: newStatus,
  //       comment: remark
  //     });

  //     toast.success(toastMessage);

  //     const taskNotificationData = {
  //       taskId,
  //       taskName,
  //       senderMail: email,
  //       adminMail,
  //       Account: 1,
  //       message: `Task ${message}`,
  //       messageBy: empData?.profile?.image_url ? name : null,
  //       profile: empData?.profile?.image_url,
  //       status: "unseen",
  //       path: action === "accept" ? "taskassign" : "taskreject"
  //     };

  //     socket.emit("adminTaskNotification", taskNotificationData);
  //     fetchData();
  //   } catch (error) {
  //     console.error(`Error ${message.toLowerCase()} task:`, error.message);
  //     toast.error(`Failed to ${message.toLowerCase()} task. Please try again.`);
  //   } finally {
  //     setStatus((prev) => ({ ...prev, [statusKey]: false }));
  //   }
  // };

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const AcceptTask = async (taskID, taskName, adminMail) => {
    try {
      setIsAccepted(true);

      // Prompt the user for Accept remarks
      const AcceptTaskRemark = prompt("Enter remarks for Accept Task:");

      if (AcceptTaskRemark === null) {
        // If the user clicks Cancel in the prompt, do nothing
        setIsAccepted(false);
        return;
      }

      // Update the task status to "Cancelled" in the database
      await api.put(
        `/api/tasks/${taskID}`,
        {
          status: "Pending",
          comment: AcceptTaskRemark,
        },
      );

      // Display success notification
      toast.success("Task Accepteed successfully!");

      if (empData.profile) {
        const taskNotificationData = {
          taskId,
          taskName,
          senderMail: email,
          adminMail,
          Account: 1,
          message: `Task Accepted`,
          messageBy: name,
          profile: empData.profile.image_url,
          status: "unseen",
          path: "taskassign",
        };

        socket.emit("adminTaskNotification", taskNotificationData);
      } else {
        const taskNotificationData = {
          taskId,
          taskName,
          senderMail: email,
          adminMail,
          Account: 1,
          message: `Task Accepted`,
          messageBy: name,
          profile: null,
          status: "unseen",
          path: "taskassign",
        };

        socket.emit("adminTaskNotification", taskNotificationData);
      }
      // Update the UI by fetching the latest tasks
      fetchData();
    } catch (error) {
      console.error("Error canceling task:", error.message);
      toast.error("Failed to cancel task. Please try again.");
    } finally {
      setIsAccepted(false);
    }
  };
  const RejectTask = async (taskId, taskName, adminMail) => {
    try {
      setIsRejected(true);
      const RejectRemarks = prompt("Enter remarks for Reject Task:");

      if (RejectRemarks === null) {
        setIsRejected(false);
        return;
      }

      await api.put(
        `/api/tasks/${taskId}`,
        {
          status: "Rejected",
          comment: RejectRemarks,
        },
       
      );

      toast.success("Task Rejected");
      if (empData.profile) {
        const taskNotificationData = {
          taskId,
          taskName,
          senderMail: email,
          adminMail,
          Account: 1,
          message: `Task Rejected`,
          messageBy: name,
          profile: empData.profile.image_url,
          status: "unseen",
          path: "taskreject",
        };

        socket.emit("adminTaskNotification", taskNotificationData);
      } else {
        const taskNotificationData = {
          taskId,
          taskName,
          senderMail: email,
          adminMail,
          Account: 1,
          message: `Task Rejected`,
          messageBy: name,
          profile: null,
          status: "unseen",
          path: "taskreject",
        };

        socket.emit("adminTaskNotification", taskNotificationData);
      }
      fetchData();
    } catch (error) {
      console.error("Error Rejecting task:", error.message);
      toast.error("Failed to Reject task. Please try again.");
    } finally {
      setIsRejected(false);
    }
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
    <div className="p-4">
      <div
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
        }}
      >
        <h5 style={{ fontWeight: "600" }} className="p-0 m-0 text-uppercase">
          New Task (
          {
            tasks?.filter(
              (task) =>
                task.status === "Assigned" &&
                task?.managerEmail?.Email === email
            ).length
          }
          )
        </h5>
        <p className="p-0 m-0">You can view all new tasks here!</p>
      </div>

      <div className="row mx-auto">
        {tasks?.filter(
          (task) =>
            task?.status === "Assigned" && task?.managerEmail?.Email === email
        ).length > 0 ? (
          tasks
            ?.filter(
              (task) =>
                task?.status === "Assigned" &&
                task?.managerEmail?.Email === email
            )
            .reverse()
            .map((task) => (
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
                    <h5>{task.Taskname}</h5>
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

                  <div className="my-3 d-flex flex-column gap-1">
                    <h6>Task Description</h6>
                    <span>{task.description}</span>
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
                    <div className="mt-4">
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
                          <div className="d-flex gap-3">
                            <button
                              onClick={() =>
                                AcceptTask(
                                  task._id,
                                  task.Taskname,
                                  task.adminMail.Email
                                )
                              }
                              className="btn btn-primary py-1"
                            >
                              <IoMdDoneAll /> Accept
                            </button>
                            <button
                              onClick={() => showPdf(task._id)}
                              className="btn btn-secondary py-1"
                            >
                              <RiAttachmentLine /> Attachment
                            </button>
                            <button
                              onClick={() =>
                                RejectTask(
                                  task._id,
                                  task.Taskname,
                                  task.adminMail.Email
                                )
                              }
                              className="btn btn-danger py-1"
                            >
                              <MdOutlineCancel /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div
            className="d-flex flex-column gap-3  align-items-center justify-content-center"
            style={{ height: "80vh" }}
          >
            <img
              style={{ width: "30%", height: "auto" }}
              src={AssignTask}
              alt="Assign Task"
            />
            <p
              style={{
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
              }}
            >
              Sorry, there are no tasks assigned yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerNewTask;
