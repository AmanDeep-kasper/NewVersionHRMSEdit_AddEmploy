import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import api from "../../Pages/config/api";

const PayrollFormMany = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [records, setRecords] = useState([]);

  const addRecord = () => {
    setRecords([
      ...records,
      {
        employeeObjID: "",
        employeeData: {
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
          Sandwich: "",
          totalPayableDays: "",
        },
      },
    ]);
  };

  const removeRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const updateRecord = (index, field, value) => {
    setRecords((prevRecords) => {
      const updatedRecords = [...prevRecords];
      if (field === "employeeObjID") {
        updatedRecords[index][field] = value;
      } else {
        updatedRecords[index].employeeData[field] = value;
      }
      return updatedRecords;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!year || !month) {
      alert("Please select Year and Month.");
      return;
    }

    if (records.length === 0) {
      alert("Please add at least one employee record.");
      return;
    }

    for (const record of records) {
      if (!record.employeeObjID) {
        alert("Please fill all required fields.");
        return;
      }
    }

    try {
      const groupedRecords = records.reduce((acc, record) => {
        const { employeeObjID, employeeData } = record;
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push({ employeeObjID, employeeData });
        return acc;
      }, {});

      const payload = Object.keys(groupedRecords).map((month) => ({
        year,
        month: parseInt(month),
        EmployeeAttandanceData: groupedRecords[month],
      }));

      // ✅ API call with Authorization header
      await api.post(
        `/api/payroll/addPayrollRecordsMany`,
        { records: payload },
      );

      alert("Payroll records added successfully!");
      setRecords([]);
    } catch (error) {
      console.error("Error adding records:", error);
      alert("Failed to add payroll records.");
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-3">Add Payroll Records</h2>
      <form onSubmit={handleSubmit}>
        {/* Global Year & Month Selection */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Month</label>
            <select
              className="form-control"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
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
        </div>

        {/* Employee Data */}
        {records.map((record, index) => (
          <div key={index} className="mb-3 p-3 border rounded">
            <div className="row">
              <div className="col-md-4 mb-2">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={record.employeeObjID}
                  onChange={(e) =>
                    updateRecord(index, "employeeObjID", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="row">
              {[
                "daysInMonth",
                "absent",
                "present",
                "halfday",
                "holiday",
                "paidLeaves",
                "unpaidLeaves",
                "NCNS",
                "Sandwich",
                "totalPayableDays",
              ].map((field) => (
                <div key={field} className="col-md-3 mb-2">
                  <label className="form-label">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={record.employeeData[field] || ""}
                    onChange={(e) => updateRecord(index, field, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => removeRecord(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <div className="d-flex align-items-center gap-2">
          <button type="button" className="btn btn-primary" onClick={addRecord}>
            + Add Employee
          </button>
          <button type="submit" className="btn btn-success">
            Submit Payroll
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollFormMany;
