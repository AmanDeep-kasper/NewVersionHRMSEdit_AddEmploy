import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config/config";
import TittleHeader from "../../TittleHeader/TittleHeader";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import toast from "react-hot-toast";
import api from "../../config/api";

const UpdateNcnsOrSandwich = () => {
  const [employees, setEmployees] = useState([]);
  const [hoverMsg, setHoverMsg] = useState();
  const [formData, setFormData] = useState({
    employeeObjID: "",
    year: "",
    month: "",
    date: "",
    isNCNS: false,
    isSandwich: false,
    isForcedAbsent: false,
  });

  const currentDate = new Date();
  const { darkMode } = useTheme();

  const getYears = () => {
    const years = [];
    for (let year = 2024; year <= currentDate.getFullYear(); year++) {
      years.push(year);
    }
    return years;
  };

  const getMonths = (year) => {
    const allMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    if (year === currentDate.getFullYear()) {
      return allMonths.slice(0, currentDate.getMonth() + 1);
    }
    return allMonths;
  };

  const getDates = (year, month) => {
    const monthIndex = getMonths(year).indexOf(month);
    if (
      year === currentDate.getFullYear() &&
      monthIndex === currentDate.getMonth()
    ) {
      return Array.from({ length: currentDate.getDate() }, (_, i) => i + 1);
    }
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        isNCNS: name === "isNCNS" ? checked : false,
        isSandwich: name === "isSandwich" ? checked : false,
        isForcedAbsent: name === "isForcedAbsent" ? checked : false,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await api.get(`/api/employee`, {
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to load employees.");
    }
  };

  fetchEmployees();
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const response = await api.post(
      `/api/update-Attendance-Status`,
      {
        employeeObjID: formData.employeeObjID,
        year: parseInt(formData.year),
        month: getMonths(parseInt(formData.year)).indexOf(formData.month) + 1,
        date: parseInt(formData.date),
        isNCNS: formData.isNCNS,
        isSandwich: formData.isSandwich,
        isForcedAbsent: formData.isForcedAbsent,
      },
    );

    toast.success("Attendance status updated successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error updating attendance status:", error);
    const errorMsg = error.response?.data?.message || "Failed to update attendance status.";
    toast.error(errorMsg);
  }
};


  return (
    <div className="container-fluid">
      <div className="mb-3">
        <TittleHeader
          title={"Update Attendance: NCNS, Sandwich, Forced Absent"}
          message={"You can mark NCNS, Sandwich, or Forced Absent for the employee attendance."}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className={`row mt-2 g-4 p-4 rounded shadow-sm mx-auto ${
          darkMode ? "text-black" : "text-light"
        }`}
        style={{
          background: darkMode
            ? "var(--primaryDashMenuColor)"
            : "var(--primaryDashColorDark)",
        }}
      >
        {/* Status Checkboxes */}
        <div className="col-12 d-flex flex-wrap align-items-center gap-4">
          {[
            { name: "isNCNS", label: "NCNS" },
            { name: "isSandwich", label: "Sandwich" },
            { name: "isForcedAbsent", label: "Forced Absent" },
          ].map(({ name, label }) => (
            <label key={name} className="form-switch d-flex align-items-center gap-2 ">
              <input
                type="checkbox"
                
                className="form-check-input position-relative"
                style={{ height: "1.5rem", width: "2.8rem" }}
                name={name}
                checked={formData[name]}
                onChange={handleChange}
                disabled={
                  !formData[name] &&
                  (formData.isNCNS || formData.isSandwich || formData.isForcedAbsent)
                }
              />
              <span className="fw-normal ">{label}</span>
            </label>
          ))}
          <p className={`m-0 ${darkMode ? "badge-warning" : "badge-warning-dark"}`}>
            Only one status can be selected at a time.
          </p>
        </div>

        {/* Alert Messages */}
        <div className="col-12">
          {formData.isNCNS && (
            <span  className={`${darkMode ? "badge-danger" : "badge-danger-dark"}`}>NCNS selected: 2 days salary deduction.</span>
          )}
          {formData.isSandwich && (
            <span  className={`${darkMode ? "badge-danger" : "badge-danger-dark"}`}>Sandwich selected: 1 day salary deduction.</span>
          )}
          {formData.isForcedAbsent && (
            <span  className={`${darkMode ? "badge-danger" : "badge-danger-dark"}`}>Forced Absent: Full day unpaid leave.</span>
          )}
        </div>

        {/* Employee Dropdown */}
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label">Select Employee</label>
          <select
            name="employeeObjID"
            value={formData.employeeObjID}
            onChange={handleChange}
            required
            className={`form-select rounded-2 ${
              darkMode
                ? "bg-light text-dark border"
                : "bg-dark text-light border-0"
            }`}
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.FirstName} {emp.LastName} ({emp.empID})
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label">Select Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className={`form-select rounded-2 ${
              darkMode
                ? "bg-light text-dark border"
                : "bg-dark text-light border-0"
            }`}
          >
            <option value="">-- Select Year --</option>
            {getYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label">Select Month</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
            className={`form-select rounded-2 ${
              darkMode
                ? "bg-light text-dark border"
                : "bg-dark text-light border-0"
            }`}
          >
            <option value="">-- Select Month --</option>
            {formData.year &&
              getMonths(parseInt(formData.year)).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
          </select>
        </div>

        {/* Date */}
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label">Select Date</label>
          <select
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={`form-select rounded-2 ${
              darkMode
                ? "bg-light text-dark border"
                : "bg-dark text-light border-0"
            }`}
          >
            <option value="">-- Select Date --</option>
            {formData.year &&
              formData.month &&
              getDates(parseInt(formData.year), formData.month).map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary px-4"
            onMouseEnter={() =>
              setHoverMsg(
                !formData.isNCNS &&
                  !formData.isSandwich &&
                  !formData.isForcedAbsent
                  ? "Submitting will clear all special status for this date."
                  : ""
              )
            }
            onMouseLeave={() => setHoverMsg("")}
            disabled={
              !formData.employeeObjID ||
              !formData.year ||
              !formData.month ||
              !formData.date
            }
          >
            {formData.isNCNS
              ? "Update NCNS"
              : formData.isSandwich
              ? "Update Sandwich"
              : formData.isForcedAbsent
              ? "Update Forced Absent"
              : "Clear All Flags"}
          </button>
          {hoverMsg && (
            <p className="text-danger mt-2" style={{ fontSize: "0.875rem" }}>
              {hoverMsg}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdateNcnsOrSandwich;
