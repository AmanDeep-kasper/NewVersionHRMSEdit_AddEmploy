// final filter based department
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Container, Form } from "react-bootstrap";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
// import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import api from "../../../../Pages/config/api";

const AdminTaskStatus = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [endDateError, setEndDateError] = useState(false);
  const { userData} = useSelector((state)=> state.user);
  const email = userData?.Email;
  const [managerData, setManagerData] = useState(null);
  const { socket } = useContext(AttendanceContext);
  const { darkMode } = useTheme();

  const taskId = uuidv4();
  const [newTask, setNewTask] = useState({
    Taskname: "",
    description: "",
    startDate: "",
    endDate: "",
    attachments: null,
    managerEmail: "",
    department: "",
    comment: "",
  });

  const isFormValid = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      newTask.Taskname.trim() !== "" &&
      newTask.description.trim() !== "" &&
      newTask.startDate.trim() !== "" &&
      newTask.endDate.trim() !== "" &&
      newTask.managerEmail.trim() !== "" &&
      emailPattern.test(newTask.managerEmail) &&
      newTask.department.trim() !== ""
    );
  };

  const ManagerDataHandler = () => {
    if (newTask.department === "") return;
    api
      .get(`/api/employee`, {
      })
      .then((val) => {
        let mana = val.data.filter((val) => {
          return (
            val.Account === 4 &&
            val.department[0].DepartmentName === newTask.department
          );
        });
        setManagerData(mana);
      })
      .catch((err)=>console.log(err)  )
  };

  // const addTask = async () => {
  //   let formData = new FormData();
  //   formData.append("Taskname", newTask.Taskname);
  //   formData.append("description", newTask.description);
  //   formData.append("startDate", newTask.startDate);
  //   formData.append("endDate", newTask.endDate);
  //   formData.append("file", newTask.attachments);
  //   formData.append("managerEmail", newTask.managerEmail);
  //   formData.append("department", newTask.department);
  //   formData.append("comment", newTask.comment);
  //   formData.append("adminMail", email);

  //   const id = localStorage.getItem("_id");
  //   axios
  //     .post(`${BASE_URL}/api/tasks`, formData)
  //     .then((res) => {
  //         
  //       const taskNotificationData = {
  //         taskId,
  //         taskName: newTask.Taskname,
  //         senderMail: email,
  //         managerEmail: newTask.managerEmail,
  //         Account: 4,
  //         message: `New task assigned by ${email}`,
  //         status: "unseen",
  //         path: "newTask"
  //       };

  //       socket.emit("managerTaskNotification", taskNotificationData);

  //       // Display success toast
  //       toast.success("Task added successfully!");
  //     })
  //     .catch((err) => {
  //         
  //       // Display error toast
  //       toast.error("Failed to add task. Please try again.");
  //     });
  // };
