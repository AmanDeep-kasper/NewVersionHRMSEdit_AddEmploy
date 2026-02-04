import React from 'react';
import TittleHeader from '../../../../Pages/TittleHeader/TittleHeader';
import TakeBreakLogs from '../../../../Pages/Attendance/TakeBreakLogs';
import { useTheme } from '../../../../Context/TheamContext/ThemeContext';
import EmpAttendanceCard from '../../../../Pages/Attendance/EmpAttendanceCard';

const AttendanceHeader = ({
  attendanceData,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  getYears,
  getMonthsForYear,
  getMonthName,
}) => {
  const { darkMode } = useTheme();

  return (
    <div className="d-flex flex-column mb-4 flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
      <TittleHeader
        title="Attendance List"
        message="You can check your attendance here."
      />
      <div className='d-flex align-items-center gap-2'>
        {" "}
        <TakeBreakLogs />
        {attendanceData && (
          <div className="d-flex gap-3 align-items-center">
            <div>
              <select
                className={`form-select ${darkMode ? "bg-white text-dark" : "bg-dark text-white border-0"}`}
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {getYears().map((year) => (
                  <option key={year.year} value={year.year}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className={`form-select ${darkMode ? "bg-white text-dark" : "bg-dark text-white border-0"}`}
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {getMonthsForYear(selectedYear).map((selectedMonth) => (
                  <option key={selectedMonth} value={selectedMonth}>
                    {getMonthName(selectedMonth)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* <EmpAttendanceCard/> */}
    </div>
  );
};

export default AttendanceHeader;
