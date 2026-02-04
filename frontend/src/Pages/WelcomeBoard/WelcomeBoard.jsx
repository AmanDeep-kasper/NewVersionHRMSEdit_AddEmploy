import React, { useEffect, useState } from "react";
import "./WelcomeBoard.css";
import axios from "axios";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import TakeBreakLogs from "../Attendance/TakeBreakLogs";
import { useSelector } from "react-redux";
import api from "../config/api";
// import HrAttendance from "../../Component/HrManager/attendance/AttendanceSample";

const WelcomeBoard = ({ height = "220px" }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const { darkMode } = useTheme();
  const { userData} = useSelector((state)=> state.user);
  const id = userData?._id;

  const loadEmployeeData = () => {
    api
      .get(`/api/particularEmployee/${id}`, {
      })
      .then((response) => {
        setEmployeeData(response.data);
      })
      .catch((error) => {
          
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  return (
    <div
      style={{
        height: height,
        width: "100%",
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="d-flex align-items-center shadow rounded-0 m-0 justify-content-center p-2"
    >
      {employeeData && (
        <div className="d-flex gap-3 flex-column align-items-center">
          <h5 className="my-0 p-0 gap-1 d-flex flex-column align-items-center">
            <span className="m-0">Welcome Back 👋</span>
            <span className="text-capitalize">
              {employeeData.FirstName} {employeeData.LastName}
            </span>
          </h5>
          <TakeBreakLogs />
        </div>
      )}
    </div>
  );
};

export default WelcomeBoard;
