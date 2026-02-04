import React, { useState, useEffect } from "react";
import "./DepartmentForm.css";
import axios from "axios";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../config/api";

const DepartmentForm = ({ onDepartmentSubmit, onFormClose }) => {
  const [companyData, setCompanyData] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = () => {
    api
      .get(`/api/company`, {
      })
      .then((response) => {
        setCompanyData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <h5>Add Department Details</h5>

      <form
        className="d-flex flex-column gap-3 mt-3"
        onSubmit={onDepartmentSubmit}
      >
        <div>
          <label>Company</label>
          <div>
            <select
              className={`form-select ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              name="company"
              required
            >
              <option value="" disabled selected>
                Select your option
              </option>
              {companyData.map((data) => (
                <option key={data["_id"]} value={data["_id"]}>
                  {data["CompanyName"]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label>Department</label>
          <div>
            <input
              className={`form-control ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="text"
              placeholder="Department"
              name="Department"
              required
            />
          </div>
        </div>

        <div className="d-flex gap-3">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
          <button className="btn btn-danger" type="reset" onClick={onFormClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;
