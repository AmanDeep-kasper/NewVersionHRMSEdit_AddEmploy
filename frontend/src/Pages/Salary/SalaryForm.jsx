import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import TittleHeader from "../TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api";

const SalaryForm = (props) => {
  const { darkMode } = useTheme();
  const [employeeData, setEmployeeData] = useState([]);
  const [formValues, setFormValues] = useState({
    employeeId: "",
    BasicSalary: "",
    HRASalary: "",
    ConvenyanceAllowance: "",
    otherAllowance: "",
    totalSalary: "",
  });
  const [errors, setErrors] = useState({});

  // Load employee data
  useEffect(() => {
    const loadEmployeeInfo = async () => {
      try {
        const response = await api.get("/api/employee");
        // Log to check API response
        console.log("Employees:", response.data);
        setEmployeeData(response.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadEmployeeInfo();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";

    const numberFields = [
      "BasicSalary",
      "HRASalary",
      "ConvenyanceAllowance",
      "otherAllowance",
    ];

    if (numberFields.includes(name)) {
      const validPattern = /^[0-9]*\.?[0-9]{0,2}$/;
      if (!validPattern.test(value)) {
        errorMsg = "Only numbers allowed (max 2 decimals)";
      } else if (value.includes("-")) {
        errorMsg = "Negative values are not allowed";
      } else if (value === "") {
        errorMsg = "This field is required";
      } else if (isNaN(Number(value))) {
        errorMsg = "Invalid number";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    // Update form values and total salary
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };
      const totalSalary = calculateTotalSalary(updatedValues);
      return { ...updatedValues, totalSalary };
    });
  };

  const calculateTotalSalary = (values) => {
    const { BasicSalary, HRASalary, ConvenyanceAllowance, otherAllowance } =
      values;
    return (
      parseFloat(BasicSalary || 0) +
      parseFloat(HRASalary || 0) +
      parseFloat(ConvenyanceAllowance || 0) +
      parseFloat(otherAllowance || 0)
    ).toFixed(2);
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-2"
    >
      <TittleHeader
        title="Add Salary Details"
        message="You can add salary details of the employee."
      />
      <Form
        id="form"
        onSubmit={props.onSalarySubmit}
        className="w-100 row row-gap-3 py-4 mb-5"
        style={{ width: "fit-content" }}
      >
        {/* Employee Select */}
        <div className="col-12 col-md-6 col-lg-4">
          <label>Select Employee</label>
          <Form.Control
            as="select"
            name="employeeId"
            value={formValues.employeeId}
            onChange={handleChange}
            className={`form-select text-capitalize ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            required
          >
            <option value="" disabled>
              Select your option
            </option>

            {/* Active employees with no salary yet */}
            {employeeData
              .filter((emp) => !emp.salary || emp.salary.length === 0)
              .filter((emp) => emp.status?.toLowerCase() === "active")
              .map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.empID} - {emp.FirstName} {emp.LastName}
                </option>
              ))}

            {/* Inactive employees with no salary */}
            {employeeData
              .filter((emp) => !emp.salary || emp.salary.length === 0)
              .filter((emp) => emp.status?.toLowerCase() !== "active")
              .map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.empID} - {emp.FirstName} {emp.LastName} (
                  {emp.status})
                </option>
              ))}
          </Form.Control>
        </div>

        {/* Basic Salary */}
        <div className="col-12 col-md-6 col-lg-4">
          <label>Basic Salary</label>
          <Form.Control
            type="number"
            name="BasicSalary"
            min={0}
            step="0.01"
            placeholder="Basic Salary"
            value={formValues.BasicSalary}
            onChange={handleChange}
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            required
          />
          {errors.BasicSalary && (
            <div style={{ color: "red", fontSize: "0.9em" }}>
              {errors.BasicSalary}
            </div>
          )}
        </div>

        {/* HRA */}
        <div className="col-12 col-md-6 col-lg-4">
          <label>House Rent Allowance (H.R.A.)</label>
          <Form.Control
            type="number"
            name="HRASalary"
            min={0}
            step="0.01"
            placeholder="H.R.A"
            value={formValues.HRASalary}
            onChange={handleChange}
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            required
          />
          {errors.HRASalary && (
            <div style={{ color: "red", fontSize: "0.9em" }}>
              {errors.HRASalary}
            </div>
          )}
        </div>

        {/* Convenyance Allowance */}
        <div className="col-12 col-md-6 col-lg-4">
          <label>Convenyance Allowance</label>
          <Form.Control
            type="number"
            name="ConvenyanceAllowance"
            min={0}
            step="0.01"
            placeholder="Convenyance Allowance"
            value={formValues.ConvenyanceAllowance}
            onChange={handleChange}
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            required
          />
          {errors.ConvenyanceAllowance && (
            <div style={{ color: "red", fontSize: "0.9em" }}>
              {errors.ConvenyanceAllowance}
            </div>
          )}
        </div>

        {/* Other Allowance */}
        <div className="col-12 col-md-6 col-lg-4">
          <label>Other Allowance</label>
          <Form.Control
            type="number"
            name="otherAllowance"
            min={0}
            step="0.01"
            placeholder="Other Allowance"
            value={formValues.otherAllowance}
            onChange={handleChange}
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            required
          />
          {errors.otherAllowance && (
            <div style={{ color: "red", fontSize: "0.9em" }}>
              {errors.otherAllowance}
            </div>
          )}
        </div>

        {/* Total Salary (read-only) */}
        <div className="col-12 col-md-6 col-lg-4">
          <label>Total Salary</label>
          <Form.Control
            type="number"
            name="totalSalary"
            placeholder="Total Earning"
            value={formValues.totalSalary}
            readOnly
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
          />
        </div>

        {/* Submit / Cancel */}
        <div className="d-flex align-items-center gap-3 mt-3">
          <Button className="btn btn-primary" type="submit">
            Submit
          </Button>
          <Button
            className="btn btn-danger"
            type="reset"
            onClick={props.onFormClose}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SalaryForm;
