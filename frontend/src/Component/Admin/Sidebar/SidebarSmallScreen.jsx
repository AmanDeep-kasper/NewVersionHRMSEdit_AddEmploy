import React, { useState } from "react";
import { BsBuildingsFill } from "react-icons/bs";
import { FaAddressBook } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";
import { MdDashboard, MdMenuOpen, MdTaskAlt } from "react-icons/md";
import { TbDeviceIpadMinus } from "react-icons/tb";
import { MdHolidayVillage } from "react-icons/md";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { FcLeave } from "react-icons/fc";
import { Link } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import "./Sidebar.css";
import { useSidebar } from "../../../Context/AttendanceContext/smallSidebarcontext";

const SidebarSmallScreen = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { toggleSidebar } = useSidebar();

  const allLinks = [
    {
      icon: <MdDashboard />,
      name: "Dashboard",
      navLinks: [{ to: "/admin/dashboard", label: "Dashboard" }]
    },
    {
      icon: <FaUserTie />,
      name: "Employee",
      navLinks: [
        { to: "/admin/user", label: "Employee List" },
        { to: "/admin/salary", label: "Salary" }
      ]
    },
    {
      icon: <FaCalendarCheck />,
      name: "Attendance",
      navLinks: [
        { to: "/admin/adminAttendance", label: "Create Attendance" },
        { to: "/hr/adminviewAttenDance", label: "View Attendance" },
        { to: "/admin/leave", label: "View Leave " }
      ]
    },
    {
      icon: <FcLeave />,
      name: "Leave",
      navLinks: [
        { to: "/admin/applyLeave", label: "Apply Leave" },
        { to: "/admin/leave", label: "Pending " },
        { to: "/admin/leaveAccepted", label: "Accepted " },
        { to: "/admin/leaveRejected", label: "Rejected " }
      ]
    },
    {
      icon: <MdTaskAlt />,
      name: "Task",
      navLinks: [
        { to: "/admin/task", label: "Create New Task" },
        { to: "/admin/taskassign", label: "Assigned" },
        { to: "/admin/taskstatus", label: "Active Taask" },
        { to: "/admin/taskcancle", label: "Cancelled Task" },
        { to: "/admin/taskcomplete", label: "Completed Task" },
        { to: "/admin/taskreject", label: "Rejected Task" }
      ]
    },
    {
      icon: <TbDeviceIpadMinus />,
      name: "Access",
      navLinks: [
        { to: "/admin/role", label: "Role" },
        { to: "/admin/position", label: "Position" },
        { to: "/admin/department", label: "Department" }
      ]
    },
    {
      icon: <BsBuildingsFill />,
      name: "Company",
      navLinks: [
        { to: "/admin/company", label: "Company List" }
        // { to: "/hr/employee", label: "Create Employee" },
      ]
    },
    {
      icon: <FaAddressBook />,
      name: "Address",
      navLinks: [
        { to: "/admin/country", label: "Country" },
        { to: "/admin/state", label: "State" },
        { to: "/admin/city", label: "City" }
      ]
    },
    {
      icon: <MdHolidayVillage />,
      name: "Holiday",
      navLinks: [{ to: "/admin/leaveCal", label: "Leave Calendar" }]
    },
    {
      icon: <AiOutlineFundProjectionScreen />,
      name: "Project",
      navLinks: [
        { to: "/admin/project-bid", label: "Project Bidding" },
        { to: "/admin/portal-master", label: "Portal Master" }
      ]
    }
  ];


  return (
    <div
      style={{
        minHeight: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        overflow: "inherit",
        width: "fit-content",
        backgroundColor: "var(--primaryDashColorDark)",
      }}
      className="d-flex  flex-column gap-2 p-3"
    >
      <h3
        style={{ borderBottom: "3px solid green" }}
        className="fw-bolder mt-0 text-success justify-content-between py-2 d-flex gap-2"
      >
        <p
          style={{ display: "block" }}
          className="my-auto"
        >
          ADMIN
        </p>{" "}
        <span className="text-white fs-6 rounded-5 my-auto border-2 border d-flex  justify-content-center align-items-center" style={{ height: '30px', width: '30px', cursor: 'pointer' }} onClick={toggleSidebar}>X</span>
      </h3>

      {allLinks.map(({ icon, name, navLinks }) => (
        <div
          key={name}
          onMouseEnter={() => setActiveCategory(name)}
          onMouseLeave={() => setActiveCategory(null)}
          className="position-relative"
        >
          <span
            style={{ color: "var(--primaryDashMenuColor)", height: '3rem', outline: 'none', border: 'none' }}
            className="p-0  text-start fw-bold gap-2 justify-between w-100 d-flex justify-content-between"
          >
            <div
              style={{ width: "fit-content" }}
              className="d-flex gap-2 my-auto"
            >
              <p
                style={{
                  height: "30px",
                  width: "30px",
                  alignItems: "center",
                  color: activeCategory === name ? "#FF9209" : "white"
                }}
                className="m-auto d-flex rounded-5  justify-content-center fs-3"
              >
                {icon}
              </p>
              <p
                style={{ display: "block" }}
                className="my-auto"
              >
                {name}
              </p>
            </div>
            <span
              style={{
                transform: `rotate(${activeCategory === name ? "135deg" : "0deg"
                  })`,
                transition: "1s ease",
                display: "block"
              }}
              className="my-auto fs-4"
            >
              +
            </span>
          </span>

          <div
            style={{
              ...dropdownStyle,
              display: activeCategory === name ? "flex" : "none",
              backgroundColor: 'var(--primaryDashColorDark)',
              width: "fit-content"
            }}
            className="flex-column position-absolute top-0 start-100 py-2 px-2 gap-2 mt-2  "
          >
            {navLinks.map((link) => (
              <Link className="text-decoration-none" key={link.to} to={link.to}>
                <div className="text-decoration-none flex-nowrap text-start fw-bolder gap-3 text-white d-flex justify-content-between ">
                  <div
                    style={{ borderBottom: "1px solid white" }}
                    className="d-flex gap-1 flex-nowrap"
                  >
                    <p className="m-0">{link.icon}</p>
                    <p style={{ whiteSpace: "pre" }} className="m-auto">
                      {link.label}
                    </p>
                  </div>
                  <span style={{}} className="my-auto ">
                    ›
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const buttonStyle = {
  outline: "none",
  border: "none",
  height: "3rem"
};

const dropdownStyle = {
  width: "250px",
  zIndex: "5",
  borderLeft: "5px solid white"
};

export default SidebarSmallScreen;
