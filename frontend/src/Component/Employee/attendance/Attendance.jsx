import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import InnerDashContainer from "../../InnerDashContainer";
import Moment from "moment";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import toast from "react-hot-toast";
import AttendanceDetails from "./AttendanceList";
import { RiLoginCircleFill, RiLogoutCircleFill } from "react-icons/ri";
import { MdCoffee, MdMouse } from "react-icons/md";
import api from "../../../Pages/config/api";

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
  }, []);

  useEffect(() => {
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
      `/api/attendance/${employeeID}`,
    );

    const attendance = response.data && (response.data.attendance || response.data);
    const lastDate = attendance?.years?.[attendance.years?.length - 1]?.months?.slice(-1)[0]?.dates?.slice(-1)[0];
    setMessage(lastDate ? `Status: ${lastDate.status}` : "");
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
          </div>
        </div>
      </div>
      <AttendanceDetails />
    </div>
  );
};

export default SetLog;
