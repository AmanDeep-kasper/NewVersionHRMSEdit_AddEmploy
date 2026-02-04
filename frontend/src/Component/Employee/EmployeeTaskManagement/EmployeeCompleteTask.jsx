import React, { useState, useEffect } from "react";
import axios from "axios";
import RequestImage from "../../../img/Request/Request.svg";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import profile from "../../../img/profile.jpg";
import { useSelector } from "react-redux";

import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import { GiDuration } from "react-icons/gi";
import EmpTaskDetails from "./TaskContainer/EmpTaskDetails";
import { useViewContext } from "../../../Context/ViewContax/viewType";
import { FaRegDotCircle } from "react-icons/fa";
import api from "../../../Pages/config/api";

const EmployeeCompletedTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const { userData } = useSelector((state) => state.user);

  const email = userData?.Email;
  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`, {
        params: { status: "Completed" }, // Filter by status "Completed"
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching completed tasks:", error.message);
      setError("Error fetching completed tasks. Please try again later.");
    } finally {
      setLoading(false);
      // Schedule the next update after 1 minute (adjust as needed)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // ---------------task view and card-----------------------//
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
    return <EmpTaskDetails task={selectedTask} onBack={handleBack} />;
  }
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
    <div className="">
      {tasks && tasks.length > 0 ? (
        email &&
          tasks.filter(
            (task) =>
              task.status === "Pending" &&
              task.employees.some(
                (taskemp) =>
                  taskemp.employee.Email === email &&
                  taskemp.empTaskStatus === "Completed"
              )
          ).length > 0 ? (
          viewType === "card" ? (
            <div className="row p-1">
              {tasks
                .filter((task) =>
                  task.employees.some(
                    (taskemp) =>
                      taskemp.employee.Email === email &&
                      taskemp.empTaskStatus === "Completed"
                  )
                )
                .reverse()
                .map((task, index) => (
                  <div
                    className="col-xl-4 p-2"
                    onClick={() => handleCardClick(task)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="card"
                      style={{ borderBottom: "2px solid #148158",
                        background: darkMode ? "transparent" : "rgb(43, 44, 44)",
                        color: darkMode ? "#3c3c3c" : "#f2f2f2",}}
                    >
                      <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                        <h5 class=" fw-medium">{task.taskID}</h5>
                        <div class="d-flex align-items-center">
                          <span
                            // className={`badge ${getBadgeClass(task.Priority)}`}
                            className={`priority-badge ${task.Priority.toLowerCase()}`}

                          >
                            <FaRegDotCircle />{task.Priority}
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center pb-3  ">
                          <div>
                            {/* <h6 className="mb-1">{task.Taskname}</h6> */}
                            <h6 className="mb-1">{task.Taskname.slice(0, 60) + "..."}</h6>

                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="mb-3">
                              <span className="mb-1 d-block">Start Date</span>
                              <p className="">
                                {" "}
                                {getFormattedDate(task.startDate)}
                              </p>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="mb-3">
                              <span className="mb-1 d-block">End Date</span>
                              <p className="">
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
                        <div className="p-2" style={{
                        background: darkMode ? "#F8F9FA" : "#161515f6",
                        color: darkMode ? "#3c3c3c" : "#f2f2f2",}}
                        >
                          <div className="row align-items-center">
                            <div className="col-6">
                              <span className="fw-medium d-flex align-items-center">
                                <GiDuration />
                                Duration: {task.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* <div className="d-flex flex-column gap-2 my-2">
                          {task.status === "Completed" && (
                            <span
                              className={`${darkMode
                                  ? "text-start badge-success p-3"
                                  : " text-start badge-success-dark p-3"
                                }`}
                            >
                              <h6>Fully Completed</h6>
                              <p className="my-auto fs-6">
                                This task is successfully completed and cannot
                                be re-open for any query contact your admin.
                              </p>
                            </span>
                          )}
                          {task.status === "Pending" && (
                            <span
                              className={`${darkMode
                                  ? "text-start badge-warning p-3"
                                  : " text-start badge-warning-dark p-3"
                                }`}
                            >
                              <h6>Partial Completed</h6>
                              This task is completed from your side but pending
                              from others
                            </span>
                          )}
                        </div> */}
                      
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="table-responsive my-3 p-0" style={{ borderRadius: "10px", border: "1px solid #E9EAEB", overflowX: "auto",}}>
              <table className="table table-hover" style={{ position: "relative" }}>
                <thead style={{ position: "sticky", top: 0, background: darkMode ? "#333" : "#fff", zIndex: 1000 }}>
                  <tr>
                    <th style={rowHeadStyle(darkMode)}>Task Name</th>
                    <th style={rowHeadStyle(darkMode)}>Description</th>
                    <th style={rowHeadStyle(darkMode)}>Start Date</th>
                    <th style={rowHeadStyle(darkMode)}>End Date</th>
                    <th style={rowHeadStyle(darkMode)}>Assigned By</th>
                  </tr>
                </thead>
                <tbody>
                  {email &&
                    tasks
                      .filter(
                        (task) =>
                          task.status === "Pending" &&
                          task.employees.some(
                            (taskemp) =>
                              taskemp.employee.Email === email &&
                              taskemp.empTaskStatus === "Completed"
                          )
                      )
                      .reverse()
                      .map((task) => (
                        <tr
                          key={task._id}

                        >
                          <td style={rowBodyStyle(darkMode)}> <span onClick={() => handleCardClick(task)}
                            style={{ cursor: "pointer", color: 'rgba(18, 41, 216,1)', fontWeight: '500' }}>{task.Taskname.slice(0, 30)}{task.Taskname.length > 30 && "..."}</span></td>
                          <td style={rowBodyStyle(darkMode)}>
                            {" "}
                            <div
                              className="text-start flex-wrap d-flex"
                              dangerouslySetInnerHTML={{
                                __html: sanitizedDesc(
                                  task.description.length > 60
                                    ? task.description.slice(0, 60) + "..."
                                    : task.description
                                ),
                              }}
                            />

                          </td>
                          <td style={rowBodyStyle(darkMode)}>{getFormattedDate(task.startDate)}</td>
                          <td style={rowBodyStyle(darkMode)}>{getFormattedDate(task.endDate)}</td>
                          <td style={rowBodyStyle(darkMode)}>{task.adminMail.Email}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div
            className="d-flex flex-column gap-3 align-items-center justify-content-center"
            style={{ height: "80vh" }}
          >
            <img
              style={{ width: "15rem", height: "auto" }}
              src={RequestImage}
              alt="No tasks found"
            />
            <p
              style={{
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              There is no task found at this moment.
            </p>
          </div>
        )
      ) : (
        <div
          className="d-flex flex-column gap-3 align-items-center justify-content-center"
          style={{ height: "80vh" }}
        >
          <img
            style={{ width: "15rem", height: "auto" }}
            src={RequestImage}
            alt="No tasks found"
          />
          <p
            style={{
              color: darkMode
                ? "var(--primaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
          >
            There is no task found at this moment.
          </p>
        </div>
      )}
    </div>

    // <div className="mt-2 py-2">
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
    //   {tasks.filter((task) =>
    //     task.employees.some(
    //       (taskemp) =>
    //         taskemp.employee.Email === email &&
    //         taskemp.empTaskStatus === "Completed"
    //     )
    //   ).length > 0 ? (
    //     <div className="row mx-auto gap-2">
    //       {tasks
    //         .filter((task) =>
    //           task.employees.some(
    //             (taskemp) =>
    //               taskemp.employee.Email === email &&
    //               taskemp.empTaskStatus === "Completed"
    //           )
    //         )
    //         .map((task, index) => (
    //           <div
    //             key={task._id}
    //             style={{
    //               color: darkMode
    //                 ? "var(--primaryDashColorDark)"
    //                 : "var(--secondaryDashMenuColor)",
    //             }}
    //             className="col-12 p-0 mt-2"
    //           >
    //             <div
    //               style={{
    //                 border: !darkMode
    //                   ? "1px solid var(--primaryDashMenuColor)"
    //                   : "1px solid var(--secondaryDashColorDark)",
    //                 background: !darkMode ? "#323232" : "#FFFFFF",
    //               }}
    //               className="task-hover-effect p-3  rounded-2 shadow border-0"
    //             >
    //               <div className="row">
    //                 <div
    //                   style={{ borderRight: "1px solid rgba(0,0,0,.1)" }}
    //                   className="col-12 col-md-6"
    //                 >
    //                   <div className="d-flex flex-column">
    //                     <h6 className="m-0 fw-normal">Assigned By</h6>
    //                     <div className="d-flex align-items-center gap-2">
    //                       <img
    //                         style={{
    //                           height: "30px",
    //                           width: "30px",
    //                           borderRadius: "50%",
    //                           objectFit: "cover",
    //                         }}
    //                         src={
    //                           task.managerEmail.profile
    //                             ? task.managerEmail.profile.image_url
    //                             : profile
    //                         }
    //                         alt=""
    //                       />{" "}
    //                       <div className="d-flex align-items-center justify-content-between my-2 w-100">
    //                         <div className="d-flex flex-column">
    //                           <span style={{ fontWeight: "500" }}>
    //                             {task.managerEmail.FirstName}{" "}
    //                             {task.managerEmail.LastName}
    //                           </span>

    //                           <span>{task.managerEmail.Email}</span>
    //                         </div>
    //                         <span
    //                           className={`${
    //                             darkMode
    //                               ? "badge-primary"
    //                               : "badge-primary-dark"
    //                           }`}
    //                         >
    //                           {accountAccess(task.managerEmail.Account)}
    //                         </span>
    //                       </div>
    //                     </div>
    //                   </div>
    //                   <h5 style={{ wordWrap: "anywhere" }}>{task.Taskname}</h5>
    //                   <span style={{ wordWrap: "anywhere" }}>
    //                     {task.description}
    //                   </span>
    //                   <div className="d-flex flex-column my-2">
    //                     <h6>Remarks</h6>
    //                     <span>{task.comment}</span>
    //                   </div>
    //                 </div>
    //                 <div className="col-12 col-md-6">
    //                   <div className="d-flex align-items-center justify-content-between">
    //                     <p className="my-auto">
    //                       Duration:{" "}
    //                       <span className="text-danger ml-2">
    //                         {task.duration + 1}days
    //                       </span>
    //                     </p>{" "}
    //                     <div className="d-flex align-items-center gap-3">
    //                       {" "}
    //                       <span
    //                         className={`${
    //                           task.status === "Completed"
    //                             ? "py-1 px-3 bg-success rounded-3 text-white"
    //                             : "py-1 px-3 bg-warning rounded-3 text-black"
    //                         }`}
    //                       >
    //                         {task.status}
    //                       </span>
    //                       <div>
    //                         <span
    //                           style={{ cursor: "pointer" }}
    //                           onMouseEnter={() => setTimeinfo("name")}
    //                           onMouseLeave={() => setTimeinfo(false)}
    //                           onClick={() => toggleTaskDetails(task._id)}
    //                         >
    //                           {expandedTaskId === task._id ? (
    //                             <span style={{ cursor: "pointer" }}>
    //                               <LuPanelTopClose
    //                                 title="close"
    //                                 className="fs-3"
    //                               />
    //                             </span>
    //                           ) : (
    //                             <span style={{ cursor: "pointer" }}>
    //                               <LuPanelBottomClose
    //                                 title="open"
    //                                 className="fs-3"
    //                               />
    //                             </span>
    //                           )}
    //                         </span>
    //                       </div>
    //                     </div>
    //                   </div>
    //                   <div className="d-flex align-items-center my-3 gap-4">
    //                     <p
    //                       className={`${
    //                         darkMode
    //                           ? "badge-success my-auto"
    //                           : "badge-success-dark my-auto"
    //                       }`}
    //                     >
    //                       Start Date{" "}
    //                       {new Date(task.startDate)
    //                         .toLocaleDateString("en-US", {
    //                           day: "numeric",
    //                           month: "short",
    //                           year: "numeric",
    //                         })
    //                         .replace(",", "")}
    //                     </p>{" "}
    //                     <span className="p-2 d-flex align-items-center justify-content-center">
    //                       <LuArrowRightLeft />
    //                     </span>
    //                     <p
    //                       className={`${
    //                         darkMode
    //                           ? "badge-danger my-auto"
    //                           : "badge-danger-dark my-auto"
    //                       }`}
    //                     >
    //                       End Date{" "}
    //                       {new Date(task.endDate)
    //                         .toLocaleDateString("en-US", {
    //                           day: "numeric",
    //                           month: "short",
    //                           year: "numeric",
    //                         })
    //                         .replace(",", "")}
    //                     </p>
    //                   </div>
    //                   <div>
    //                     <div>
    //                       <div className="d-flex flex-column gap-2 my-2">
    //                         {task.status === "Completed" && (
    //                           <span
    //                             className={`${
    //                               darkMode
    //                                 ? "text-start badge-success p-3"
    //                                 : " text-start badge-success-dark p-3"
    //                             }`}
    //                           >
    //                             <h6>Fully Completed</h6>
    //                             <p className="my-auto fs-6">
    //                               This task is successfully completed and cannot
    //                               be re-open for any query contact your admin.
    //                             </p>
    //                           </span>
    //                         )}
    //                         {task.status === "Pending" && (
    //                           <span
    //                             className={`${
    //                               darkMode
    //                                 ? "text-start badge-warning p-3"
    //                                 : " text-start badge-warning-dark p-3"
    //                             }`}
    //                           >
    //                             <h6>Partial Completed</h6>
    //                             This task is completed from your side but
    //                             pending from others
    //                           </span>
    //                         )}
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 <div className="my-2">
    //                   {expandedTaskId === task._id && (
    //                     <div
    //                       style={{
    //                         background: darkMode
    //                           ? "rgba(165, 177, 255, 0.23)"
    //                           : "rgba(0, 0, 0, 0.23)",
    //                       }}
    //                       className="p-2 rounded-3"
    //                     >
    //                       <div className="d-flex align-items-center justify-content-between my-3">
    //                         <AvatarGroup images={task.employees} />
    //                       </div>

    //                       <div style={{ width: "100%", overflow: "auto" }}>
    //                         <h6 className="fw-bold">Project Members</h6>
    //                         <Table>
    //                           <thead>
    //                             <tr>
    //                               <th style={rowHeadStyle(darkMode)}>Name</th>
    //                               <th style={rowHeadStyle(darkMode)}>Email</th>
    //                               <th style={rowHeadStyle(darkMode)}>
    //                                 Designation
    //                               </th>

    //                               <th style={rowHeadStyle(darkMode)}>
    //                                 Task Status
    //                               </th>
    //                               <th style={rowHeadStyle(darkMode)}>
    //                                 Remarks
    //                               </th>
    //                             </tr>
    //                           </thead>
    //                           <tbody>
    //                             {email &&
    //                               task.employees.map((taskemp, i) => (
    //                                 <tr key={i}>
    //                                   <td
    //                                     style={{
    //                                       verticalAlign: "middle",
    //                                       whiteSpace: "pre",
    //                                       background: darkMode
    //                                         ? "var( --secondaryDashMenuColor)"
    //                                         : "var(--secondaryDashColorDark)",
    //                                       color: darkMode
    //                                         ? "var(--secondaryDashColorDark)"
    //                                         : "var( --primaryDashMenuColor)",
    //                                       border: "none",
    //                                     }}
    //                                     className="text-capitalize"
    //                                   >
    //                                     {`${taskemp.employee.FirstName} ${taskemp.employee.LastName}`}
    //                                   </td>
    //                                   <td
    //                                     style={{
    //                                       verticalAlign: "middle",
    //                                       whiteSpace: "pre",
    //                                       background: darkMode
    //                                         ? "var( --secondaryDashMenuColor)"
    //                                         : "var(--secondaryDashColorDark)",
    //                                       color: darkMode
    //                                         ? "var(--secondaryDashColorDark)"
    //                                         : "var( --primaryDashMenuColor)",
    //                                       border: "none",
    //                                     }}
    //                                   >
    //                                     {taskemp.employee.Email}
    //                                   </td>
    //                                   <td
    //                                     style={{
    //                                       verticalAlign: "middle",
    //                                       whiteSpace: "pre",
    //                                       background: darkMode
    //                                         ? "var( --secondaryDashMenuColor)"
    //                                         : "var(--secondaryDashColorDark)",
    //                                       color: darkMode
    //                                         ? "var(--secondaryDashColorDark)"
    //                                         : "var( --primaryDashMenuColor)",
    //                                       border: "none",
    //                                     }}
    //                                   >
    //                                     {
    //                                       taskemp.employee.position[0]
    //                                         .PositionName
    //                                     }
    //                                   </td>
    //                                   <td
    //                                     style={{
    //                                       verticalAlign: "middle",
    //                                       whiteSpace: "pre",
    //                                       background: darkMode
    //                                         ? "var( --secondaryDashMenuColor)"
    //                                         : "var(--secondaryDashColorDark)",
    //                                       color: darkMode
    //                                         ? "var(--secondaryDashColorDark)"
    //                                         : "var( --primaryDashMenuColor)",
    //                                       border: "none",
    //                                     }}
    //                                   >
    //                                     {taskemp?.empTaskStatus}{" "}
    //                                   </td>
    //                                   <td
    //                                     style={{
    //                                       maxWidth: "10rem",
    //                                       overflow: "hidden",
    //                                       whiteSpace: "nowrap",
    //                                       textOverflow: "ellipsis",
    //                                       verticalAlign: "middle",
    //                                       whiteSpace: "pre",
    //                                       background: darkMode
    //                                         ? "var( --secondaryDashMenuColor)"
    //                                         : "var(--secondaryDashColorDark)",
    //                                       color: darkMode
    //                                         ? "var(--secondaryDashColorDark)"
    //                                         : "var( --primaryDashMenuColor)",
    //                                       border: "none",
    //                                     }}
    //                                   >
    //                                     {taskemp?.empTaskComment}
    //                                   </td>
    //                                 </tr>
    //                               ))}
    //                           </tbody>
    //                         </Table>
    //                       </div>
    //                     </div>
    //                   )}
    //                 </div>
    //                 <div className="d-flex align-items-center mt-4 justify-content-between">
    //                   <p className="my-auto">
    //                     Created At: {getTimeAgo(task.createdAt)}
    //                   </p>
    //                   <p className="my-auto">
    //                     Latest Updated At: {getTimeAgo(task.updatedAt)}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //     </div>
    //   ) : (
    //     <div
    //       className="d-flex flex-column gap-3 align-items-center justify-content-center"
    //       style={{ height: "80vh" }}
    //     >
    //       <img
    //         style={{ width: "15rem", height: "auto" }}
    //         src={RequestImage}
    //         alt="No task found"
    //       />
    //       <p
    //         style={{
    //           color: darkMode
    //             ? "var(--primaryDashColorDark)"
    //             : "var(--secondaryDashMenuColor)",
    //         }}
    //       >
    //         There is no task found at this moment.
    //       </p>
    //     </div>
    //   )}
    // </div>
  );
};

export default EmployeeCompletedTask;