const addTask = async () => {
  try {
    // ✅ Basic validation
    if (
      !newTask.Taskname ||
      !newTask.description ||
      !newTask.startDate ||
      !newTask.endDate ||
      !newTask.managerEmail ||
      !newTask.department
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // ✅ Show loading state
    setIsAdding(true);

    // ✅ Prepare FormData for file upload
    const formData = new FormData();
    formData.append("Taskname", newTask.Taskname.trim());
    formData.append("description", newTask.description.trim());
    formData.append("startDate", newTask.startDate);
    formData.append("endDate", newTask.endDate);
    if (newTask.attachments) {
      formData.append("file", newTask.attachments);
    }
    formData.append("managerEmail", newTask.managerEmail.trim());
    formData.append("department", newTask.department.trim());
    formData.append("comment", newTask.comment || "");
    formData.append("adminMail", email);

    // ✅ Make API call with authorization
    const response = await api.post(`/api/tasks`, formData, {
    });

    // ✅ Get the created task ID from API response
    const taskId = response.data?.task?._id || null;

    // ✅ Emit socket event for notifications
    const taskNotificationData = {
      taskId,
      taskName: newTask.Taskname,
      senderMail: email,
      managerEmail: newTask.managerEmail,
      Account: 4,
      message: `New task assigned by ${email}`,
      status: "unseen",
      path: "newTask",
    };
    socket.emit("managerTaskNotification", taskNotificationData);

    // ✅ Success message
    toast.success(response.data?.message || "Task added successfully!");

    // ✅ Reset form
    setNewTask({
      Taskname: "",
      description: "",
      startDate: "",
      endDate: "",
      attachments: null,
      managerEmail: "",
      department: "",
      comment: "",
    });

    // ✅ Optionally refresh task list
    fetchData();
  } catch (error) {
    console.error("Error adding task:", error);
    const errMsg =
      error.response?.data?.message ||
      "Failed to add task. Please try again.";
    toast.error(errMsg);
  } finally {
    setIsAdding(false);
  }
};


  // const addTask = async () => {
  //   let formData = new FormData();
  //   formData.append("Taskname", newTask.Taskname);
  //   formData.append("description", newTask.description);
  //   formData.append("startDate", newTask.startDate);
  //   formData.append("endDate", newTask.endDate);
  //   formData.append("file", newTask.attachments);
  //   formData.append("managerEmail", newTask.managerEmail);
  //   formData.append("department", newTask.department);
  //   formData.append("comment", newTask.comment);
  //   formData.append("adminMail", email);
  //   //   
  //   const id = localStorage.getItem("_id");
  //   axios
  //     .post(`${BASE_URL}/api/tasks`, formData)
  //     .then((res) => {
  //         
  //       const taskNotificationData = {
  //         taskId,
  //         taskName: newTask.Taskname,
  //         senderMail: email,
  //         managerEmail: newTask.managerEmail,
  //         Account: 4,
  //         message: `New task assigned by ${email}`,
  //         status: "unseen",
  //         path: "newTask"
  //       };

  //       socket.emit("managerTaskNotification", taskNotificationData);
  //     })
  //     .catch((err) => {
  //         
  //     });
  // };
  // Fetch all tasks on component mount
 useEffect(() => {
  let isMounted = true; // ✅ To prevent state update if component unmounts

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/api/tasks`, {
      });

      if (isMounted) {
        setTasks(response.data); // ✅ Update state only if component is still mounted
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (isMounted) {
        setError("Failed to fetch tasks. Please try again.");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchTasks();

  // ✅ Cleanup function to avoid memory leaks
  return () => {
    isMounted = false;
  };
}, []); // Runs once on mount


  const loadDepartmentInfo = () => {
    api
      .get(`/api/department`, {
      })
      .then((response) => {
        setDepartmentData(response.data);
      })
      .catch((error) => {
          
      });
  };

  useEffect(() => {
    loadDepartmentInfo();
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <TittleHeader
        title={"Create New Task"}
        message={"You cn create new task here."}
      />
      <form className="row mt-2 p-0 row-gap-3 p-md-3 w-100">
        <div className="col-12 col-md-6">
          <label>Task Name</label>
          <input
            className="form-control rounded-0"
            type="text"
            required
            placeholder="Enter task name"
            value={newTask.Taskname}
            onChange={(e) =>
              setNewTask({ ...newTask, Taskname: e.target.value })
            }
          />
        </div>

        <div className="col-12 col-md-6">
          <label>Start Date</label>
          <input
            className="form-control rounded-0"
            type="date"
            required
            value={newTask.startDate}
            onChange={(e) => {
              setNewTask({ ...newTask, startDate: e.target.value });
              // Reset the endDateError when StartDate changes
              setEndDateError(false);
            }}
          />
        </div>
        <div className="col-12">
          <label>Task Description</label>
          <textarea
            className="form-control rounded-0 "
            required
            placeholder="Enter task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
        </div>
        <div className="col-12 col-md-6">
          <label>End Date</label>
          <input
            className="form-control rounded-0"
            type="date"
            required
            value={newTask.endDate}
            onChange={(e) => {
              const selectedEndDate = e.target.value;
              // Check if selectedEndDate is less than StartDate
              if (selectedEndDate < newTask.startDate) {
                setEndDateError(true);
              } else {
                setEndDateError(false);
                setNewTask({ ...newTask, endDate: selectedEndDate });
              }
            }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Department</label>
          <Form.Control
            className="rounded-0"
            as="select"
            name="department"
            required
            value={newTask.department}
            onChange={(e) =>
              setNewTask({ ...newTask, department: e.target.value })
            }
            onBlur={ManagerDataHandler}
          >
            <option value="">Select your option</option>
            {departmentData.map((data, index) => (
              <option key={index} value={data.DepartmentName}>
                {data.DepartmentName}
              </option>
            ))}
          </Form.Control>
        </div>
        <div className="col-12">
          <label>managerEmail</label>
          <Form.Control
            className="rounded-0"
            as="select"
            name="department"
            required
            value={newTask.managerEmail}
            onChange={(e) =>
              setNewTask({ ...newTask, managerEmail: e.target.value })
            }
          >
            <option value="">Select your option</option>
            {managerData &&
              managerData.map((data, index) => (
                <option key={index} value={data.Email}>
                  {data.Email}
                </option>
              ))}
          </Form.Control>
        </div>
        <div className="col-12">
          <label className="fw-bold mt-3">Attachments</label>
          <input
            className="form-control rounded-0"
            type="file"
            multiple
            required
            onChange={(e) =>
              setNewTask({ ...newTask, attachments: e.target.files[0] })
            }
          />
        </div>

        <div className="d-flex align-items-center">
          {" "}
          <button
            className="btn btn-primary"
            variant="info"
            onClick={addTask}
            disabled={!isFormValid()}
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTaskStatus;
