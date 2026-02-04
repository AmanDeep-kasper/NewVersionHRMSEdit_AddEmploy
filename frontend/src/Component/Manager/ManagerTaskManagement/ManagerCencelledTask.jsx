import { useState, useEffect } from "react";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import profile from "../../../img/profile.jpg";
import { useSelector } from "react-redux";
import { GiDuration } from "react-icons/gi";
import ManagerTaskDetails from "./taskContainer/ManagerTaskDetails";
import { useViewContext } from "../../../Context/ViewContax/viewType";
import { rowHeadStyle } from "../../../Style/TableStyle";
import { FaRegDotCircle } from "react-icons/fa";
import api from "../../../Pages/config/api";

const ManagerCencelledTask = () => {
  const [tasks, setTasks] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const email = userData?.Email;
  const fetchData = async () => {
    try {
      const response = await api.get(
        `/api/tasks`,
        {
          params: { status: "Cancelled" },
        },
      );

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching cancelled tasks:", error.message);
      setError("Error fetching cancelled tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataWithTimeout = async () => {
      await fetchData();
    };

    fetchDataWithTimeout();
  }, []);

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };
  const accountAccess = (value) => {
    switch (value) {
      case 1: {
        return "Admin";
      }
      case 2: {
        return "Hr";
      }
      case 3: {
        return "Employee";
      }
      case 4: {
        return "Manager";
      }
    }
  };

  const [selectedTask, setSelectedTask] = useState(null); // To track the selected task
  const { viewType } = useViewContext();
  const handleCardClick = (task) => {
    setSelectedTask(task); // Set the selected task to navigate to details
  };

  const handleBack = () => {
    setSelectedTask(null); // Reset the selected task to go back
  };

  if (selectedTask) {
    // Render TaskDetails if a task is selected
    return <ManagerTaskDetails task={selectedTask} onBack={handleBack} />;
  }
  const getBadgeClass = (priority) => {
    switch (priority) {
      case "High":
        return "badge-danger";
      case "Medium":
        return "badge-warning";
      case "Low":
        return "badge-success";
      default:
        return "badge-secondary";
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

  return (
    <div className="container-fluid ">
      {viewType === "card" ? (
        <div className="row mx-auto">
          {tasks
            ?.filter(
              (task) =>
                task?.status === "Cancelled" &&
                task?.managerEmail?.Email === email
            )
            .reverse()

            .map((task) => (
              <div
                className="col-xl-4 p-2"
                onClick={() => handleCardClick(task)}
                style={{ cursor: "pointer" }}
              >
                <div className="card">
                  <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5 class="fw-medium">{task.taskID}</h5>
                    <div class="d-flex align-items-center">
                      <span
                        className={`priority-badge ${task.Priority.toLowerCase()}`}
                      >
                        <FaRegDotCircle />  {task.Priority}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center pb-3  ">
                      <div>
                        <h6 className="mb-1">{task.Taskname.slice(0, 60) + "..."}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="mb-3">
                          <span className="mb-1 d-block">Start Date</span>
                          <p className="text-dark">
                            {" "}
                            {getFormattedDate(task.startDate)}
                          </p>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="mb-3">
                          <span className="mb-1 d-block">End Date</span>
                          <p className="text-dark">
                            {" "}
                            {getFormattedDate(task.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="mb-3">
                          <span className="mb-1 d-block">Project Lead</span>
                          <h6 className="fw-normal d-flex align-items-center">
                            <img
                              className="avatar avatar-xs rounded-circle me-1"
                              src={
                                task.managerEmail.profile
                                  ? task.managerEmail.profile.image_url
                                  : profile
                              }
                              alt="Img"
                            />
                            {task.managerEmail.FirstName}{" "}
                            {task.managerEmail.LastName}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="bg-light p-2">
                      <div className="row align-items-center">
                        <div className="col-6">
                          <span className="fw-medium d-flex align-items-center">
                            <GiDuration />
                            Duration: {task.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2 my-2">
                      {task.status === "Completed" && (
                        <span style={{ color: "green" }} className="border border-success px-2 py-1 text-center">
                          This task is successfully completed and cannot be
                          re-open for any query contact your admin.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="table-responsive my-3 p-0" style={{ borderRadius: "10px", border: "1px solid #E9EAEB", overflowX: "auto", }}>
          <table className="table table-hover" style={{ position: "relative" }}>
            <thead style={{ position: "sticky", top: 0, background: !darkMode ? "#333" : "#fff", zIndex: 1000 }}>
              <tr>
                <th style={rowHeadStyle(!darkMode)}>Task Name</th>
                <th style={rowHeadStyle(!darkMode)}>Description</th>
                <th style={rowHeadStyle(!darkMode)}>Start Date</th>
                <th style={rowHeadStyle(!darkMode)}>End Date</th>
                <th style={rowHeadStyle(!darkMode)}>Assigned By</th>
              </tr>
            </thead>
            <tbody>
              {tasks
                .filter(
                  (task) =>
                    task.status === "Cancelled" && task.managerEmail.Email === email
                )
                .reverse()
                .map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => handleCardClick(task)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{task.Taskname}</td>
                    <td>
                      {" "}
                      <div
                        className="text-start flex-wrap d-flex"
                        dangerouslySetInnerHTML={{
                          __html: sanitizedDesc(task.description),
                        }}
                      />
                    </td>
                    <td>{getFormattedDate(task.startDate)}</td>
                    <td>{getFormattedDate(task.endDate)}</td>
                    <td>{task.adminMail.Email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    // <div className="container-fluid py-3">
    //   <TittleHeader
    //     title={"Cancelled Task"}
    //     numbers={
    //       tasks.filter(
    //         (task) =>
    //           task.status === "Cancelled" && task.managerEmail.Email === email
    //       ).length
    //     }
    //     message={"You can view all Cancelled tasks here."}
    //   />
    //   {loading && (
    //     <div
    //       style={{ width: "100%", height: "100%" }}
    //       className="d-flex aline-center gap-2"
    //     >
    //       <div
    //         className="spinner-grow bg-primary"
    //         style={{ width: "1rem", height: "1rem" }}
    //         role="status"
    //       ></div>

    //       <span className="text-primary fw-bold">Loading...</span>
    //     </div>
    //   )}

    //   <div className="row mx-auto">
    //     {tasks.filter(
    //       (task) =>
    //         task.status === "Cancelled" && task.managerEmail.Email === email
    //     ).length > 0 ? (
    //       tasks
    //         .filter(
    //           (task) =>
    //             task.status === "Cancelled" && task.managerEmail.Email === email
    //         )
    //         .map((task, index) => (
    //           <div
    //             key={task._id}
    //             style={{
    //               color: !darkMode
    //                 ? "var(--primaryDashColorDark)"
    //                 : "var(--secondaryDashMenuColor)",
    //             }}
    //             className="col-12 col-md-6 col-lg-4 p-2"
    //           >
    //             <div
    //               style={{
    //                 border: !!darkMode
    //                   ? "1px solid var(--primaryDashMenuColor)"
    //                   : "1px solid var(--secondaryDashColorDark)",
    //               }}
    //               className="task-hover-effect p-2"
    //             >
    //               <div className="d-flex align-items-center justify-content-between">
    //                 <h6>{task.Taskname}</h6>
    //                 <button
    //                   style={{ cursor: "auto" }}
    //                   className="btn btn-danger"
    //                 >
    //                   {task.status}
    //                 </button>
    //               </div>
    //               <hr />
    //               <div className="d-flex align-items-center justify-content-between gap-2">
    //                 <div className="d-flex align-items-center gap-2">
    //                   <img
    //                     style={{
    //                       height: "30px",
    //                       width: "30px",
    //                       borderRadius: "50%",
    //                       objectFit: "cover",
    //                     }}
    //                     src={
    //                       task.adminMail.profile
    //                         ? task.adminMail.profile.image_url
    //                         : profile
    //                     }
    //                     alt=""
    //                   />{" "}
    //                   <div className="d-flex flex-column">
    //                     <span>{task.adminMail.Email}</span>
    //                     <span>{accountAccess(task.adminMail.Account)}</span>
    //                   </div>
    //                 </div>

    //                 <span
    //                   style={{
    //                     border: !darkMode
    //                       ? "1px solid var(--primaryDashColorDark)"
    //                       : "1px solid var(--primaryDashMenuColor)",
    //                   }}
    //                   className="px-2 py-1 text-center"
    //                 >
    //                   {task.department}
    //                 </span>
    //               </div>
    //               <hr />
    //               <div className="my-3 d-flex flex-column gap-1">
    //                 <h6>Task Description</h6>
    //                 <span>{task.description}</span>
    //               </div>
    //               <div>
    //                 <div className="d-flex justify-content-between gap-3 my-2">
    //                   <span className="d-flex flex-column">
    //                     <h6>Task Duration</h6>
    //                     <span style={{ width: "fit-content" }}>
    //                       {task.duration} days
    //                     </span>
    //                   </span>{" "}
    //                   <span className="d-flex flex-column">
    //                     <h6>Start Date</h6>{" "}
    //                     <span style={{ width: "fit-content" }}>
    //                       {getFormattedDate(task.startDate)}
    //                     </span>
    //                   </span>
    //                   <span className="d-flex flex-column">
    //                     <h6>End Date</h6>{" "}
    //                     <span style={{ width: "fit-content" }}>
    //                       {getFormattedDate(task.endDate)}
    //                     </span>
    //                   </span>
    //                 </div>
    //                 <div className="mt-4">
    //                   <span
    //                     style={{ cursor: "pointer" }}
    //                     onMouseEnter={() => setTimeinfo("name")}
    //                     onMouseLeave={() => setTimeinfo(false)}
    //                     onClick={() => toggleTaskDetails(task._id)}
    //                   >
    //                     {expandedTaskId === task._id ? (
    //                       <span>
    //                         View Less <MdArrowDropUp className="fs-4" />
    //                       </span>
    //                     ) : (
    //                       <span>
    //                         {" "}
    //                         View Details <MdArrowDropDown className="fs-4" />
    //                       </span>
    //                     )}
    //                   </span>
    //                 </div>
    //                 {expandedTaskId === task._id && (
    //                   <div>
    //                     <div className="d-flex flex-column my-2">
    //                       <h6>Remarks</h6>
    //                       <span>{task.comment}</span>
    //                     </div>
    //                     <hr />
    //                     <div className="d-flex flex-column gap-2 my-2">
    //                       {task.status === "Cancelled" && (
    //                         <span className="border border-danger px-2 py-1 text-center">
    //                           This task is cancelled and cannot be re-open for
    //                           any query contact your admin.
    //                         </span>
    //                       )}
    //                     </div>
    //                   </div>
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         ))
    //     ) : (
    //       <div
    //         className="d-flex flex-column gap-3 align-items-center justify-content-center"
    //         style={{ height: "80vh" }}
    //       >
    //         <img
    //           style={{ width: "25%", height: "auto" }}
    //           src={RejectedTask}
    //           alt=""
    //         />
    //         <p
    //           style={{
    //             color: !darkMode
    //               ? "var(--primaryDashColorDark)"
    //               : "var(--primaryDashMenuColor)",
    //           }}
    //         >
    //           Sorry, there are no cancelled tasks found.
    //         </p>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};

export default ManagerCencelledTask;
