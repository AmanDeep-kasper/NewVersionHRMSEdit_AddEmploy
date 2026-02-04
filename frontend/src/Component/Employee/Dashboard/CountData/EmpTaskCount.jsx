import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import BASE_URL from "../../../../Pages/config/config";
import { useSelector } from "react-redux";
import api from "../../../../Pages/config/api";

const EmpTaskCount = (props) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const { userData} = useSelector((state)=> state.user);

  const id = userData?._id;;

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await api.get(
          `/api/personal-info/${id}`,
        );
        setEmail(response.data.Email);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadPersonalInfoData();
  }, []);

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
      // If remaining time is negative, consider it as delay
      remainingTime = Math.abs(remainingTime);
      return { delay: true, days: 0, hours: 0, minutes: 0 };
    } else {
      // Calculate remaining days, hours, minutes, and seconds
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      return { delay: false, days, hours, minutes };
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`,{
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
      setTimeout(fetchData, 60000);
    }
  };

  useEffect(() => {
    fetchData();

    return () => clearTimeout();
  }, []);

  // Count of different task statuses for the current employee
  const acceptedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Accepted"
    )
  ).length;

  const rejectedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Rejected"
    )
  ).length;

  // const completedTasksCount = tasks.filter(
  //   (task) =>
  //     task.status === "Pending" &&
  //     task.employees.some((emp) => emp.emptaskStatus === "Completed")
  // ).length;

  const completedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.employee.Email === email &&
        taskemp.empTaskStatus === "Completed"
    )
  ).length

  const pendingTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) => taskemp.empemail === email && task.status === "Pending"
    )
  ).length;

  const assignedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Task Assigned"
    )
  ).length;

  const acceptedTasksNotCompletedOnTimeCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Accepted" &&
        calculateRemainingTime(task.endDate).delay
    )
  ).length;

  const completedTasksOnTimeCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Completed" &&
        !calculateRemainingTime(task.endDate).delay
    )
  ).length;

  const lateCompletedAcceptedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Accepted" &&
        calculateRemainingTime(task.endDate).delay
    )
  ).length;

  const lateCompletedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Completed" &&
        calculateRemainingTime(task.endDate).delay
    )
  ).length;

  // const notAcceptedAssignedTasksCount = tasks.filter((task) =>
  //   task.employees.some(
  //     (taskemp) =>
  //       taskemp.empemail === email &&
  //       taskemp.emptaskStatus === "Task Assigned" &&
  //       taskemp.emptaskStatus !== "Accepted"
  //   )
  // ).length;

  // const notAssignedButNotAcceptedTasksCount = tasks.filter(
  //   (task) =>
  //     !task.employees.some((taskemp) => taskemp.empemail === email) &&
  //     task.employees.every((taskemp) => taskemp.emptaskStatus !== "Accepted")
  // ).length;

  // const assignedTasksNotAcceptedOnTimeCount = tasks.filter((task) =>
  //   task.employees.some(
  //     (taskemp) =>
  //       taskemp.empemail === email &&
  //       taskemp.emptaskStatus === "Task Assigned" &&
  //       calculateRemainingTime(task.endDate).delay
  //   )
  // ).length;

  return (
    <div>
      <div className="container-fluid  mt-4">
        <div className="row row-gap-4">
          <div className="col-md-3">
            <div
              style={{ backgroundColor: "#FED2AA" }}
              className=" DashboardCard position-relative"
            >
              <div className=" d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Total New Task
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {pendingTasksCount}
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
                  Accept Task{" "}
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {/* {acceptedTasks.length}{" "} */}
                    {acceptedTasksCount}
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
                  Complete Task
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {completedTasksCount}
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
              style={{ backgroundColor: "#FEBBCC" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Reject Task
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {rejectedTasksCount}
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
              style={{ backgroundColor: "#FEBBCC" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Pending Task
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {assignedTasksCount}
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
              style={{ backgroundColor: "#BCCEF8" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Overdue Task
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {acceptedTasksNotCompletedOnTimeCount}
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
              style={{ backgroundColor: "#BCCEF8" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  On Time complete
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {/* {onTimeTasks} */}
                    {completedTasksOnTimeCount}
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
              style={{ backgroundColor: "#BCCEF8" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  Late Complete
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {/* {onTimeTasks} */}
                    {lateCompletedAcceptedTasksCount}
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

          <div className="col-md-9"></div>
        </div>
      </div>
    </div>
  );
};

export default EmpTaskCount;
