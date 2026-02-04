import React, { useEffect, useContext } from "react";
import axios from "axios";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../Pages/config/config";
import Moment from "moment";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api";

function ManualAttendance() {
  const { darkMode } = useTheme();
  const { userData} = useSelector((state)=> state.user);
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

  const userType = userData?.Account;
  const reportingHr = userData?.Email;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/api/employee`, {
         
        });

        if (userType === "1") {
          setEmployees(response.data);
        } else {
          const filteredEmployees = response.data.filter(
            (item) => item.Account === 3 || item.reportHr === reportingHr
          );
          setEmployees(filteredEmployees);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchUsers();
  }, []);



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
    const yearArr = attendance?.years;
    const lastYear = yearArr?.[yearArr.length - 1];
    const lastMonth = lastYear?.months?.[lastYear.months.length - 1];
    const lastDay = lastMonth?.dates?.[lastMonth.dates.length - 1];
    const status = lastDay?.status;

    if (status) {
      setMessage(`Status: ${status}`);
    } else {
      setMessage("");
    }
  } catch (error) {
    console.error("Error fetching attendance data:", error);
  }
};

const handleLogin = async () => {
  try {
    if (!selectedEmployee) {
      setMessage("Please select an employee");
      return;
    }
    const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
    const currentTime = Moment().format("HH:mm:ss");

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        loginTime: [currentTime],
        loginTimeMs: [currentTimeMs],
        status: "login",
      },
    );

    alert("Login time recorded successfully");
  } catch (error) {
    console.error("Error recording login time:", error);
    alert("Error recording login time");
  }
};

const handleLogout = async () => {
  try {
    if (!selectedEmployee) {
      setMessage("Please select an employee");
      return;
    }

    const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
    const currentTime = Moment().format("HH:mm:ss");

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        logoutTime: [currentTime],
        logoutTimeMs: [currentTimeMs],
        status: "Logout",
      },
    );

    setMessage("Logout time recorded successfully");
  } catch (error) {
    console.error("Error recording logout time:", error);
    setMessage("Error recording logout time");
  }
};

const handleResume = async () => {
  try {
    if (!selectedEmployee) {
      setMessage("Please select an employee");
      return;
    }

    const currentTime = Moment().format("HH:mm:ss");
    const currentTimeMs = Math.round(new Date().getTime());

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        ResumeTime: [currentTime],
        resumeTimeMS: [currentTimeMs],
        status: "Login",
      },
    );

    setMessage("Resumed time recorded successfully");
  } catch (error) {
    console.error("Error recording resume time:", error);
    setMessage("Error recording resume time");
  }
};

const handleBreak = async () => {
  try {
    if (!selectedEmployee) {
      setMessage("Please select an employee");
      return;
    }

    const currentTime = Moment().format("HH:mm:ss");
    const currentTimeMs = Math.round(new Date().getTime());

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        breakTime: [currentTime],
        breakTimeMs: [currentTimeMs],
        status: "Break",
      },
    );

    setMessage("Break time recorded successfully");
  } catch (error) {
    console.error("Error recording break time:", error);
    setMessage("Error recording break time");
  }
};


  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-2"
    >
      <TittleHeader
        title={"Employee Manual Attendance"}
        message={
          "You can create manual attendance of employee in case of technical issue."
        }
      />
      <div className="my-3 d-flex flex-column gap-3">
        <select
          className="form-select text-capitalize rounded-0"
          onChange={(e) => handleUserChange(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.empID} {employee.FirstName} {employee.LastName}
            </option>
          ))}
        </select>
        <div className="d-flex gap-3">
          <button className="btn btn-success" onClick={handleLogin}>
            Login
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
          <div className="d-flex gap-3">
            <button className="btn btn-warning" onClick={handleBreak}>
              Break
            </button>
            <button className="btn btn-primary" onClick={handleResume}>
              Resume
            </button>
          </div>
        </div>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ManualAttendance;
