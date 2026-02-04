import React, { useState, useEffect } from "react";
import "./AdminProjectBidForm.css";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api";

const AdminProjectBidForm = ({ onProjectBidSubmit, onFormClose }) => {
  const [status, setStatus] = useState("");
  const [portalsInfo, setPortalsInfo] = useState([]);
  const { darkMode } = useTheme();
  let portalsData = [];

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const loadPortalsInfo = () => {
    api
      .get(`/api/admin/portal`, {
      })
      .then((response) => {
        portalsData = response.data.filter((data) => data.Status === 1);
        setPortalsInfo(portalsData);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    loadPortalsInfo();
  }, []);

  return (
    <div className="container-fluid py-3">
      <div className="my-auto">
        <h5
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "600",
          }}
          className="m-0"
        >
          Add Project Bid Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="m-0"
        >
          You can create new bid here.
        </p>
      </div>

      <form
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
        }}
        className="my-4 d-flex flex-column gap-3"
        onSubmit={onProjectBidSubmit}
      >
        <div className="row">
          <div className="col-12 col-md-6">
            <label>Project Title</label>
            <div>
              <input
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                type="text"
                placeholder="Project Title"
                name="ProjectTitle"
                required
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label>Project URL</label>
            <div>
              <input
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                type="text"
                placeholder="Project URL"
                name="ProjectURL"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <label>Project Description</label>
          <div>
            <textarea
              placeholder="Please enter description of the project"
              className={`form-control ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              rows="3"
              required
            />
          </div>
        </div>
        <div>
          <label>Portals</label>
          <div>
            <select
              className={`form-select ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              name="CompanyID"
              required
            >
              {portalsInfo.map((data) => (
                <option key={data["_id"]} value={data["_id"]}>
                  {data["PortalName"]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-4">
            <label>Estimated Time</label>
            <div>
              <input
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                type="number"
                placeholder="Estimated Time"
                name="EstimatedTime"
                required
              />
            </div>
          </div>
          <div className="col-12 col-md-2">
            <div>
              <label>Time Period</label>
              <select
                className={`form-select ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                required
              >
                <option value="">Select Time Period</option>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-2">
            <div>
              <label>Currency</label>
              <select
                className={`form-select ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
              >
                <option value="">Select Currency</option>
                <option value="₹">₹ INR</option>
                <option value="$">$ USD</option>
                <option value="€">€ EUR</option>
                <option value="£">£ GBP</option>
                <option value="¥">¥ JPY</option>
                <option value="₽">₽ RUB</option>
                <option value="₣">₣ CHF</option>
                <option value="₨">₨ PKR</option>
                <option value="$">$ CAD</option>
                <option value="₣">₣ SEK</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <label>Estimated Cost</label>
            <div>
              <input
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                type="number"
                placeholder="Estimated Cost"
                name="EstimatedCost"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          {" "}
          <div className="col-12 col-md-12">
            <label>Status</label>
            <div>
              <select
                className={`form-select ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                required
              >
                <option value="1">Open</option>
                <option value="2">Close</option>
                <option value="3">Cancel</option>
                <option value="4">Award</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <label>Remark</label>
          <div>
            <textarea
              placeholder="Please enter remarks, if any"
              className={`form-control ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              rows="3"
              required
            />
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onFormClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectBidForm;
