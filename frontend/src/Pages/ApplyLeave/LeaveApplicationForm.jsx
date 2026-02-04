import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./LeaveApplicationEmpForm.css";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { MdCancel } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../config/api";

const LeaveApplicationEmpForm = (props) => {
  const { userData } = useSelector((state) => state.user);

  const id = userData?._id;
  const [empData, setEmpData] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);

  const { darkMode } = useTheme();
  const email = userData?.Email;
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });
  const [leaveType, setLeaveType] = useState("");
  const [leaveCount, setLeaveCount] = useState(
    "Please choose a leave type first."
  );
  const loadEmployeeData = () => {
    api
      .get(`/api/particularEmployee/${id}`, {
      })
      .then((response) => {
        setEmpData(response.data);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    loadEmployeeData();
  }, []);
  useEffect(() => {
    api
      .post(
        `/api/particularLeave`,
        {
          email,
        },
      )
      .then((response) => {
        setLeaveBalance(response.data);
      })
      .catch((error) => {});
  }, []);
  const handleInputChange = (e) => {
    setLeaveCount(leaveBalance[0][e.target.value]);
    setLeaveType(e.target.value);
  };
  function dateDifference(date1, date2) {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    if (secondDate < firstDate) {
      alert("please select proper date");
      return;
    }
    const differenceInTime = secondDate.getTime() - firstDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.abs(differenceInDays);
  }

  const differenceCalculator = (e) => {
    let requiredLeave = dateDifference(formData.startDate, e.target.value);

    if (requiredLeave === undefined) return;
    if (leaveCount < requiredLeave + 1) {
      alert("leave balance is low");
      return;
    }
    setFormData((prev) => ({ ...prev, endDate: e.target.value }));
  };

  const deductLeave = () => {
    let requiredLeave = dateDifference(formData.startDate, formData.endDate);
    if (requiredLeave === undefined) return;
    if (leaveCount < requiredLeave + 1) {
      toast.info("leave balance is low");
      return;
    }
    const totalLeaveRequired = requiredLeave + 1;
    api
      .post(
        `/api/deductLeave`,
        {
          email,
          leaveType,
          totalLeaveRequired,
        },
      )
      .then((response) => {
        toast.success("leave applied successfully");
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
    >
      {leaveBalance === null ? (
        <>
          <h1>No leave found</h1>
        </>
      ) : (
        <div style={{ overflow: "auto" }} className="row">
          <div>
            <form
              className="px-3 py-4 rounded row"
              onSubmit={props.onLeaveApplicationEmpSubmit}
            >
              <div>
                <h5
                  style={{
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--secondaryDashMenuColor)",
                    fontWeight: "600",
                  }}
                  className=" m-0"
                >
                  Create Leave Request
                </h5>
                <p
                  style={{
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--secondaryDashMenuColor)",
                  }}
                  className=" m-0"
                >
                  Fill the form and submit to mark your leave.
                </p>
              </div>
              <h5 style={{ fontWeight: "500" }} className="fw-bolder mb-5"></h5>

              <div className="d-flex align-items-center gap-3">
                <div className="mb-3 w-50">
                  <label htmlFor="leaveType" className="form-label">
                    Select Leave Type
                  </label>
                  <select
                    className="form-select"
                    id="leaveType"
                    name="leaveType"
                    value={leaveType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled selected>
                      -- Select --
                    </option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Paid Leave">Paid Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                  </select>
                </div>
                <div className="mb-3 w-50">
                  <label htmlFor="leaveType" className="form-label">
                    Available {leaveType}
                  </label>
                  <select
                    className="form-control text-muted"
                    id="leaveStatus"
                    name="leaveStatus"
                  >
                    <option value="1" selected>
                      {leaveCount}
                    </option>
                  </select>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="mb-3 w-50">
                  <label htmlFor="startDate" className="form-label">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="mb-3 w-50">
                  <label htmlFor="endDate" className="form-label">
                    End Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={differenceCalculator}
                    required
                  />
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="mb-3 w-50">
                  <label htmlFor="manager" className="form-label">
                    Reporting Manager:
                  </label>
                  <input
                    className="form-control"
                    id="manager"
                    name="manager"
                    value={empData.reportManager}
                    // onChange={handleInputChange}
                    required
                    disabled
                    placeholder={empData.reportManager}
                  />
                </div>

                <div className="mb-3 w-50">
                  <label htmlFor="hr" className="form-label">
                    Reporting Hr:
                  </label>
                  <input
                    className="form-control"
                    id="hr"
                    name="hr"
                    value={empData.reportHr}
                    // onChange={handleInputChange}
                    required
                    disabled
                    placeholder={empData.reportHr}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="reason" className="form-label">
                  Reason:
                </label>
                <textarea
                  className="form-control"
                  id="reason"
                  name="reason"
                  rows={3}
                  // value={formData.reason}
                  // onChange={handleInputChange}
                  required
                  placeholder="Please mention the reason for leave"
                />
              </div>

              <div className="d-flex mt-3 mx-1 gap-4">
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={deductLeave}
                >
                  <IoCheckmarkDoneCircle /> Submit
                </button>
                <button
                  type="reset"
                  className="btn btn-danger d-flex align-items-center gap-2"
                  onClick={props.onFormClose}
                >
                  <MdCancel /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApplicationEmpForm;
