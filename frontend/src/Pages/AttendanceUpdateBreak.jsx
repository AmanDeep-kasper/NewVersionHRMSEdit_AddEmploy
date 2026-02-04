import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../Pages/config/config";
import toast from "react-hot-toast";
import api from "./config/api";


const AttendanceUpdateBreak = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [attendanceId, setAttendanceId] = useState("");
  const [date, setDate] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const [resumeTime, setResumeTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [breaks, setBreaks] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [totalBrake, setTotalBrake] = useState(0);
          const [newBreak, setNewBreak] = useState("");
          const [newResume, setNewResume] = useState("");

  // Fetch employees on mount
  useEffect(() => {
    api
      .get(`/api/employee`, {
      })
      .then((res) => setEmployees(res.data))
      .catch(() => toast.error("Failed to fetch employees"));
  }, []);

  // Fetch attendanceId when employee is selected
  useEffect(() => {
    if (selectedEmployee && date) {
      api
        .get(`/api/attendance/${selectedEmployee}`)
        .then((res) => {
          setAttendanceId(res.data._id || "");
        })
        .catch(() => setAttendanceId(""));
    }
  }, [selectedEmployee, date]);

  // Fetch break/resume times for selected employee/date (GET only)
  useEffect(() => {
    if (attendanceId && date) {
      api
        .get(`/api/attendance/break-info?attendanceId=${attendanceId}&date=${date}`, {
      
        })
        .then((res) => {
          setBreaks(res.data.breakTime || []);
          setResumes(res.data.resumeTime || []);
          setTotalBrake(res.data.totalBrake || 0);
        })
        .catch(() => {
          setBreaks([]);
          setResumes([]);
          setTotalBrake(0);
        });
    } else {
      setBreaks([]);
      setResumes([]);
      setTotalBrake(0);
    }
  }, [attendanceId, date]);

  const handleUpdateBreak = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(
        `/api/attendance/update-break`,
        {
          attendanceId,
          date,
          breakTime,
          resumeTime,
        },
      );
      toast.success("Break/Resume updated successfully");
      setBreakTime("");
      setResumeTime("");
      // Refresh break/resume list
      setBreaks(res.data.breakTime || []);
      setResumes(res.data.resumeTime || []);
      setTotalBrake(res.data.totalBrake || 0);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update break/resume time"
      );
    } finally {
      setLoading(false);
    }
  };


  

  const handleUpdatePair = async (i) => {
            setLoading(true);
            try {
              const res = await api.post(
                `/api/attendance/update-break`,
                {
                  attendanceId,
                  date,
                  breakTime: breaks[i],
                  resumeTime: resumes[i],
                  breakIndex: i,
                  resumeIndex: i,
                },
              );
              toast.success("Break/Resume updated");
              setBreaks(res.data.breakTime || []);
              setResumes(res.data.resumeTime || []);
              setTotalBrake(res.data.totalBrake || 0);
            } catch (err) {
              toast.error(err.response?.data?.message || "Update failed");
            } finally {
              setLoading(false);
            }
          };
  return (
    <div>
      <h4>Update Employee Break/Resume</h4>
      <div>
        <label>Select Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.empID} - {emp.FirstName} {emp.LastName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <form onSubmit={handleUpdateBreak}>
        <div>
          <label>Break Time (HH:mm):</label>
          <input
            type="time"
            value={breakTime}
            onChange={(e) => setBreakTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Resume Time (HH:mm):</label>
          <input
            type="time"
            value={resumeTime}
            onChange={(e) => setResumeTime(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading || !attendanceId}>
          {loading ? "Updating..." : "Update Break/Resume"}
        </button>
      </form>
      <div style={{ marginTop: 20 }}>
        <h5>Break/Resume Times for Selected Date</h5>
        <ul>
          {breaks.map((b, i) => (
            <li key={i}>
              Break: {b || "--"} | Resume: {resumes[i] || "--"}
            </li>
          ))}
        </ul>
        <div>Total Break (minutes): {totalBrake}</div>
      </div>
    </div>
  );
};

export default AttendanceUpdateBreak;
