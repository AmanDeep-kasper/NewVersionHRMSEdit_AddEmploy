// import React, { useState } from "react";
// import { rowBodyStyle, rowHeadStyle } from "../../../../Style/TableStyle";

// const BreakLogsPopover = ({ date, darkMode, convertMinutesToHMS }) => {
//   const [isHovering, setIsHovering] = useState(false);

//   // Ensure breakTime, resumeTime, and breakLogData arrays exist
import React, { useState } from "react";
import { rowBodyStyle, rowHeadStyle } from "../../../../Style/TableStyle";

// Props: date (attendance object for a specific date), darkMode, convertMinutesToHMS
const BreakLogsPopover = ({ date, darkMode, convertMinutesToHMS }) => {
  const [isHovering, setIsHovering] = useState(false);

  // Robustly handle arrays to prevent React errors
  const breakTimes = Array.isArray(date?.breakTime) ? date.breakTime : [];
  const resumeTimes = Array.isArray(date?.resumeTime) ? date.resumeTime : [];
  const breakLogData = Array.isArray(date?.breakLogData) ? date.breakLogData : [];

  // If no break times or all are "00:00", show --
  if (!breakTimes.length || (breakTimes.length === 1 && breakTimes[0] === "00:00")) {
    return <span>--</span>;
  }

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span
        className="cursor-pointer text-primary fw-bold"
        style={{ textDecoration: "underline" }}
      >
        {breakTimes.length}
      </span>
      {isHovering && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            style={{
              background: darkMode ? "#343a40" : "#fff",
              color: darkMode ? "#fff" : "#000",
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
              minWidth: "350px",
              maxWidth: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "24px",
            }}
            onMouseEnter={e => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-3">Break Logs</h5>
            <table className="table table-bordered table-striped m-0">
              <thead>
                <tr>
                  <th style={rowHeadStyle(darkMode)} className="text-center">
                    Break Time
                  </th>
                  <th style={rowHeadStyle(darkMode)} className="text-center">
                    Resume Time
                  </th>
                  <th style={rowHeadStyle(darkMode)} className="text-center">
                    Total Break
                  </th>
                </tr>
              </thead>
              <tbody>
                {breakTimes.map((breakTime, index) => (
                  <tr key={index}>
                    <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
                      {breakTime ? breakTime : "--"}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
                      {resumeTimes[index] ? resumeTimes[index] : "--"}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
                      {breakLogData[index]
                        ? convertMinutesToHMS(breakLogData[index])
                        : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-end mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setIsHovering(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakLogsPopover;

  const attendanceForDate = attendance.find(item => item.date === selectedDate);
const breakTimes = Array.isArray(attendanceForDate?.breakTime) ? attendanceForDate.breakTime : [];
const resumeTimes = Array.isArray(attendanceForDate?.resumeTime) ? attendanceForDate.resumeTime : [];

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span
        className="cursor-pointer text-primary fw-bold"
        style={{ textDecoration: "underline" }}
      >
        {date.breakTime.length}
      </span>
      {isHovering && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            style={{
              background: darkMode ? "#343a40" : "#fff",
              color: darkMode ? "#fff" : "#000",
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
              minWidth: "350px",
              maxWidth: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "24px",
            }}
            onMouseEnter={e => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-3">Break Logs</h5>
            <table className="table table-bordered table-striped m-0">
              <thead>
                <tr>
                  <th style={rowHeadStyle(darkMode)} className="text-center">
                    Break Time
                  </th>
                  <th style={rowHeadStyle(darkMode)} className="text-center">
                    Resume Time
                  </th>
                  <th style={rowHeadStyle(darkMode)} className="text-center">
                    Total Break
                  </th>
                </tr>
              </thead>
              <tbody>
                {date.breakTimes.map((breakTime, index) => (
                  <tr key={index}>
                    <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
                      {breakTime ? breakTime : "--"}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
                      {date.resumeTimes[index] ? date.resumeTimes[index] : "--"}
                    </td>
                    <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
                      {date.breakLogData[index]
                        ? convertMinutesToHMS(date.breakLogData[index])
                        : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-end mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setIsHovering(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakLogsPopover;

// import React, { useState } from "react";
// import { rowBodyStyle, rowHeadStyle } from "../../../../Style/TableStyle";
// import { Card } from "react-bootstrap";
// import { IoIosCloseCircleOutline } from "react-icons/io";

// const BreakLogsPopover = ({ date, darkMode, convertMinutesToHMS }) => {
//   const [isHovering, setIsHovering] = useState(false);

//   // Week off, holiday, or leave status
//   const isWeekOff = date.status === "WO" || date.status === "HD" || date.status === "LV" || date.isOnLeave;
//   const breakTimes = date.breakTime || [];
//   const resumeTimes = date.resumeTime || [];
//   const breakLogData = date.breakLogData || [];
//   const hasBreakData = breakTimes.length > 0 && breakLogData.some(val => val > 0);


//   console.log("Break Times:", breakTimes);  console.log("Resume Times:", resumeTimes);  console.log("Break Log Data:", breakLogData);

//   // If week off/holiday/leave, or no break data, show nothing
//   // if (isWeekOff || !hasBreakData) {
//   //   return <span>--</span>;
//   // }
// //  const [isHovering, setIsHovering] = useState(false);
//   const handleClose = () => setIsHovering(false);
//   return (
//      <div
//           style={{ position: "relative", display: "inline-block" }}
//           onMouseEnter={() => setIsHovering(true)}
//           onMouseLeave={() => setIsHovering(false)}
//         >
//           <span
//             className="cursor-pointer fw-bold"
//           // style={{ textDecoration: "underline" }}
//           >
//            {breakTimes.length}
//           </span>
    
    
//           {isHovering && (
           
    
//             <div
//               className="attendance-popover-backdrop"
//               onMouseLeave={handleClose}
//               style={{
//                 position: "fixed",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 zIndex: "1050",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 padding: "1rem",
//                 background: "rgba(0, 0, 0, 0.4)",
//                 width: "100vw",
//                 height: "100vh",
//                 overflow: "hidden",
//               }}
//             >
//               <Card className="m-0 p-0"
//                 style={{
//                   // maxHeight: "50vh",
//                   overflowY: "auto",
//                 }}>
    
    
//                 <Card.Header
//                   className={`d-flex justify-content-between align-items-center fw-bold ${darkMode ? "bg-light text-dark" : "bg-dark text-light"
//                     }`}
//                 >
//                   <span>Attendance Logs</span>
//                   <IoIosCloseCircleOutline className="bi bi-x-lg "
//                     style={{ fontSize: "1.2rem" }}
//                     onClick={handleClose}
//                     title="Close" />
//                 </Card.Header>
    
//                 <Card.Body className="p-0"
    
//                 >
//                   <div
//                     className="table-responsive"
//                     // style={{
//                     //   maxHeight: "50vh", // limit height
//                     //   overflowY: "auto",
//                     // }}
//                     style={{
//                       minWidth: "350px",
//                       maxWidth: "90vw",
//                       maxHeight: "50vh",
//                       overflowY: "auto",
//                       // padding: "24px",
//                     }}
//                     onMouseEnter={e => e.stopPropagation()}
    
//                   >
//                     {/* <table className="table table-bordered table-striped m-0"> */}
//                     <table className="table table-bordered table-striped m-0">
    
//                       <thead
//                         style={{
//                           position: "sticky",
//                           top: 0,
//                           zIndex: 2,
//                           background: darkMode ? "#343a40" : "#f8f9fa",
//                         }}
//                       >
//                         <tr>
//                           <th style={rowHeadStyle(darkMode)} className="text-center">
//                             Break Time
//                           </th>
//                           <th style={rowHeadStyle(darkMode)} className="text-center">
//                             Resume Time 
//                           </th>
                         
//                           <th style={rowHeadStyle(darkMode)} className="text-center">
//                             Total Break
//                           </th>
//                         </tr>
//                       </thead>

//                                  <tbody>
//                 {breakTimes.map((breakTime, index) => (
//                   <tr key={index}>
//                     <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//                       {breakTime ? breakTime : "--"}
//                     </td>
//                     <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//                       {resumeTimes[index] ? resumeTimes[index] : "--"}
//                     </td>
//                     <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//                       {breakLogData[index]
//                         ? convertMinutesToHMS(breakLogData[index])
//                         : "--"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//                       {/* <tbody>
//                         {date.loginTime.map((loginTime, index) => (
//                           <tr key={index}>
//                             <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//                               {loginTime === 'LV' ? (
//                                 <span
//                                   title={date.holidayName}
//                                   className={darkMode ? 'badge-info border' : 'badge-info-dark'}
//                                 >
//                                   On Leave
//                                 </span>
//                               ) : loginTime === 'HD' ? (
//                                 <span
//                                   title={date.holidayName}
//                                   className={darkMode ? 'badge-primary border' : 'badge-primary-dark'}
//                                 >
//                                   Holiday
//                                 </span>
//                               ) : loginTime ? (
//                                 loginTime
//                               ) : (
//                                 '--'
//                               )}
//                             </td>
//                             <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//                               {loginTime === 'LV' ? (
//                                 <span
//                                   title={date.holidayName}
//                                   className={darkMode ? 'badge-info border' : 'badge-info-dark'}
//                                 >
//                                   On Leave
//                                 </span>
//                               ) : loginTime === 'HD' ? (
//                                 <span
//                                   title={date.holidayName}
//                                   className={darkMode ? 'badge-primary border' : 'badge-primary-dark'}
//                                 >
//                                   Holiday
//                                 </span>
//                               ) : date.logoutTime[index] ? (
//                                 date.logoutTime[index]
//                               ) : (
//                                 '--'
//                               )}
//                             </td>
//                             <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//                               {loginTime === 'LV' ? (
//                                 <span
//                                   title={date.holidayName}
//                                   className={darkMode ? 'badge-info border' : 'badge-info-dark'}
//                                 >
//                                   On Leave
//                                 </span>
//                               ) : loginTime === 'HD' ? (
//                                 <span
//                                   title={date.holidayName}
//                                   className={darkMode ? 'badge-primary border' : 'badge-primary-dark'}
//                                 >
//                                   Holiday
//                                 </span>
//                               ) : date.LogData[index] ? (
//                                 convertMinutesToHMS(date.LogData[index])
//                               ) : (
//                                 '--'
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody> */}
                     
    
//                     </table>
//                   </div>
//                 </Card.Body>
    
//               </Card>
//             </div>
//           )}
//         </div>
//     // <div
//     //   style={{ position: "relative", display: "inline-block" }}
//     //   onMouseEnter={() => setIsHovering(true)}
//     //   onMouseLeave={() => setIsHovering(false)}
//     // >
//     //   <span
//     //     className="cursor-pointer text-primary fw-bold"
//     //     style={{ textDecoration: "underline" }}
//     //   >
//     //     {breakTimes.length}
//     //   </span>
//     //   {isHovering && (
//     //     <div
//     //       style={{
//     //         position: "fixed",
//     //         top: 0,
//     //         left: 0,
//     //         width: "100vw",
//     //         height: "100vh",
//     //         background: "rgba(0,0,0,0.4)",
//     //         zIndex: 9999,
//     //         display: "flex",
//     //         alignItems: "center",
//     //         justifyContent: "center",
//     //       }}
//     //       onMouseLeave={() => setIsHovering(false)}
//     //     >
//     //       <div
//     //         style={{
//     //           background: darkMode ? "#343a40" : "#fff",
//     //           color: darkMode ? "#fff" : "#000",
//     //           borderRadius: "12px",
//     //           boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
//     //           minWidth: "350px",
//     //           maxWidth: "90vw",
//     //           maxHeight: "80vh",
//     //           overflowY: "auto",
//     //           padding: "24px",
//     //         }}
//     //         onMouseEnter={e => e.stopPropagation()}
//     //       >
//     //         <h5 className="fw-bold mb-3">Break Logs</h5>
//     //         <table className="table table-bordered table-striped m-0">
//     //           <thead>
//     //             <tr>
//     //               <th style={rowHeadStyle(darkMode)} className="text-center">
//     //                 Break Time
//     //               </th>
//     //               <th style={rowHeadStyle(darkMode)} className="text-center">
//     //                 Resume Time
//     //               </th>
//     //               <th style={rowHeadStyle(darkMode)} className="text-center">
//     //                 Total Break
//     //               </th>
//     //             </tr>
//     //           </thead>
//     //           <tbody>
//     //             {breakTimes.map((breakTime, index) => (
//     //               <tr key={index}>
//     //                 <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//     //                   {breakTime ? breakTime : "--"}
//     //                 </td>
//     //                 <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//     //                   {resumeTimes[index] ? resumeTimes[index] : "--"}
//     //                 </td>
//     //                 <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//     //                   {breakLogData[index]
//     //                     ? convertMinutesToHMS(breakLogData[index])
//     //                     : "--"}
//     //                 </td>
//     //               </tr>
//     //             ))}
//     //           </tbody>
//     //         </table>
//     //         <div className="text-end mt-3">
//     //           <button
//     //             className="btn btn-secondary"
//     //             onClick={() => setIsHovering(false)}
//     //           >
//     //             Close
//     //           </button>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   )}
//     // </div>
//   );
// };

// export default BreakLogsPopover;



// main
// import React, { useState } from 'react';
// import { rowBodyStyle, rowHeadStyle } from '../../../../Style/TableStyle';

// const AttendanceLogsPopover = ({ date, darkMode, convertMinutesToHMS }) => {
//   const [isInfoHovering, setIsInfoHovering] = useState(false);

//   return (
//     <div
//       onMouseEnter={() => setIsInfoHovering(true)}
//       onMouseLeave={() => setIsInfoHovering(false)}
//       style={{ position: 'relative' }}
//     >
//       {date.breakTime.length}
//       <div
//         style={{
//           zIndex: 5,
//           right: '100%',
//           minHeight: 'fit-content',
//           maxHeight: '25vh',
//           overflow: 'auto',
//           top: 0,
//           scrollbarWidth: 'thin',
//           scrollbarColor: darkMode ? 'lightgray transparent' : 'darkgray transparent',
//         }}
//         className="absolute bg-white rounded-lg p-0 m-0"
//       >
//         {isInfoHovering && (
//           <table className="table table-bordered border p-0 m-0">
//             <thead>
//               <tr>
//                 <th style={rowHeadStyle(darkMode)} className="text-capitalize text-center">
//                   Break Start
//                 </th>
//                 <th style={rowHeadStyle(darkMode)} className="text-capitalize text-center">
//                   Break End
//                 </th>
//                 <th style={rowHeadStyle(darkMode)} className="text-capitalize text-center">
//                   Total Break
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {date.breakTime.map((breakTime, index) => (
//                 <tr key={index}>
//                   <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//                     {breakTime === 'LV' ? (
//                       <span
//                         title={date.holidayName}
//                         className={darkMode ? 'badge-info border' : 'badge-info-dark'}
//                       >
//                         On Leave
//                       </span>
//                     ) : breakTime === 'HD' ? (
//                       <span
//                         title={date.holidayName}
//                         className={darkMode ? 'badge-primary border' : 'badge-primary-dark'}
//                       >
//                         Holiday
//                       </span>
//                     ) : loginTime ? (
//                       loginTime
//                     ) : (
//                       '--'
//                     )}
//                   </td>

                  
//                   <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//                     {loginTime === 'LV' ? (
//                       <span
//                         title={date.holidayName}
//                         className={darkMode ? 'badge-info border' : 'badge-info-dark'}
//                       >
//                         On Leave
//                       </span>
//                     ) : loginTime === 'HD' ? (
//                       <span
//                         title={date.holidayName}
//                         className={darkMode ? 'badge-primary border' : 'badge-primary-dark'}
//                       >
//                         Holiday
//                       </span>
//                     ) : date.logoutTime[index] ? (
//                       date.logoutTime[index]
//                     ) : (
//                       '--'
//                     )}
//                   </td>


//                   <td style={rowBodyStyle(darkMode)} className="text-center text-capitalize">
//                     {loginTime === 'LV' ? (
//                       <span
//                         title={date.holidayName}
//                         className={darkMode ? 'badge-info border' : 'badge-info-dark'}
//                       >
//                         On Leave
//                       </span>
//                     ) : loginTime === 'HD' ? (
//                       <span
//                         title={date.holidayName}
//                         className={darkMode ? 'badge-primary border' : 'badge-primary-dark'}
//                       >
//                         Holiday
//                       </span>
//                     ) : date.LogData[index] ? (
//                       convertMinutesToHMS(date.LogData[index])
//                     ) : (
//                       '--'
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AttendanceLogsPopover;