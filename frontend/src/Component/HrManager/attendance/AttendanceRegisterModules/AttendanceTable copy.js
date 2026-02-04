import PropTypes from "prop-types";
import { rowBodyStyle, rowHeadStyle } from "../../../../Style/TableStyle";
import ProfileAvatar from "../../../../Utils/ProfileAvatar/ProfileAvatar";
import { convertToAmPm } from "../../../../Utils/GetDayFormatted";
import { GoArrowRight } from "react-icons/go";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { MdOutlineAccessTime } from "react-icons/md";
import Styles from "../../../../Style/Scroller.module.css";
import { convertMinutesToHoursAndMinutes } from "./Helpers";

const AttendanceTable = ({
  filteredAttendance,
  filterYear,
  filterMonth,
  daysInMonth,
  darkMode,
  selectedAttendance,
  setSelectedAttendance,
  markAttendance,
  calculateTotal,
}) => (
  <div
    style={{
      height: "fit-content",
      maxHeight: "75vh",
      overflow: "auto",
      position: "relative",
      border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
    }}
    className={`mb-2 rounded-2 ${Styles.scroller}`}
  >
    <table
      className="table table-striped table-hover"
      style={{ fontSize: ".9rem", fontWeight: "normal" }}
    >
      {/* ------------------------------------ TABLE HEADER ---------------- */}
      <thead>
        <tr style={{ position: "sticky", top: "0px", zIndex: "5" }}>
          <th style={rowHeadStyle(darkMode)}>S.No</th>
          <th
            style={{
              ...rowHeadStyle(darkMode),
              position: "sticky",
              top: "-0rem",
              left: "0",
              zIndex: "21",
            }}
          >
            User&nbsp;Profile
          </th>
          {[...Array(daysInMonth)].map((_, day) => (
            <th
              style={rowHeadStyle(darkMode)}
              className="text-center"
              key={day}
            >
              {(day + 1).toString().padStart(2, "0")}
            </th>
          ))}
          <th style={rowHeadStyle(darkMode)}>Total&nbsp;Days</th>
          <th style={rowHeadStyle(darkMode)}>Absent</th>
          <th style={rowHeadStyle(darkMode)}>Present</th>
          <th style={rowHeadStyle(darkMode)}>Holiday</th>
          <th style={rowHeadStyle(darkMode)}>Half&nbsp;Day</th>
          <th style={rowHeadStyle(darkMode)}>Paid&nbsp;Leave</th>
          <th style={rowHeadStyle(darkMode)}>Unpaid&nbsp;Leave</th>
          <th style={rowHeadStyle(darkMode)}>NCNS</th>
          <th style={rowHeadStyle(darkMode)}>Sandwich</th>
          <th style={rowHeadStyle(darkMode)}>Payable&nbsp;Days</th>
        </tr>
      </thead>

      {/* ------------------------------------ TABLE BODY ------------------ */}
      <tbody>
        {filteredAttendance.map((employee, index) => {
          // const yearObj  = employee.years.find((y) => y.year === filterYear);
          const yearObj = employee.attendance?.find(
  (y) => y.year === filterYear
);const yearObj = employee.attendance?.find(
  (y) => y.year === filterYear
);

const monthObj =
  yearObj?.months?.find((m) => m.month === filterMonth) || {};

const dates = monthObj?.dates || [];


          // const monthObj =
          //   yearObj?.months.find((m) => m.month === filterMonth) || {};
          // const dates    = monthObj.dates || [];

          return (
            <tr key={employee._id}>
              {/* --- Serial No. --- */}
              <td
                style={{
                  ...rowBodyStyle(darkMode),
                  background: darkMode ? "white" : "#232424",
                }}
                className="text-center border-0"
              >
                {(index + 1).toString().padStart(2, 0)}
              </td>

              {/* --- Profile Avatar --- */}
              <td
                style={{
                  ...rowBodyStyle(darkMode),
                  position: "sticky",
                  left: "0",
                  zIndex: "20",
                  top: "2.5rem",
                  background: darkMode ? "white" : "#232424",
                }}
                className="border-0"
              >
                <ProfileAvatar
                  firstName={employee.employeeObjID?.FirstName}
                  lastName={employee.employeeObjID?.LastName}
                  imageURL={employee.employeeObjID?.profile?.image_url}
                />
              </td>

              {/* --- Day‑wise Attendance Cells --- */}
              {[...Array(daysInMonth)].map((_, day) => {
                const dateObj    = dates.find((d) => d.date === day + 1) || {};
                const loginTime  = dateObj.loginTime?.[0];
                const netMinutes =
                  dateObj.totalLogAfterBreak !== undefined
                    ? parseInt(dateObj.totalLogAfterBreak, 10)
                    : undefined;             // <-- ► NOW PASSED

                /* ---------- call markAttendance with netLogiHours ---------- */
                const { status, color } = markAttendance({
                  loginTime,
                  day: day + 1,
                  shifts:          dateObj.shifts,
                  isNCNS:          dateObj.isNCNS || false,
                  isOnLeave:       dateObj.isOnLeave || false,
                  isSandwhich:     dateObj.isSandwhich || false,
                  isForcedAbsent:     dateObj.isForcedAbsent || false,
                  LeaveDurationName: dateObj?.leaveAttendanceData?.leaveDuration || "",
                  LeaveTypeName:     dateObj?.leaveAttendanceData?.leaveType     || "",
                  netLogiHours:    netMinutes,    
                });

                return (
                  <td
                    key={day}
                    className="px-3"
                    style={{
                      whiteSpace: "pre",
                      backgroundColor:
                        selectedAttendance.employeeId === employee._id &&
                        selectedAttendance.day === day + 1
                          ? "#6A5ACD"
                          : color,
                      textAlign: "center",
                      fontWeight: "600",
                      color: "white",
                      verticalAlign: "middle",
                      border: "1px solid rgba(0,0,0,.2)",
                      position: "relative",
                    }}
                    onMouseEnter={() =>
                      setSelectedAttendance({
                        employeeId: employee._id,
                        day: day + 1,
                      })
                    }
                    onMouseLeave={() =>
                      setSelectedAttendance({ employeeId: null, day: null })
                    }
                  >
                    {status}

                    {/* ---------- Hover Pop‑up -------------------------------- */}
                    {selectedAttendance.employeeId === employee._id &&
                    selectedAttendance.day === day + 1 ? (
                      dateObj.shifts ? (
                        <div
                          style={{
                            position: "absolute",
                            zIndex: "100",
                            fontWeight: "400",
                            borderRadius: "4px",
                            top: "50%",
                            right: "110%",
                            transform: "translateY(-50%)",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            width: "fit-content",
                          }}
                          className="shift-details d-flex flex-column gap-2 bg-white text-dark p-2"
                        >
                          {/* Shift timing */}
                          <span
                            style={{ width: "fit-content" }}
                            className="badge-primary py-1 px-2 d-flex align-items-center gap-2"
                          >
                            <span className="badge-warning">
                              {dateObj.shifts.name} :
                            </span>
                            <span>{convertToAmPm(dateObj.shifts.startTime)}</span>
                            <GoArrowRight />
                            <span>{convertToAmPm(dateObj.shifts.endTime)}</span>
                          </span>

                          {/* Details row */}
                          <div style={{ fontSize: ".9rem" }} className="row">
                            {dateObj.isOnLeave ? (
                              /* On Leave */
                              <p className="col-12 p-1 my-0 w-100 px-3">
                                On&nbsp;{dateObj.LeaveApplication?.Leavetype}
                              </p>
                            ) : loginTime === "HD" ? (
                              /* Holiday */
                              <p className="col-12 p-1 my-0 w-100 px-3">
                                It's&nbsp;Holiday
                              </p>
                            ) : loginTime === "WO" ? (
                              /* Weekend */
                              <p className="col-12 p-1 my-0 w-100 px-3">
                                It's&nbsp;Weekend
                              </p>
                            ) : (
                              /* In/Out times */
                              <>
                                <p className="col-6 p-1 my-0 px-1">
                                  IN&nbsp;<FiLogIn />&nbsp;
                                <span>
                                    {convertToAmPm(loginTime)}
                                </span>
                                </p>
                                
                                <p className="col-6 p-1 my-0 px-0">
                                  OUT&nbsp;<FiLogOut />&nbsp;
                                  <span>
                                    {dateObj.logoutTime
                                    ? convertToAmPm(
                                        dateObj.logoutTime[
                                          dateObj.logoutTime.length - 1
                                        ]
                                      )
                                    : "Not Logged out"}
                                  </span>
                                </p>
                              </>
                            )}

                            {/* Net Login Time or Leave details */}
                            {dateObj.isOnLeave ? (
                              <div className="d-flex flex-column gap-1 px-3">
                                <span>
                                  Duration:&nbsp;{dateObj?.leaveAttendanceData?.leaveDuration}
                                  {" → "}
                                  {["Casual Leave", "Paid Leave", "Maternity Leave", "Paternity Leave"].includes(
                                    dateObj?.leaveAttendanceData?.leaveType
                                  )
                                    ? "( Paid )"
                                    : "( Unpaid )"}
                                </span>
                                <span>
                                  Approved&nbsp;By:&nbsp;
                                  {dateObj.LeaveApplication?.updatedBy}
                                </span>
                              </div>
                            ) : loginTime === "HD" ? (
                              <div className="d-flex align-items-center gap-1">
                                <p className="p-1 my-0">
                                  {dateObj.holiday?.holidayName}
                                </p>
                                <p className="p-1 my-0">
                                  {dateObj.holiday?.holidayType}
                                </p>
                              </div>
                            ) : (
                              <p className="p-1 my-0 w-100 px-3">
                                Net&nbsp;Login&nbsp;
                                <MdOutlineAccessTime />&nbsp;
                                {convertMinutesToHoursAndMinutes(
                                  dateObj.totalLogAfterBreak
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* No shift defined */
                        <div
                          style={{
                            position: "absolute",
                            background: "white",
                            color: "black",
                            zIndex: "100",
                            fontWeight: "400",
                            borderRadius: "4px",
                            top: "50%",
                            right: "110%",
                            padding: ".3rem",
                            transform: "translateY(-50%)",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                          className="bg-white text-dark p-1"
                        >
                          Shift&nbsp;Not&nbsp;Available
                        </div>
                      )
                    ) : null}
                  </td>
                );
              })}

              {/* --------- Totals Columns ---------------------------------- */}
              <td style={rowBodyStyle(darkMode)} className="text-center">
                {calculateTotal("H", employee) +
                  calculateTotal("P", employee) +
                  calculateTotal("A", employee) +
                  calculateTotal("N", employee) +
                  calculateTotal("S", employee) +
                  calculateTotal("O", employee) +
                  calculateTotal("VF", employee) +
                  calculateTotal("VH", employee) +
                  calculateTotal("UF", employee) +
                  calculateTotal("UH", employee)}
              </td>
              <td style={rowBodyStyle(darkMode)} className="text-center">
                {calculateTotal("A", employee)}
              </td>
              <td style={rowBodyStyle(darkMode)} className="text-center">
                {calculateTotal("P", employee)  + calculateTotal("VH", employee) / 2}
              </td>
              <td style={rowBodyStyle(darkMode)} className="text-center">
                {calculateTotal("O", employee)}
              </td>
              <td style={rowBodyStyle(darkMode)} className="text-center">
                {calculateTotal("H", employee)}
              </td>
              <td style={rowBodyStyle(darkMode)} className="text-center">
                {calculateTotal("VF", employee) + calculateTotal("VH", employee) / 2}
              </td>
              <td style={rowBodyStyle(darkMode)} className="text-center">
                {calculateTotal("UF", employee) + calculateTotal("UH", employee) / 2}
              </td>
              <td style={rowBodyStyle(darkMode)} className="text-center">
                {calculateTotal("N", employee)}
              </td>
              <td style={rowBodyStyle(darkMode)} className="text-center">
                {calculateTotal("S", employee)}
              </td>
              <td style={rowBodyStyle(darkMode)} className="text-center">
                {Math.max(
                  calculateTotal("H", employee) / 2 +
                    calculateTotal("P", employee) +
                    calculateTotal("O", employee) -
                    calculateTotal("N", employee) +
                    calculateTotal("VF", employee) +  calculateTotal("UH", employee) / 2 +
                    Math.round(calculateTotal("VH", employee) * 2) / 2, 
                  0
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

AttendanceTable.propTypes = {
  filteredAttendance: PropTypes.array.isRequired,
  filterYear:         PropTypes.number.isRequired,
  filterMonth:        PropTypes.number.isRequired,
  daysInMonth:        PropTypes.number.isRequired,
  darkMode:           PropTypes.bool.isRequired,
  selectedAttendance: PropTypes.shape({
    employeeId: PropTypes.string,
    day:        PropTypes.number,
  }).isRequired,
  setSelectedAttendance: PropTypes.func.isRequired,
  markAttendance:       PropTypes.func.isRequired,
  calculateTotal:       PropTypes.func.isRequired,
};

export default AttendanceTable;



// import PropTypes from "prop-types";
// import { rowBodyStyle, rowHeadStyle } from "../../../../Style/TableStyle";
// import ProfileAvatar from "../../../../Utils/ProfileAvatar/ProfileAvatar";
// import { convertToAmPm } from "../../../../Utils/GetDayFormatted";
// import { GoArrowRight } from "react-icons/go";
// import { FiLogIn, FiLogOut } from "react-icons/fi";
// import { MdOutlineAccessTime } from "react-icons/md";
// import Styles from "../../../../Style/Scroller.module.css";
// import { convertMinutesToHoursAndMinutes } from "./Helpers";

// const AttendanceTable = ({
//   attendance,
//   filterYear,
//   filterMonth,
//   daysInMonth,
//   darkMode,
//   selectedAttendance = { employeeId: null, day: null },
//   setSelectedAttendance = () => {},
// }) => (
//   <div
//     style={{
//       height: "fit-content",
//       maxHeight: "75vh",
//       overflow: "auto",
//       position: "relative",
//       border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
//     }}
//     className={`mb-2 rounded-2 ${Styles.scroller}`}
//   >
//     <table
//       className="table table-striped table-hover"
//       style={{ fontSize: ".9rem", fontWeight: "normal" }}
//     >
//       {/* ------------------------------------ TABLE HEADER ---------------- */}
//       <thead>
//         <tr style={{ position: "sticky", top: "0px", zIndex: "5" }}>
//           <th style={rowHeadStyle(darkMode)}>S.No</th>
//           <th
//             style={{
//               ...rowHeadStyle(darkMode),
//               position: "sticky",
//               top: "-0rem",
//               left: "0",
//               zIndex: "21",
//             }}
//           >
//             User&nbsp;Profile
//           </th>
//           {[...Array(daysInMonth)].map((_, day) => (
//             <th
//               style={rowHeadStyle(darkMode)}
//               className="text-center"
//               key={day}
//             >
//               {(day + 1).toString().padStart(2, "0")}
//             </th>
//           ))}
//           <th style={rowHeadStyle(darkMode)}>Total&nbsp;Days</th>
//           <th style={rowHeadStyle(darkMode)}>Absent</th>
//           <th style={rowHeadStyle(darkMode)}>Present</th>
//           <th style={rowHeadStyle(darkMode)}>Holiday</th>
//           <th style={rowHeadStyle(darkMode)}>Half&nbsp;Day</th>
//           <th style={rowHeadStyle(darkMode)}>Paid&nbsp;Leave</th>
//           <th style={rowHeadStyle(darkMode)}>Unpaid&nbsp;Leave</th>
//           <th style={rowHeadStyle(darkMode)}>NCNS</th>
//           <th style={rowHeadStyle(darkMode)}>Sandwich</th>
//           <th style={rowHeadStyle(darkMode)}>Payable&nbsp;Days</th>
//         </tr>
//       </thead>

//       {/* ------------------------------------ TABLE BODY ------------------ */}
//       <tbody>
//         {attendance.map((employee, index) => {

//           // console.log("employee in AttendanceTable:", employee);
//           const yearObj = employee.years?.find((y) => y.year === filterYear);
//           const monthObj = yearObj?.months?.find((m) => m.month === filterMonth) || {};
//           const dates = monthObj.dates || [];
//           const summary = employee.AttendanceSummary || {};

//           return (
//             <tr key={employee.userId}>
//               {/* --- Serial No. --- */}
//               <td
//                 style={{
//                   ...rowBodyStyle(darkMode),
//                   background: darkMode ? "white" : "#232424",
//                 }}
//                 className="text-center border-0"
//               >
//                 {(index + 1).toString().padStart(2, 0)}
//               </td>

//               {/* --- Profile Avatar --- */}
//               <td
//                 style={{
//                   ...rowBodyStyle(darkMode),
//                   position: "sticky",
//                   left: "0",
//                   zIndex: "20",
//                   top: "2.5rem",
//                   background: darkMode ? "white" : "#232424",
//                 }}
//                 className="border-0"
//               >
//                 <ProfileAvatar
//                   firstName={employee.FirstName}
//                   lastName={employee.LastName}
//                   imageURL={employee.profile?.image_url}
//                 />
//               </td>

//               {/* --- Day‑wise Attendance Cells --- */}
//               {[...Array(daysInMonth)].map((_, day) => {
//                 // const dateObj = dates.find((d) => d.date === day + 1) || {};
//                 // const status = dateObj.status || '--';
//                 const dates = monthObj.dates || [];  // Empty if no data
// const dateObj = dates.find((d) => d.date === day + 1) || {};  // {} if not found
// const status = dateObj.status || '--';  // '--' if no status
//                 const color = dateObj.color || (darkMode ? "#c1bdbd" : "rgba(32, 32, 32, 0.3)");

//                 return (
//                   <td
//                     key={day}
//                     className="px-3"
//                     style={{
//                       whiteSpace: "pre",
//                       backgroundColor:
//                         selectedAttendance.employeeId === employee.userId &&
//                         selectedAttendance.day === day + 1
//                           ? "#6A5ACD"
//                           : color,
//                       textAlign: "center",
//                       fontWeight: "600",
//                       color: "white",
//                       verticalAlign: "middle",
//                       border: "1px solid rgba(0,0,0,.2)",
//                       position: "relative",
//                     }}
//                     onMouseEnter={() =>
//                       setSelectedAttendance({
//                         employeeId: employee.userId,
//                         day: day + 1,
//                       })
//                     }
//                     onMouseLeave={() =>
//                       setSelectedAttendance({ employeeId: null, day: null })
//                     }
//                   >
//                     {status}

//                     {/* ---------- Hover Pop‑up -------------------------------- */}
//                     {selectedAttendance.employeeId === employee.userId &&
//                     selectedAttendance.day === day + 1 ? (
//                       dateObj.shifts ? (
//                         <div
//                           style={{
//                             position: "absolute",
//                             zIndex: "100",
//                             fontWeight: "400",
//                             borderRadius: "4px",
//                             top: "50%",
//                             right: "110%",
//                             transform: "translateY(-50%)",
//                             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                             width: "fit-content",
//                           }}
//                           className="shift-details d-flex flex-column gap-2 bg-white text-dark p-2"
//                         >
//                           {/* Shift timing */}
//                           <span
//                             style={{ width: "fit-content" }}
//                             className="badge-primary py-1 px-2 d-flex align-items-center gap-2"
//                           >
//                             <span className="badge-warning">
//                               {dateObj.shifts.name} :
//                             </span>
//                             <span>{convertToAmPm(dateObj.shifts.startTime)}</span>
//                             <GoArrowRight />
//                             <span>{convertToAmPm(dateObj.shifts.endTime)}</span>
//                           </span>

//                           {/* Details row */}
//                           <div style={{ fontSize: ".9rem" }} className="row">
//                             {dateObj.isOnLeave ? (
//                               /* On Leave */
//                               <p className="col-12 p-1 my-0 w-100 px-3">
//                                 On&nbsp;{dateObj.LeaveApplication?.Leavetype}
//                               </p>
//                             ) : dateObj.loginTime === "HD" ? (
//                               /* Holiday */
//                               <p className="col-12 p-1 my-0 w-100 px-3">
//                                 It's&nbsp;Holiday
//                               </p>
//                             ) : dateObj.loginTime === "WO" ? (
//                               /* Weekend */
//                               <p className="col-12 p-1 my-0 w-100 px-3">
//                                 It's&nbsp;Weekend
//                               </p>
//                             ) : (
//                               /* In/Out times */
//                               <>
//                                 <p className="col-6 p-1 my-0 px-1">
//                                   IN&nbsp;<FiLogIn />&nbsp;
//                                 <span>
//                                     {convertToAmPm(dateObj.loginTime)}
//                                 </span>
//                                 </p>
                                
//                                 <p className="col-6 p-1 my-0 px-0">
//                                   OUT&nbsp;<FiLogOut />&nbsp;
//                                   <span>
//                                     {dateObj.logoutTime
//                                     ? convertToAmPm(
//                                         dateObj.logoutTime[
//                                           dateObj.logoutTime.length - 1
//                                         ]
//                                       )
//                                     : "Not Logged out"}
//                                   </span>
//                                 </p>
//                               </>
//                             )}

//                             {/* Net Login Time or Leave details */}
//                             {dateObj.isOnLeave ? (
//                               <div className="d-flex flex-column gap-1 px-3">
//                                 <span>
//                                   Duration:&nbsp;{dateObj?.leaveAttendanceData?.leaveDuration}
//                                   {" → "}
//                                   {["Casual Leave", "Paid Leave", "Maternity Leave", "Paternity Leave"].includes(
//                                     dateObj?.leaveAttendanceData?.leaveType
//                                   )
//                                     ? "( Paid )"
//                                     : "( Unpaid )"}
//                                 </span>
//                                 <span>
//                                   Approved&nbsp;By:&nbsp;
//                                   {dateObj.LeaveApplication?.updatedBy}
//                                 </span>
//                               </div>
//                             ) : dateObj.loginTime === "HD" ? (
//                               <div className="d-flex align-items-center gap-1">
//                                 <p className="p-1 my-0">
//                                   {dateObj.holiday?.holidayName}
//                                 </p>
//                                 <p className="p-1 my-0">
//                                   {dateObj.holiday?.holidayType}
//                                 </p>
//                               </div>
//                             ) : (
//                               <p className="p-1 my-0 w-100 px-3">
//                                 Net&nbsp;Login&nbsp;
//                                 <MdOutlineAccessTime />&nbsp;
//                                 {convertMinutesToHoursAndMinutes(
//                                   dateObj.totalLogAfterBreak
//                                 )}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       ) : (
//                         /* No shift defined */
//                         <div
//                           style={{
//                             position: "absolute",
//                             background: "white",
//                             color: "black",
//                             zIndex: "100",
//                             fontWeight: "400",
//                             borderRadius: "4px",
//                             top: "50%",
//                             right: "110%",
//                             padding: ".3rem",
//                             transform: "translateY(-50%)",
//                             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                           }}
//                           className="bg-white text-dark p-1"
//                         >
//                           Shift&nbsp;Not&nbsp;Available
//                         </div>
//                       )
//                     ) : null}
//                   </td>
//                 );
//               })}

//               {/* --------- Totals Columns ---------------------------------- */}
//               <td style={rowBodyStyle(darkMode)} className="text-center">
//                 {(summary.totalDays || 0)}
//               </td>
//               <td style={rowBodyStyle(darkMode)} className="text-center">
//                 {summary.absent || 0}
//               </td>
//               <td style={rowBodyStyle(darkMode)} className="text-center">
//                 {summary.present || 0}
//               </td>
//               <td style={rowBodyStyle(darkMode)} className="text-center">
//                 {summary.holiday || 0}
//               </td>
//               <td style={rowBodyStyle(darkMode)} className="text-center">
//                 {summary.halfday || 0}
//               </td>
//               <td style={rowBodyStyle(darkMode)} className="text-center">
//                 {summary.paidLeaves || 0}
//               </td>
//               <td style={rowBodyStyle(darkMode)} className="text-center">
//                 {summary.unpaidLeaves || 0}
//               </td>
//               <td style={rowBodyStyle(darkMode)} className="text-center">
//                 {summary.NCNS || 0}
//               </td>
//               <td style={rowBodyStyle(darkMode)} className="text-center">
//                 {summary.Sandwhich || 0}
//               </td>
//               <td style={rowBodyStyle(darkMode)} className="text-center">
//                 {summary.totalPayableDays || 0}
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   </div>
// );

// AttendanceTable.propTypes = {
//   attendance: PropTypes.array.isRequired,
//   filterYear:         PropTypes.number.isRequired,
//   filterMonth:        PropTypes.number.isRequired,
//   daysInMonth:        PropTypes.number.isRequired,
//   darkMode:           PropTypes.bool.isRequired,
//   selectedAttendance: PropTypes.shape({
//     employeeId: PropTypes.string,
//     day:        PropTypes.number,
//   }),
//   setSelectedAttendance: PropTypes.func,
// };

// export default AttendanceTable;
