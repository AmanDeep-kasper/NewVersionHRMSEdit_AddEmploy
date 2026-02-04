import { useState, useEffect } from "react";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import api from "../../../Pages/config/api";

const MyTodo = () => {
  const [todoData, setTodoData] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  // Fetch to-dos on component mount
 useEffect(() => {
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/todos`, {
      });
      setTodoData(response.data);
    } catch (error) {
      setError(error?.response?.data?.message || "Error fetching to-dos.");
      console.error("Error fetching to-dos:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTodos();
}, []);

// ✅ Handle adding a new to-do
const handleAddTodo = async (e) => {
  e.preventDefault();
  if (newTodo.trim() && newDate) {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/todos`,
        {
          todoTask: newTodo,
          date: newDate,
        },
      );
      setTodoData((prev) => [...prev, response.data]);
      setNewTodo("");
      setNewDate("");
      setError(null);
      alert("To-do added successfully!");
    } catch (error) {
      setError(error?.response?.data?.message || "Error adding to-do.");
      console.error("Error adding to-do:", error);
    } finally {
      setLoading(false);
    }
  } else {
    setError("Please enter a task and a date.");
  }
};

// ✅ Handle toggling task completion
const toggleCheck = async (id, isChecked) => {
  try {
    const response = await api.put(
      `/api/todos/${id}`,
      {
        isChecked: !isChecked,
      },
    );
    setTodoData((prev) =>
      prev.map((task) => (task._id === id ? response.data : task))
    );
  } catch (error) {
    setError(error?.response?.data?.message || "Error updating to-do.");
    console.error("Error updating to-do:", error);
  }
};

// ✅ Handle deleting a task with confirmation
const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this task?")) {
    try {
      await api.delete(`/api/todos/${id}`, {
      });
      setTodoData((prev) => prev.filter((task) => task._id !== id));
      setError(null);
      alert("Task deleted successfully!");
    } catch (error) {
      setError(error?.response?.data?.message || "Error deleting to-do.");
      console.error("Error deleting to-do:", error);
    }
  }
};


  return (
    <div className="container-fluid">
      <TittleHeader
        title={"To Do"}
        message={"You can create and view your to-do's here"}
      />

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Form Section */}
      <div className="row px-2 my-3">
        <form
          className="col-12 col-md-3 py-3 px-2 d-flex flex-column gap-3"
          onSubmit={handleAddTodo}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Please enter your to-do here"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </form>

        {/* Todo List */}
        <div className="col-12 col-md-9">
          {loading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={rowHeadStyle(darkMode)}>Done</th>
                  <th style={rowHeadStyle(darkMode)}>Task</th>
                  <th style={rowHeadStyle(darkMode)}>Date</th>
                  <th style={rowHeadStyle(darkMode)}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todoData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No tasks available. Add a new to-do!
                    </td>
                  </tr>
                ) : (
                  todoData.map((task) => (
                    <tr key={task._id}>
                      <td style={rowBodyStyle(darkMode)}>
                        <input
                          type="checkbox"
                          checked={task.isChecked}
                          onChange={() => toggleCheck(task._id, task.isChecked)}
                        />
                      </td>
                      <td style={rowBodyStyle(darkMode)}>{task.todoTask}</td>
                      <td style={rowBodyStyle(darkMode)}>{task.date}</td>
                      <td style={rowBodyStyle(darkMode)}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(task._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTodo;
