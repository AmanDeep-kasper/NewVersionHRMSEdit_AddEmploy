import React, { useContext, useEffect, useState } from "react";
import moment from "moment-timezone";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FaRegDotCircle } from "react-icons/fa";
import { IoChatbubbles } from "react-icons/io5";
import { CgArrowLongLeft } from "react-icons/cg";
import { Modal, Button, ListGroup } from "react-bootstrap";

import {
  getFormattedDate,
  getTimeAgo,
} from "../../../../Utils/GetDayFormatted";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
import { addDetails } from "../../../../redux/slices/messageSlice";

import ChatEmpManager from "./Modal/ChatEmpManager";
import api from "../../../../Pages/config/api";
import BASE_URL from "../../../../Pages/config/config";
import profile from "./profile.jpg";

const EmpTaskDetails = ({ task, onBack }) => {
  const { darkMode } = useTheme();
  const { socket } = useContext(AttendanceContext);
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const email = userData?.Email;
  const empId = userData?._id;
  const empName = `${userData?.FirstName} ${userData?.LastName}`;

  const [currentTime, setCurrentTime] = useState(moment());
  const [empData, setEmpData] = useState(null);
  const [chatExpand, setChatExpand] = useState(false);
  const [uploadExpand, setUploadExpand] = useState(false);
  const [detailExpand, setDetailExpand] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTaskName, setSelectedTaskName] = useState("");
  const [activeAttachment, setActiveAttachment] = useState(null);

  /* ------------------ TIME ------------------ */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateRemainingTime = (endDate) => {
    const end = moment
      .tz(endDate, "YYYY-MM-DD", "Asia/Kolkata")
      .add(1, "day")
      .startOf("day");

    const diff = end.diff(currentTime);
    if (diff <= 0) {
      return { delay: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const d = moment.duration(diff);
    return {
      delay: false,
      days: Math.floor(d.asDays()),
      hours: d.hours(),
      minutes: d.minutes(),
      seconds: d.seconds(),
    };
  };

  const remainingTime = calculateRemainingTime(task.endDate);

  /* ------------------ EMPLOYEE DATA ------------------ */

  useEffect(() => {
    api
      .get(`/api/particularEmployee/${empId}`)
      .then((res) => setEmpData(res.data))
      .catch(() => {});
  }, [empId]);

  /* ------------------ PROGRESS ------------------ */

  const calculateProgress = () => {
    const valid = task.employees.filter((e) => e.empTaskStatus !== "Rejected");
    const completed = valid.filter((e) => e.empTaskStatus === "Completed");
    return valid.length
      ? Math.round((completed.length / valid.length) * 100)
      : 0;
  };

  /* ------------------ ACTIONS ------------------ */

  const updateTaskStatus = async (status, remarkRequired = true) => {
    let remark = "";
    if (remarkRequired) {
      remark = prompt(`Enter remarks for ${status}`);
      if (!remark) return;
    }

    await api.put(`/api/tasks/${task._id}/employees/${email}`, {
      empTaskStatus: status,
      empTaskComment: remark,
      acceptedAt:
        status === "Accepted"
          ? new Date().toLocaleDateString("en-GB")
          : undefined,
    });

    toast.success(`Task ${status}`);
    socket.emit("employeeTaskUpdateNotification", {
      taskId: task._id,
      message: `Task ${status}`,
      messageBy: empName,
      employeesEmail: [task.managerEmail.Email],
      Account: 3,
    });
  };

  /* ------------------ CHAT ------------------ */

  const openChat = () => {
    const to = task.employees
      .filter((e) => e.employee.Email !== email)
      .map((e) => e.employee.Email)
      .concat(task.managerEmail.Email);

    dispatch(
      addDetails({
        taskId: task._id,
        to,
        taskName: task.Taskname,
        name: empName,
      }),
    );

    setChatExpand(true);
  };

  /* ------------------ ATTACHMENTS ------------------ */

  const viewAttachments = (attachments, employee, taskName) => {
    setSelectedAttachments(attachments);
    setSelectedEmployee(employee);
    setSelectedTaskName(taskName);
    setActiveAttachment(null);
    setShowModal(true);
  };

  /* ------------------ RENDER ------------------ */

  return (
    <div className="container-fluid p-2">
      <div className="row">
        {/* MAIN */}
        <div className="col-xl-9 col-md-8">
          <div className="card">
            <div className="card-header d-flex align-items-center gap-2">
              <CgArrowLongLeft onClick={onBack} style={{ cursor: "pointer" }} />
              <h5 className="mb-0">{task.taskID}</h5>
            </div>

            <div className="card-body">
              <h5>{task.Taskname}</h5>

              {/* Description */}
              <div
                dangerouslySetInnerHTML={{ __html: task.description }}
                className="border-bottom pb-3 mb-3"
              />

              {/* Team */}
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Remark</th>
                    <th>Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {task.employees.map((e, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        {e.employee.FirstName} {e.employee.LastName}
                      </td>
                      <td>
                        <FaRegDotCircle /> {e.empTaskStatus}
                      </td>
                      <td>{e.empTaskComment}</td>
                      <td>
                        {e.attachments.length > 0 && (
                          <button
                            className="btn btn-link"
                            onClick={() =>
                              viewAttachments(
                                e.attachments,
                                e.employee,
                                task.Taskname,
                              )
                            }
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ACTIONS */}
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-primary"
                  onClick={() => updateTaskStatus("Accepted")}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => updateTaskStatus("Rejected")}
                >
                  Reject
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => updateTaskStatus("Completed")}
                >
                  Complete
                </button>
                <button className="btn btn-info" onClick={openChat}>
                  Chat
                </button>
              </div>

              <div className="mt-3 d-flex justify-content-between">
                <span>Created {getTimeAgo(task.createdAt)}</span>
                <span>Updated {getTimeAgo(task.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SIDE */}
        <div className="col-xl-3 col-md-4">
          <div className="card mb-3">
            <div
              className="card-header d-flex justify-content-between"
              onClick={() => setDetailExpand(!detailExpand)}
            >
              <h6>Task Details</h6>
              {detailExpand ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </div>

            {detailExpand && (
              <div className="card-body">
                <p>Status: {task.status}</p>
                <p>Priority: {task.Priority}</p>
                <p>Department: {task.department}</p>
                <p>Start: {getFormattedDate(task.startDate)}</p>
                <p>End: {getFormattedDate(task.endDate)}</p>

                <CircularProgressbar
                  value={calculateProgress()}
                  text={`${calculateProgress()}%`}
                  styles={buildStyles({
                    pathColor: "#28a745",
                    textColor: "#28a745",
                  })}
                />

                <hr />
                <h6>Time Left</h6>
                {remainingTime.delay ? (
                  <span className="text-danger">Task overdue</span>
                ) : (
                  <span>
                    {remainingTime.days}d {remainingTime.hours}h{" "}
                    {remainingTime.minutes}m
                  </span>
                )}
              </div>
            )}
          </div>

          {/* CHAT */}
          <div className="card">
            <div
              className="card-header d-flex justify-content-between"
              onClick={() => setChatExpand(!chatExpand)}
            >
              <h6>Team Chat</h6>
              {chatExpand ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </div>
            {chatExpand && <ChatEmpManager />}
          </div>
        </div>
      </div>

      {/* FLOAT CHAT */}
      <IoChatbubbles
        className="btn btn-primary position-fixed"
        style={{ bottom: 20, right: 20, borderRadius: "50%" }}
        onClick={openChat}
      />

      {/* ATTACHMENT MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEmployee?.FirstName} {selectedEmployee?.LastName} –{" "}
            {selectedTaskName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex">
          <div className="w-25">
            <ListGroup>
              {selectedAttachments.map((f, i) => (
                <ListGroup.Item
                  key={i}
                  action
                  onClick={() => setActiveAttachment(f)}
                >
                  {f.fileName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <div className="w-75 text-center">
            {activeAttachment && (
              <a
                href={activeAttachment.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open Attachment
              </a>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmpTaskDetails;
