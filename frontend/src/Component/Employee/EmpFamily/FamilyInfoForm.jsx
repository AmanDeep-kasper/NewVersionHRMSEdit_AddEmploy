import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useLocation } from "react-router-dom";

const FamilyInfoForm = (props) => {
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  const location = useLocation().pathname.split("/")[2];
  const user =
    location === "employee"
      ? sessionStorage.getItem("personal_id")
      : userData?._id;
  const createdBy = userData?._id;

  const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const maxDate = yesterday.toISOString().split("T")[0];


  // Controlled form state for all fields
  const [fields, setFields] = useState({
    Name: "",
    Relationship: "",
    DOB: "",
    Occupation: "",
    parentMobile: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sanitization and validation helpers
  const sanitizeText = (value) => value.replace(/[^A-Za-z ]/g, "");
  const sanitizeMobile = (value) => value.replace(/[^0-9]/g, "").slice(0, 10);

  const validate = (fields) => {
    const errs = {};
    if (!fields.Name || fields.Name.trim().length < 2) {
      errs.Name = "Name must be at least 2 letters and only alphabets.";
    }
    if (!fields.Relationship || fields.Relationship.trim().length < 2) {
      errs.Relationship = "Relationship must be at least 2 letters and only alphabets.";
    }
    if (!fields.DOB) {
      errs.DOB = "Date of Birth is required.";
    }
    if (!fields.Occupation || fields.Occupation.trim().length < 2) {
      errs.Occupation = "Occupation must be at least 2 letters and only alphabets.";
    }
    if (!fields.parentMobile || !/^[0-9]{10}$/.test(fields.parentMobile)) {
      errs.parentMobile = "Contact No must be a valid 10-digit number.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitized = value;
    if (["Name", "Relationship", "Occupation"].includes(name)) {
      sanitized = sanitizeText(value);
    } else if (name === "parentMobile") {
      sanitized = sanitizeMobile(value);
    }
    setFields((prev) => ({ ...prev, [name]: sanitized }));
    // Remove error as user types
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(fields);
    if (errs[name]) {
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all as touched to show errors
    setTouched({ Name: true, Relationship: true, DOB: true, Occupation: true, parentMobile: true });
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      props.onFamilyInfoSubmit({
        ...fields,
        user,
        createdBy,
      });
      setFields({ Name: "", Relationship: "", DOB: "", Occupation: "", parentMobile: "" });
      setTouched({});
    }
  };

  return (
    <div className="container-fluid pb-3">
      <h5 className="my-3">+ Family Details</h5>
      <div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label>Name</label>
            <div className="form-input">
              <input
                className={`form-control text-capitalize rounded-2 ${darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
                  }`}
                type="text"
                name="Name"
                placeholder="Name"
                minLength={2}
                maxLength={30}
                value={fields.Name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {touched.Name && errors.Name && <div style={{ color: 'red', fontSize: 13 }}>{errors.Name}</div>}
            </div>
          </div>
          <div>
            <label>Relationship</label>
            <div className="form-input">
              <input
                className={`form-control text-capitalize rounded-2 ${darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
                  }`}
                type="text"
                name="Relationship"
                placeholder="Relationship"
                minLength={2}
                maxLength={30}
                value={fields.Relationship}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {touched.Relationship && errors.Relationship && <div style={{ color: 'red', fontSize: 13 }}>{errors.Relationship}</div>}
            </div>
          </div>
          <div>
            <label>Date of Birth</label>
            <div className="form-input">
              <input
                className={`form-control text-uppercase rounded-2 ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                  }`}
                type="date"
                name="DOB"
                max={maxDate}
                value={fields.DOB}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {touched.DOB && errors.DOB && <div style={{ color: 'red', fontSize: 13 }}>{errors.DOB}</div>}
            </div>
          </div>
          <div>
            <label>Occupation</label>
            <div className="form-input">
              <input
                className={`form-control text-capitalize rounded-2 ${darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
                  }`}
                type="text"
                name="Occupation"
                placeholder="Occupation"
                minLength={2}
                maxLength={30}
                value={fields.Occupation}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {touched.Occupation && errors.Occupation && <div style={{ color: 'red', fontSize: 13 }}>{errors.Occupation}</div>}
            </div>
          </div>
          <div>
            <label>Contact No</label>
            <div className="form-input">
              <input
                className={`form-control text-capitalize rounded-2 ${darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
                  }`}
                type="tel"
                name="parentMobile"
                placeholder="Contact No"
                pattern="[0-9]{10}"
                maxLength="10"
                value={fields.parentMobile}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                title="Please enter a valid 10-digit mobile number"
              />
              {touched.parentMobile && errors.parentMobile && <div style={{ color: 'red', fontSize: 13 }}>{errors.parentMobile}</div>}
            </div>
          </div>

          <div className="d-flex gap-3 mt-3">
            <button className="btn btn-primary" type="submit">
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
    </div>
  );
};

export default FamilyInfoForm;
