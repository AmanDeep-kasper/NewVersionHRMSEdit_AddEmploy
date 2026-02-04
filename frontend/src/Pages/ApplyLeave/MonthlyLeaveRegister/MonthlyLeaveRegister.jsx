import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../config/config';
import { rowBodyStyle, rowHeadStyle } from '../../../Style/TableStyle';
import { useTheme } from '../../../Context/TheamContext/ThemeContext';

const MonthlyLeaveRegister = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [error, setError] = useState('');

  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/leave-application-by-month-year?month=${month}&year=${year}`);
        setLeaveApplications(response.data.filter(data => data.Status === '2')); // Assuming Status is a string
        setError('');
      } catch (err) {
        setError('Error fetching leave applications');
        console.error(err);
      }
    };

    fetchLeaveApplications();
  }, [month, year]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/api/leave-application-by-month-year?month=${month}&year=${year}`);
      setLeaveApplications(response.data.filter(data => data.Status === '2'));
      setError('');
    } catch (err) {
      setError('Error fetching leave applications');
      console.error(err);
    }
  };

  // Helper function to calculate total days
  const calculateTotalDays = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className='container-fluid'>
      <h5>Leave Application Monthly</h5>
      <form className='d-flex align-items-end gap-3 my-2' onSubmit={handleSubmit}>
        <div className='d-flex flex-column gap-0'>
          <label htmlFor="month">Month:</label>
          <input
            type="number" className='form-control'
            id="month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            min="1"
            max="12"
            required
          />
        </div>
        <div className='d-flex flex-column gap-0'>
          <label htmlFor="year">Year:</label>
          <input
            type="number" className='form-control'
            id="year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min="1900"
            max={new Date().getFullYear()}
            required
          />
        </div>
        <button className='btn btn-primary' type="submit">Fetch Leave Applications</button>
      </form>

      {error && <p>{error}</p>}

      {leaveApplications.length > 0 && (
        <table className='table'>
          <thead>
            <tr>
              <th style={rowHeadStyle(darkMode)}>Employee ID</th>
              <th style={rowHeadStyle(darkMode)}>Employee Name</th>
              <th style={rowHeadStyle(darkMode)}>Leave Type</th>
              <th style={rowHeadStyle(darkMode)}>From Date</th>
              <th style={rowHeadStyle(darkMode)}>To Date</th>
              <th style={rowHeadStyle(darkMode)}>Total Days</th>
              <th style={rowHeadStyle(darkMode)}>Status</th>
              <th style={rowHeadStyle(darkMode)}>Additional Manager</th>
            </tr>
          </thead>
          <tbody>
            {leaveApplications.map((leave) => (
              <tr key={leave._id}>
                <td style={rowBodyStyle(darkMode)}>{leave.employee[0]?.empID || 'N/A'}</td>
                <td className='text-capitalize' style={rowBodyStyle(darkMode)}>{`${leave.employee[0]?.FirstName || ''} ${leave.employee[0]?.LastName || ''}`}</td>
                <td className='text-capitalize' style={rowBodyStyle(darkMode)}>{leave.Leavetype}</td>
                <td style={rowBodyStyle(darkMode)}>{new Date(leave.FromDate).toLocaleDateString()}</td>
                <td style={rowBodyStyle(darkMode)}>{new Date(leave.ToDate).toLocaleDateString()}</td>
                <td style={rowBodyStyle(darkMode)}>{calculateTotalDays(leave.FromDate, leave.ToDate)}</td>
                <td style={rowBodyStyle(darkMode)}>{leave.Status}</td>
                <td style={rowBodyStyle(darkMode)}>{leave.aditionalManager}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MonthlyLeaveRegister;
