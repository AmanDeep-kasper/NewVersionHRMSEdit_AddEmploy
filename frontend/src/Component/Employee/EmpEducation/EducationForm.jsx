import React from "react";
import "./EducationForm.css";
import { useSelector } from "react-redux";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useLocation } from "react-router-dom";

const EducationForm = (props) => {
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  const location = useLocation().pathname.split("/")[2];
  const id =
    location === "employee"
      ? sessionStorage.getItem("personal_id")
      : userData?._id;

  const createdBy = userData?._id;

  return (
    <div className="container-fluid pb-3">
      <h5 className="my-3">Education Details</h5>
      <div>
        <form
          className="d-flex flex-column gap-2"
          onSubmit={(e) => props.onEducationSubmit(e, id, createdBy)}
        >
          <div className="d-flex flex-column">
            <label>School / University</label>
            <input
              type="Text"
              className={`form-control  text-capitalize rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              placeholder="School / University "
              required
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <lable>Degree</lable>
            <input
              type="Text"
              className={`form-control  text-capitalize rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              placeholder="Degree "
              required
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <lable>Grade / %</lable>
            <input
              className={`form-control  text-capitalize rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="Text"
              placeholder="Grade"
              required
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <lable>Passing Of Year</lable>
            <input
              type="text"
              className={`form-control text-capitalize rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              placeholder="Passing Of Year"
              required
            />
          </div>

          <div className="d-flex align-items-center gap-2 my-2">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>

            <button
              className="btn btn-danger"
              type="reset"
              onClick={props.onFormClose}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationForm;
