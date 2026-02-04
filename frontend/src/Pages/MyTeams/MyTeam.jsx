import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import { useSelector } from "react-redux";
import api from "../config/api";

const MyTeam = () => {
  const {managerMail} = useContext(AttendanceContext)
  const { userData} = useSelector((state)=> state.user);
  const email = userData?.Email;;
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  const Account =(value)=>{
    switch(value){
      case 1:{
        return "Admin"
      }
      case 2:{
        return "Hr"
      } 
      case 3:{
        return "Manager"
      } 
      default :
        return "Employee"
    }
  }

  useEffect(() => {
    api
      .post(
        `/api/employeeTeam`,
        { email:managerMail===null?email: managerMail },
      )
      .then((response) => {
        if (Array.isArray(response.data)) {
          
          setEmployeeData(response.data);
          setLoading(false);
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  return (
    <div style={{
      height: "17rem",
      overflow: "hidden",
      color: darkMode ? "black" : "white",
      background: darkMode ? "#F5F5F6" : "#161515f6", 
    }}
    className="px-3 shadow-sm rounded-2 d-flex flex-column gap-2 justify-content-between pb-3 pt-2">
       <h5 className="my-0 fw-normal  d-flex align-items-center gap-2">
          Employee Lits
        </h5>
      {!loading ? (
          <div style={{
            // maxHeight: "68vh",
            overflow: "auto",
            position: "relative",
          }}
          className="table-responsive p-2 mb-3">  
        <table className="table">
          <thead>
            <tr>
              <th style={{ verticalAlign: "middle" }}>Employee Name</th>
              <th>ID</th>
              <th>Position</th>
              <th>Account</th>
              <th>Status</th>
              <th>Email</th>
              <th>Contact No</th>
              <th>Login Status</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((employee) => (
              <tr key={employee._id}>
                <td
                  className="border-0"
                  style={{
                    verticalAlign: "middle",
                    textTransform: "capitalize",
                    background:
                      employee.status === "Inactive"
                        ? "rgba(194, 11, 11, 0.363)"
                        : darkMode
                        ? "var(--secondaryDashMenuColor)"
                        : "var(--secondaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                  }}
                >
                  <div
                    className="d-flex align-items-center"
                    style={{
                      height: "35px",
                      width: "35px",
                      borderRadius: "50%",
                      backgroundColor: "#ccc",
                      color: "white",
                      fontWeight: "bold",
                      overflow: "hidden",
                      marginRight: "10px",
                    }}
                  >
                    {employee?.data?.profile?.image_url ? (
                      <img
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        src={employee?.data?.profile?.image_url}
                        alt=""
                      />
                    ) : (
                      <span>
                        {employee?.FirstName?.charAt(0).toUpperCase() ?? ""}
                        {employee?.LastName?.charAt(0).toUpperCase() ?? ""}
                      </span>
                    )}
                  </div>
                  <span>{`${employee.FirstName} ${employee.LastName}`}</span>
                </td>
                <td>{employee.empID}</td>
                <td>{employee.position[0].PositionName}</td>
                <td>{Account(employee.Account)}</td>
                <td
                  className={
                    employee.status === "active"
                      ? "text-success border-0 text-capitalize"
                      : "text-danger border-0 text-capitalize"
                  }
                >
                  {employee.status}
                </td>
                <td>{employee.Email}</td>
                <td>{employee.ContactNo}</td>
                <td>{employee.loginStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MyTeam;
