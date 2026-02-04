import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import BASE_URL from "./config/config";
import toast from "react-hot-toast";
import TittleHeader from "./TittleHeader/TittleHeader";
import { useSelector } from "react-redux";
import { useTheme } from "../Context/TheamContext/ThemeContext";
import api from "./config/api";

const AttendanceUpdateBreakForm = () => {
  const { userData } = useSelector((state) => state.user);
  // const email = userData?.Email;

    const email = useSelector((state) => state.login?.user?.Email);
  const [attendanceData, setAttendanceData] = useState({
    updatedBy: email,
    date: new Date().toISOString().split("T")[0],
    Email: "",
    breakTime: "",
    resumeTime: "",
    totalBrake: "",
  });
  const [empData, setEmpData] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [breakResumeList, setBreakResumeList] = useState([]);
  const [allBreakData, setAllBreakData] = useState([]);
  const { darkMode } = useTheme();


  useEffect(() => {
    api
      .post(
        `/api/EmployeeAllForAdmin`,
        { email },
      )
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEmpData(response.data);
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  // Fetch existing break/resume for selected employee and date
  useEffect(() => {
    const fetchBreaks = async () => {
      const empEmail = attendanceData.Email;
      const date = attendanceData.date;
      if (!empEmail || !date) return;
      try {
        const res = await api.post(`/api/attendance/break-info-by-email`, { email: empEmail, date });
        if (res && res.data) {
          const { attendanceId, breakTime, resumeTime, totalBrake, breakData } = res.data;
          // set attendanceId so updateBreak can use it
          if (attendanceId) {
            setAttendanceData((prev) => ({ ...prev, attendanceId }));
          }
          // Build list of all break/resume pairs with computed durations
          const breaks = Array.isArray(breakTime) ? breakTime : [];
          const resumes = Array.isArray(resumeTime) ? resumeTime : [];
          const bData = Array.isArray(breakData) ? breakData : [];

          const fmt = (t) => (t && typeof t === "string" && t.includes(":") ? t.split(":").slice(0,2).join(":") : t || "");

          const list = [];
          for (let i = 0; i < Math.max(breaks.length, resumes.length); i++) {
            list.push({
              index: i,
              breakTime: fmt(breaks[i] || ""),
              resumeTime: fmt(resumes[i] || ""),
              duration: (bData[i] || 0),
            });
          }
          setBreakResumeList(list);
          setAllBreakData(bData || []);

          // Populate form with last entry (for quick add/edit)
          const lastBreak = fmt(breaks.length ? breaks[breaks.length - 1] : "");
          const lastResume = fmt(resumes.length ? resumes[resumes.length - 1] : "");
          setAttendanceData((prev) => ({
            ...prev,
            breakTime: lastBreak,
            resumeTime: lastResume,
            totalBrake: totalBrake || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching break info by email:", err);
        setBreakResumeList([]);
        setAllBreakData([]);
      }
    };

    fetchBreaks();
  }, [attendanceData.Email, attendanceData.date]);

  useEffect(() => {
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 40);

    const formatDate = (date) => {
      const d = new Date(date);
      const month = "" + (d.getMonth() + 1);
      const day = "" + d.getDate();
      const year = d.getFullYear();

      return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
    };

    setMinDate(formatDate(twoDaysAgo));
    setMaxDate(formatDate(today));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendanceData({
      ...attendanceData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post(`/api/attendance/update-break`, attendanceData, {
      })
      .then((response) => {
        setAttendanceData({
          updatedBy: email,
          date: "",
          Email: "",
          breakTime: "",
          resumeTime: "",
          totalBrake: "",
        });
        toast.success("Break/Resume/Total Break updated successfully");
      })
      .catch((error) => {
        toast.error("Error updating break/resume/total break");
        console.error("Error updating break/resume/total break:", error);
      });
  };

  return (
    <div className="container-fluid mt-4">
      <div className="">
        <div className="card-header mb-3">
          <TittleHeader
            title={"Update Break/Resume/Total Break4444"}
            message={"You can update user break/resume/total break here."}
          />
        </div>
        <div className={`card-body ${darkMode ? "text-dark" : "text-light"}`}>
          <form className={"row row-gap-3"} onSubmit={handleSubmit}>
            <div className="col-12 col-md-6">
              <label htmlFor="Email" className="form-label">
                Select Email:
              </label>
              <select
                id="Email"
                name="Email"
                className={`form-select ms-0 ms-md-auto rounded-2 ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                  }`}
                value={attendanceData.Email}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select an email
                </option>
                {empData.map((emp) => {
                  const firstName = emp?.FirstName?.charAt(0).toUpperCase() + emp?.FirstName?.slice(1).toLowerCase();
                  const lastName = emp?.LastName?.charAt(0).toUpperCase() + emp?.LastName?.slice(1).toLowerCase();
                  const email = emp?.Email?.toLowerCase();

                  return (
                    <option key={email} value={email}>
                      {firstName} {lastName} - {email}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="date" className="form-label">
                Date:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                  }`}
                value={attendanceData.date}
                onChange={handleChange}
                min={minDate}
                max={maxDate}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="breakTime" className="form-label">
                Break Time:
              </label>
              <input
                type="time"
                id="breakTime"
                name="breakTime"
                className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                  }`}
                value={attendanceData.breakTime}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="resumeTime" className="form-label">
                Resume Time:
              </label>
              <input
                type="time"
                id="resumeTime"
                name="resumeTime"
                className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                  }`}
                value={attendanceData.resumeTime}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="totalBrake" className="form-label">
                Total Break (minutes):
              </label>
              <input
                type="number"
                id="totalBrake"
                name="totalBrake"
                className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                  }`}
                value={attendanceData.totalBrake}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary  ">
                Update Break/Resume/Total Break
              </button>
            </div>
          </form>

          {/* Display all break/resume entries */}
          {breakResumeList.length > 0 && (
            <div className="mt-5">
              <h5 className={darkMode ? "text-dark" : "text-light"}>
                Break/Resume History
              </h5>
              <div className="table-responsive">
                <table
                  className={`table table-sm ${
                    darkMode
                      ? "table-light"
                      : "table-dark"
                  }`}
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Break Time</th>
                      <th>Resume Time</th>
                      <th>Duration (min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakResumeList.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.index + 1}</td>
                        <td>{item.breakTime || "-"}</td>
                        <td>{item.resumeTime || "-"}</td>
                        <td>{item.duration > 0 ? item.duration : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total break summary */}
              {allBreakData.length > 0 && (
                <div className="alert alert-info mt-3">
                  <strong>Total Break Time:</strong>{" "}
                  {allBreakData.reduce((sum, d) => sum + (d || 0), 0)} minutes
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceUpdateBreakForm;
