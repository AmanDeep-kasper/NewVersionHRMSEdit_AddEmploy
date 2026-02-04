import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import "moment-timezone"; // Required for .tz() to work
import { toast } from "react-hot-toast";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import {
  getFormattedDate,
  getTimeAgo,
} from "../../../../Utils/GetDayFormatted";
import profile from "./profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
import { addDetails } from "../../../../redux/slices/messageSlice";
import BASE_URL from "../../../../Pages/config/config"; // ← Fixed: import BASE_URL
import api from "../../../../Pages/config/api";

import { FiEdit } from "react-icons/fi";
import { CgArrowLongLeft } from "react-icons/cg";
import { FaRegDotCircle } from "react-icons/fa";
import { GiDuration } from "react-icons/gi";
import { IoMdEye } from "react-icons/io";
import { IoChatbubbles } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import ChatEmpManager from "../../../Employee/EmployeeTaskManagement/TaskContainer/Modal/ChatEmpManager";
import AdminChatModal from "../taskModal/AdminChatModal";
import UpdateTaskModal from "../../../Admin/TaskManagement/modal/UpdateTaskModal";
import { Modal, Button, ListGroup } from "react-bootstrap";

const ManagerTaskDetails = ({ task, onBack }) => {
  // ────────────────────────────────────────────────
  // ALL HOOKS FIRST — no conditionals before them
  // ────────────────────────────────────────────────

  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);
  const { socket } = useContext(AttendanceContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empData, setEmpData] = useState(null);
  const [currentTime, setCurrentTime] = useState(moment());
  const [startTime, setStartTime] = useState(null);
  const [allImage, setAllImage] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [chatExpand, setChatExpand] = useState(false);
  const [adminExpand, setAdminExpand] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isBodyVisible, setIsBodyVisible] = useState(true);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTaskName, setSelectedTaskName] = useState("");
  const [activeAttachment, setActiveAttachment] = useState(null);

  // More states (only the ones you actually use)
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isForwardButtonDisabled, setIsForwardButtonDisabled] = useState(true);



  const email = userData?.Email;
  const name = `${userData?.FirstName} ${userData?.LastName}`;

  // ────────────────────────────────────────────────
  // Effects
  // ────────────────────────────────────────────────

  useEffect(() => {
    if (task?.acceptedAt) {
      setStartTime(moment.tz(task.acceptedAt, "Asia/Kolkata"));
    }
  }, [task?.acceptedAt]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const calculateRemainingTime = () => {
    if (!startTime) {
      return {
        delay: false,
        days: "--",
        hours: "--",
        minutes: "--",
        seconds: "--",
      };
    }
    const end = moment.tz(task.endDate, "Asia/Kolkata").endOf("day");
    const diff = end.diff(currentTime);
    if (diff <= 0) {
      return { delay: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const duration = moment.duration(diff);
    return {
      delay: false,
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  };

  const calculateProgress = () => {
    if (!task?.employees?.length) return 0;
    const valid = task.employees.filter((e) => e.empTaskStatus !== "Rejected");
    const total = valid.length || 1;
    const done = valid.filter((e) =>
      ["Completed", "Verified"].includes(e.empTaskStatus)
    ).length;
    return Math.round((done / total) * 100);
  };

    const remaining = calculateRemainingTime();
    const progress = calculateProgress();

  const getStatusBadgeClass = (status) => {
    const map = {
      Completed: "bg-success",
      Verified: "bg-info",
      "In Review": "bg-warning text-dark",
      Rejected: "bg-danger",
      "Task Assigned": "bg-secondary",
    };
    return map[status] || "bg-secondary";
  };

  const toggleChat = () => setChatExpand(!chatExpand);
  const toggleAdminChat = () => setAdminExpand(!adminExpand);
  const toggleButtons = () => setShowButtons(!showButtons);

  const handleViewAttachments = (attachments, employee, taskName) => {
    setSelectedAttachments(attachments);
    setSelectedEmployee(employee);
    setSelectedTaskName(taskName);
    setShowAttachmentsModal(true);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/api/tasks");
        setTasks(res.data || []);
      } catch (err) {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // 🔥 Put it HERE
  if (!task) {
    return <div className="text-center py-5 text-muted">No task selected</div>;
  }

  return (
    <div className="container-fluid py-3">
      <div className="row g-3">
        {/* Main content - 9 columns on xl, 8 on lg */}
        <div className="col-xl-9 col-lg-8">
          <div
            className="card shadow-sm border-0"
            style={{
              background: !darkMode ? "#1f2937" : "#ffffff",
              color: !darkMode ? "#e5e7eb" : "#1f2937",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              className="card-header d-flex justify-content-between align-items-center px-4 py-3"
              style={{
                background: !darkMode ? "#111827" : "#f8fafc",
                borderBottom: `1px solid ${!darkMode ? "#374151" : "#e2e8f0"}`,
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <CgArrowLongLeft
                  size={28}
                  className="cursor-pointer text-primary"
                  onClick={onBack}
                />
                <h4 className="mb-0 fw-semibold">{task.taskID}</h4>
              </div>

              <FiEdit
                size={22}
                className="cursor-pointer text-primary"
                onClick={() => setShowUpdateModal(true)}
              />
            </div>

            {/* Body */}
            <div className="card-body p-4">
              {/* Title & metadata */}
              <div className="mb-4">
                <h3 className="fw-bold mb-3">{task.Taskname}</h3>
                <div className="d-flex flex-wrap gap-4 small text-muted">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={task.adminMail?.profile?.image_url || profile}
                      alt="Creator"
                      className="rounded-circle"
                      style={{ width: 36, height: 36, objectFit: "cover" }}
                    />
                    <div>
                      Created by{" "}
                      <strong>
                        {task.adminMail.FirstName} {task.adminMail.LastName}
                      </strong>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={task.managerEmail?.profile?.image_url || profile}
                      alt="Manager"
                      className="rounded-circle"
                      style={{ width: 36, height: 36, objectFit: "cover" }}
                    />
                    <div>
                      Assigned to{" "}
                      <strong>
                        {task.managerEmail.FirstName}{" "}
                        {task.managerEmail.LastName}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description + Attachments */}
              <div className="mb-5 pb-4 border-bottom">
                <div
                  className="mb-4"
                  dangerouslySetInnerHTML={{
                    __html:
                      task.description || "<p>No description provided.</p>",
                  }}
                />

                {task.pdf?.length > 0 && (
                  <div>
                    <h6 className="mb-3 fw-semibold">Task Attachments</h6>
                    <div className="d-flex flex-wrap gap-3">
                      {task.pdf.map((path, idx) => (
                        <div
                          key={idx}
                          className="shadow-sm rounded overflow-hidden cursor-pointer"
                          style={{ width: 160, height: 120 }}
                          onClick={() =>
                            window.open(
                              `${BASE_URL}/${path}`,
                              "_blank",
                              "noreferrer"
                            )
                          }
                        >
                          <img
                            src={`${BASE_URL}/${path}`}
                            alt={`Attachment ${idx + 1}`}
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Team Members Table */}
              <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Team Members</h5>
                  {task.status === "Pending" && (
                    <button className="btn btn-sm btn-primary d-flex align-items-center gap-2">
                      <span>Add Team Member</span>
                    </button>
                  )}
                </div>

                <div
                  className="table-responsive rounded shadow-sm"
                  style={{
                    border: !darkMode
                      ? "1px solid #374151"
                      : "1px solid #e2e8f0",
                  }}
                >
                  <table className="table table-hover mb-0 align-middle">
                    <thead>
                      <tr
                        style={{ background: !darkMode ? "#111827" : "#f8fafc" }}
                      >
                        <th className="ps-4 py-3">Name</th>
                        <th className="py-3">Designation</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Attachments</th>
                        <th className="py-3">Remarks</th>
                        {task.employees.some(
                          (e) => e.empTaskStatus === "In Review"
                        ) && <th className="py-3">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {task.employees?.map((emp, idx) => (
                        <tr key={idx}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle overflow-hidden"
                                style={{ width: 44, height: 44 }}
                              >
                                <img
                                  src={
                                    emp.employee?.profile?.image_url || profile
                                  }
                                  alt=""
                                  className="w-100 h-100 object-fit-cover"
                                />
                              </div>
                              <div>
                                <div className="fw-medium">
                                  {emp.employee.FirstName}{" "}
                                  {emp.employee.LastName}
                                </div>
                                <div className="small text-muted">
                                  {emp.employee.Email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            {emp.employee?.position?.[0]?.PositionName || "—"}
                          </td>
                          <td className="py-3">
                            <span
                              className={`badge ${getStatusBadgeClass(
                                emp.empTaskStatus
                              )} px-3 py-2`}
                            >
                              {emp.empTaskStatus}
                            </span>
                          </td>
                          <td className="py-3">
                            {emp.attachments?.length > 0 ? (
                              <IoMdEye
                                size={22}
                                className="cursor-pointer text-primary"
                                onClick={() =>
                                  handleViewAttachments(
                                    emp.attachments,
                                    emp.employee,
                                    task.Taskname
                                  )
                                }
                              />
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="py-3 text-muted small">
                            {emp.empTaskComment || "—"}
                          </td>
                          {task.employees.some(
                            (e) => e.empTaskStatus === "In Review"
                          ) && (
                            <td className="py-3">
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-success">
                                  Verify
                                </button>
                                <button className="btn btn-sm btn-danger">
                                  Reject
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 mt-4">
                <button
                  className="btn btn-primary px-4"
                  disabled={["Completed", "Rejected", "Cancelled"].includes(
                    task.status
                  )}
                >
                  Accept Task
                </button>
                <button
                  className="btn btn-danger px-4"
                  disabled={["Completed", "Rejected", "Cancelled"].includes(
                    task.status
                  )}
                >
                  Reject Task
                </button>
                <button
                  className="btn btn-success px-4"
                  disabled={task.status !== "Pending"}
                >
                  Complete Task
                </button>
              </div>
            </div>

            {/* Footer timestamps */}
            <div className="card-footer text-muted small px-4 py-3 d-flex justify-content-between">
              <div>Created: {getTimeAgo(task.createdAt)}</div>
              <div>Last updated: {getTimeAgo(task.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* Sidebar - 3 columns on xl, 4 on lg */}
        <div className="col-xl-3 col-lg-4">
          {/* Task Info */}
          <div
            className="card shadow-sm mb-3"
            style={{ background: !darkMode ? "#1f2937" : "#fff" }}
          >
            <div
              className="card-header py-3 cursor-pointer"
              onClick={() => setIsBodyVisible(!isBodyVisible)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Task Information</h5>
                {isBodyVisible ? (
                  <MdKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                )}
              </div>
            </div>

            {isBodyVisible && (
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between px-4 py-3">
                    <span>Priority</span>
                    <span
                      className={`badge bg-${
                        task.Priority === "High"
                          ? "danger"
                          : task.Priority === "Medium"
                          ? "warning"
                          : "success"
                      } text-white`}
                    >
                      {task.Priority}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between px-4 py-3">
                    <span>Status</span>
                    <span
                      className={`badge bg-${
                        task.status === "Completed" ? "success" : "secondary"
                      } text-white`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between px-4 py-3">
                    <span>Start Date</span>
                    <span className="badge bg-light text-dark">
                      {getFormattedDate(task.startDate)}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between px-4 py-3">
                    <span>Due Date</span>
                    <span className="badge bg-light text-dark">
                      {getFormattedDate(task.endDate)}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between px-4 py-3">
                    <span>Department</span>
                    <span className="badge bg-info">
                      {task.department || "—"}
                    </span>
                  </div>
                </div>

                {/* Time Remaining */}
                <div className="p-4 border-top">
                  <h6 className="mb-3">Time Remaining</h6>
                  {remaining.delay ? (
                    <div className="alert alert-danger small mb-0 py-2">
                      Task is overdue — please take action
                    </div>
                  ) : !startTime ? (
                    <div className="alert alert-warning small mb-0 py-2">
                      Waiting for acceptance...
                    </div>
                  ) : (
                    <div className="d-flex gap-3 justify-content-center">
                      {["days", "hours", "minutes", "seconds"].map((unit) => (
                        <div key={unit} className="text-center">
                          <div className="fs-4 fw-bold border rounded px-3 py-2 bg-light text-dark">
                            {remaining[unit]}
                          </div>
                          <div className="small text-muted mt-1 text-capitalize">
                            {unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress Circle */}
                <div className="p-4 border-top text-center">
                  <div style={{ width: 140, height: 140, margin: "0 auto" }}>
                    <CircularProgressbar
                      value={progress}
                      text={`${progress}%`}
                      styles={buildStyles({
                        pathColor:
                          progress >= 80
                            ? "#10b981"
                            : progress >= 50
                            ? "#3b82f6"
                            : "#f59e0b",
                        textColor: !darkMode ? "#e0e0e0" : "#333",
                        trailColor: !darkMode ? "#374151" : "#e5e7eb",
                        textSize: "24px",
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Team Chat */}
          <div className="card shadow-sm mb-3">
            <div
              className="card-header py-3 cursor-pointer"
              onClick={toggleChat}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Team Chat</h5>
                {chatExpand ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </div>
            </div>
            {chatExpand && <ChatEmpManager />}
          </div>

          {/* Admin Chat */}
          <div className="card shadow-sm">
            <div
              className="card-header py-3 cursor-pointer"
              onClick={toggleAdminChat}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Admin Chat</h5>
                {adminExpand ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </div>
            </div>
            {adminExpand && <AdminChatModal />}
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div
        className="position-fixed bottom-0 end-0 m-4"
        style={{ zIndex: 1050 }}
      >
        <button
          className="btn btn-primary rounded-circle shadow-lg p-3 d-flex align-items-center justify-content-center"
          style={{ width: 64, height: 64 }}
          onClick={toggleButtons}
        >
          <IoChatbubbles size={32} />
        </button>

        {showButtons && (
          <div className="position-absolute bottom-100 end-0 mb-4 d-flex flex-column gap-3">
            <button
              className="btn btn-secondary rounded-circle shadow d-flex align-items-center justify-content-center"
              style={{ width: 52, height: 52 }}
              onClick={toggleAdminChat}
            >
              Admin
            </button>
            <button
              className="btn btn-secondary rounded-circle shadow d-flex align-items-center justify-content-center"
              style={{ width: 52, height: 52 }}
              onClick={toggleChat}
            >
              Team
            </button>
          </div>
        )}
      </div>

      {/* Attachments Preview Modal */}
      <Modal
        show={showAttachmentsModal}
        onHide={() => setShowAttachmentsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEmployee?.FirstName} {selectedEmployee?.LastName} —{" "}
            {selectedTaskName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex p-0">
          {/* Left - List */}
          <div
            style={{ flex: "0 0 35%", borderRight: "1px solid #dee2e6" }}
            className="p-3"
          >
            <ListGroup variant="flush">
              {selectedAttachments.map((att, i) => (
                <ListGroup.Item
                  key={i}
                  active={activeAttachment === att}
                  action
                  onClick={() => setActiveAttachment(att)}
                >
                  {att.fileName || `Attachment ${i + 1}`}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          {/* Right - Preview */}
          <div style={{ flex: 1 }} className="p-4 text-center">
            {activeAttachment ? (
              activeAttachment.fileType?.startsWith("image/") ? (
                <img
                  src={activeAttachment.fileUrl}
                  alt="preview"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "500px", objectFit: "contain" }}
                />
              ) : (
                <div className="py-5">
                  <p className="lead">
                    Preview not available for this file type
                  </p>
                  <a
                    href={activeAttachment.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    Open File
                  </a>
                </div>
              )
            ) : (
              <p className="text-muted py-5">Select an attachment to view</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAttachmentsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Task Modal */}
      <UpdateTaskModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        task={task}
        // onUpdate={refresh logic if needed}
      />
    </div>
  );
};

export default ManagerTaskDetails;
