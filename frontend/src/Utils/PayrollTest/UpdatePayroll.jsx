import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import api from "../../Pages/config/api";

const UpdatePayroll = () => {
  const [employeeUpdates, setEmployeeUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (index, field, value) => {
    setEmployeeUpdates((prev) => {
      const updates = [...prev];
      updates[index] = { ...updates[index], [field]: value };
      return updates;
    });
  };

 const handleSubmit = async () => {
  setLoading(true);
  setMessage("");

  try {

    const { data } = await api.put(
      `/api/update-payroll`,
      { employeeUpdates },
    );

    setMessage(data?.message || "Payroll updated successfully!");
  } catch (error) {
    console.error("Error updating payroll:", error);
    setMessage(error?.response?.data?.message || "Error updating payroll");
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <h2>Update Payroll</h2>
      {employeeUpdates.map((update, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Employee ID"
            value={update.employeeObjID || ""}
            onChange={(e) =>
              handleInputChange(index, "employeeObjID", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Field Name"
            value={update.field || ""}
            onChange={(e) => handleInputChange(index, "field", e.target.value)}
          />
          <input
            type="text"
            placeholder="New Value"
            value={update.value || ""}
            onChange={(e) => handleInputChange(index, "value", e.target.value)}
          />
        </div>
      ))}
      <button onClick={() => setEmployeeUpdates([...employeeUpdates, {}])}>
        Add Employee Update
      </button>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Updating..." : "Submit"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdatePayroll;
