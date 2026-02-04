import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import RequestImage from "../../../img/Request/Request.svg";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import profile from "../../../img/profile.jpg";
import { useSelector } from "react-redux";
import { LuArrowRightLeft } from "react-icons/lu";
import { getTimeAgo } from "../../../Utils/GetDayFormatted";
import api from "../../../../Pages/config/api";

const EmployeeRejectTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useSelector((state) => state.user);

  const email = userData?.Email;
  const { darkMode } = useTheme();
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

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

  const rejectedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.employee.Email === email && taskemp.empTaskStatus === "Rejected"
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
            taskemp.empTaskStatus === "Rejected"
        )
      ).length > 0 ? (
        <div
          style={{
            maxHeight: "80vh",
            overflow: "auto",
          }}
          className="row mx-auto gap-3"
        >
          {tasks
            .filter((task) =>
              task.employees.some(
                (taskemp) =>
                  taskemp.employee.Email === email &&
                  taskemp.empTaskStatus === "Rejected"
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
                    borderLeft: "5px solid #dc3545",
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
                          <span className="py-2 px-3 bg-danger rounded-3 text-white">
                            Rejected
                          </span>
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
                            <div
                              className={`${
                                darkMode
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

export default EmployeeRejectTask;
