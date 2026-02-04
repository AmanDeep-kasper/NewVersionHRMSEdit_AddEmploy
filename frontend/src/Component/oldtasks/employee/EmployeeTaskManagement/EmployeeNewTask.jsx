import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import RequestImage from "../../../img/Request/Request.svg";
import { toast } from "react-hot-toast";
import Table from "react-bootstrap/Table";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import profile from "../../../img/profile.jpg";
import AvatarGroup from "../../../Pages/AvatarGroup/AvatarGroup";
import { useSelector } from "react-redux";
import { RiAttachmentLine } from "react-icons/ri";
import {
  LuArrowRightLeft,
  LuPanelBottomClose,
  LuPanelTopClose,
} from "react-icons/lu";
import { rowHeadStyle } from "../../../Style/TableStyle";
import { getTimeAgo } from "../../../Utils/GetDayFormatted";
import api from "../../../../Pages/config/api";

const EmployeeNewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const { userData } = useSelector((state) => state.user);
  const [allImage, setAllImage] = useState(null);

  const empMail = userData?.Email;
  const { darkMode } = useTheme();
  const { socket } = useContext(AttendanceContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [empData, setEmpData] = useState(null);
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const id = userData?._id;

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await api.get(
          `/api/personal-info/` + id,
        );
        setEmpData(response.data);

        setEmail(response.data.Email);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Error fetching personal info. Please try again later.");
      }
    };

    loadPersonalInfoData();
  }, [id]);

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
    getPdf();
  }, []);
  const getPdf = async () => {
    const result = await api.get(`/api/getTask`);

    setAllImage(result.data.data);
  };
  const showPdf = (id) => {
    let require =
      allImage &&
      allImage.filter((val) => {
        return val._id === id;
      });

    window.open(`${BASE_URL}/${require[0].pdf}`, "_blank", "noreferrer");
  };

  const acceptTask = async (taskId, empEmail, task) => {
  try {
    if (!taskId || !empEmail || !task) {
      toast.error("Invalid task or employee details.");
      return;
    }

    const empRemarks = prompt("Enter remarks for accepting the task:");
    if (empRemarks === null || empRemarks.trim() === "") {
      toast.info("Task acceptance cancelled.");
      return;
    }

    // ✅ Update the task status to "Accepted" in the backend
    await api.put(
      `/api/tasks/${taskId}/employees/${empEmail}`,
      {
        empTaskStatus: "Accepted",
        empTaskComment: empRemarks,
      },
    );

    toast.success("Task accepted successfully!");

    // ✅ Prepare notification recipients (excluding rejected and current user)
    const employeeNotificationArr = task.employees
      .filter(
        (val) => val.empTaskStatus !== "Rejected" && val.employee.Email !== email
      )
      .map((val) => val.employee.Email);

    // ✅ Create a single notification object
    const employeeTaskNotification = {
      senderMail: empEmail,
      employeesEmail: [...employeeNotificationArr, task.managerEmail.Email],
      taskId,
      status: "unseen",
      taskName: task.Taskname,
      message: `Task Accepted`,
      messageBy: name || "Employee",
      profile: empData?.profile?.image_url || null,
      taskStatus: "Accepted",
      Account: 3,
      path: "activeTask",
    };

    // ✅ Emit notification via socket
    socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);

    // ✅ Refresh task data
    fetchData();
  } catch (error) {
    console.error("Error accepting task:", error);
    toast.error(error.response?.data?.message || "Failed to accept task. Please try again.");
  }
};


  const rejectTask = async (taskId, empEmail, task) => {
  try {
    if (!taskId || !empEmail || !task) {
      toast.error("Invalid task or employee details.");
      return;
    }

    const empRemarks = prompt("Enter remarks for rejecting the task:");
    if (empRemarks === null || empRemarks.trim() === "") {
      toast.info("Task rejection cancelled.");
      return;
    }

    // ✅ Update task status in the backend
    await api.put(
      `/api/tasks/${taskId}/employees/${empEmail}`,
      {
        empTaskStatus: "Rejected",
        empTaskComment: empRemarks,
      },
    );

    toast.success("Task rejected successfully!");

    // ✅ Prepare notification object
    const employeeTaskNotification = {
      senderMail: empEmail,
      employeesEmail: [task.managerEmail.Email], // Only manager notified
      taskId,
      status: "unseen",
      taskName: task.Taskname,
      message: "Task Rejected",
      messageBy: name || "Employee",
      profile: empData?.profile?.image_url || null,
      taskStatus: "Rejected",
      Account: 3,
      path: "activeTask",
    };

    // ✅ Emit notification via Socket.io
    socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);

    // ✅ Refresh task list
    fetchData();
  } catch (error) {
    console.error("Error rejecting task:", error);
    toast.error(error.response?.data?.message || "Failed to reject task. Please try again.");
  }
};


  const completeTask = async (taskId, empEmail, task) => {
  try {
    if (!taskId || !empEmail || !task) {
      toast.error("Invalid task or employee details.");
      return;
    }

    const empRemarks = prompt("Enter remarks for completing the task:");
    if (empRemarks === null || empRemarks.trim() === "") {
      toast.info("Task completion cancelled.");
      return;
    }

    // ✅ Update task status in the backend
    await api.put(
      `/api/tasks/${taskId}/employees/${empEmail}`,
      {
        empTaskStatus: "Completed",
        empTaskComment: empRemarks,
      },
    );

    toast.success("Task completed successfully!");

    // ✅ Collect other employees for notifications
    const employeeNotificationArr = task.employees
      .filter(
        (val) => val.empTaskStatus !== "Rejected" && val.employee.Email !== empEmail
      )
      .map((val) => val.employee.Email);

    // ✅ Prepare notification object
    const employeeTaskNotification = {
      senderMail: empEmail,
      employeesEmail: [...employeeNotificationArr, task.managerEmail.Email],
      taskId,
      status: "unseen",
      taskName: task.Taskname,
      taskStatus: "Completed",
      message: "Task Completed",
      messageBy: name || "Employee",
      profile: empData?.profile?.image_url || null,
      Account: 3,
      path: "activeTask",
    };

    // ✅ Emit notification via Socket.io
    socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);

    // ✅ Refresh tasks after completion
    fetchData();
  } catch (error) {
    console.error("Error completing task:", error);
    toast.error(error.response?.data?.message || "Failed to complete task. Please try again.");
  }
};


  const totalTaskAssigned = tasks.filter(
    (task) =>
      task.status === "Pending" &&
      task.employees.some(
        (taskemp) =>
          taskemp.employee.Email === email &&
          taskemp.empTaskStatus === "Task Assigned"
      )
  ).length;

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
  return (
    <div className="container-fluid py-2 h-800px">
      {loading && (
        <div
          style={{ width: "100%", height: "100%" }}
          className="d-flex align-center gap-2"
        >
          <div
            className="spinner-grow bg-primary"
            style={{ width: "1rem", height: "1rem" }}
            role="status"
          ></div>
          <span className="text-primary fw-bold">Loading...</span>
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !tasks.length && (
        <p className="text-danger">Data not available.</p>
      )}
      {email &&
      tasks.filter(
        (task) =>
          task.status === "Pending" &&
          task.employees.some(
            (taskemp) =>
              taskemp.employee.Email === email &&
              taskemp.empTaskStatus === "Task Assigned"
          )
      ).length > 0 ? (
        <div
          style={{
            maxHeight: "80vh",
            overflow: "auto",
          }}
          className="row mx-auto gap-3"
        >
          {email &&
            tasks
              .filter(
                (task) =>
                  task.status === "Pending" &&
                  task.employees.some(
                    (taskemp) =>
                      taskemp.employee.Email === email &&
                      taskemp.empTaskStatus === "Task Assigned"
                  )
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
                  className="col-12 p-0 mt-2"
                >
                  <div
                    style={{
                      background: !darkMode ? "#323232" : "#FFFFFF",
                      borderLeft: "5px solid rgb(16, 60, 184)",
                      borderTop: "0",
                      borderBottom: "0",
                      borderRight: "0",
                    }}
                    className="task-hover-effect p-3  rounded-2 shadow"
                  >
                    <div className="row">
                      <div
                        style={{ borderRight: "1px solid rgba(0,0,0,.1)" }}
                        className="col-12 col-md-6"
                      >
                        <div className="d-flex flex-column">
                          <h6 className="m-0 fw-normal">Assigned By</h6>
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
                            <div className="d-flex align-items-center justify-content-between my-2 w-100">
                              <div className="d-flex flex-column">
                                <span style={{ fontWeight: "500" }}>
                                  {task.managerEmail.FirstName}{" "}
                                  {task.managerEmail.LastName}
                                </span>

                                <span>{task.managerEmail.Email}</span>
                              </div>
                              <span
                                className={`${
                                  darkMode
                                    ? "badge-primary"
                                    : "badge-primary-dark"
                                }`}
                              >
                                {accountAccess(task.managerEmail.Account)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <h5 style={{ wordWrap: "anywhere" }}>
                          {task.Taskname}
                        </h5>
                        <span style={{ wordWrap: "anywhere" }}>
                          {task.description}
                        </span>
                        <div className="d-flex flex-column my-2">
                          <h6>Remarks</h6>
                          <span>{task.comment}</span>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="my-auto">
                            Duration:{" "}
                            <span className="text-danger ml-2">
                              {task.duration + 1}days
                            </span>
                          </p>{" "}
                          <div className="d-flex align-items-center gap-3">
                            {" "}
                            <span className="py-1 px-3 btn-primary rounded-3 border">
                              Not Accepted
                            </span>
                            <div>
                              <span
                                style={{ cursor: "pointer" }}
                                onMouseEnter={() => setTimeinfo("name")}
                                onMouseLeave={() => setTimeinfo(false)}
                                onClick={() => toggleTaskDetails(task._id)}
                              >
                                {expandedTaskId === task._id ? (
                                  <span style={{ cursor: "pointer" }}>
                                    <LuPanelTopClose
                                      title="close"
                                      className="fs-3"
                                    />
                                  </span>
                                ) : (
                                  <span style={{ cursor: "pointer" }}>
                                    <LuPanelBottomClose
                                      title="open"
                                      className="fs-3"
                                    />
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center my-3 gap-4">
                          <p
                            className={`${
                              darkMode
                                ? "badge-success my-auto"
                                : "badge-success-dark my-auto"
                            }`}
                          >
                            Start Date{" "}
                            {new Date(task.startDate)
                              .toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              .replace(",", "")}
                          </p>{" "}
                          <span className="p-2 d-flex align-items-center justify-content-center">
                            <LuArrowRightLeft />
                          </span>
                          <p
                            className={`${
                              darkMode
                                ? "badge-danger my-auto"
                                : "badge-danger-dark my-auto"
                            }`}
                          >
                            End Date{" "}
                            {new Date(task.endDate)
                              .toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              .replace(",", "")}
                          </p>
                        </div>
                        <div>
                          <span className="d-flex flex-column gap-1">
                            <h6>Remaining Time</h6>
                            <span>
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <div className="d-flex gap-2 justify-content-between">
                                  {calculateRemainingTime(task.endDate)
                                    .delay ? (
                                    <div className="">
                                      <span className=" rounded-5 border border-danger  my-auto  p-1 px-2">
                                        Please finish the task as soon as you
                                        can, as it's running late.
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
                        </div>
                        <div className="d-flex flex-column gap-2 my-2">
                          Action
                          {email &&
                            task.employees
                              .filter(
                                (taskemp) => taskemp.employee.Email === email
                              )
                              .map((taskemp, i) => (
                                <div className="d-flex align-items-center gap-2">
                                  <button
                                    className="btn btn-primary py-1"
                                    onClick={() =>
                                      acceptTask(
                                        task._id,
                                        taskemp.employee.Email,
                                        task
                                      )
                                    }
                                    disabled={
                                      taskemp.empTaskStatus === "Accepted" ||
                                      taskemp.empTaskStatus === "Rejected" ||
                                      taskemp.empTaskStatus === "Completed"
                                    }
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn  py-1 btn-danger"
                                    onClick={() =>
                                      rejectTask(
                                        task._id,
                                        taskemp.employee.Email,
                                        task
                                      )
                                    }
                                    disabled={
                                      taskemp.empTaskStatus === "Accepted" ||
                                      taskemp.empTaskStatus === "Rejected" ||
                                      taskemp.empTaskStatus === "Completed"
                                    }
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => showPdf(task._id)}
                                    className="btn btn-secondary py-1"
                                  >
                                    <RiAttachmentLine /> Attachment
                                  </button>
                                </div>
                              ))}
                        </div>
                      </div>
                    </div>
                    <div className="my-2">
                      {expandedTaskId === task._id && (
                        <div
                          style={{
                            background: darkMode
                              ? "rgba(165, 177, 255, 0.23)"
                              : "rgba(0, 0, 0, 0.23)",
                          }}
                          className="p-2 rounded-3"
                        >
                          <div className="d-flex align-items-center justify-content-between my-3">
                            <AvatarGroup images={task.employees} />
                          </div>

                          <div style={{ width: "100%", overflow: "auto" }}>
                            <h6 className="fw-bold">Project Members</h6>
                            <Table>
                              <thead>
                                <tr>
                                  <th style={rowHeadStyle(darkMode)}>Name</th>
                                  <th style={rowHeadStyle(darkMode)}>Email</th>
                                  <th style={rowHeadStyle(darkMode)}>
                                    Designation
                                  </th>

                                  <th style={rowHeadStyle(darkMode)}>
                                    Task Status
                                  </th>
                                  <th style={rowHeadStyle(darkMode)}>
                                    Remarks
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {email &&
                                  task.employees.map((taskemp, i) => (
                                    <tr key={i}>
                                      <td
                                        style={{
                                          verticalAlign: "middle",
                                          whiteSpace: "pre",
                                          background: darkMode
                                            ? "var( --secondaryDashMenuColor)"
                                            : "var(--secondaryDashColorDark)",
                                          color: darkMode
                                            ? "var(--secondaryDashColorDark)"
                                            : "var( --primaryDashMenuColor)",
                                          border: "none",
                                        }}
                                        className="text-capitalize"
                                      >
                                        {`${taskemp.employee.FirstName} ${taskemp.employee.LastName}`}
                                      </td>
                                      <td
                                        style={{
                                          verticalAlign: "middle",
                                          whiteSpace: "pre",
                                          background: darkMode
                                            ? "var( --secondaryDashMenuColor)"
                                            : "var(--secondaryDashColorDark)",
                                          color: darkMode
                                            ? "var(--secondaryDashColorDark)"
                                            : "var( --primaryDashMenuColor)",
                                          border: "none",
                                        }}
                                      >
                                        {taskemp.employee.Email}
                                      </td>
                                      <td
                                        style={{
                                          verticalAlign: "middle",
                                          whiteSpace: "pre",
                                          background: darkMode
                                            ? "var( --secondaryDashMenuColor)"
                                            : "var(--secondaryDashColorDark)",
                                          color: darkMode
                                            ? "var(--secondaryDashColorDark)"
                                            : "var( --primaryDashMenuColor)",
                                          border: "none",
                                        }}
                                      >
                                        {
                                          taskemp.employee.position[0]
                                            .PositionName
                                        }
                                      </td>
                                      <td
                                        style={{
                                          verticalAlign: "middle",
                                          whiteSpace: "pre",
                                          background: darkMode
                                            ? "var( --secondaryDashMenuColor)"
                                            : "var(--secondaryDashColorDark)",
                                          color: darkMode
                                            ? "var(--secondaryDashColorDark)"
                                            : "var( --primaryDashMenuColor)",
                                          border: "none",
                                        }}
                                      >
                                        {taskemp?.empTaskStatus}{" "}
                                      </td>
                                      <td
                                        style={{
                                          background: darkMode
                                            ? "var( --secondaryDashMenuColor)"
                                            : "var(--secondaryDashColorDark)",
                                          color: darkMode
                                            ? "var(--secondaryDashColorDark)"
                                            : "var( --primaryDashMenuColor)",
                                          border: "none",
                                        }}
                                      >
                                        <textarea
                                          name=""
                                          id=""
                                          value={taskemp?.empTaskComment}
                                          className={`form-control ms-0 ms-md-auto rounded-2 ${
                                            darkMode
                                              ? "bg-light text-dark border dark-placeholder"
                                              : "bg-dark text-light border-0 light-placeholder"
                                          }`}
                                          style={{ height: "2rem" }}
                                        ></textarea>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                    <hr className="my-0" />
                    <div className="d-flex align-items-center mt-4 justify-content-between">
                      <p className="my-auto">
                        Created At: {getTimeAgo(task.createdAt)}
                      </p>
                      <p className="my-auto">
                        Latest Updated At: {getTimeAgo(task.updatedAt)}
                      </p>
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
            src={RequestImage}
            alt="No task found"
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

export default EmployeeNewTask;
