import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveApplicationEmpForm.css";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import BASE_URL from "../../../Pages/config/config";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api";

const LeaveApplicationEmpForm = (props) => {
  const { userData } = useSelector((state) => state.user);
  const [reasionLength, setReasionLength] = useState(0);
  const maxLength = 100;
  const id = userData?._id;
  const [empData, setEmpData] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [leaveType, setLeaveType] = useState("");
  const [leaveCount, setLeaveCount] = useState([]);
  const [leaveDuration, setLeaveDuration] = useState(""); // Full day or half day
  const [halfDayType, setHalfDayType] = useState(""); // First half or second half
  const [addManager, setAddManager] = useState(""); // Additional manager
  const [additionalManagerList, setAdditionalManagerList] = useState([]);
  const email = userData?.Email;

  const location = useLocation();
  const { darkMode } = useTheme();
  const status = location.pathname.split("/")[1];

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Load employee data
  const loadEmployeeData = () => {
    api
      .get(`/api/particularEmployee/${id}`, {
      })
      .then((response) => {
        setEmpData(response.data);
      })
      .catch((error) => {
        console.error("Error loading employee data", error);
      });
  };

  // Load leave balance data
  const loadLeaveBalance = () => {
    api
      .post(
        `/api/particularLeave`,
        { id },
      )
      .then((response) => {
        setLeaveBalance(response.data);
      })
      .catch((error) => {
        console.error("Error loading leave balance", error);
      });
  };

  // Load additional managers
  const loadManagersData = () => {
    api
      .post(
        `/api/managersList`,
        { status, email },
      )
      .then((response) => {
        // Normalize various possible response shapes to an array
        const resp = response && response.data ? response.data : response;
        let list = [];
        if (Array.isArray(resp)) {
          list = resp;
        } else if (resp && Array.isArray(resp.data)) {
          list = resp.data;
        } else if (resp && typeof resp === 'object') {
          // Single object -> wrap into array
          list = [resp];
        } else {
          list = [];
        }
        setAdditionalManagerList(list);
      })
      .catch((error) => {
        console.error("Error loading additional managers", error);
      });
  };

  useEffect(() => {
    loadEmployeeData();
    loadLeaveBalance();
    loadManagersData();
  }, []);

  const handleInputChange = (e) => {
    if (e.target.value === "unPaid Leave") {
      setLeaveCount(365);
      setLeaveType(e.target.value);
      return;
    }
    setLeaveCount(leaveBalance[0][e.target.value]);
    setLeaveType(e.target.value);
    setReasionLength(e.target.value);
  };

  const handleDurationChange = (e) => {
    setLeaveDuration(e.target.value);

    if (e.target.value === "Full Day") {
      setFormData((prev) => ({
        ...prev,
        endDate: formData.startDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        endDate: "",
      }));
    }
  };

  const handleHalfDayTypeChange = (e) => {
    setHalfDayType(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Handle 'startDate' validation
    if (name === "startDate") {
      const selectedDate = new Date(value); // Convert input value to a Date object
      const today = new Date(); // Current date
      today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

      if (selectedDate < today) {
        alert("Start date cannot be in the past.");
        return;
      }
    }

    // Update reasionLength when the reason field is updated
    if (name === "reason") {
      setReasionLength(value.length);
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const differenceCalculator = (e) => {
    if (leaveDuration === "Half Day") return; // Skip calculation for half-day leave

    const selectedEndDate = new Date(e.target.value);
    const selectedStartDate = new Date(formData.startDate);

    if (selectedEndDate < selectedStartDate) {
      alert("End date cannot be earlier than the start date.");
      return;
    }

    if (leaveType === "unPaid Leave") {
      setFormData((prev) => ({ ...prev, endDate: e.target.value }));
      return;
    }

    let requiredLeave = dateDifference(formData.startDate, e.target.value);

    if (leaveCount < requiredLeave + 1) {
      alert("Leave balance is low");
      return;
    }

    setFormData((prev) => ({ ...prev, endDate: e.target.value }));
  };

  function dateDifference(date1, date2) {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    if (secondDate < firstDate) {
      alert("Please select proper date");
      return;
    }
    const differenceInTime = secondDate.getTime() - firstDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.abs(differenceInDays);
  }

  const deductLeave = (e) => {
    e.preventDefault();
    if (leaveType === "unPaid Leave") {
      const requiredLeave =
        leaveDuration === "Half Day"
          ? 0.5
          : dateDifference(formData.startDate, formData.endDate) + 1;
      props.onLeaveApplicationEmpSubmit(e, requiredLeave);
      return;
    }
    const requiredLeave =
      leaveDuration === "Half Day"
        ? 0.5
        : dateDifference(formData.startDate, formData.endDate) + 1; // Half day leave
    if (leaveCount < requiredLeave) {
      alert("Leave balance is low");
      return;
    }
    props.onLeaveApplicationEmpSubmit(e, requiredLeave);
  };

  return (
    <>
      {empData ? (
        <div
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="container-fluid py2"
        >
          {leaveBalance.length < 0 ? (
            <div className="p-4 badge-danger border">
              <h5>Leave balance not available</h5>
              <p className="my-0">Please contact to your reporting manager</p>
            </div>
          ) : (
            <div>
              <TittleHeader
                title={"Create Leave"}
                message={"You can create a new leave request here."}
              />
              <form
                className="py-4 rounded row"
                onSubmit={(e) => deductLeave(e)}
              >
                <div className="mb-3 col-12">
                  <label htmlFor="leaveType" className="form-label">
                    Select Leave Type
                  </label>
                  <select
                    className={`form-select rounded-2 ${darkMode
                        ? "bg-light text-dark border dark-placeholder"
                        : "bg-dark text-light border-0 light-placeholder"
                      }`}
                    id="leaveType"
                    name="leaveType"
                    value={leaveType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled selected>
                      -- Select Leave Type --
                    </option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Paid Leave">Paid Leave</option>
                    <option value="unPaid Leave">unPaid Leave</option>
                    {empData.Gender === "male" ? (
                      <option value="Paternity Leave">Paternity Leave</option>
                    ) : (
                      <option value="Maternity Leave">Maternity Leave</option>
                    )}
                  </select>
                </div>
                <div className="mb-3 col-12">
                  {leaveCount < 300 && (
                    <label htmlFor="leaveCount" className="form-label">
                      Available {leaveType}
                    </label>
                  )}

                  <div
                    className={`rounded-2 w-100 ${darkMode
                        ? "text-dark border dark-placeholder"
                        : "text-light border-0 light-placeholder"
                      }`}
                    style={{
                      width: "fit-content",
                      position: "relative",
                      background: "rgba(201, 34, 34, 0.116)",
                    }}
                  >
                    {leaveCount > 300 && (
                      <p
                        className="my-0"
                        style={{
                          position: "absolute",
                          padding: ".5rem",
                        }}
                      >
                        As per Companie's Guidlines
                      </p>
                    )}

                    <input
                      className={`form-control rounded-2 ${darkMode
                          ? "bg-light text-dark border dark-placeholder"
                          : "bg-dark text-light border-0 light-placeholder"
                        }`}
                      id="leaveCount"
                      name="leaveCount"
                      value={leaveCount}
                      style={{ opacity: leaveCount > 300 ? 0 : "100%" }}
                      readOnly
                      disabled
                      placeholder="Please select a leave type"
                    />
                  </div>
                </div>
                {leaveCount > 0 && (
                  <>
                    <div className="mb-3 col-12">
                      <label htmlFor="leaveDuration" className="form-label">
                        Leave Duration
                      </label>
                      <select
                        className={`form-select rounded-2 ${darkMode
                            ? "bg-light text-dark border-0"
                            : "bg-dark text-light border-0"
                          }`}
                        id="leaveDuration"
                        name="leaveDuration"
                        value={leaveDuration}
                        onChange={handleDurationChange}
                        required
                      >
                        <option value="" disabled selected>
                          -- Select --
                        </option>
                        <option value="Full Day">Full Day</option>
                        <option value="Half Day">Half Day</option>
                      </select>
                    </div>

                    {leaveDuration === "Half Day" && (
                      <div className="mb-3 col-12">
                        <label htmlFor="halfDayType" className="form-label">
                          Select Half
                        </label>
                        <select
                          className={`form-select rounded-2 ${darkMode
                              ? "bg-light text-dark border-0"
                              : "bg-dark text-light border-0"
                            }`}
                          id="halfDayType"
                          name="halfDayType"
                          value={halfDayType}
                          onChange={handleHalfDayTypeChange}
                          required
                        >
                          <option value="" disabled selected>
                            -- Select --
                          </option>
                          <option value="First Half">First Half</option>
                          <option value="Second Half">Second Half</option>
                        </select>
                      </div>
                    )}
                  </>
                )}
                {leaveDuration === "Half Day" ? (
                  <div className="mb-3 col-12">
                    <label htmlFor="startDate" className="form-label">
                      Start Date:
                    </label>
                    <input
                      type="date"
                      className={`form-control rounded-2 ${darkMode
                          ? "bg-light text-dark border-0"
                          : "bg-dark text-light border-0"
                        }`}
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      min={new Date().toLocaleDateString("en-CA")} // Disable past dates
                      required
                    />
                  </div>
                ) : (
                  <div className="mb-3 col-6">
                    <label htmlFor="startDate" className="form-label">
                      Start Date:
                    </label>
                    <input
                      type="date"
                      className={`form-control rounded-2 ${darkMode
                          ? "bg-light text-dark border-0"
                          : "bg-dark text-light border-0"
                        }`}
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      min={minDate}
                      required
                    />
                  </div>
                )}
                {leaveDuration === "Half Day" ? (
                  <div style={{ display: "none" }} className="mb-3 col-6">
                    <label htmlFor="endDate" className="form-label">
                      End Date:
                    </label>
                    <input
                      type="date"
                      className={`form-control rounded-2 ${darkMode
                          ? "bg-light text-dark border-0"
                          : "bg-dark text-light border-0"
                        }`}
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={differenceCalculator}
                      disabled={leaveDuration === "Half Day"}
                      required={leaveDuration === "Full Day"}
                      min={minDate}
                    />
                  </div>
                ) : (
                  <div className="mb-3 col-6">
                    <label htmlFor="endDate" className="form-label">
                      End Date:
                    </label>
                    <input
                      type="date"
                      className={`form-control rounded-2 ${darkMode
                          ? "bg-light text-dark border-0"
                          : "bg-dark text-light border-0"
                        }`}
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={differenceCalculator}
                      disabled={leaveDuration === "Half Day"}
                      required={leaveDuration === "Full Day"}
                      min={minDate}
                    />
                  </div>
                )}
                <div className="mb-3 col-12 col-md-6">
                  <label htmlFor="manager" className="form-label">
                    Reporting Manager:
                  </label>
                  <input
                    className={`form-control rounded-2 ${darkMode
                        ? "bg-light text-dark border-0"
                        : "bg-dark text-light border-0"
                      }`}
                    id="manager"
                    name="manager"
                    value={empData.reportManager}
                    disabled
                    placeholder={empData.reportManager}
                  />
                </div>
                <div className="mb-3 col-12 col-md-6">
                  <label htmlFor="hr" className="form-label">
                    Reporting HR:
                  </label>
                  <input
                    className={`form-control rounded-2 ${darkMode
                        ? "bg-light text-dark border-0"
                        : "bg-dark text-light border-0"
                      }`}
                    id="hr"
                    name="hr"
                    value={empData.reportHr}
                    disabled
                    placeholder={empData.reportHr}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="additionalManager" className="form-label">
                    Additional Manager:
                  </label>
                  <select
                    className={`form-select rounded-2 ${darkMode
                        ? "bg-light text-dark border dark-placeholder"
                        : "bg-dark text-light border-0 light-placeholder"
                      }`}
                    id="additionalManager"
                    name="additionalManager"
                    value={addManager}
                    onChange={(e) => setAddManager(e.target.value)}
                  >
                    <option value="" disabled selected>
                      -- Select Additional Manager --
                    </option>
                    {additionalManagerList.map((val) => (
                      <option key={val.Email} value={val.Email}>
                        {val.Email}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ position: "relative" }} className="mb-3">
                  <label htmlFor="reason" className="form-label">
                    Reason:
                  </label>
                  <textarea
                    className={`form-control rounded-2 ${darkMode
                        ? "bg-light text-dark border dark-placeholder"
                        : "bg-dark text-light border-0 light-placeholder"
                      }`}
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleFormChange}
                    maxLength={maxLength}
                    required
                    placeholder="Please mention the reason for leave"
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: ".2rem",
                      right: "2rem",
                    }}
                  >
                    {maxLength - reasionLength === 100
                      ? "100 characters"
                      : `${maxLength - reasionLength} characters left`}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  <button
                    type="reset"
                    className="btn btn-danger"
                    onClick={props.onFormClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default LeaveApplicationEmpForm;
