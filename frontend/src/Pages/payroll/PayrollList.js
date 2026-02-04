import React, { useState } from 'react';
import { getEmployeePayroll } from './api';

const PayrollList = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [error, setError] = useState('');

  const handleFetchPayroll = async (e) => {
    e.preventDefault();
    setError('');

    if (!employeeId || !month || !year) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const data = await getEmployeePayroll(employeeId, month, year);
      setPayrollRecords(data);
    } catch (err) {
      setError('Error fetching payroll records. Please try again.');
    }
  };

  return (
    <div>
      <h2>Fetch Employee Payroll</h2>
      <form onSubmit={handleFetchPayroll}>
        <div>
          <label htmlFor="employeeId">Employee ID:</label>
          <input
            type="text"
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="month">Month:</label>
          <input
            type="number"
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
            required
          />
        </div>
        <div>
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>
        <button type="submit">Fetch Payroll</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Payroll Records</h3>
      <ul>
        {payrollRecords.map((record) => (
          <li key={record._id}>
            Employee: {record.employee.FirstName} {record.employee.LastName} - Base Salary: {record.baseSalary} - Deductions: {record.deductions} - Final Salary: {record.finalSalary}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PayrollList;
