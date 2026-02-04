import React from 'react';
import { MdOutlineWbSunny } from 'react-icons/md';
import { TbStatusChange } from 'react-icons/tb';
import { HiOutlineLogin, HiOutlineLogout } from 'react-icons/hi';
import { IoIosTimer, IoMdTimer } from 'react-icons/io';
import { GrStatusInfo } from 'react-icons/gr';
import { GoHash } from 'react-icons/go';

import AttendanceRow from './AttendanceRow';
import { rowHeadStyle } from '../../../../Style/TableStyle';

const AttendanceTable = ({
  currentItems,
  selectedMonth,
  darkMode,
  handleMouseEnter,
  handleMouseLeave,
  getAttendanceMark,
  convertMinutesToHMS,
  twoDigitDate,
  daySwitch
}) => {
  return (
    <div
      style={{
        height: 'fit-content',
        maxHeight: '75vh',
        overflow: 'auto',
        position: 'relative',
        border: darkMode ? 'var(--borderLight)' : 'var(--borderDark)'
      }}
      className="scroller mb-2 rounded-lg"
    >
      <table className="table table-hover mb-0">
        <thead>
          <tr style={{ position: 'sticky', zIndex: 10, top: '-2px' }}>
            <th style={rowHeadStyle(darkMode)}>
              <MdOutlineWbSunny /> Date | Day
            </th>
            <th style={rowHeadStyle(darkMode)}>Shift</th>
            <th style={rowHeadStyle(darkMode)}>
              <TbStatusChange /> Mark
            </th>
            <th style={rowHeadStyle(darkMode)}>
              <HiOutlineLogin /> Login Time
            </th>
            <th style={rowHeadStyle(darkMode)}>
              <HiOutlineLogout /> Logout Time
            </th>
            <th style={rowHeadStyle(darkMode)}>
              <GoHash /> Logs
            </th>
            <th style={rowHeadStyle(darkMode)}>
              <IoIosTimer /> Gross Login
            </th>
            <th style={rowHeadStyle(darkMode)}>
              <GoHash /> Breaks
            </th>
            <th style={rowHeadStyle(darkMode)}>
              <IoMdTimer /> Total Break
            </th>
            <th style={rowHeadStyle(darkMode)}>
              <HiOutlineLogin /> Net Login
            </th>
            <th style={rowHeadStyle(darkMode)}>
              <GrStatusInfo /> Status
            </th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((year) => {
            // ⭐ Directly find the selected month from each year
            const month = year.months?.find(
              (m) => Number(m.month) === Number(selectedMonth)
            );

            // If month not found → skip
            if (!month) return null;

            return month.dates
              ?.sort((a, b) => a.date - b.date)
              .map((date) => (
                <AttendanceRow
                  key={`${year.year}-${month.month}-${date.date}`}
                  date={date}
                  darkMode={darkMode}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  getAttendanceMark={getAttendanceMark}
                  convertMinutesToHMS={convertMinutesToHMS}
                  twoDigitDate={twoDigitDate}
                  daySwitch={daySwitch}
                />
              ));
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
