import React, { useState } from "react";
import "../DashboardHR.css";
import { Link } from "react-router-dom";
import AdminEmployeeTable from "../../../Pages/AddEmployee/EmployeeTable";
import LeaveApplicationHRTable from "../LeaveApplicationHRTable";
import PositionTable from "../../../Pages/Department/PositionTable";
import RoleTable from "../../../Pages/Department/RoleTable";
// import EmpCharts from "../../Pages/Charts/EmpCharts";
import HrCharts from "../Chart/TaskChart";
import HolidayList from "../../../Pages/LeaveCalendar/HolidayList";
import ManagerCompletedTask from "../ManagerTaskManagement/ManagerCompletedTask";
import UpcomingBirthdays from "../../../Pages/AddEmployee/UpcomingBirthdays";

import Chart from "react-apexcharts";

import { IoIosArrowDroprightCircle } from "react-icons/io";
import Login from "../../../Pages/Login/Login";
const HRDash = (props) => {
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [totalPositions, setTotalPositions] = useState(0);
  const [totalRole, setTotalRole] = useState(0);

  const updateTotalEmployees = (totalEmployees) => {
    setTotalEmployees(totalEmployees);
  };

  const updateTotalLeaves = (totalLeaves) => {
    setTotalLeaves(totalLeaves);
  };

  const updateTotalPositions = (totalPositions) => {
    setTotalPositions(totalPositions);
  };

  const updateTotalRole = (totalRole) => {
    setTotalRole(totalRole);
  };

  const updateTotalCompletedTasks = (totalCompletedTasks) => {
    setTotalCompletedTasks(totalCompletedTasks);
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
                  Total <br /> Employees
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {totalEmployees}
                  </span>
                </p>
                <Link
                  className="moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
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
                  Total <br /> Leave{" "}
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {totalLeaves}
                  </span>
                </p>
                <Link
                  className="moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
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
                  Total <br /> Position
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {totalPositions}
                  </span>
                </p>
                <Link
                  className="moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
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
                  Total <br /> Role
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {totalRole}
                  </span>
                </p>
                <Link
                  className="moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
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

          {/* <h1>Task</h1>
          <div className="col-md-3">
            <div
              style={{ backgroundColor: "#D0A2F7" }}
              className=" DashboardCard position-relative"
            >
              <div className=" d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total Complete Task
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {totalCompletedTasks}
                  </span>
                </p>
                <Link
                  className="text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-2  aline-items-center fw-bold text-info  aline-center"
                  to="/hr/taskcomplete"
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
              style={{ backgroundColor: "#FF9B9B" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total Logout
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {totalLeaves}
                  </span>
                </p>
                <Link
                  className="text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-2  aline-items-center fw-bold text-info  aline-center"
                  to="/admin/leave"
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
              style={{ backgroundColor: "#FF9B9B" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total Logout
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {totalLeaves}
                  </span>
                </p>
                <Link
                  className="text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-2  aline-items-center fw-bold text-info  aline-center"
                  to="/admin/leave"
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
              style={{ backgroundColor: "#FF9B9B" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total Logout
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {totalLeaves}
                  </span>
                </p>
                <Link
                  className="text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-2  aline-items-center fw-bold text-info  aline-center"
                  to="/admin/leave"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div> */}

          <div className="col-md-9">
            {/* Your existing code for tables */}
            <div style={{ display: "none" }}>
              <AdminEmployeeTable updateTotalEmployees={updateTotalEmployees} />
            </div>

            <div style={{ display: "none" }}>
              <LeaveApplicationHRTable updateTotalLeaves={updateTotalLeaves} />
            </div>
            <div style={{ display: "none" }}>
              <PositionTable updateTotalPositions={updateTotalPositions} />
            </div>
            <div style={{ display: "none" }}>
              <RoleTable updateTotalRole={updateTotalRole} />
            </div>
            <div style={{ display: "none" }}>
              <ManagerCompletedTask
                updateTotalCompletedTasks={updateTotalCompletedTasks}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDash;
