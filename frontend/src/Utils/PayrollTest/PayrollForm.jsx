import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import api from "../../Pages/config/api";

const PayrollForm = () => {
  const [formData, setFormData] = useState({
    year: "",
    month: "",
    employeeObjID: "",
    isAttChecked: false,
    status: "Pending",
    daysInMonth: "",
    absent: "",
    present: "",
    halfday: "",
    holiday: "",
    paidLeaves: "",
    unpaidLeaves: "",
    NCNS: "",
    Sandwhich: "",
    totalPayableDays: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      year: parseInt(formData.year),
      month: parseInt(formData.month),
      employeeObjID: formData.employeeObjID,
      employeeData: {
        isAttChecked: formData.isAttChecked,
        status: formData.status,
        daysInMonth: parseInt(formData.daysInMonth),
        absent: parseInt(formData.absent),
        present: parseInt(formData.present),
        halfday: parseInt(formData.halfday),
        holiday: parseInt(formData.holiday),
        paidLeaves: parseInt(formData.paidLeaves),
        unpaidLeaves: parseInt(formData.unpaidLeaves),
        NCNS: parseInt(formData.NCNS),
        Sandwhich: parseInt(formData.Sandwhich),
        totalPayableDays: parseInt(formData.totalPayableDays),
      },
    };

    try {

      const response = await api.post(
        `/api/payroll/addPayroll`,
        payload,
      );

      alert("Payroll record added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding payroll record:", error);
      alert(error?.response?.data?.message || "Error adding payroll record");
    }
  };

  // ...return JSX form UI here..


  return (
    <div className="container-fluid">
      <h2 className="text-center mb-4">Add Payroll Record</h2>
      <form onSubmit={handleSubmit} className="row mx-auto">
        <div className="col-3">
          <label className="form-label">Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-3">
          <label className="form-label">Month</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Month</option>
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="col-3">
          <label className="form-label">Employee ID</label>
          <input
            type="text"
            name="employeeObjID"
            value={formData.employeeObjID}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-3">
          <label className="form-label">Attendance Checked</label>
          <input
            type="checkbox"
            name="isAttChecked"
            checked={formData.isAttChecked}
            onChange={handleChange}
            className="form-check-input ms-2"
          />
        </div>

        <div className="col-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Processed">Processed</option>
            <option value="Paid">Paid</option>
            <option value="Hold">Hold</option>
            <option value="Failed ">Failed </option>
          </select>
        </div>

        <div className="col-3">
          <label className="form-label">Days in Month</label>
          <input
            type="number"
            name="daysInMonth"
            value={formData.daysInMonth}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-3">
          <label className="form-label">Absent Days</label>
          <input
            type="number"
            name="absent"
            value={formData.absent}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-3">
          <label className="form-label">Present Days</label>
          <input
            type="number"
            name="present"
            value={formData.present}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-3">
          <label className="form-label">Half Days</label>
          <input
            type="number"
            name="halfday"
            value={formData.halfday}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-3">
          <label className="form-label">Holiday</label>
          <input
            type="number"
            name="holiday"
            value={formData.holiday}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-3">
          <label className="form-label">Paid Leaves</label>
          <input
            type="number"
            name="paidLeaves"
            value={formData.paidLeaves}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-3">
          <label className="form-label">Unpaid Leaves</label>
          <input
            type="number"
            name="unpaidLeaves"
            value={formData.unpaidLeaves}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-3">
          <label className="form-label">NCNS</label>
          <input
            type="number"
            name="NCNS"
            value={formData.NCNS}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-3">
          <label className="form-label">Sandwhich</label>
          <input
            type="number"
            name="Sandwhich"
            value={formData.Sandwhich}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-3">
          <label className="form-label">Total Payable Days</label>
          <input
            type="number"
            name="totalPayableDays"
            value={formData.totalPayableDays}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Submit Payroll Record
        </button>
      </form>
    </div>
  );
};

export default PayrollForm;
