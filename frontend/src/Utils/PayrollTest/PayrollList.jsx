import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import api from "../../Pages/config/api";

const PayrollList = () => {
  const [payrollRecords, setPayrollRecords] = useState([]);

  useEffect(() => {
    const fetchPayrollRecords = async () => {
      try {
        const response = await api.get(`/api/payroll`, {
        });
        setPayrollRecords(response.data);
      } catch (error) {
        console.error("Error fetching payroll records:", error.message);
        alert("Failed to fetch payroll records. Please try again later.");
      }
    };

    fetchPayrollRecords();
  }, []);

  return (
    <div>
      <h2>Payroll Records</h2>
      <ul>
        {payrollRecords.map((record) => (
          <li key={record._id}>{record.years[0].year}</li>
        ))}
      </ul>
    </div>
  );
};

export default PayrollList;
