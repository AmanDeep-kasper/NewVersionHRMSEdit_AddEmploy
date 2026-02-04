import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const EducationFormEdit = (props) => {
  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);

  const location = useLocation().pathname.split("/")[2];
  const employeeObjID =
    location === "employee"
      ? sessionStorage.getItem("personal_id")
      : userData?._id;
  const { editData, onEducationEditUpdate, onFormEditClose } = props;
  const updatedBy = userData?._id;

  const [formData, setFormData] = useState({
    SchoolUniversity: editData.SchoolUniversity || "",
    Degree: editData.Degree || "",
    Grade: editData.Grade || "",
    PassingOfYear: editData.PassingOfYear || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container-fluid pb-4">
      <h5>Edit Education Details</h5>

      <form
        id="form"
        className="d-flex flex-column gap-2"
        onSubmit={(e) =>
          onEducationEditUpdate(editData, e, employeeObjID, updatedBy)
        }
      >
        <div className="d-flex flex-column">
          <label>School / University</label>
          <input
            className="form-control"
            type="text"
            name="SchoolUniversity"
            placeholder="School / University"
            required
            value={formData.SchoolUniversity}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex flex-column">
          <label>Degree</label>
          <input
            className="form-control"
            type="text"
            name="Degree"
            placeholder="Degree"
            required
            value={formData.Degree}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex flex-column">
          <label>Grade / %</label>
          <input
            className="form-control"
            type="text"
            name="Grade"
            placeholder="Grade"
            required
            value={formData.Grade}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex flex-column">
          <label>Passing Of Year</label>
          <input
            className="form-control"
            type="text"
            name="PassingOfYear"
            placeholder="Passing Of Year"
            required
            value={formData.PassingOfYear}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex align-items-center mt-2 gap-3">
          <button className="btn btn-primary" type="submit">
            Update
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={onFormEditClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationFormEdit;
