import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

// Component for fetching and displaying leave report
const LeaveReport = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Fetch the leave report
  const fetchLeaveReport = async () => {
    try {
      const response = await axios.get('/api/leave-report', {
        params: { employeeId, month, year }
      });
      setLeaveData(response.data.leaveSummary);
      setLeaveSummary(response.data.leaveSummary);
    } catch (error) {
      console.error("Error fetching leave report:", error);
    }
  };

  // Handle form submit to get the report
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchLeaveReport();
  };

  return (
    <div>
      <h2>Monthly Leave Report</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Month (MM)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Year (YYYY)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <button type="submit">Get Leave Report</button>
      </form>

      {/* Display Leave Summary */}
      {leaveSummary && (
        <div>
          <h3>Leave Summary for Employee {employeeId}</h3>
          <ul>
            <li>Casual Leaves: {leaveSummary.casualLeave}</li>
            <li>Paid Leaves: {leaveSummary.paidLeave}</li>
            <li>Unpaid Leaves: {leaveSummary.unpaidLeave}</li>
            <li>Total Leaves: {leaveSummary.totalLeave}</li>
          </ul>
        </div>
      )}

      {/* Display Leave Applications in a Table */}
      {leaveData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>From Date</th>
              <th>To Date</th>
              <th>Leave Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.map((leave, index) => (
              <tr key={index}>
                <td>{moment(leave.FromDate).format('YYYY-MM-DD')}</td>
                <td>{moment(leave.ToDate).format('YYYY-MM-DD')}</td>
                <td>{leave.Leavetype}</td>
                <td>{leave.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveReport;
