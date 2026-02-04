import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Container, Alert, Spinner } from "react-bootstrap";
import BASE_URL from "../../Pages/config/config";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api";

const UpdateEmployeeShift = () => {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const userId = userData?._id;
  const {darkMode} = useTheme()

  // ✅ Fetch Employees
  useEffect(() => {
    api
      .get(`/api/employee`, {
      })
      .then((res) => setEmployees(res.data))
      .catch((err) => toast.error("Error fetching employees"));
  }, []);

  // ✅ Fetch Shifts
  useEffect(() => {
    api
      .get(`/api/shifts`, {
      })
      .then((res) => setShifts(res.data))
      .catch((err) => toast.error("Error fetching shifts"));
  }, []);

  // ✅ Handle Employee Selection
  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
    setSelectedShift(""); // Reset shift selection
  };

  // ✅ Handle Submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!selectedEmployee || !selectedShift || !updatedDate) {
    toast.error("Please select an employee, shift, and date.");
    setLoading(false);
    return;
  }

  try {
    const response = await api.put(
      `/api/employees/update-shift`,
      {
        employeeId: selectedEmployee,
        shiftId: selectedShift,
        updatedDate,
        updatedBy: userId, // ✅ Track who updated the shift
      },
    );

    toast.success(response.data.message || "Shift updated successfully!");
    setSelectedEmployee(""); // Reset employee selection
    setSelectedShift(""); // Reset shift selection
    setUpdatedDate(""); // Reset date selection
  } catch (error) {
    toast.error("Error updating shift!");
    console.error("Error updating shift", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <Container fluid className={`${!darkMode ? "text-light" : "text-dark"}`}>
      <TittleHeader title="Update Employee Shift" message="You can update employee shift from here" />
      
      <Form className="mt-3" onSubmit={handleSubmit}>
        {/* Employee Dropdown */}
        <Form.Group className={`mb-3`}>
          <Form.Label>Select Employee</Form.Label>
          <Form.Select   className={` text-capitalize form-select ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
              }`}  value={selectedEmployee} onChange={handleEmployeeChange}>
            <option value="">Choose Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.empID} - {emp.FirstName} {emp.LastName} 
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {/* Shift Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Select New Shift</Form.Label>
          <Form.Select className={`form-select ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
              }`} value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)}>
            <option value="">Choose Shift</option>
            {shifts.map((shift) => (
              <option key={shift._id} value={shift._id}>
                {shift.name} ({shift.startTime} - {shift.endTime})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {/* Date Picker */}
        <Form.Group className="mb-3">
          <Form.Label>Select Effective Date</Form.Label>
          <Form.Control className={` text-capitalize form-control ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
              }`} type="date" value={updatedDate} onChange={(e) => setUpdatedDate(e.target.value)} />
        </Form.Group>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Update Shift"}
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateEmployeeShift;