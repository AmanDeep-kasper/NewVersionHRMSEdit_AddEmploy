import React, { useState } from 'react';
import { generatePayroll } from './api';

const PayrollForm = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleGeneratePayroll = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!month || !year) {
      setError('Please enter both month and year.');
      return;
    }

    try {
      const data = await generatePayroll(month, year);
      setMessage(`Payroll generated successfully for ${month}/${year}`);
      console.log(data); // You may want to handle the data as needed
    } catch (err) {
      setError('Error generating payroll. Please try again.');
    }
  };

  return (
    <div>
      <h2>Generate Payroll</h2>
      <form onSubmit={handleGeneratePayroll}>
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
        <button type="submit">Generate Payroll</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PayrollForm;
