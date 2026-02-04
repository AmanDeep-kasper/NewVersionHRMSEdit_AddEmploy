import React, { useEffect, useState } from "react";
import "../DashboardHR.css";
import { Link } from "react-router-dom";
// import AdminEmployeeTable from "../../../Pages/AddEmployee/EmployeeTable";
// import LeaveApplicationHRTable from "../LeaveApplicationHRTable";
// import PositionTable from "../../../Pages/Department/PositionTable";
// import RoleTable from "../../../Pages/Department/RoleTable";
// import EmpCharts from "../../Pages/Charts/EmpCharts";
// import HrCharts from "../../../Pages/Chart/TaskChart";
// import HolidayList from "../../../Pages/LeaveCalendar/HolidayList";
// import ManagerCompletedTask from "../ManagerTaskManagement/ManagerCompletedTask";
// import UpcomingBirthdays from "../../../Pages/AddEmployee/UpcomingBirthdays";

// import Chart from "react-apexcharts";

import { IoIosArrowDroprightCircle } from "react-icons/io";
// import Login from "../../../Pages/Login/Login";
// import axios from "axios";

const HRDash = (props) => {
  const [totalEmployees, setTotalEmployees] = useState(0);

  // levecount

  // leave count

  const updateTotalEmployees = (totalEmployees) => {
    setTotalEmployees(totalEmployees);
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row row-gap-4">
          <div className="col-md-3">
            <div
              style={{ backgroundColor: "#FED2AA" }}
              className=" DashboardCard position-relative"
            >
              <div className=" d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total Employees
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {totalEmployees}
                  </span>
                </p>
                <Link
                  className="text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-2  aline-items-center fw-bold text-info  aline-center"
                  to="/hr/employee"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div
              style={{ backgroundColor: "#DFFFD8" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total Leave Applications{" "}
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    { }
                  </span>
                </p>
                <Link
                  className="text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-2  aline-items-center fw-bold text-info  aline-center"
                  to="/hr/leave-application-hr"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* <div className="row row-gap-4"></div> */}
          <div className="col-md-3">
            <div
              style={{ backgroundColor: "#FEBBCC" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  On Accept Leave
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    { }
                  </span>
                </p>
                <Link
                  className="text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-2  aline-items-center fw-bold text-info  aline-center"
                  to="/hr/position"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div
              style={{ backgroundColor: "#BCCEF8" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total Role
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    { }
                  </span>
                </p>
                <Link
                  className="text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-2  aline-items-center fw-bold text-info  aline-center"
                  to="/hr/role"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-9"></div>
        </div>
      </div>
    </div>
  );
};

export default HRDash;
