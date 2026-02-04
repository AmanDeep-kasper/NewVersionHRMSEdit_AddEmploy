import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./WorkExperienceForm.css";
import { useSelector } from "react-redux";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useLocation } from "react-router-dom";

const WorkExperienceForm = (props) => {
  const { userData } = useSelector((state) => state.user);
  const location = useLocation().pathname.split("/")[2];
  const id =
    location === "employee"
      ? sessionStorage.getItem("personal_id")
      : userData?._id;

  const createdBy = userData?._id;
  const today = new Date().toISOString().split("T")[0];
  const { darkMode } = useTheme();

  // Sanitization helpers
  // Designation: only letters and spaces
  const sanitizeText = (value) => value.replace(/[^A-Za-z ]/g, "");
  // Company Name: only letters, numbers, spaces (ignore special characters)
  const sanitizeCompanyName = (value) => value.replace(/[^A-Za-z0-9 ]/g, "");

  const formik = useFormik({
    initialValues: {
      companyName: "",
      designation: "",
      fromDate: "",
      toDate: "",
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Company name is required"),
      designation: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Designation must contain only letters and spaces.")
        .min(2, "Designation must be at least 2 characters.")
        .max(30, "Designation must be at most 30 characters.")
        .required("Designation is required"),
      fromDate: Yup.date().required("From date is required"),
      toDate: Yup.date()
        .required("To date is required")
        .min(Yup.ref("fromDate"), "To date must be after From date")
        .max(today, "To date cannot be in the future"),
    }),
    onSubmit: (values) => {
      props.onWorkExperienceSubmit(values, id);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Custom onChange for Designation to sanitize input
  const handleDesignationChange = (e) => {
    const sanitized = sanitizeText(e.target.value);
    formik.setFieldValue("designation", sanitized);
  };
  // Custom onChange for Company Name to sanitize input
  const handleCompanyNameChange = (e) => {
    const sanitized = sanitizeCompanyName(e.target.value);
    formik.setFieldValue("companyName", sanitized);
  };

  return (
    <div className="container-fluid pb-4">
      <h5 className="my-3">Add Experience</h5>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Company Name</label>
          <div className="form-input">
            <input
              type="text"
              name="companyName"
              className={`form-control  text-capitalize rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              onChange={handleCompanyNameChange}
              onBlur={formik.handleBlur}
              value={formik.values.companyName}
              placeholder="Please enter company's name"
              minLength={2}
              maxLength={50}
              required
              autoComplete="off"
            />
            {formik.touched.companyName && formik.errors.companyName ? (
              <div className="error" style={{ color: "red" }}>
                {formik.errors.companyName}
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <label>Designation</label>
          <div className="form-input">
            <input
              type="text"
              name="designation"
              className={`form-control  text-capitalize rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              onChange={handleDesignationChange}
              onBlur={formik.handleBlur}
              value={formik.values.designation}
              placeholder="Enter your designation"
              minLength={2}
              maxLength={30}
              required
              autoComplete="off"
            />
            {formik.touched.designation && formik.errors.designation ? (
              <div className="error" style={{ color: "red" }}>
                {formik.errors.designation}
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <label>From</label>
          <div className="form-input">
            <input
              type="date"
              name="fromDate"
              className={`form-control text-uppercase rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fromDate}
              required
            />
            {formik.touched.fromDate && formik.errors.fromDate ? (
              <div className="error" style={{ color: "red" }}>
                {formik.errors.fromDate}
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <label>To</label>
          <div className="form-input">
            <input
              type="date"
              name="toDate"
              className={`form-control  text-uppercase rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.toDate}
              required
            />
            {formik.touched.toDate && formik.errors.toDate ? (
              <div className="error" style={{ color: "red" }}>
                {formik.errors.toDate}
              </div>
            ) : null}
          </div>
        </div>

        <div className="d-flex gap-3 mt-3">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Submit
          </button>

          <button
            className="btn btn-danger"
            type="reset"
            onClick={props.onFormClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkExperienceForm;
