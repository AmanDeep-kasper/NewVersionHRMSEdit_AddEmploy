import React, { useEffect, useState } from "react";
import EmployeeNewTask from "../EmployeeNewTask";
import EmployeeActiveTask from "../EmployeeActiveTask";
import EmployeeCompletedTask from "../EmployeeCompleteTask";
import EmployeeRejectTask from "../EmployeeRejectTask";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../../../redux/slices/tasksSlice";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";

const TaskContainer = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const [activeTask, setActiveTask] = useState("newTask");
  const { userData } = useSelector((state) => state.user);

  const renderTaskComponent = () => {
    switch (activeTask) {
      case "activeTask":
        return <EmployeeActiveTask />;
      case "taskComplete":
        return <EmployeeCompletedTask />;
      case "taskReject":
        return <EmployeeRejectTask />;
      default:
        return <EmployeeNewTask />;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid">
      <div
        style={{
          width: "fit-content",
        }}
        className="d-flex align-items-center gap-2 p-1 px-2 rounded-3 ml-2 justify-content-start"
      >
        <button
          className="btn shadow-sm border"
          style={{
            background: activeTask === "newTask" ? "#1a2a8b" : "#F5F5F5",
            color: activeTask === "newTask" ? "#F5F5F5" : "#1b20a4d3",
            fontWeight: "600",
          }}
          onClick={() => setActiveTask("newTask")}
        >
          Assigned Task
        </button>
        <button
          className="btn shadow-sm border"
          style={{
            background: activeTask === "activeTask" ? "#1a2a8b" : "#F5F5F5",
            color: activeTask === "activeTask" ? "#F5F5F5" : "#1b20a4d3",
            fontWeight: "600",
          }}
          onClick={() => setActiveTask("activeTask")}
        >
          Pending Task
        </button>
        <button
          className="btn shadow-sm border"
          style={{
            background: activeTask === "taskComplete" ? "#1a2a8b" : "#F5F5F5",
            color: activeTask === "taskComplete" ? "#F5F5F5" : "#1b20a4d3",
            fontWeight: "600",
          }}
          onClick={() => setActiveTask("taskComplete")}
        >
          Completed Task
        </button>
        <button
          className="btn shadow-sm border"
          style={{
            background: activeTask === "taskReject" ? "#1a2a8b" : "#F5F5F5",
            color: activeTask === "taskReject" ? "#F5F5F5" : "#1b20a4d3",
            fontWeight: "600",
          }}
          onClick={() => setActiveTask("taskReject")}
        >
          Rejected Task
        </button>
      </div>
      <div className="">{renderTaskComponent()}</div>
    </div>
  );
};

export default TaskContainer;
