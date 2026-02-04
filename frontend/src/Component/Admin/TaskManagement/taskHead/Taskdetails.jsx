import React, { useContext, useEffect, useState } from "react";
import { getFormattedDate, getTimeAgo } from "../../../../Utils/GetDayFormatted";
import profile from "./profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import axios from "axios";
import BASE_URL from "../../../../Pages/config/config";
import toast from "react-hot-toast";
import {
  MdCancel,
  MdDeleteForever,
  MdEdit,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import "./chat.css";
import { addDetails } from "../../../../redux/slices/messageSlice";
import { useNavigate } from "react-router-dom";
import UpdateTaskModal from "../modal/UpdateTaskModal";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { FiEdit } from "react-icons/fi";
import { IoChatbubbles } from "react-icons/io5";
import { CgArrowLongLeft } from "react-icons/cg";
import AdminChatModal from "../../../Manager/ManagerTaskManagement/taskModal/AdminChatModal";
import { rowBodyStyle, rowHeadStyle } from "../../../../Style/TableStyle";
import { FaRegDotCircle } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { Button, ListGroup } from "react-bootstrap";
import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
import { v4 as uuidv4 } from "uuid";
import { v4 as uuid } from "uuid";
import moment from "moment-timezone";
import api from "../../../../Pages/config/api";

const TaskDetails = ({ task, onBack, startDate, endDate }) => {
  //   if (!task) return null;
  const { userData } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [allImage, setAllImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { darkMode } = useTheme();
  const email = userData?.Email;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updatedTask, setUpdatedTask] = useState({
    id: "",
    Taskname: "",
    description: "",
    startDate: "",
    endDate: "",
    managerEmail: "",
    duration: 0,
    comment: "",
  });
  const [totalAssignedTasks, setTotalAssignedTasks] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment()); // Update current time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const calculateRemainingTime = (endDate) => {
    const now = currentTime;

    // Ensure the end date is set to 12:00 AM of the next day
    const endDateTime = moment.tz(endDate, "YYYY-MM-DD", "Asia/Kolkata").add(1, "day").startOf("day");

    const diff = endDateTime.diff(now); // Get difference in milliseconds

    if (diff <= 0) {
      return { delay: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    } else {
      return {
        delay: false,
        days: Math.floor(moment.duration(diff).asDays()),
        hours: moment.duration(diff).hours(),
        minutes: moment.duration(diff).minutes(),
        seconds: moment.duration(diff).seconds(),
      };
    }
  };

  const remainingTime = calculateRemainingTime(task.endDate);

 useEffect(() => {
  getPdf();
}, []);

const getPdf = async () => {
  try {
    const result = await api.get(`/api/getTask`, {
     
    });
    setAllImage(result.data.data);
  } catch (error) {
    console.error("Error fetching task PDF data:", error);
  }
};

// Use token in URL query param (since window.open can't set headers)

function pdfOpener(val) {
  // No need to read or send token manually — cookies handle it
  const url = `${BASE_URL}/${val}`;
  window.open(url, "_blank", "noreferrer");
}

const showPdf = (id) => {
  const required = allImage?.filter((val) => val._id === id);
  if (required && required[0]?.pdf.length > 1) {
    required[0].pdf.forEach((val) => {
      pdfOpener(val);
    });
  } else {
    const url = `${BASE_URL}/${required[0]?.pdf[0]}`;
    window.open(url, "_blank", "noreferrer");
  }
};

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`, {
       
      });
      setTasks(response.data);
      // Update the totalAssignedTasks state with the count of assigned tasks
      const assignedTasksCount = response.data.filter(
        (task) => task.status === "Assigned" && task.adminMail.Email === email
      ).length;
      setTotalAssignedTasks(assignedTasksCount);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
      // Schedule the next update after 1 minute (adjust as needed)
    }
  };

  useEffect(() => {
    fetchData();

    return () => clearTimeout();
  }, []);

  const cancelTask = async (taskId) => {
    try {
      setIsCanceling(true);

      // Prompt the user for cancellation remarks
      const cancellationRemarks = prompt(
        "Enter remarks for task cancellation:"
      );

      if (cancellationRemarks === null) {
        // If the user clicks Cancel in the prompt, do nothing
        setIsCanceling(false);
        return;
      }

      // Update the task status to "Cancelled" in the database
      await api.put(`/api/tasks/${taskId}`, {
        status: "Cancelled",
        comment: cancellationRemarks,
      });
      // Display success notification
      toast.success("Task canceled successfully!");
      // Update the UI by fetching the latest tasks
      fetchData();
    } catch (error) {
      console.error("Error canceling task:", error.message);
      toast.error("Failed to cancel task. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/api/tasks/${updatedTask.id}`, {
        Taskname: updatedTask.Taskname,
        description: updatedTask.description,
        startDate: updatedTask.startDate,
        endDate: updatedTask.endDate,
        managerEmail: updatedTask.managerEmail,
        duration: updatedTask.duration,
        comment: updatedTask.comment,
      });

      // Display success notification
      toast.success("Task updated successfully!");

      // Close the update modal
      handleCloseUpdateModal();

      // Update the UI by fetching the latest tasks
      fetchData();
    } catch (error) {
      console.error("Error updating task:", error.message);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const ShortedText = (text) => {
    return text; // No length restriction or truncation
  };

  const sanitizedDesc = (description) => {
    if (!description) return "";

    return ShortedText(
      description
        .replace(/<img[^>]*>/g, "")
        .replace(/<iframe[^>]*>/g, "")
        .replace(/<h1[^>]*>.*?<\/h1>/gi, "")
        .replace(/<h2[^>]*>.*?<\/h2>/gi, "")
        .replace(/<script[^>]*>.*?<\/script>/gi, "")
    );
  };

  const calculateProgress = (task) => {
    const totalEmployees =
      task.employees.length -
      task.employees.filter((emp) => emp.empTaskStatus === "Rejected").length;
    const completedTasks = task.employees.filter(
      (emp) => emp.empTaskStatus === "Completed"
    ).length;
    return (completedTasks / totalEmployees) * 100;
  };
  // update task
  const [taskToUpdate, setTaskToUpdate] = useState(null);

  const handleUpdateClick = (task) => {
    setTaskToUpdate(task);
    setShowUpdateModal(true);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
  };

  const handleTaskUpdate = () => {
    fetchData(); // Re-fetch tasks after update
  };
  // end update task

  // =========chat===========//

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  // ---------active task------//
  const [selectAll, setSelectAll] = useState(false);
  const [isForwardButtonDisabled, setIsForwardButtonDisabled] = useState(true);
  const [getEmployee, setGetEmployee] = useState([]);
  const [, setEmployeeData] = useState([]);
  const [inputEmail, setInputEmail] = useState("");
  const [originalEmployeeData, setOriginalEmployeeData] = useState([]);
  const [filteredEmployeeData, setFilteredEmployeeData] = useState([]);
  // update task
  const [rowData, setRowData] = useState([]);
  const [taskDepartment, setTaskDepartment] = useState("");
  const [taskName, setTaskName] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [modalShow, setModalShow] = React.useState(false);
  const [empData, setEmpData] = useState(null);


  const taskId = uuidv4();
  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const id = userData?._id;

  const { socket } = useContext(AttendanceContext);

  const loadEmployeeDatas = () => {
    api
      .get(`/api/employee`, {
       
      })
      .then((response) => {
        const employeeObj = response.data;

        const emp = response.data.filter((val) => {
          return val.Email === email;
        });

        setEmpData(emp);
        setEmployeeData(employeeObj);
        setLoading(false);
        const rowDataT = employeeObj.map((data) => {
          return {
            data,
            Email: data["Email"],
            department: data["department"][0]["DepartmentName"],
            FirstName: data["FirstName"] + "" + data["LastName"],
            ContactNo: data["ContactNo"],
            PositionName: data["position"][0]
              ? data["position"][0]["PositionName"]
              : "",
          };
        });

        setRowData(rowDataT);
      })
      .catch((error) => { });
  };

  useEffect(() => {
    loadEmployeeDatas();
  }, []);
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setInputEmail(searchValue);

    if (!searchValue) {
      setRowData(filteredEmployeeData); // Reset to filtered employees instead of all employees
      return;
    }

    const filteredEmployees = filteredEmployeeData.filter((employee) =>
      (employee.FirstName && employee.FirstName.toLowerCase().includes(searchValue)) ||
      (employee.Email && employee.Email.toLowerCase().includes(searchValue)) ||
      (employee.PositionName && employee.PositionName.toLowerCase().includes(searchValue))
    );

    setRowData(filteredEmployees);
  };

  const handleInputChange = (e) => {
    setInputEmail(e.target.value);
  };

  const removeSelectedEmployee = (Email) => {
    setSelectedEmployees(
      selectedEmployees.filter((employee) => employee.Email !== Email)
    );
  };

  const addSelectedEmployee = (employee) => {
    const isChecked = selectedEmployees.some(
      (emp) => emp.Email === employee.Email
    );

    if (isChecked) {
      setSelectedEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.Email !== employee.Email)
      );
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
    if (selectedEmployees.length < 0) {
      setIsForwardButtonDisabled(true);
    } else {
      setIsForwardButtonDisabled(false); // Disable the button when there is at least one selected employee
    }

    setInputEmail("");
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedEmployees(selectAll ? [] : [...rowData]);
  };

  const forwordTaskToEmployee = async (taskId, dep, taskName, task) => {
    const employeeEmails = task.employees.map((emp) => emp.employee.Email);
    let filteredData = rowData.filter((val) => {
      return (
        !employeeEmails.includes(val.Email) &&
        val.Email !== email &&
        val.data.Account === 3 &&
        val.data.status === "active"
      );
    });

    setTaskName(taskName);
    setRowData(filteredData);
    setFilteredEmployeeData(filteredData); // Store filtered list separately

    setTaskDepartment(dep);
    setSelectedTaskId(taskId);
    setModalShow(true);
  };


  const forwardTaskToEmployees = async (selectedTaskId) => {
    try {
      const employeeNotificationArr = [];
      for (const employee of selectedEmployees) {
        try {
          employeeNotificationArr.push(employee.Email);
          const employeeData = {
            empname: employee.FirstName,
            empemail: employee.Email,
            empdesignation: employee.PositionName,
            empTaskStatus: "Task Assigned",
          };

          await api.post(
            `/api/tasks/${selectedTaskId}/employees`,
            {
              employees: [employeeData],
            },
            
          );
        } catch (error) {
          console.error(
            `Error forwarding task to ${employee.FirstName}:`,
            error.message
          );
        }
      }
      const taskId = uuid();

      if (empData[0].profile) {
        const employeeTaskNotification = {
          senderMail: email,
          employeesEmail: employeeNotificationArr,
          taskId,
          status: "unseen",
          message: `Task Assigned`,
          messageBy: name,
          profile: empData[0].profile.image_url,
          taskName,
          Account: 2,
          path: "newTask",
        };

        socket.emit("employeeTaskNotification", employeeTaskNotification);
      } else {
        const employeeTaskNotification = {
          senderMail: email,
          employeesEmail: employeeNotificationArr,
          taskId,
          status: "unseen",
          message: `Task Assigned`,
          messageBy: name,
          profile: null,
          taskName,
          Account: 2,
          path: "newTask",
        };

        socket.emit("employeeTaskNotification", employeeTaskNotification);
      }
      fetchData();

      setSelectedEmployees([]);
      setModalShow(false);
    } catch (error) {
      console.error("Error forwarding task:", error.message);
      toast.error("Failed to forward task. Please try again.");
    }
  };

  const navigateHandler = (taskId, to, task) => {
    dispatch(
      addDetails({
        taskId: task._id,
        to: [to.Email],
        task: task.adminMail.profile ? task.adminMail.profile : null,
        taskName: task.Taskname,
      })
    );

    // navigate("/admin/admin_manager");
    adminToggle();
  };

  // manager and admin task chating
  const [adminExpand, setAdminExpand] = useState(null);

  const adminToggle = () => {
    setAdminExpand(!adminExpand);

    const adminToggle = () => {
      setAdminExpand((prev) => !prev);
    };
  };

  // task details expands
  const [isBodyVisible, setIsBodyVisible] = useState(null);
  const toggleBodyVisibility = () => {
    setIsBodyVisible(!isBodyVisible);
  };
  const [showModal, setShowModal] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTaskName, setSelectedTaskName] = useState("");

  const handleViewAttachments = (attachments, employee, taskName) => {
    setSelectedAttachments(attachments);
    setSelectedEmployee(employee);
    setSelectedTaskName(taskName);
    setShowModal(true);
  };
  const [activeAttachment, setActiveAttachment] = useState(null);

  return (
    <div className="conatiner mt-2">
      <div className="row">
        <div className="col-xl-9 col-md-8">
          <div className="card" style={{
            background: darkMode ? "transparent" : "rgb(43, 44, 44)",
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
          }}>
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="d-flex align-items-center gap-2">
                <div>
                  <CgArrowLongLeft
                    onClick={onBack}
                    style={{ fontSize: "20px", cursor: "pointer" }}
                  />
                </div>
                <h5 className="fw-medium mb-0">{task.taskID}</h5>
              </div>
              <div>
                <FiEdit
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={() => handleUpdateClick(task)}
                />
              </div>
            </div>

            <div className="card-body">
              <div>
                {/* created by */}
                <div className=" align-items-center justify-content-between flex-wrap border-bottom mb-3">
                  <div className="align-items-center flex-wrap">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <h5 className="fw-semibold me-2">{task.Taskname}</h5>
                      </div>
                      <div className="d-flex justify-content-between align-items-center flex-wrap row-gap-2">
                        <div className="d-flex ">
                          <p className="d-flex align-items-center mb-0 me-2">
                            <img
                              src={
                                task.adminMail.profile
                                  ? task.adminMail.profile.image_url
                                  : profile
                              }
                              className="avatar avatar-xs rounded-circle me-2"
                              alt="img"
                            />
                            Created By:{" "}
                            <span className=" ms-1">
                              {task.adminMail.FirstName}{" "}
                              {task.adminMail.LastName}
                            </span>
                          </p>

                        </div>
                        <div className="d-flex align-items-center flex-wrap row-gap-2">
                          <p className="d-flex align-items-center mb-0 me-2">
                            <img
                              src={
                                task.managerEmail.profile
                                  ? task.managerEmail.profile.image_url
                                  : profile
                              }
                              className="avatar avatar-xs rounded-circle me-2"
                              alt="img"
                            />
                            Assigned To:{" "}
                            <span className=" ms-1">
                              {task.managerEmail.FirstName}{" "}
                              {task.managerEmail.LastName}
                            </span>
                          </p>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* discription */}
                <div className="border-bottom mb-3 pb-3">
                  <div
                    className="text-start flex-wrap d-flex"
                    dangerouslySetInnerHTML={{
                      __html: sanitizedDesc(task.description),
                    }}
                  />

                  {/* task attachments */}
                  <div className="mt-4">
                    <h5>Task Attachments</h5>
                    <div className="d-flex align-items-center mb-3">
                      {task.pdf?.map((imagePath, index) => (
                        <div key={index}>
                          <img
                            onClick={() => showPdf(task._id)}
                            src={`${BASE_URL}/${imagePath}`}
                            alt={task.Taskname}
                            style={{
                              width: " 100px",
                              height: "auto",
                              margin: "10px",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-bottom mb-3 ">
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                    <h5 className="fw-700">Team Members</h5>
                    <div className="d-flex align-items-center">
                      {task.status === "Pending" && (
                        <button className="btn btn-primary border btn-sm d-inline-flex align-items-center gap-2"
                          onClick={() =>
                            forwordTaskToEmployee(
                              task._id,
                              task.department,
                              task.Taskname,
                              task
                            )
                          }
                          style={{ fontWeight: "700" }}>
                          Add Team
                        </button>
                      )}
                    </div>

                    <div
                      className="table-responsive"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #E9EAEB",
                      }}
                    >
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th style={rowHeadStyle(darkMode)}>S. No </th>
                            <th style={rowHeadStyle(darkMode)}> Name</th>
                            <th style={rowHeadStyle(darkMode)}> Email</th>
                            <th style={rowHeadStyle(darkMode)}> Designation</th>
                            <th style={rowHeadStyle(darkMode)}> Task Status</th>
                            <th style={rowHeadStyle(darkMode)}> Remarks</th>
                            <th style={rowHeadStyle(darkMode)}> Attachment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {task.employees.map((taskemp, i) => (
                            <tr key={i}>
                              <td style={rowBodyStyle(darkMode)}> {i + 1}</td>
                              <td style={rowBodyStyle(darkMode)}>
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-rounded flex-shrink-0 me-2">
                                    <img
                                      src={
                                        taskemp.employee.profile
                                          ? taskemp.employee.profile
                                            ?.image_url ||
                                          taskemp.employee.profile
                                          : profile
                                      }
                                      alt="Img"
                                    />
                                  </div>
                                  <h6 className="fw-medium">
                                    {" "}
                                    {`${taskemp.employee.FirstName} ${taskemp.employee.LastName}`}
                                  </h6>{" "}
                                </div>
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                {taskemp.employee.Email}
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                {" "}
                                {taskemp.employee.position[0].PositionName}
                              </td>
                              <td style={rowBodyStyle(darkMode)}>
                                <span
                                  className={`task-status-badge ${taskemp.empTaskStatus
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                >
                                  <FaRegDotCircle /> {taskemp.empTaskStatus}
                                </span>
                              </td>

                              <td style={rowBodyStyle(darkMode)}>
                                {" "}
                                {taskemp.empTaskComment}
                              </td>
                              {/* <td style={rowBodyStyle(darkMode)}>
                                {taskemp.attachments.length > 0 ? (
                                  <div className="attachments">
                                    {taskemp.attachments.map((file, index) => (
                                      <div
                                        key={index}
                                        style={{
                                          display: "inline-block",
                                          margin: "5px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {file.fileType &&
                                        file.fileType.startsWith("image/") ? (
                                          <div>
                                            <a
                                              href={file.fileUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              style={{
                                                display: "block",
                                                marginBottom: "5px",
                                              }}
                                            >
                                              <img
                                                src={file.fileUrl}
                                                alt={
                                                  file.fileName || "Attachment"
                                                }
                                                style={{
                                                  maxWidth: "50px",
                                                  maxHeight: "50px",
                                                  objectFit: "cover",
                                                  borderRadius: "5px",
                                                }}
                                              />
                                            </a>
                                            <a
                                              href={file.fileUrl}
                                              download={file.fileName}
                                              style={{
                                                textDecoration: "none",
                                                color: "#007bff",
                                                fontSize: "12px",
                                              }}
                                            >
                                              Download
                                            </a>
                                          </div>
                                        ) : (
                                          <div>
                                            <a
                                              href={file.fileUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              style={{
                                                display: "block",
                                                marginBottom: "5px",
                                                textDecoration: "none",
                                                color: "#007bff",
                                              }}
                                            >
                                              {file.fileName || "View File"}
                                            </a>
                                            <a
                                              href={file.fileUrl}
                                              download={file.fileName}
                                              style={{
                                                textDecoration: "none",
                                                color: "#007bff",
                                                fontSize: "12px",
                                              }}
                                            >
                                              Download
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p>No attachments</p>
                                )}
                              </td> */}
                              <td style={rowBodyStyle(darkMode)}>
                                {taskemp.attachments.length > 0 ? (
                                  <IoMdEye
                                    style={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                    }}
                                    variant="link"
                                    onClick={() =>
                                      handleViewAttachments(
                                        taskemp.attachments,
                                        taskemp.employee,
                                        task.taskName
                                      )
                                    }
                                  />
                                ) : (
                                  <p>No attachments</p>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Attachment Modal */}
                      <Modal
                        show={showModal}
                        fullscreen={false}
                        onHide={() => setShowModal(false)}
                        centered
                        size="lg"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            {selectedEmployee?.FirstName}{" "}
                            {selectedEmployee?.LastName} - {selectedTaskName}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ display: "flex" }}>
                          {/* Left side - Attachment List */}
                          <div
                            style={{
                              flex: 1,
                              borderRight: "1px solid #ddd",
                              paddingRight: "10px",
                            }}
                          >
                            {selectedAttachments.length > 0 ? (
                              <ListGroup>
                                {selectedAttachments.map((file, index) => (
                                  <ListGroup.Item
                                    key={index}
                                    action
                                    active={activeAttachment === file}
                                    onClick={() => setActiveAttachment(file)}
                                    className="text-dark"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {file.fileName || `Attachment ${index + 1}`}
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            ) : (
                              <p>No attachments</p>
                            )}
                          </div>

                          {/* Right side - Attachment Preview */}
                          <div
                            style={{
                              flex: 2,
                              paddingLeft: "10px",
                              textAlign: "center",
                            }}
                          >
                            {activeAttachment ? (
                              <div>
                                {activeAttachment.fileType?.startsWith(
                                  "image/"
                                ) ? (
                                  <a
                                    href={activeAttachment.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={activeAttachment.fileUrl}
                                      alt={
                                        activeAttachment.fileName ||
                                        "Attachment"
                                      }
                                      style={{
                                        maxWidth: "100%",
                                        maxHeight: "300px",
                                        objectFit: "contain",
                                        borderRadius: "5px",
                                      }}
                                    />
                                  </a>
                                ) : (
                                  <a
                                    href={activeAttachment.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      fontSize: "16px",
                                      color: "#007bff",
                                    }}
                                  >
                                    {activeAttachment.fileName || "View File"}
                                  </a>
                                )}
                                <br />
                                <a
                                  href={activeAttachment.fileUrl}
                                  download={activeAttachment.fileName}
                                  style={{
                                    textDecoration: "none",
                                    color: "#007bff",
                                    fontSize: "14px",
                                  }}
                                >
                                  Download
                                </a>
                              </div>
                            ) : (
                              <p>Select an attachment to preview</p>
                            )}
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                          >
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </div>

                {/* action button */}
                <div className="d-flex align-items-center mb-3">
                  <div className="d-flex flex-column gap-2 ">
                    {/* Action
                    <div
                      style={{ height: "fit-content" }}
                      className="d-flex  gap-2"
                    >
                      <button
                        className="btn btn-danger d-flex justify-center aline-center gap-2"
                        onClick={() => cancelTask(task._id)}
                      >
                        <MdCancel />
                        Cancel Task
                      </button>
                    </div> */}
                    {/* Task Update Modal */}
                    {taskToUpdate && (
                      <UpdateTaskModal
                        show={showUpdateModal}
                        onHide={handleCloseModal}
                        task={taskToUpdate}
                        onUpdate={handleTaskUpdate}
                      />
                    )}
                  </div>
                </div>


                <div className="d-flex align-items-center p-2 justify-content-between">
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
        </div>
        <div className="col-xl-3 col-md-4">
          <div className="card" style={{
            background: darkMode ? "transparent" : "rgb(43, 44, 44)",
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
          }}>
            <div
              className="card-header p-3 d-flex justify-content-between"
              style={{ cursor: "pointer" }}
              onClick={toggleBodyVisibility}
            >
              <h4>Task Details</h4>

              <span style={{ cursor: "pointer" }}>
                {isBodyVisible ? (
                  <MdKeyboardArrowUp title="Close" className="fs-3" />
                ) : (
                  <MdKeyboardArrowDown title="Open" className="fs-3" />
                )}
              </span>
            </div>
            {isBodyVisible && (
              <div className="card-body p-0">
                {/*task related important  */}

                <div class="d-flex flex-column">
                  <div class="d-flex align-items-center justify-content-between border-bottom p-3">
                    <div>Priority</div>
                    <div class="d-flex align-items-center">
                      <span
                        className={`priority-badge ${task.Priority.toLowerCase()}`}
                      >
                        <FaRegDotCircle /> {task.Priority}
                      </span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center justify-content-between border-bottom p-3">
                    <div>Status</div>
                    <div className="d-flex align-items-center">
                      <span
                        className={`task-status-badge ${task.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        <FaRegDotCircle /> {task.status}
                      </span>
                    </div>
                  </div>
                  {/*task  start date  */}
                  <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                    <div>Start Date</div>
                    <div className="d-flex align-items-center">
                      <span className="date-badge start-date">
                        {getFormattedDate(task.startDate)}
                      </span>
                    </div>
                  </div>
                  {/* task end date  */}
                  <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                    <div>End Date</div>
                    <div className="d-flex align-items-center">
                      <span className="date-badge end-date">
                        {getFormattedDate(task.endDate)}
                      </span>
                    </div>
                  </div>
                  {/* department */}
                  <div class="d-flex align-items-center justify-content-between p-3">
                    <div>Department</div>
                    <div class="d-flex align-items-center">
                      <span class="department-badge depart">
                        {task.department}
                      </span>
                    </div>
                  </div>
                </div>
                {/* .calculate time */}
                <div className="border-bottom p-3">
                  <div className="mb-3">
                    <span className="d-flex flex-column gap-1">
                      <h6>Time Left</h6>
                      <span>
                        <div>
                          <div className="d-flex gap-2">
                            {remainingTime.delay ? (
                              <div className="rounded-2 border border-danger text-wrap  my-auto p-1 px-2">
                                <span >
                                  Please finish the task as soon as you can, as it's running late.
                                </span>
                              </div>
                            ) : (
                              <>
                                {/* Days */}
                                <div className="text-center">
                                  <div
                                    className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                    style={{
                                      boxShadow: "0 0 5px 2px gray inset",
                                      height: "30px",
                                      minWidth: "30px",
                                    }}
                                  >
                                    {remainingTime.days}
                                  </div>
                                  <div>Days</div>
                                </div>

                                {/* Hours */}
                                <div className="text-center">
                                  <div
                                    className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                    style={{
                                      boxShadow: "0 0 5px 2px gray inset",
                                      height: "30px",
                                      minWidth: "30px",
                                    }}
                                  >
                                    {remainingTime.hours}
                                  </div>
                                  <div>Hrs</div>
                                </div>

                                {/* Minutes */}
                                <div className="text-center">
                                  <div
                                    className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                    style={{
                                      boxShadow: "0 0 5px 2px gray inset",
                                      height: "30px",
                                      minWidth: "30px",
                                    }}
                                  >
                                    {remainingTime.minutes}
                                  </div>
                                  <div>Min</div>
                                </div>

                                {/* Seconds */}
                                <div className="text-center">
                                  <div
                                    className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                    style={{
                                      boxShadow: "0 0 5px 2px gray inset",
                                      height: "30px",
                                      minWidth: "30px",
                                    }}
                                  >
                                    {remainingTime.seconds}
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
                </div>
                {/* task progress bar */}
                <div className="d-flex align-items-center border-bottom p-3">
                  <div>
                    <div
                      className="d-flex"
                      style={{
                        width: "20rem",
                        height: "7rem",
                        borderRadius: "50%",
                      }}
                    >
                      <CircularProgressbar
                        className="fw-bold"
                        value={isNaN(calculateProgress(task)) ? 0 : calculateProgress(task)}
                        text={`${isNaN(calculateProgress(task)) ? "0" : calculateProgress(task).toFixed(0)}%`}
                        styles={buildStyles({
                          pathColor: "#28a745",
                          textColor: "#28a745",
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* manager and admin chat */}
          <div
            className="card mt-3"
            style={{
              display: "flex",
              flexDirection: "column",
              background: darkMode ? "transparent" : "rgb(43, 44, 44)",
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
          >
            <div
              className="card-header p-3 d-flex justify-content-between"
              onClick={adminToggle}
            >
              <h4>Manager Chat</h4>
              <span style={{ cursor: "pointer" }}>
                {adminExpand ? (
                  <MdKeyboardArrowUp title="Close" className="fs-3" />
                ) : (
                  <MdKeyboardArrowDown title="Open" className="fs-3" />
                )}
              </span>
            </div>
            {adminExpand && <AdminChatModal ChatTaskId={task._id} />}
          </div>
        </div>
      </div>

      {task.status === "Pending" && (
        <div className="position-fixed end-0 p-3" style={{ bottom: "25px" }}>
          <IoChatbubbles
            className="btn btn-primary d-flex justify-center align-items-center gap-2"
            style={{
              borderRadius: "50%",
              height: "50px",
              width: "50px",
              position: "relative",
            }}
            onClick={() => navigateHandler(task._id, task.managerEmail, task)}
          />
        </div>
      )}

      {/* task forward */}
      <Modal
        fullscreen={false}
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Forward Task to Employees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <form className="d-flex col-8 flex-column gap-3">
              <input
                className="w-100 py-1 px-2 rounded-5 border"
                type="search"
                name=""
                placeholder="Search..."
                id=""
                value={inputEmail}
                onChange={(e) => {
                  handleInputChange(e);
                  handleSearch(e);
                }}
              />
              <div>
                <div className=" p-2">
                  {" "}
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    onChange={toggleSelectAll}
                    checked={selectAll}
                  />{" "}
                  <span>Select All</span>
                </div>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Name</th>
                      {/* <th>Email</th> */}
                      {/* <th>Contact</th> */}
                      <th>Designation</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rowData.map((row, index) => (
                      <tr key={index}>
                        <th scope="row">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onChange={() => addSelectedEmployee(row)}
                            checked={selectedEmployees.some(
                              (emp) => emp.Email === row.Email
                            )}
                          />
                        </th>
                        <td>{row.FirstName}</td>
                        {/* <td>{row.Email}</td> */}
                        {/* <td>{row.ContactNo}</td> */}
                        <td>{row.PositionName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </form>
            <div className="d-flex flex-column col-4 gap-2 ">
              <div
                className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
                style={{ height: "fit-content" }}
              >
                <div>
                  <span className="fw-bold ">Selected Employees:</span>
                  {selectedEmployees.map((employee, index) => (
                    <div key={index} className="d-flex">
                      <span
                        style={{
                          boxShadow: "-3px 3px 5px rgba(204, 201, 201, 0.767)",
                          width: "fit-content",
                        }}
                        className="selected-employee-email d-flex btn gap-2 aline-center  btn-light py-1 px-2 m-1"
                        onClick={() => removeSelectedEmployee(employee.Email)}
                      >
                        {employee.FirstName} - {employee.PositionName}
                        <span className="text-danger d-none">
                          <MdDeleteForever />
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn  btn-primary "
                onClick={() => forwardTaskToEmployees(selectedTaskId)}
                disabled={isForwardButtonDisabled}
              >
                Forward Task to Employees
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setModalShow(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskDetails;
