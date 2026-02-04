import React from "react";
import { Link } from "react-router-dom";

const PayrollController = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/hr/SalarySlip">SalarySlip</Link>
        </li>
        <li>
          <Link to="/hr/PayrollForm">PayrollForm</Link>
        </li>
        <li>
          <Link to="/hr/PayrollFormMany">PayrollFormMany</Link>
        </li>
        <li>
          <Link to="/hr/PayrollList">PayrollList</Link>
        </li>
        <li>
          <Link to="/hr/PayrollDetails">PayrollDetails</Link>
        </li>
        <li>
          <Link to="/hr/UpdatePayrollForm">UpdatePayrollForm</Link>
        </li>
        <li>
          <Link to="/hr/BulkUpdateForm">BulkUpdateForm</Link>
        </li>
      </ul>
    </div>
  );
};

export default PayrollController;
