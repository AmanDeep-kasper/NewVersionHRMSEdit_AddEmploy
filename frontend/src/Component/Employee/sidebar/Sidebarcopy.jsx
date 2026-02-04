import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdDashboard, MdMenuOpen, MdTaskAlt } from "react-icons/md";
import { FaCalendarCheck, FaUserCircle } from "react-icons/fa";
import { TbDeviceIpadMinus } from "react-icons/tb";
import { useSidebar } from "../../../Context/AttendanceContext/smallSidebarcontext";

const SidebarSmallScreen = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { toggleSidebar } = useSidebar();

  const allLinks = [
    {
      icon: <MdDashboard />,
      name: "Dashboard",
      navLinks: [{ to: "/employee/dashboard", label: "Dashboard" }]
    },
    {
      icon: <FaUserCircle />,
      name: "Profile",
      navLinks: [
        // { to: `/employee/${data["_id"]}/personal-info`, label: "personal-info" },
        { to: `/employee/${data["_id"]}/education`, label: "education" },
        { to: `/employee/${data["_id"]}/family-info`, label: "Dependents" },
        {
          to: `/employee/${data["_id"]}/work-experience`,
          label: "Work Experience"
        }
      ]
    },
    {
      icon: <FaCalendarCheck />,
      name: "Leave",
      navLinks: [
        { to: `/employee/${data["_id"]}/leave-application-emp`, label: "Leave" }
      ]
    },
    {
      icon: <MdTaskAlt />,
      name: "Task",
      navLinks: [
        { to: "/employee/newTask", label: "New Task" },
        { to: "/employee/activeTask", label: "Active Task" }
      ]
    },
    {
      icon: <TbDeviceIpadMinus />,
      name: "Attendance",
      navLinks: [
        { to: `/employee/${data["_id"]}/attendance`, label: "attendance" },
        {
          to: `/employee/${data["_id"]}/attendanceList`,
          label: "Attendance List"
        }
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
        backgroundColor: "var(--primaryDashColorDark)"
      }}
      className="d-flex flex-column gap-2 p-3"
    >
      <h3
        style={{ borderBottom: "3px solid green" }}
        className="fw-bolder text-success justify-content-between py-2 d-flex gap-2"
      >
        <p style={{ display: "block" }} className="my-auto">
          Employee
        </p>
        <span
          className="text-white fs-6 rounded-5 my-auto border-2 border d-flex  justify-content-center align-items-center"
          style={{ height: "30px", width: "30px", cursor: "pointer" }}
          onClick={toggleSidebar}
        >
          X
        </span>
      </h3>

      {allLinks.map(({ icon, name, navLinks }) => (
        <div
          key={name}
          onMouseEnter={() => setActiveCategory(name)}
          onMouseLeave={() => setActiveCategory(null)}
          className="position-relative"
        >
          <span
            style={{
              color: "var(--primaryDashMenuColor)",
              height: "3rem",
              outline: "none",
              border: "none"
            }}
            className="p-0  text-start fw-bold gap-2 justify-between w-100 d-flex justify-content-between"
          >
            <div
              style={{ width: "fit-content" }}
              className="d-flex my-auto gap-2"
            >
              <p
                style={{
                  height: "30px",
                  width: "30px",
                  alignItems: "center",
                  color:
                    activeCategory === name
                      ? "#FF9209"
                      : "var(--primaryDashMenuColor)"
                }}
                className="m-auto d-flex rounded-5  justify-content-center fs-3"
              >
                {icon}
              </p>
              <p style={{ display: "block" }} className="my-auto">
                {name}
              </p>
            </div>
            <span
              style={{
                transform: `rotate(${
                  activeCategory === name ? "135deg" : "0deg"
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
              backgroundColor: "var(--primaryDashColorDark)",
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
                    <p
                      style={{ whiteSpace: "pre" }}
                      className="m-auto text-capitalize"
                    >
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

const dropdownStyle = {
  width: "250px",
  zIndex: "5",
  borderLeft: "5px solid white"
};

export default SidebarSmallScreen;
