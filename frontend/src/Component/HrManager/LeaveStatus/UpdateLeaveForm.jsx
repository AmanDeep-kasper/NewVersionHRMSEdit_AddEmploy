import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import api from "../../../Pages/config/api";

const UpdateLeaveForm = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [leaveValues, setLeaveValues] = useState({
    sickLeave: 0,
    totalSickLeave: 0,
    paidLeave: 0,
    totalPaidLeave: 0,
    totalCasualLeave: 0,
    casualLeave: 0,
    totalPaternityLeave: 0,
    paternityLeave: 0,
    totalMaternityLeave: 0,
    maternityLeave: 0,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timeout = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [message, error]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get(`/api/employee`, {
          
        });
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load employees");
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchLeaveData = async () => {
      if (!selectedEmployee) return;

      try {
        const res = await api.get(
          `/api/by-emp/${selectedEmployee}`,
          
        );
        const data = res.data;

        setLeaveValues({
          sickLeave: data.sickLeave || 0,
          totalSickLeave: data.totalSickLeave || 0,
          paidLeave: data.paidLeave || 0,
          totalPaidLeave: data.totalPaidLeave || 0,
          casualLeave: data.casualLeave || 0,
          totalCasualLeave: data.totalCasualLeave || 0,
          paternityLeave: data.paternityLeave || 0,
          totalPaternityLeave: data.totalPaternityLeave || 0,
          maternityLeave: data.maternityLeave || 0,
          totalMaternityLeave: data.totalMaternityLeave || 0,
        });
      } catch (err) {
        console.error(err);
        setLeaveValues({
          sickLeave: 0,
          totalSickLeave: 0,
          paidLeave: 0,
          totalPaidLeave: 0,
          totalCasualLeave: 0,
          casualLeave: 0,
          totalPaternityLeave: 0,
          paternityLeave: 0,
          totalMaternityLeave: 0,
          maternityLeave: 0,
        });
        setError("Leave data not found or failed to fetch.");
      }
    };

    fetchLeaveData();
  }, [selectedEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits (no letters, no special chars)
    if (/^\d*$/.test(value)) {
      const numericValue = Number(value);

      // Validation: individual leave ≤ total leave
      const totalMapping = {
        sickLeave: "totalSickLeave",
        paidLeave: "totalPaidLeave",
        casualLeave: "totalCasualLeave",
        paternityLeave: "totalPaternityLeave",
        maternityLeave: "totalMaternityLeave",
      };

      // If editing a normal leave type, compare with corresponding total
      if (totalMapping[name]) {
        const totalLeaveKey = totalMapping[name];
        const totalLeaveValue = leaveValues[totalLeaveKey];

        if (numericValue > totalLeaveValue) {
          setError(
            `${name.replace(
              /([A-Z])/g,
              " $1"
            )} cannot be greater than ${totalLeaveKey.replace(
              /([A-Z])/g,
              " $1"
            )}`
          );
          return;
        }
      }

      setLeaveValues((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate all normal ≤ total before proceeding
    const mappings = [
      ["sickLeave", "totalSickLeave"],
      ["paidLeave", "totalPaidLeave"],
      ["casualLeave", "totalCasualLeave"],
      ["paternityLeave", "totalPaternityLeave"],
      ["maternityLeave", "totalMaternityLeave"],
    ];

    for (let [normal, total] of mappings) {
      if (leaveValues[normal] > leaveValues[total]) {
        setError(
          `${normal.replace(
            /([A-Z])/g,
            " $1"
          )} cannot be greater than ${total.replace(/([A-Z])/g, " $1")}`
        );
        return;
      }
    }

    setLoading(true);

    try {
      const res = await api.put(
        `/api/updateLeave/${selectedEmployee}`,
        leaveValues,
        
      );
      setMessage(res.data.message || "Leave updated successfully.");
      setSelectedEmployee("");
      setLeaveValues({
        sickLeave: 0,
        totalSickLeave: 0,
        paidLeave: 0,
        totalPaidLeave: 0,
        totalCasualLeave: 0,
        casualLeave: 0,
        totalPaternityLeave: 0,
        paternityLeave: 0,
        totalMaternityLeave: 0,
        maternityLeave: 0,
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="mb-3">
        <TittleHeader title={"Update Employee Leave"} />
      </div>

      {message && (
        <Alert variant="success" onClose={() => setMessage("")} dismissible>
          {message}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Select Employee</Form.Label>
          <Form.Select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            {employees
              .filter((emp) => emp.status === "active")
              .map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.FirstName} {emp.LastName} ({emp.Email})
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <div className="d-flex flex-column gap-2 mx-0 ">
          {/* Total Leave Values - Read Only */}
          <div className="d-flex flex-column gap-2 p-2 py-4 shadow-sm bg-white">
            {" "}
            <h5 className="ml-3">Total Leaves</h5>
            <div className="d-flex flex-wrap ">
              {[
                "totalSickLeave",
                "totalPaidLeave",
                "totalCasualLeave",
                "totalPaternityLeave",
                "totalMaternityLeave",
              ].map((type) => (
                <Form.Group className="mb-2 col-3" key={type}>
                  <Form.Label className="text-capitalize">
                    {type.replace(/([A-Z])/g, " $1")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={type}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={leaveValues[type] || 0}
                    onChange={handleChange}
                    placeholder={`Enter ${type}`}
                  />
                </Form.Group>
              ))}
            </div>
          </div>

          <div className="d-flex flex-column gap-2 p-2 py-4 shadow-sm bg-white">
            {" "}
            <h5 className="ml-3">Balance Leaves</h5>
            <div className="d-flex flex-wrap ">
              {/* Editable Leave Values */}
              {[
                "sickLeave",
                "paidLeave",
                "casualLeave",
                "paternityLeave",
                "maternityLeave",
              ].map((type) => (
                <Form.Group className="mb-2 col-3" key={type}>
                  <Form.Label className="text-capitalize">
                    {type.replace(/([A-Z])/g, " $1")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={type}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={leaveValues[type] || 0}
                    onChange={handleChange}
                    placeholder={`Enter ${type}`}
                  />
                </Form.Group>
              ))}
            </div>
          </div>
        </div>

        <Button className="my-3" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Update Leave"}
        </Button>
      </Form>
    </div>
  );
};

export default UpdateLeaveForm;
