import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import api from "../../Pages/config/api";

const PayrollDetails = ({ match }) => {
  const [payroll, setPayroll] = useState(null);
  const { id } = match.params;

 useEffect(() => {
  if (!id) {
    console.warn("Payroll ID is missing.");
    return;
  }

  const fetchPayrollDetails = async () => {
    try {

      
      const response = await api.get(`/api/payroll/${id}`, {
      });

      setPayroll(response.data);
    } catch (error) {
      console.error("Error fetching payroll details:", error);
      alert("Failed to fetch payroll details. Please try again.");
    }
  };

  fetchPayrollDetails();
}, [id]);


  if (!payroll) return <div>Loading...</div>;

  return (
    <div>
      <h2>
        {payroll.PayrollName} - {payroll.year}-{payroll.month}
      </h2>
      <p>Status: {payroll.status}</p>
      <p>Processed At: {payroll.ProcessedAt}</p>
    </div>
  );
};

export default PayrollDetails;
