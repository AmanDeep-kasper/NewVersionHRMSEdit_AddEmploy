import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdCancel,
  MdEdit,
  MdOutlineCancel,
} from "react-icons/md";
import ActiveTask from "../../../img/Task/ActiveTask.svg";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BsFiletypeDoc } from "react-icons/bs";
import BASE_URL from "../../../Pages/config/config";
import toast from "react-hot-toast";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import profile from "../../../img/profile.jpg"
import { useSelector } from "react-redux";
import api from "../../../../Pages/config/api";
const AdminAssignedTask = () => {
  const { userData} = useSelector((state)=> state.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [allImage, setAllImage] = useState(null);
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { darkMode } = useTheme();
  const email = userData?.Email;
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
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    getPdf();
  }, []);
  const getPdf = async () => {
    const result = await axios.get(`${BASE_URL}/api/getTask`);
      
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

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`,{
      });
      setTasks(response.data);
      // Update the totalAssignedTasks state with the count of assigned tasks
      const assignedTasksCount = response.data.filter(
        (task) => task.status === "Assigned" && task.adminMail.Email ===email
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
    setError(null);

    // ✅ Validate taskId
    if (!taskId) {
      toast.error("Invalid Task ID");
      setIsCanceling(false);
      return;
    }

    // ✅ Prompt user for remarks
    const cancellationRemarks = prompt("Enter remarks for task cancellation:");
    if (cancellationRemarks === null || cancellationRemarks.trim() === "") {
      toast.error("Cancellation remarks are required.");
      setIsCanceling(false);
      return;
    }

    // ✅ API request to update task status
    const response = await api.put(
      `/api/tasks/${taskId}`,
      {
        status: "Cancelled",
        comment: cancellationRemarks.trim(),
      },
    );

    // ✅ Success response
    toast.success(response.data.message || "Task canceled successfully!");

    // ✅ Refresh task list
    fetchData();
  } catch (error) {
    console.error("Error canceling task:", error);
    const errMsg =
      error.response?.data?.message ||
      "Failed to cancel task. Please try again.";
    toast.error(errMsg);
    setError(errMsg);
  } finally {
    setIsCanceling(false);
  }
};

  const updateTask = (taskId) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);

    if (taskToUpdate) {
      setUpdatedTask({
        id: taskToUpdate._id,
        Taskname: taskToUpdate.Taskname,
        description: taskToUpdate.description,
        startDate: taskToUpdate.startDate,
        endDate: taskToUpdate.endDate,
        managerEmail: taskToUpdate.managerEmail,
        duration: taskToUpdate.duration,
        comment: taskToUpdate.comment,
      });

      setShowUpdateModal(true);
    }

      
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

 const handleUpdate = async () => {
  try {
    // ✅ Basic validation
    if (!updatedTask || !updatedTask.id) {
      toast.error("Invalid task details.");
      return;
    }

    // ✅ Show loading (if you have a state)
    setIsUpdating(true);

    const response = await api.put(
      `/api/tasks/${updatedTask.id}`,
      {
        Taskname: updatedTask.Taskname?.trim(),
        description: updatedTask.description?.trim(),
        startDate: updatedTask.startDate,
        endDate: updatedTask.endDate,
        managerEmail: updatedTask.managerEmail?.trim(),
        duration: updatedTask.duration,
        comment: updatedTask.comment?.trim(),
      },
    );

    // ✅ Success notification
    toast.success(response.data.message || "Task updated successfully!");

    // ✅ Close modal
    handleCloseUpdateModal();

    // ✅ Refresh tasks
    fetchData();
  } catch (error) {
    console.error("Error updating task:", error);
    const errMsg =
      error.response?.data?.message ||
      "Failed to update task. Please try again.";
    toast.error(errMsg);
  } finally {
    setIsUpdating(false);
  }
};


  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };
  const accountAccess = (value)=>{
    switch(value){
      case 1: {return "Admin"}
      case 2:  {return "Hr"}
      case 3:  {return "Employee"}
      case 4:  {return "Manager"}
    }
  }
  return (
    <div className="container-fluid py-2">
      <TittleHeader
        title={"Assigned"}
        numbers={totalAssignedTasks}
        message={"You can view all assigned task status here."}
      />
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
      {tasks
          .filter((task) => task.status === "Assigned" && task.adminMail.Email===email).length > 0 ? (      <div className="row mx-auto">
            {tasks
              .filter((task) => task.status === "Assigned" && task.adminMail.Email===email)
              .reverse()
              .map((task, index) => (
                <div
                  key={task._id}
                  style={{
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--secondaryDashMenuColor)",
                  }}
                  className="col-12 col-md-6 col-lg-4 p-2"
                >
                  <div
                    style={{
                      border: !darkMode
                        ? "1px solid var(--primaryDashMenuColor)"
                        : "1px solid var(--secondaryDashColorDark)",
                    }}
                    className="task-hover-effect p-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 style={{wordWrap:"anywhere"}}>{task.Taskname}</h5>
                      <button className="btn btn-primary">{task.status}</button>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center justify-content-between gap-2">
                       
                          <div className="d-flex align-items-center gap-2">
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                            src={task.adminMail.profile? task.adminMail.profile.image_url: profile}
                            alt=""
                          /> <div className="d-flex flex-column">
                          <span>{task.adminMail.Email}</span>
                          <span>{accountAccess(task.adminMail.Account)}</span>
                          </div>
                          </div>
                         
                       
                        <span
                          style={{
                            border: darkMode
                              ? "1px solid var(--primaryDashColorDark)"
                              : "1px solid var(--primaryDashMenuColor)",
                          }}
                          className="px-2 py-1 text-center"
                        >
                          {task.department}
                        </span>
                      </div>
                      <hr />
                      <div className="d-flex align-items-center justify-content-between gap-2">
                       
                       <div className="d-flex align-items-center gap-2">
                       <img
                         style={{
                           height: "30px",
                           width: "30px",
                           borderRadius: "50%",
                           objectFit: "cover",
                         }}
                         src={task.managerEmail.profile? task.managerEmail.profile.image_url: profile}
                         alt=""
                       /> <div className="d-flex flex-column">
                       <span>{task.managerEmail.Email}</span>
                       <span>{accountAccess(task.managerEmail.Account)}</span>
                       </div>
                       </div>
                   </div>
                    <hr />
                    <div className="my-3 d-flex flex-column gap-1">
                      <h6>Task Description</h6>
                      <span style={{wordWrap:"anywhere"}}>{task.description}</span>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between gap-3 my-2">
                        <span className="d-flex flex-column">
                          <h6>Task Duration</h6>
                          <span style={{ width: "fit-content" }}>
                            {task.duration} days
                          </span>
                        </span>{" "}
                        <span className="d-flex flex-column">
                          <h6>Start Date</h6>{" "}
                          <span style={{ width: "fit-content" }}>
                            {getFormattedDate(task.startDate)}
                          </span>
                        </span>
                        <span className="d-flex flex-column">
                          <h6>End Date</h6>{" "}
                          <span style={{ width: "fit-content" }}>
                            {getFormattedDate(task.endDate)}
                          </span>
                        </span>
                      </div>
                      <div className="mt-4">
                        <span
                          style={{ cursor: "pointer" }}
                          onMouseEnter={() => setTimeinfo("name")}
                          onMouseLeave={() => setTimeinfo(false)}
                          onClick={() => toggleTaskDetails(task._id)}
                        >
                          {expandedTaskId === task._id ? (
                            <span>
                              View Less <MdArrowDropUp className="fs-4" />
                            </span>
                          ) : (
                            <span>
                              {" "}
                              View Details <MdArrowDropDown className="fs-4" />
                            </span>
                          )}
                        </span>
                      </div>
                      {expandedTaskId === task._id && (
                        <div>
                          <div className="d-flex flex-column my-2">
                            <h6>Remarks</h6>
                            <span>{task.comment}</span>
                          </div>
                          <hr />
                          <span className="d-flex flex-column gap-1">
                            <h6>Time Left</h6>
                            <span>
                              <div
                                style={{
                                  display:
                                    expandedTaskId === task._id ? "flex" : "none",
                                }}
                              >
                                <div className="d-flex gap-2 justify-content-between">
                                  {calculateRemainingTime(task.endDate).delay ? (
                                    <div className="">
                                      <span className=" rounded-5 border border-danger  my-auto  p-1 px-2">
                                        Please finish the task as soon as you can,
                                        as it's running late.
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
                          <div className="d-flex flex-column gap-2 my-2">
                            Action
                            <div
                              style={{ height: "fit-content" }}
                              className="d-flex pt-3 gap-2"
                            >
                              <button
                                className="btn btn-danger d-flex justify-center aline-center gap-2"
                                onClick={() => cancelTask(task._id)}
                              >
                                <MdCancel />
                                Cancel Task
                              </button>
                              {allImage && allImage.length > 0 && (
                                <button
                                  className="btn btn-primary d-flex justify-center aline-center gap-2"
                                  onClick={() => showPdf(task._id)}
                                >
                                  <BsFiletypeDoc />
                                  View Docs
                                </button>
                              )}
                              <button
                                className="btn btn-primary d-flex justify-center aline-center gap-2"
                                onClick={() => updateTask(task._id)}
                              >
                                <MdEdit />
                                Update Task
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>) : (
          <div
            className="d-flex flex-column gap-3 align-items-center justify-content-center"
            style={{ height: "80vh" }}
          >
            <img
              style={{ width: "15rem", height: "auto" }}
              src={ActiveTask}
              alt=""
            />
            <p style={{color: !darkMode ? "white" : "black"}}>Sorry, there are no tasks assigned yet.</p>
          </div>
        )}


      <Modal
        show={showUpdateModal}
        fullscreen={false}
        onHide={handleCloseUpdateModal}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Update Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex flex-column gap-3">
            <Form.Group controlId="formTaskName">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedTask.Taskname}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, Taskname: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={updatedTask.description}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <div className="row">
              <Form.Group className="col-12 col-md-6" controlId="startDate">
                <Form.Label>Start Date </Form.Label>
                <Form.Control
                  type="date"
                  value={updatedTask.startDate}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      startDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="col-12 col-md-6" controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={updatedTask.endDate}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      endDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="col-12" controlId="comment">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedTask.comment}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      comment: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>

            <Button variant="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminAssignedTask;
