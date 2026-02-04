import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const WorkExperienceForm = ({
  editData,
  onWorkExperienceEditUpdate,
  onFormEditClose,
}) => {
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    CompanyNameData: editData?.CompanyName || "",
    DesignationData: editData?.Designation || "",
    FromDateData: editData?.FromDate?.slice(0, 10) || "",
    ToDateData: editData?.ToDate?.slice(0, 10) || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onWorkExperienceEditUpdate(formData, editData); // Pass formData and editData
  };

  return (
    <div className="container-fluid pb-4">
      <h5>Edit Work Experience Details</h5>

      <div>
        <Form
          className="d-flex flex-column gap-2"
          id="form"
          onSubmit={handleSubmit}
        >
          <div>
            <label>Company Name</label>
            <input
              className={`form-control text-capitalize rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="text"
              placeholder="Company Name"
              required
              name="CompanyNameData"
              value={formData.CompanyNameData}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Designation</label>
            <input
              className={`form-control text-capitalize rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="text"
              placeholder="Designation"
              required
              name="DesignationData"
              value={formData.DesignationData}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>From Date</label>
            <input
              className={`form-control text-uppercase rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="date"
              required
              name="FromDateData"
              value={formData.FromDateData}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>To Date</label>
            <input
              className={`form-control text-uppercase rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="date"
              required
              name="ToDateData"
              value={formData.ToDateData}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex align-items-center mt-2 gap-3">
            <button className="btn btn-primary" type="submit">
              Update
            </button>
            <button
              className="btn btn-danger"
              style={{ color: "white" }}
              type="reset"
              onClick={onFormEditClose}
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default WorkExperienceForm;
