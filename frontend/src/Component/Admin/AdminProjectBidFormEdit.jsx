import React, { useState, useEffect } from "react";
import "./AdminProjectBidFormEdit.css";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api";

const AdminProjectBidFormEdit = ({
  editData,
  onProjectBidEditUpdate,
  onFormEditClose,
}) => {
  const [portalsInfo, setPortalsInfo] = useState([]);
  const { darkMode } = useTheme();
  const [projectTitleData, setProjectTitleData] = useState(
    editData["ProjectTitle"]
  );
  const [projectURLData, setProjectURLData] = useState(editData["ProjectURL"]);
  const [projectDescriptionData, setProjectDescriptionData] = useState(
    editData["ProjectDesc"]
  );
  const [estimatedTimeData, setEstimatedTimeData] = useState(
    editData["EstimatedTime"]
  );
  const [estimatedCostData, setEstimatedCostData] = useState(
    editData["EstimatedCost"]
  );
  const [remarkData, setRemarkData] = useState(editData["Remark"]);
  const [timePeriodData, setTimePeriodData] = useState(editData["TimePeriod"]);
  const [currencyData, setCurrencyData] = useState(editData["Currency"]);

  useEffect(() => {
    loadPortalsInfo();
  }, []);

  const loadPortalsInfo = () => {
    api
      .get(`/api/admin/portal`, {
        
      })
      .then((response) => {
        const activePortals = response.data.filter(
          (data) => data["Status"] == 1
        );
        setPortalsInfo(activePortals);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container-fluid py-3">
      <div className="my-auto">
        <h5
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "600",
          }}
          className="m-0"
        >
          Edit Project Bid Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
        >
          You can edit project bid details here.
        </p>
      </div>
      <form
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
        }}
        className="my-4 d-flex flex-column gap-3"
        onSubmit={(e) => onProjectBidEditUpdate(editData, e)}
      >
        <div className="row">
          <div className="col-12 col-md-6">
            <label>Project Title</label>
            <div>
              <input
                type="text"
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                placeholder="Project Title"
                name="ProjectTitle"
                required
                value={projectTitleData}
                onChange={(e) => setProjectTitleData(e.target.value)}
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
                value={projectURLData}
                onChange={(e) => setProjectURLData(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <label>Project Description</label>
          <div>
            <textarea
              className={`form-control ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              rows="3"
              required
              value={projectDescriptionData}
              onChange={(e) => setProjectDescriptionData(e.target.value)}
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
              {portalsInfo.map((data, index) => (
                <option
                  key={index}
                  value={data["_id"]}
                  // Check if editData.portals exists and has at least one portal before accessing its ID
                  selected={
                    editData["portals"] &&
                    editData["portals"].length > 0 &&
                    editData["portals"][0]["ID"] === data["ID"]
                  }
                >
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
                value={estimatedTimeData}
                onChange={(e) => setEstimatedTimeData(e.target.value)}
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
                value={timePeriodData}
                onChange={(e) => setTimePeriodData(e.target.value)}
              >
                <option value="Days" selected={editData["TimePeriod"] == 1}>
                  Days
                </option>
                <option value="Weeks" selected={editData["TimePeriod"] == 2}>
                  Weeks
                </option>
                <option value="Months" selected={editData["TimePeriod"] == 3}>
                  Months
                </option>
                <option value="Years" selected={editData["TimePeriod"] == 4}>
                  Years
                </option>
              </select>
            </div>
          </div>

          <div className="col-12 col-md-2">
            <div>
              <label>Currency</label>
              <select
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                value={currencyData}
                onChange={(e) => setCurrencyData(e.target.value)}
              >
                <option value="₹" selected={editData["currency"] == 1}>
                  ₹ INR
                </option>
                <option value="$" selected={editData["currency"] == 2}>
                  $ USD
                </option>
                <option value="€" selected={editData["currency"] == 3}>
                  € EUR
                </option>
                <option value="£" selected={editData["currency"] == 4}>
                  £ GBP
                </option>
                <option value="¥" selected={editData["currency"] == 5}>
                  ¥ JPY
                </option>
                <option value="₽" selected={editData["currency"] == 6}>
                  ₽ RUB
                </option>
                <option value="₣" selected={editData["currency"] == 7}>
                  ₣ CHF
                </option>
                <option value="₨" selected={editData["currency"] == 8}>
                  ₨ PKR
                </option>
                <option value="$" selected={editData["currency"] == 9}>
                  $ CAD
                </option>
                <option value="₣" selected={editData["currency"] == 10}>
                  ₣ SEK
                </option>
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
                value={estimatedCostData}
                onChange={(e) => setEstimatedCostData(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row">
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
                <option value="1" selected={editData["Status"] == 1}>
                  Open
                </option>
                <option value="2" selected={editData["Status"] == 2}>
                  Close
                </option>
                <option value="3" selected={editData["Status"] == 3}>
                  Cancel
                </option>
                <option value="4" selected={editData["Status"] == 4}>
                  Award
                </option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <label>Remark</label>
          <div>
            <textarea
              className={`form-control ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              rows="3"
              required
              value={remarkData}
              onChange={(e) => setRemarkData(e.target.value)}
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
            onClick={onFormEditClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectBidFormEdit;
