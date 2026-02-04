import React from 'react';
import { GoArrowRight } from 'react-icons/go';
import { convertToAmPm } from '../../../../Utils/GetDayFormatted';
import AttendanceLogsPopover from './AttendanceLogsPopover';
import BreakLogsPopover from './BreakLogsPopover';
import { rowBodyStyle } from '../../../../Style/TableStyle';
import { useState } from 'react';

const AttendanceRow = ({
  date,
  darkMode,
  handleMouseEnter,
  handleMouseLeave,
  getAttendanceMark,
  convertMinutesToHMS,
  twoDigitDate,
  daySwitch
}) => {
  const badgeClass = (type) => `badge bg-${type} ${darkMode ? 'border border-light' : ''}`;

  const isOnLeave = date.isOnLeave
  const LeaveType = date?.leaveAttendanceData?.leaveType
  const LeaveDuration = date?.leaveAttendanceData?.leaveDuration
  const totalLogAfterBreak = date?.totalLogAfterBreak
  const netMinutes = parseInt(totalLogAfterBreak ?? "0", 10);
const [showLogsModal, setShowLogsModal] = useState(false);

  const leaveBadge = () => (
    <span className={
      darkMode ? 'badge-primary' : 'badge-primary-dark'
    } title={date.holidayName}>
      {(
        LeaveType === 'unPaid Leave')
        ? 'Un-Paid Leave'
        : 'Paid Leave'}{' '}
      / {LeaveDuration === 'Full Day' ? 'Full' : 'Half'}
    </span>
  );

  return (
    <tr
      id={`attendance-row-${date.date}`}
      onMouseEnter={() => handleMouseEnter(date.date)}
      onMouseLeave={handleMouseLeave}
    >
      <td style={rowBodyStyle(darkMode)} className="text-center">
        <div className="d-flex gap-2 align-items-start">
          <span
            style={{
              background: darkMode ? "white" : "rgba(54,51,52,0.8)",
              color: darkMode ? "black" : "white",
            }}
            className="btn btn-sm  border-0"
          >
            {twoDigitDate(date.date)}
          </span>
          <span
            style={{
              background: darkMode ? "white" : "rgba(54,51,52,0.8)",
              color: darkMode ? "black" : "white",
            }}
            className="btn btn-sm border-0"
          >
            {daySwitch(date.day)}
          </span>
        </div>
      </td>

      <td style={rowBodyStyle(darkMode)}>
        <span
          style={{ width: "fit-content" }}
          className={`badge-primary py-1 px-2 flex items-center gap-2 ${
            darkMode ? "badge-primary" : "badge-primary-dark"
          }`}
        >
          <span
            style={{ width: "fit-content" }}
            className={`badge-warning gap-2 my-1 mr-2 ${
              darkMode ? "badge-warning" : "badge-warning-dark"
            }`}
            s
          >
            {date?.shifts?.name} :
          </span>
          <span>{date?.shifts?.startTime}</span>
          <GoArrowRight />
          <span>{date?.shifts?.endTime}</span>
        </span>
      </td>

      <td style={rowBodyStyle(darkMode)}>
        {["LV", "HD", "WO"].includes(date.loginTime[0]) ? (
          date.loginTime[0] === "LV" ? (
            leaveBadge()
          ) : (
            <span
              className={darkMode ? "badge-primary" : "badge-primary-dark"}
              title={date.holidayName}
            >
              {date.loginTime[0] === "HD" ? "Holiday" : "Week Off"}
            </span>
          )
        ) : date.isNCNS || date.isSandwhich || date.isForcedAbsent ? (
          <span className={darkMode ? "badge-danger" : "badge-danger-dark"}>
            {date.isNCNS ? "NCNS" : date.isSandwhich ? "Sandwich" : "Absent"}
          </span>
        ) : (
          getAttendanceMark(date)
        )}
      </td>

      <td style={rowBodyStyle(darkMode)} className="text-capitalize">
        {["LV", "HD", "WO"].includes(date.loginTime[0]) ? (
          date.loginTime[0] === "LV" ? (
            leaveBadge()
          ) : (
            <span
              className={darkMode ? "badge-primary" : "badge-primary-dark"}
              title={date.holidayName}
            >
              {date.loginTime[0] === "HD" ? "Holiday" : "Week Off"}
            </span>
          )
        ) : date.isNCNS || date.isSandwhich || date.isForcedAbsent ? (
          <span className={darkMode ? "badge-danger" : "badge-danger-dark"}>
            {date.isNCNS ? "NCNS" : date.isSandwhich ? "Sandwich" : "Absent"}
          </span>
        ) : date.loginTime[0] ? (
          convertToAmPm(date.loginTime[0])
        ) : (
          <>--</>
        )}
      </td>

      <td style={rowBodyStyle(darkMode)}>
        {["LV", "WO", "HD"].includes(date.logoutTime.at(-1)) ? (
          date.logoutTime.at(-1) === "LV" ? (
            leaveBadge()
          ) : (
            <span
              className={darkMode ? "badge-primary" : "badge-primary-dark"}
              title={date.holidayName}
            >
              {date.logoutTime.at(-1) === "HD" ? "Holiday" : "Week Off"}
            </span>
          )
        ) : date.isNCNS || date.isSandwhich || date.isForcedAbsent ? (
          <span className={darkMode ? "badge-danger" : "badge-danger-dark"}>
            {date.isNCNS ? "NCNS" : date.isSandwhich ? "Sandwich" : "Absent"}
          </span>
        ) : date.logoutTime.at(-1) ? (
          convertToAmPm(date.logoutTime.at(-1))
        ) : (
          <>--</>
        )}
      </td>

      <td style={rowBodyStyle(darkMode)} className="text-uppercase ">
        <div >
          <AttendanceLogsPopover
            date={date}
            show={showLogsModal}
            darkMode={darkMode}
            convertMinutesToHMS={convertMinutesToHMS}
          />
        </div>
      </td>

      <td style={rowBodyStyle(darkMode)}>
        {convertMinutesToHMS(date.TotalLogin)}
      </td>

      <td style={rowBodyStyle(darkMode)} className="text-uppercase ">
        <BreakLogsPopover
          date={{
            ...date,
            // Ensure resumeTime always present, fallback to ResumeTime if needed
            resumeTime:
              Array.isArray(date.resumeTime) && date.resumeTime.length > 0
                ? date.resumeTime
                : Array.isArray(date.ResumeTime)
                  ? date.ResumeTime
                  : [],
          }}
          darkMode={darkMode}
          convertMinutesToHMS={convertMinutesToHMS}
        />
      </td>

      <td style={rowBodyStyle(darkMode)}>
        {convertMinutesToHMS(date.totalBrake)}
      </td>

      <td style={rowBodyStyle(darkMode)}>
        {convertMinutesToHMS(date.totalLogAfterBreak)}
      </td>

      <td style={rowBodyStyle(darkMode)}>
        {date.status === "LV" || date.isOnLeave ? (
          <span
            className={darkMode ? "badge-info" : "badge-info-dark"}
            title={date.holidayName}
          >
            On Leave
          </span>
        ) : date.status === "HD" ? (
          <span
            className={darkMode ? "badge-primary" : "badge-primary-dark"}
            title={date.holidayName}
          >
            Holiday
          </span>
        ) : date.status === "WO" ? (
          <span className={darkMode ? "badge-primary" : "badge-primary-dark"}>
            Week Off
          </span>
        ) : date.status === "break" ? (
          <span className={darkMode ? "badge-warning" : "badge-warning-dark"}>
            On Break
          </span>
        ) : date.status === "login" ? (
          <span className={darkMode ? "badge-success" : "badge-success-dark"}>
            Login
          </span>
        ) : (
          <span className={darkMode ? "badge-danger" : "badge-danger-dark"}>
            Logout
          </span>
        )}
      </td>
    </tr>
  );
};

export default AttendanceRow;
