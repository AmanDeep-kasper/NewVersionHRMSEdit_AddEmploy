import axios from "axios";
import React, { useState, useEffect } from "react";
import { GiPartyPopper } from "react-icons/gi";
import HappyBirthday from "./HappyBirthday.svg";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { getFormattedDate } from "../../Utils/GetDayFormatted";
import api from "../config/api";

const UpcomingBirthdays = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const { darkMode } = useTheme();

  const loadEmployeeData = () => {
    api
      .get(`/api/employee`, {
      })
      .then((response) => {
        // Ensure that response.data is an array
        if (Array.isArray(response.data)) {
          setEmployeeData(response.data);
          setLoading(false);

          // Clear the state arrays
          setRowData([]);

          response.data.forEach((data) => {
            let temp = {
              data,
              Email: data["Email"],
              Password: data["Password"],
              Account:
                data["Account"] === 1
                  ? "Admin"
                  : data["Account"] === 2
                  ? "HR"
                  : data["Account"] === 3
                  ? "Employee"
                  : "",
              RoleName: data["role"][0] ? data["role"][0]["RoleName"] : "",
              FirstName: data["FirstName"],
              MiddleName: data["MiddleName"],
              LastName: data["LastName"],
              DOB: data["DOB"].slice(0, 10),
              ContactNo: data["ContactNo"],
              EmployeeCode: data["EmployeeCode"],
              empID: data["empID"],
              DepartmentName: data["department"][0]
                ? data["department"][0]["DepartmentName"]
                : "",
              PositionName: data["position"][0]
                ? data["position"][0]["PositionName"]
                : "",
              DateOfJoining: data["DateOfJoining"].slice(0, 10),
            };
            // Use set function to update state
            setRowData((prevData) => [...prevData, temp]);
          });
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
          
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const calculateUpcomingBirthdays = () => {
    const today = new Date();
    const upcomingBirthdaysData = rowData.filter((employee) => {
      const dob = new Date(employee.DOB);
      dob.setFullYear(today.getFullYear());

      // Check if the upcoming birthday is within the next 7 days
      const timeDiff = dob - today;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 7;
    });

    setUpcomingBirthdays(upcomingBirthdaysData);
  };

  useEffect(() => {
    calculateUpcomingBirthdays();
  }, [rowData]);

  return (
    <div className="border">
      <div
        style={{
          backgroundColor: darkMode
            ? "var(--primaryDashMenuColor)"
            : "var(--primaryDashColorDark)",
        }}
        className="shadow position-relative"
      >
        <span
          style={{
            position: "sticky",
            top: "0",
            backgroundColor: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
            color: darkMode
              ? "var(--primaryDashMenuColor)"
              : "var(--primaryDashColorDark)",
          }}
          className="p-2 p-1 px-3 d-flex justify-content-between gap-0 text-center"
        >
          Upcoming Birthdays
          <span>({upcomingBirthdays.length})</span>
        </span>
        <div>
          {upcomingBirthdays.length > 0 ? (
            <div className="d-flex flex-column gap-3 py-3 px-3">
              {upcomingBirthdays.map((employee) => (
                <div className="" key={employee.empID}>
                  <div className="row" style={{ verticalAlign: "middle" }}>
                    <div className="d-flex justify-content-between ">
                      <div className="d-flex gap-2">
                        <div style={{ height: "45px", width: "45px" }}>
                          <img
                            style={{
                              height: "100%",
                              width: "100%",
                              border: "3px solid gray",
                              borderRadius: "50%",
                              overflow: "hidden",
                              objectFit: "cover",
                            }}
                            src={
                              employee?.data?.profile?.image_url
                                ? employee?.data?.profile?.image_url
                                : "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                            }
                            alt=""
                          />
                        </div>
                        <div
                          style={{
                            color: darkMode
                              ? "var(--primaryDashColorDark)"
                              : "var(--primaryDashMenuColor)",
                          }}
                          className="d-flex flex-column my-auto"
                        >
                          <span>{employee.empID}</span>
                          <span className="text-capitalize">{`${employee.FirstName} ${employee.LastName}`}</span>
                        </div>
                      </div>

                      <div
                        style={{
                          color: darkMode
                            ? "var(--primaryDashColorDark)"
                            : "var(--primaryDashMenuColor)",
                        }}
                        className="my-auto"
                      >
                        Date <br />
                        {getFormattedDate(employee.DOB)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="d-flex flex-column justify-content-center aline-items-center gap-3"
              style={{ height: "100%", width: "100%" }}
            >
              <img
                style={{
                  height: 70,
                  opacity: !darkMode ? 0.75 : 0.6,
                  filter: !darkMode ? "brightness(0.9)" : "none",
                }}
                className="mx-auto"
                src={HappyBirthday}
                alt="Happy Birthday"
              />
              <p
                style={{
                  opacity: "60%",
                  fontSize: "13px",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                }}
                className="text-center w-75 mx-auto "
              >
                No upcoming birthdays in the next 7 days.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingBirthdays;
