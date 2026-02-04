import React, { useEffect, useState } from "react";
import EmployeeNewTask from "../EmployeeNewTask";
import EmployeeActiveTask from "../EmployeeActiveTask";
import EmployeeCompletedTask from "../EmployeeCompleteTask";
import EmployeeRejectTask from "../EmployeeRejectTask";
import EmployeeReviewTask from "../EmployeeReviewTask";
import EmployeeVerifiedTask from "../EmployeeVerifiedTask";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../../../redux/slices/tasksSlice";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { FaTable, FaTh } from "react-icons/fa";
import { useViewContext } from "../../../../Context/ViewContax/viewType";
import { ClipLoader } from "react-spinners";

const TaskContainer = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const path = sessionStorage.getItem("task");
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const [activeTask, setActiveTask] = useState(path || "newTask");
  const { userData } = useSelector((state) => state.user);
  const email = userData?.Email;

  //Get viewType and toggleViewType from context
  const { viewType, toggleViewType } = useViewContext();

  const renderTaskComponent = () => {
    switch (activeTask) {
      case "activeTask":
        return <EmployeeActiveTask />;
      case "reviewTask":
        return <EmployeeReviewTask />;
      case "verifiedTask":
        return <EmployeeVerifiedTask />;
      case "taskComplete":
        return <EmployeeCompletedTask />;
      case "taskReject":
        return <EmployeeRejectTask />;
      default:
        return <EmployeeNewTask />;
    }
  };

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >

        <ClipLoader color="#3498db" size={50} />
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div
      className="container-fluid py-4 "
      style={{
        overflowX: "auto",
        overflowY: "auto",
        height: "calc(100vh - 80px)",
      }}
    >
      <div
        className="card"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          // backgroundColor: "white",
          background: darkMode ? "#fbfbfb" : "rgba(49, 49, 49, 0.56)",
          color: darkMode ? "#3c3c3c" : "#f2f2f2",
        }}
      >
        <div className="card-body p-3 ">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="d-flex flex-wrap gap-3">
              <div className="assigned">
                <button
                  className="btn btn-outline-primary "
                  style={{
                    background:
                      activeTask === "newTask"
                        ? "rgba(0, 0, 205, 0.50)"
                        : "#FFFFFF",
                    color: activeTask === "newTask" ? "#F5F5F5" : "#1b20a4d3",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    sessionStorage.setItem("task", "newTask");
                    setActiveTask("newTask");
                  }}
                >
                  New Task{" "}
                  <span className="badge bg-danger">
                    {
                      tasks.filter(
                        (task) =>
                          task.status === "Pending" &&
                          task.employees.some(
                            (taskemp) =>
                              taskemp.employee.Email === email &&
                              taskemp.empTaskStatus === "Task Assigned",
                          ),
                      ).length
                    }
                  </span>
                </button>
              </div>

              <div className="active1">
                <button
                  className="btn btn-outline-primary"
                  style={{
                    background:
                      activeTask === "activeTask"
                        ? "rgba(0, 0, 205, 0.50)"
                        : "#FFFFFF",
                    color:
                      activeTask === "activeTask" ? "#F5F5F5" : "#1b20a4d3",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    sessionStorage.setItem("task", "activeTask");
                    setActiveTask("activeTask");
                  }}
                >
                  In Progress{" "}
                  <span className="badge bg-danger">
                    {
                      tasks.filter(
                        (task) =>
                          task.status === "Pending" &&
                          task.employees.some(
                            (taskemp) =>
                              taskemp.employee.Email === email &&
                              taskemp.empTaskStatus === "Accepted",
                          ),
                      ).length
                    }
                  </span>
                </button>
              </div>

              <div className="review">
                <button
                  className="btn btn-outline-primary"
                  style={{
                    background:
                      activeTask === "reviewTask"
                        ? "rgba(0, 0, 205, 0.50)"
                        : "#FFFFFF",
                    color:
                      activeTask === "reviewTask" ? "#F5F5F5" : "#1b20a4d3",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    sessionStorage.setItem("task", "reviewTask");
                    setActiveTask("reviewTask");
                  }}
                >
                  In Review{" "}
                  <span className="badge bg-danger">
                    {
                      tasks.filter(
                        (task) =>
                          task.status === "Pending" &&
                          task.employees.some(
                            (taskemp) =>
                              taskemp.employee.Email === email &&
                              taskemp.empTaskStatus === "In Review",
                          ),
                      ).length
                    }
                  </span>
                </button>
              </div>

              <div className="verifiedTask">
                <button
                  className="btn btn-outline-primary"
                  style={{
                    background:
                      activeTask === "verifiedTask"
                        ? "rgba(0, 0, 205, 0.50)"
                        : "#FFFFFF",
                    color:
                      activeTask === "verifiedTask" ? "#F5F5F5" : "#1b20a4d3",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    sessionStorage.setItem("task", "verifiedTask");
                    setActiveTask("verifiedTask");
                  }}
                >
                  Verified{" "}
                  <span className="badge bg-danger">
                    {
                      tasks.filter(
                        (task) =>
                          task.status === "Pending" &&
                          task.employees.some(
                            (taskemp) =>
                              taskemp.employee.Email === email &&
                              taskemp.empTaskStatus === "Verified",
                          ),
                      ).length
                    }
                  </span>
                </button>
              </div>

              <div className="complete">
                <button
                  className="btn btn-outline-primary "
                  style={{
                    background:
                      activeTask === "taskComplete"
                        ? "rgba(0, 0, 205, 0.50)"
                        : "#FFFFFF",
                    color:
                      activeTask === "taskComplete" ? "#F5F5F5" : "#1b20a4d3",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    sessionStorage.setItem("task", "taskComplete");
                    setActiveTask("taskComplete");
                  }}
                >
                  Completed{" "}
                  <span className="badge bg-danger">
                    {
                      tasks.filter(
                        (task) =>
                          task.status === "Pending" &&
                          task.employees.some(
                            (taskemp) =>
                              taskemp.employee.Email === email &&
                              taskemp.empTaskStatus === "Completed",
                          ),
                      ).length
                    }
                  </span>
                </button>
              </div>
              <div className="reject">
                <button
                  className="btn btn-outline-primary"
                  style={{
                    background:
                      activeTask === "taskReject"
                        ? "rgba(0, 0, 205, 0.50)"
                        : "#FFFFFF",
                    color:
                      activeTask === "taskReject" ? "#F5F5F5" : "#1b20a4d3",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    sessionStorage.setItem("task", "taskReject");
                    setActiveTask("taskReject");
                  }}
                >
                  Rejected{" "}
                  <span className="badge bg-danger">
                    {
                      tasks.filter(
                        (task) =>
                          task.status === "Pending" &&
                          task.employees.some(
                            (taskemp) =>
                              taskemp.employee.Email === email &&
                              taskemp.empTaskStatus === "Rejected",
                          ),
                      ).length
                    }
                  </span>
                </button>
              </div>
            </div>
            <div className="d-flex align-items-center flex-wrap row-gap-3">
              <div className="type me-3">
                <button
                  onClick={toggleViewType}
                  className="btn btn-outline-primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {viewType === "card" ? <FaTable /> : <FaTh />}{" "}
                  {/* Icon based on view type */}
                  {viewType === "card" ? "Table View" : "Card View"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="">{renderTaskComponent()}</div>
    </div>
  );
};

export default TaskContainer;
