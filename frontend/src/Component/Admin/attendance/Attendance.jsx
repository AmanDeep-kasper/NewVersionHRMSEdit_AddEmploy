import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import Moment from "moment";
import BASE_URL from "../../../Pages/config/config";
import api from "../../../Pages/config/api"; // 👈 import api here
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import toast from "react-hot-toast";
import { MdCoffee, MdMouse } from "react-icons/md";

const SetLog = (props) => {
  const [empName, setEmpName] = useState(null);
  const { darkMode } = useTheme();
  const {
    employees,
    setEmployees,
    selectedEmployee,
    setSelectedEmployee,
    attencenceID,
    setAttencenceID,
    message,
    setMessage,
  } = useContext(AttendanceContext);

  useEffect(() => {
    fetchEmployees();
        loadPersonalInfoData();

  }, []);

 

  const fetchEmployees = async () => {
    try {
      const response = await api.get(
        `/api/employee/${props.data["_id"]}`,
       
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const loadPersonalInfoData = async () => {
    try {
      const response = await api.get(
        `/api/personal-info/${props.data["_id"]}`,
       
      );
      setEmpName(response.data.FirstName);
    } catch (error) {
      console.error("Error fetching personal info:", error);
    }
  };

  const handleUserChange = (employeeID) => {
    const selectedEmployee = employees.find(
      (employee) => employee._id === employeeID
    );
    if (selectedEmployee) {
      setAttencenceID(selectedEmployee.attendanceObjID);
      setSelectedEmployee(employeeID);
      fetchMessage(employeeID);
    }
  };

  const fetchMessage = async (employeeID) => {
  try {
    const response = await api.get(
      `/api/attendances/${employeeID}`,
    );

    // Response is now a single object
    const attendanceData = response.data;
    if (attendanceData && attendanceData.years && attendanceData.years.length > 0) {
      const lastYear = attendanceData.years[attendanceData.years.length - 1];
      const lastMonth = lastYear.months[lastYear.months.length - 1];
      const lastDate = lastMonth.dates[lastMonth.dates.length - 1];
      setMessage(lastDate ? `Status: ${lastDate.status}` : "");
    }
  } catch (error) {
    console.error("Error fetching attendance data:", error);
  }
};

 const handleAttendanceAction = async (actionType, statusType) => {
  const employeeData = employees.find((val) => val.FirstName === empName);
  if (!employeeData) {
    setMessage("Please select a user");
    return;
  }

  const { attendanceObjID, _id } = employeeData;
  const currentTime = Moment().format("HH:mm:ss");

  try {
    await api.post(
      `/api/attendance/${attendanceObjID}`,
      {
        employeeId: _id,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        [actionType]: [currentTime],
        status: statusType,
      },
    );

    setMessage(`${statusType} time recorded successfully`);
    toast.success(`${statusType} time recorded successfully`);
  } catch (error) {
    setMessage(`Error recording ${statusType} time`);
    toast.error(`Error recording ${statusType} time`);
    console.error(`Error recording ${statusType} time:`, error);
  }
};


  const handleLogin = () => handleAttendanceAction("loginTime", "login");
  const handleLogout = () => handleAttendanceAction("logoutTime", "logout");
  const handleResume = () => handleAttendanceAction("resumeTime", "resume");
  const handleBreak = () => handleAttendanceAction("breakTime", "break");

  const handleCheckEarly = async () => {
    if (!selectedEmployee) {
      toast.error("Select an employee first");
      return;
    }
    try {
      const res = await api.get(`/api/attendance/check-early/${selectedEmployee}`);
      if (res && res.data) {
        if (res.data.ok && res.data.notified) {
          toast.success(`Early login detected — employee notified (${res.data.minutesBefore} min before)`);
        } else if (res.data.ok && !res.data.notified) {
          toast(`No early login detected`);
        } else {
          toast.error(res.data.message || "Check failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error checking early login");
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between py-2">
        <div className="d-flex justify-content-between align-items-center p-3 px-2">
          <h5
            style={{
              color: darkMode
                ? "var(--primaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
            className="fw-bold my-auto"
          >
            Attendance System
          </h5>
        </div>
        <div className="d-flex gap-3 px-2" style={{ height: "fit-content" }}>
          <div className="d-flex gap-3">
            <button
              title="Break"
              className="btn btn-warning d-flex align-items-center gap-2"
              onClick={handleBreak}
            >
              <MdCoffee /> <span className="d-none d-md-flex">Break</span>
            </button>
            <button
              title="Resume"
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handleResume}
            >
              <MdMouse /> <span className="d-none d-md-flex">Resume</span>
            </button>
            <button
              title="Check Early Login"
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={handleCheckEarly}
            >
              Check Early
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetLog;
