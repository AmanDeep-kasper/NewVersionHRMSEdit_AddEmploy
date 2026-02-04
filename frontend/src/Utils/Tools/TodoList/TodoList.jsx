import React, { useState, useEffect } from "react";
import axios from "axios";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { MdCheckCircle, MdOutlineCheckCircleOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { AiOutlineDelete } from "react-icons/ai";
import OverLayToolTip from "../../OverLayToolTip";
import { FiEdit2 } from "react-icons/fi";
import TodoImage from "../../../img/Todo/Todo.svg";
import { useShowTodo } from "../../../Context/ShowTodoListContext/ShowTodoListContext";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import BASE_URL from "../../../Pages/config/config";
import { getFormattedDate, getTimeAgo } from "../../GetDayFormatted";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [isRepeating, setIsRepeating] = useState(false);
  const [frequency, setFrequency] = useState("daily");
  const [isAddPrompt, setIsAddPrompt] = useState(false);
  const { darkMode } = useTheme();
  const currentDate = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const { isVisible, toggleVisibilityTodo } = useShowTodo();

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      toast.error("Error fetching tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [task]);

  const handleAddTask = async () => {
    try {
      if (!task.trim()) return;
      const newTask = {
        task,
        isCompleted: false,
        isRepeating,
        frequency,
        startDate,
        endDate,
        startTime,
        endTime,
      };
      const response = await axios.post(`${BASE_URL}/api/todos`, newTask);
      setTasks([...tasks, response.data]);
      resetTaskForm();
      toast.success("Task successfully added");
    } catch (error) {
      console.error("Failed to add task", error);
      toast.error("Error adding task");
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      if (!updatedTask.trim()) return;
      if (!id) {
        console.error("Invalid task ID");
        return;
      }

      const response = await axios.put(`${BASE_URL}/api/todos/${id}`, {
        task: updatedTask,
      });

      // Update the task directly in the state
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, task: response.data.task } : task
        )
      );
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Failed to update task", error);
      toast.error("Error updating task");
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/todos/${id}`);

      setTasks(tasks.filter((task) => task.id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Failed to delete task", error);
      toast.error("Error deleting task");
    }
  };


  // Toggle task completion
  const handleToggleComplete = async (id) => {
    try {
      const taskToToggle = tasks.find((task) => task.id === id);
      const updatedTask = {
        ...taskToToggle,
        isCompleted: !taskToToggle.isCompleted,
      };
      const response = await axios.put(
        `${BASE_URL}/api/todos/${id}`,
        updatedTask
      );
      setTasks(
        tasks.map((task) =>
          task.id === id
            ? { ...task, isCompleted: response.data.isCompleted }
            : task
        )
      );
    } catch (error) {
      console.error("Failed to toggle task completion", error);
      toast.error("Error toggling task completion");
    }
  };

  // Reset task form
  const resetTaskForm = () => {
    setTask("");
    setIsRepeating(false);
    setFrequency("daily");
    setStartDate(currentDate);
    setEndDate(currentDate);
    setStartTime("00:00");
    setEndTime("23:59");
    setIsAddPrompt(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      {isVisible && (
        <div
          className="p-3"
          style={{
            position: "absolute",
            zIndex: 10000,
            background: "white",
            height: "100vh",
            width: "100%",
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <TittleHeader
              title={"Todo List"}
              message={"You can create and view all your todo tasks"}
            />
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() => setIsAddPrompt(true)}
                className="btn btn-primary"
              >
                Add Todo
              </button>
              <button
                className="btn btn-light border"
                onClick={toggleVisibilityTodo}
              >
                Back →
              </button>
            </div>
          </div>
          {isAddPrompt && (
            <div
              className="p-3 px-4 rounded-2 shadow bg-white"
              style={{
                position: "absolute",
                left: "50%",
                top: "30%",
                transform: "translate(-50%)",
                minWidth: "30rem",
                minHeight: "15rem",
              }}
            >
              <div className="d-flex align-items-center justify-content-between py-1 mb-4">
                <h5 className="my-0">Create Task in To-Do</h5>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsAddPrompt(false)}
                >
                  Close ( X )
                </span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <input
                  type="text"
                  required
                  className="form-control"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Enter a task"
                />
                <div className="form-check form-switch fs-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    checked={isRepeating}
                    onChange={() => setIsRepeating(!isRepeating)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    Repeat
                  </label>
                </div>
              </div>
              <div className="d-flex flex-column my-2 gap-3">
                {isRepeating && (
                  <select
                    className="form-select"
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                )}
                {isRepeating ? (
                  frequency === "daily" ? (
                    <div>
                      <label>Every Day</label>
                      <p className="text-muted">Tasks will repeat daily.</p>
                    </div>
                  ) : frequency === "weekly" ? (
                    <div className="d-flex flex-wrap gap-3">
                      <label>Select Days</label>
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <div key={day} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={day}
                            value={day}
                            onChange={(e) => {
                              const selectedDay = e.target.value;
                              setFrequency((prev) => {
                                const days = prev.days || [];
                                return {
                                  ...prev,
                                  days: e.target.checked
                                    ? [...days, selectedDay]
                                    : days.filter((d) => d !== selectedDay),
                                };
                              });
                            }}
                          />
                          <label className="form-check-label" htmlFor={day}>
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : frequency === "monthly" ? (
                    <div className="d-flex align-items-center gap-3">
                      <div>
                        <label>Start Day</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          max="31"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>End Day</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          max="31"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label>End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  )
                ) : (
                  <div>
                    <label>End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                )}
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <label>Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button className="btn btn-primary my-2" onClick={handleAddTask}>
                Add Task
              </button>
            </div>
          )}
          {tasks.length >= 1 ? (
            <table className="table mt-3">
              <thead>
                <tr>
                  <th style={rowHeadStyle(darkMode)}>Complete</th>
                  <th style={rowHeadStyle(darkMode)}>Task</th>
                  <th style={rowHeadStyle(darkMode)}>Created At</th>
                  <th style={rowHeadStyle(darkMode)}>Updated At</th>
                  <th style={rowHeadStyle(darkMode)}>Frequency</th>
                  <th style={rowHeadStyle(darkMode)}>Start Date</th>
                  <th style={rowHeadStyle(darkMode)}>End Date</th>
                  <th style={rowHeadStyle(darkMode)}>Start Time</th>
                  <th style={rowHeadStyle(darkMode)}>End Time</th>
                  <th style={rowHeadStyle(darkMode)}>Update</th>
                  <th style={rowHeadStyle(darkMode)}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      <div className="d-flex align-items-center px-2">
                        {task.isCompleted ? (
                          <span
                            style={{ cursor: "pointer" }}
                            className="d-flex align-items-center justify-content-center p-0"
                            onClick={() => handleToggleComplete(task._id)}
                          >
                            <MdCheckCircle className="text-success fs-4" />
                          </span>
                        ) : (
                          <span
                            style={{ cursor: "pointer" }}
                            className="d-flex align-items-center justify-content-center p-0"
                            onClick={() => handleToggleComplete(task.id)}
                          >
                            <MdOutlineCheckCircleOutline className="text-muted fs-4" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      <div
                        style={{
                          textDecoration: task.isCompleted
                            ? "line-through"
                            : "none",
                          color: task.isCompleted ? "red" : "inherit",
                          maxWidth: "400px",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }}
                      >
                        {task.task}
                      </div>
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      {getTimeAgo(task.createdAt)}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      {getTimeAgo(task.updatedAt)}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      {task.isRepeating ? task.frequency : "One Time"}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      {getFormattedDate(task.startDate)}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      {getFormattedDate(task.endDate)}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      {task.startTime}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      {task.endTime}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      <OverLayToolTip
                        style={{ color: darkMode ? "black" : "white" }}
                        icon={<FiEdit2 className="text-primary" />}
                        onClick={() =>
                          handleUpdateTask(
                            task._id,
                            prompt("Update task:", task.task)
                          )
                        }
                        tooltip={"Edit Role"}
                      />
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="py-0">
                      <OverLayToolTip
                        style={{ color: darkMode ? "black" : "white" }}
                        icon={<AiOutlineDelete className="fs-5 text-danger" />}
                        onClick={() => handleDeleteTask(task._id)}
                        tooltip={"Delete"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ height: "80vh" }}
            >
              <img
                style={{ width: "20rem", height: "auto" }}
                src={TodoImage}
                alt="No tasks found"
              />
              <p
                style={{
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
              >
                There is no task found in the to-do list at this moment.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TodoList;
