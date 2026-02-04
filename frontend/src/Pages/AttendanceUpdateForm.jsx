import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import BASE_URL from "./config/config";
import toast from "react-hot-toast";
import TittleHeader from "./TittleHeader/TittleHeader";
import { useSelector } from "react-redux";
import { useTheme } from "../Context/TheamContext/ThemeContext";
import api from "./config/api";

const AttendanceUpdateForm = () => {
  const { userData } = useSelector((state) => state.user);
  // ✅ Get email from Redux (assuming it's stored in login slice)
  const email = useSelector((state) => state.login?.user?.Email);
  // const email = userData?.Email;
  const [attendanceData, setAttendanceData] = useState({
    updatedBy: email,
    date: new Date().toISOString().split("T")[0],
    loginTime: "",
    logoutTime: "",
    remark: "",
    Email: "",
  });


  const [empData, setEmpData] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const { darkMode } = useTheme();

  console.log(email)

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

  const formatTime = (time) => {
    if (!time) return "";
    return `${time}:00`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "loginTime" || name === "logoutTime") {
      formattedValue = formatTime(value);
    }

    setAttendanceData({
      ...attendanceData,
      [name]: formattedValue,
    });
  };

  const handleEmailSelect = (selectedOption) => {
    setAttendanceData({
      ...attendanceData,
      Email: selectedOption ? selectedOption.value : null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post(`/api/updateAttendance`, attendanceData, {
      })
      .then((response) => {
        setAttendanceData({
          updatedBy: email,
          date: "",
          loginTime: "",
          logoutTime: "",
          remark: "",
          Email: "", // Reset to empty string instead of null
        });
        toast.success("Login time Update successfully");
      })
      .catch((error) => {
        toast.error("Error fetching employee attendance");
        console.error("Error fetching employee data:", error);
      });
  };

  const emailOptions = empData.map((emp) => ({
    value: emp.Email,
    label: emp.Email,
  }));

  return (
    <div className="container-fluid mt-4">
      <div className="">
        <div className="card-header mb-3">
          <TittleHeader
            title={"Update Attendance"}
            message={"You can update user attendance here."}
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

            <div className="col-12 col-md-6">
              <label htmlFor="loginTime" className="form-label">
                Login Time:
              </label>
              <input
                type="time"
                id="loginTime"
                name="loginTime"
                className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                  }`}
                value={attendanceData.loginTime}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="logoutTime" className="form-label">
                Logout Time:
              </label>
              <input
                type="time"
                id="logoutTime"
                name="logoutTime"
                className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                  }`}
                value={attendanceData.logoutTime}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label htmlFor="remark" className="form-label">
                Remark:
              </label>
              <textarea
                id="remark"
                name="remark"
                className={`form-control ms-0 ms-md-auto rounded-2  ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                  }`}
                rows="3"
                value={attendanceData.remark}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary  ">
                Update Attendance
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceUpdateForm;
