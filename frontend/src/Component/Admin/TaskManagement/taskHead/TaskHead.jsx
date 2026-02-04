import React, { useEffect, useState } from "react";
import AdminCreatetask from "../AdminAsignTask";
import AdminNewTask from "../AdminAssignedTask";
import AdminActiveTask from "../AdminActive";
import AdminCompletedTask from "../AdminCompleteTask";
import AdminRejectTask from "../RejectedTask";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../../../redux/slices/tasksSlice";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { FaTable, FaTh } from "react-icons/fa";
import { useViewContext } from "../../../../Context/ViewContax/viewType";
import { ClipLoader } from "react-spinners";

const TaskContainer = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const [activeTask, setActiveTask] = useState("newTask");
  const { userData } = useSelector((state) => state.user);
  const email = userData?.Email;

  //Get viewType and toggleViewType from context
  const { viewType, toggleViewType } = useViewContext();
  const renderTaskComponent = () => {
    switch (activeTask) {
      case "activeTask":
        return <AdminActiveTask />;
      case "taskComplete":
        return <AdminCompletedTask />;
      case "taskReject":
        return <AdminRejectTask />;
      case "createtask":
        return <AdminCreatetask />;
      default:
        return <AdminNewTask />;
    }
  };

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;


  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <ClipLoader color="#3498db" size={50} />
      </div>
    );
  if (error) return <p>{error}</p>;


  return (
    <div className="container-fluid"
      style={{
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: "85vh",
      }}
    >
      <div
        className="card"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          background: darkMode ? "#fbfbfb" : "rgba(49, 49, 49, 0.56)",
          color: darkMode ? "#3c3c3c" : "#f2f2f2",
          // boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="card-body p-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="d-flex flex-wrap gap-3">
              <div className="assigned">
                <button
                  className="btn btn-outline-primary "
                  style={{
                    background:
                      activeTask === "newTask" ? "rgba(0, 0, 205, 0.50)" : "#FFFFFF",
                    color: activeTask === "newTask" ? "#F5F5F5" : "#1b20a4d3",
                    fontWeight: "600",
                  }}
                  onClick={() => setActiveTask("newTask")}
                >
                  New Task  <span className="badge bg-danger">
                    {
                      tasks?.filter(
                        (task) =>
                          task.status === "Assigned"
                        //  &&  task.adminMail.Email === email
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
                      activeTask === "activeTask" ? "rgba(0, 0, 205, 0.50)" : "#FFFFFF",
                    color:
                      activeTask === "activeTask" ? "#F5F5F5" : "#1b20a4d3",
                    fontWeight: "600",
                  }}
                  onClick={() => setActiveTask("activeTask")}
                >
                  In Progress <span className="badge bg-danger">
                    {
                      tasks?.filter(
                        (task) =>
                          task.status === "Pending"
                        //  && task.adminMail.Email === email
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
                      activeTask === "taskComplete" ? "rgba(0, 0, 205, 0.50)" : "#FFFFFF",
                    color:
                      activeTask === "taskComplete" ? "#F5F5F5" : "#1b20a4d3",
                    fontWeight: "600",
                  }}
                  onClick={() => setActiveTask("taskComplete")}
                >
                  Completed Task  <span className="badge bg-danger">
                    {
                      tasks?.filter(
                        (task) =>
                          task.status === "Completed"
                        // && task.adminMail.Email === email
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
                      activeTask === "taskReject" ? "rgba(0, 0, 205, 0.50)" : "#FFFFFF",
                    color:
                      activeTask === "taskReject" ? "#F5F5F5" : "#1b20a4d3",
                    fontWeight: "600",
                  }}
                  onClick={() => setActiveTask("taskReject")}
                >
                  Rejected Task  <span className="badge bg-danger">
                    {
                      tasks?.filter(
                        (task) =>
                          task.status === "Rejected" &&
                          task.adminMail.Email === email
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
              <div className="createtask">
                <button
                  className="btn btn-outline-primary "
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onClick={() => setActiveTask("createtask")}
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-0">{renderTaskComponent()}</div>
    </div>
  );
};

export default TaskContainer;
