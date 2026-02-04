import React, { useState, useEffect } from "react";
import axios from "axios";
import RequestImage from "../../../img/Request/Request.svg";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import profile from "../../../img/profile.jpg";
import { useSelector } from "react-redux";
import {
  LuArrowRightLeft,
  LuPanelBottomClose,
  LuPanelTopClose,
} from "react-icons/lu";
import { getTimeAgo } from "../../../Utils/GetDayFormatted";
import { Table } from "react-bootstrap";
import AvatarGroup from "../../../Pages/AvatarGroup/AvatarGroup";
import { rowHeadStyle } from "../../../Style/TableStyle";
import api from "../../../../Pages/config/api";

const EmployeeCompletedTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const { userData } = useSelector((state) => state.user);

  const email = userData?.Email;
  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`, {
        params: { status: "Completed" }, // Filter by status "Completed"
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching completed tasks:", error.message);
      setError("Error fetching completed tasks. Please try again later.");
    } finally {
      setLoading(false);
      // Schedule the next update after 1 minute (adjust as needed)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const completedTasksCount = tasks.filter(
    (task) =>
      task.status === "Pending" &&
      task.employees.some((emp) => emp.empTaskStatus === "Completed")
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
    <div className="container-fluid py-2">
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
      {tasks.filter((task) =>
        task.employees.some(
          (taskemp) =>
            taskemp.employee.Email === email &&
            taskemp.empTaskStatus === "Completed"
        )
      ).length > 0 ? (
        <div
          style={{
            maxHeight: "80vh",
            overflow: "auto",
          }}
          className="row mx-auto gap-2"
        >
          {tasks
            .filter((task) =>
              task.employees.some(
                (taskemp) =>
                  taskemp.employee.Email === email &&
                  taskemp.empTaskStatus === "Completed"
              )
            )
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
                    borderLeft: "5px solid rgb(66, 192, 16)",
                    borderTop: "0",
                    borderBottom: "0",
                    borderRight: "0",
                    background: !darkMode ? "#323232" : "#FFFFFF",
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
                      <h5 style={{ wordWrap: "anywhere" }}>{task.Taskname}</h5>
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
                          <span
                            className={`${
                              task.status === "Completed"
                                ? "py-1 px-3 bg-success rounded-3 text-white"
                                : "py-1 px-3 bg-warning rounded-3 text-black"
                            }`}
                          >
                            {task.status}
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
                        <div>
                          <div className="d-flex flex-column gap-2 my-2">
                            {task.status === "Completed" && (
                              <span
                                className={`${
                                  darkMode
                                    ? "text-start badge-success p-3"
                                    : " text-start badge-success-dark p-3"
                                }`}
                              >
                                <h6>Fully Completed</h6>
                                <p className="my-auto fs-6">
                                  This task is successfully completed and cannot
                                  be re-open for any query contact your admin.
                                </p>
                              </span>
                            )}
                            {task.status === "Pending" && (
                              <span
                                className={`${
                                  darkMode
                                    ? "text-start badge-warning p-3"
                                    : " text-start badge-warning-dark p-3"
                                }`}
                              >
                                <h6>Partial Completed</h6>
                                This task is completed from your side but
                                pending from others
                              </span>
                            )}
                          </div>
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

export default EmployeeCompletedTask;
