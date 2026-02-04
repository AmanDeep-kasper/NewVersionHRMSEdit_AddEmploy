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
// import TodayLoginTime from "../../../Pages/GetDailyData/GetDailyData";

function SetLog(props) {
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
    const fetchUsers = async () => {
      try {
        const response = await api.get(
          `/api/employee/` + props.data["_id"],
        );

          
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchUsers();
  }, []);
  // hello

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await api.get(
          `/api/personal-info/` + props.data["_id"],
        );
          
        setEmpName(response.data.FirstName);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadPersonalInfoData();
  }, []);

  // hello
  const handleUserChange = (employeeID) => {
    const selectedEmployee = employees.find(
      (employee) => employee._id === employeeID
    );

    if (selectedEmployee) {
      setAttencenceID(selectedEmployee.attendanceObjID);
      setSelectedEmployee(employeeID);
      getMessage(employeeID);
    }
  };

  const getMessage = async (employeeID) => {
  try {
    const response = await api.get(
      `/api/attendance/${employeeID}`,
    );
    const attendance = response.data && (response.data.attendance || response.data);
    const lastDate = attendance?.years?.[attendance.years?.length - 1]?.months?.slice(-1)[0]?.dates?.slice(-1)[0];

    if (lastDate) {
      setMessage(`Status: ${lastDate.status}`);
    } else {
      setMessage("");
    }
  } catch (error) {
    console.error("Error fetching attendance data:", error);
  }
};


 const handleLogin = async () => {
  let data = employees.filter((val) => {
    return val.FirstName === empName;
  });

  if (!empName) {
    setMessage("Please select a user");
    return;
  }

  if (data.length === 0) {
    setMessage("Employee not found");
    return;
  }

  let attencenceID = data[0].attendanceObjID;
  let selectedEmployee = data[0]._id;

  try {
    const currentTime = Moment().format("HH:mm:ss");

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        loginTime: [currentTime],
        status: "login",
      },
    );

    setMessage("Login time recorded successfully");
    toast.success("Login time recorded successfully");
  } catch (error) {
    setMessage("Error recording login time");
    toast.error("Error recording login time");
  }
};


  const handleLogout = async () => {
  let data = employees.filter((val) => {
    return val.FirstName === empName;
  });

  if (!empName) {
    setMessage("Please select an employee");
    return;
  }

  if (data.length === 0) {
    setMessage("Employee not found");
    return;
  }

  let attencenceID = data[0].attendanceObjID;
  let selectedEmployee = data[0]._id;

  try {
    const currentTime = Moment().format("HH:mm:ss");

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        logoutTime: [currentTime],
        status: "logout",
      },
    );

    setMessage("Logout time recorded successfully");
    toast.success("Logout time recorded successfully");
  } catch (error) {
    setMessage("Error recording logout time");
    toast.error("Error recording logout time");
  }
};


  const handleResume = async () => {
  let data = employees.filter((val) => {
    return val.FirstName === empName;
  });

  if (!empName) {
    setMessage("Please select an employee");
    return;
  }

  if (data.length === 0) {
    setMessage("Employee not found");
    return;
  }

  let attencenceID = data[0].attendanceObjID;
  let selectedEmployee = data[0]._id;

  try {
    const currentTime = new Date().toLocaleTimeString();
    const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        ResumeTime: [currentTime],
        resumeTimeMS: [currentTimeMs],
        status: "resume",
      },
      
    );

    setMessage("Resumed time recorded successfully");
    toast.success("Resumed time recorded successfully");
  } catch (error) {
    console.error("Error recording resume time:", error);
    setMessage("Error recording resume time");
    toast.error("Error recording resume time");
  }
};


  const handleBreak = async () => {
  let data = employees.filter((val) => {
    return val.FirstName === empName;
  });

  if (!empName) {
    setMessage("Please select an employee");
    return;
  }

  if (data.length === 0) {
    setMessage("Employee not found");
    return;
  }

  let attencenceID = data[0].attendanceObjID;
  let selectedEmployee = data[0]._id;

  try {
    const currentTime = new Date().toLocaleTimeString();
    const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        breakTime: [currentTime],
        breakTimeMs: [currentTimeMs],
        status: "break",
      },
    );

    setMessage("Break time recorded successfully");
    toast.success("Break time recorded successfully");
  } catch (error) {
    setMessage("Error recording break time");
    toast.error("Error recording break time", error);
  }
};


  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between py-2">
        <div className="d-flex justify-content-between aline-items-center p-3 px-2">
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
        <div className="d-flex  gap-3 px-2" style={{ height: "fit-content" }}>
          <div className="d-flex gap-3">
            {/* <button
              title="Login"
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={handleLogin}
            >
              <RiLoginCircleFill />{" "}
              <span className="d-none d-md-flex">Login</span>
            </button>
            <button
              className="btn btn-danger d-flex align-items-center gap-2"
              title="Logout"
              onClick={handleLogout}
            >
              <RiLogoutCircleFill />{" "}
              <span className="d-none d-md-flex">Logout</span>
            </button> */}
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
      </div>

      {/* {message && <p>{message}</p>} */}

      <AttendanceDetails />
    </div>
  );
}

export default SetLog;
