import React, { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import {
  MdMenuOpen,
  MdOutlineContacts,
  MdOutlineLocationOn,
  MdTaskAlt,
} from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbBeach, TbUserCheck } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { ImCalendar } from "react-icons/im";
import { PiUsersThree } from "react-icons/pi";
import { IoCashOutline } from "react-icons/io5";
import { HiOutlineSpeakerphone } from "react-icons/hi";

const Sidebar = (props) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [extended, setExtended] = useState(false);
  const { darkMode } = useTheme();

  const allLinks = [
    {
      icon: <LuLayoutDashboard />,
      name: "Dashboard",
      navLinks: [{ to: "/hr/dashboard", label: "Dashboard" }],
    },
    {
      icon: <PiUsersThree />,
      name: "Employee",
      navLinks: [{ to: "/hr/employee", label: "Employee List" }],
    },
    {
      icon: <IoCashOutline />,
      name: "Salary",
      navLinks: [{ to: "/hr/salary", label: "Salary" }],
    },
    {
      icon: <TbUserCheck />,
      name: "Attendance",
      navLinks: [
        { to: "/hr/attenDance", label: "Create Attendance" },
        { to: "/hr/AttendanceRegister", label: "Attendance Register" },
        { to: "/hr/todaysAttendance", label: "TodaysAttendance" },
        { to: "/hr/viewAttenDance", label: "View Attendance" },
        { to: "/hr/manualAttand", label: "Manual Attendance" },
        { to: "/hr/updateAttendance", label: "Update Attendance" },

      ],
    },
    {
      icon: <TbBeach />,
      name: "Leave",
      navLinks: [
        { to: "/hr/createLeave", label: "Apply Leave" },
        { to: "/hr/leaveApplication", label: "Pending " },
        { to: "/hr/leaveAccepted", label: "Accepted " },
        { to: "/hr/leaveRejected", label: "Rejected " },
        { to: "/hr/assignLeave", label: "Assign Leave" },
        { to: "/hr/allEmpLeave", label: "All Emp Leave" },
        // { to: "/hr/leaveBalance", label: "Leave Balance" },
      ],
    },
    // {
    //   icon: <MdTaskAlt />,
    //   name: "Task",
    //   navLinks: [
    //     { to: "/hr/newTask", label: "Assign New Task" },
    //     { to: "/hr/ActiveTask", label: "Active Task" },
    //     { to: "/hr/taskcancle", label: "Cancelled Task" },
    //     { to: "/hr/taskcomplete", label: "Completed Task" },
    //     { to: "/hr/rejectTask", label: "Rejected Task" },
    //   ],
    // },
    {
      icon: <MdOutlineContacts />,
      name: "Access",
      navLinks: [
        { to: "/hr/role", label: "Role" },
        { to: "/hr/position", label: "Position" },
        { to: "/hr/department", label: "Department" },
      ],
    },
    {
      icon: <HiOutlineBuildingOffice2 />,
      name: "Company",
      navLinks: [{ to: "/hr/company", label: "Company List" }],
    },
    {
      icon: <MdOutlineLocationOn />,
      name: "Address",
      navLinks: [
        { to: "/hr/country", label: "Country" },
        { to: "/hr/state", label: "State" },
        { to: "/hr/city", label: "City" },
      ],
    },
    {
      icon: <HiOutlineSpeakerphone />,
      name: "Notice",
      navLinks: [{ to: "/hr/NoticeManagement", label: "Notice" }],
    },
    {
      icon: <ImCalendar />,
      name: "Holiday",
      navLinks: [{ to: "/hr/holiday", label: "Holiday Calendar" }],
    },
    {
      icon: <FaRegCircleUser />,
      name: "Profile",
      navLinks: [{ to: "/hr/personal-info", label: "Profile" }],
    },
  ];

  const ExtendClick = () => {
    setExtended(!extended);
  };

  return (
    <div
      style={{
        minHeight: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        overflow: "inherit",
        width: "fit-content",
        borderRight: "1px solid rgba(90, 88, 88, 0.1)",
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
      }}
      className="d-none d-sm-flex flex-column gap-2 p-2"
    >
      <h3
        style={{ borderBottom: "3px solid #DE4E26" }}
        className="text-success justify-content-between py-2 d-flex gap-2"
      >
        <button
          style={{
            display: !extended ? "none" : "block",
            cursor: "none",
            background: "#DE4E26",
          }}
          className=" btn text-white rounded-0 py-0"
        >
          HR
        </button>
        <span
          onClick={ExtendClick}
          style={{
            border: "none",
            outline: "none",
            cursor: "pointer",
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
            transform: `rotate(${!extended ? "180deg" : "0deg"})`,
          }}
          className="my-auto p-0 fs-4"
        >
          <MdMenuOpen />
        </span>
      </h3>

      <div
        className="m-0 p-0"
        style={{ maxHeight: "50px", overflow: "auto initial" }}
      >
        {allLinks.map(({ icon, name, navLinks }) => (
          <div
            key={name}
            onMouseEnter={() => setActiveCategory(name)}
            onMouseLeave={() => setActiveCategory(null)}
            className="position-relative"
          >
            {navLinks.length > 1 ? (
              <span
                style={{
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  height: "3rem",
                  outline: "none",
                  border: "none",
                }}
                className="p-0 text-start gap-2 justify-between w-100 d-flex justify-content-between"
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
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                    }}
                    className="m-auto d-flex rounded-5 justify-content-center fs-5"
                  >
                    {icon}
                  </p>
                  <p
                    style={{ display: !extended ? "none" : "block" }}
                    className="my-auto"
                  >
                    {name}
                  </p>
                </div>
                <span
                  style={{
                    transform: `rotate(${
                      activeCategory === name ? "135deg" : "0deg"
                    })`,
                    transition: "1s ease",
                    display: !extended ? "none" : "block",
                  }}
                  className="my-auto fs-4"
                >
                  +
                </span>
              </span>
            ) : (
              <OverlayTrigger
                placement="right"
                overlay={
                  !extended ? (
                    <Tooltip id={`tooltip-${name}`}>{name}</Tooltip>
                  ) : (
                    <span></span>
                  )
                }
              >
                <NavLink to={navLinks[0].to} className="text-decoration-none">
                  <span
                    style={{
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      height: "3rem",
                      outline: "none",
                      border: "none",
                    }}
                    className="p-0 text-start gap-2 justify-between w-100 d-flex justify-content-between"
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
                          color: darkMode
                            ? "var(--primaryDashColorDark)"
                            : "var(--primaryDashMenuColor)",
                        }}
                        className="m-auto d-flex rounded-5 justify-content-center fs-5"
                      >
                        {icon}
                      </p>
                      <p
                        style={{ display: !extended ? "none" : "block" }}
                        className="my-auto"
                      >
                        {name}
                      </p>
                    </div>
                  </span>
                </NavLink>
              </OverlayTrigger>
            )}

            {navLinks.length > 1 && (
              <div
                style={{
                  ...dropdownStyle,
                  display: activeCategory === name ? "flex" : "none",
                  backgroundColor: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  width: "fit-content",
                }}
                className="flex-column position-absolute top-0 start-100 py-2 px-1 gap-2 mt-2 shadow-sm"
              >
                <p
                  style={{
                    display: extended ? "none" : "block",
                    color: darkMode ? "green" : "orange",
                  }}
                  className="m-0 py-0 pl-1 fw-bold"
                >
                  {name}
                </p>
                {navLinks.map((link) => (
                  <NavLink
                    className="text-decoration-none"
                    key={link.to}
                    to={link.to}
                  >
                    <div
                      style={{
                        color: darkMode
                          ? "var(--primaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                      }}
                      className="text-decoration-none flex-nowrap text-start gap-3 d-flex justify-content-between "
                    >
                      <div className="d-flex gap-1 flex-nowrap">
                        <p className="m-0">{link.icon}</p>
                        <p style={{ whiteSpace: "pre" }} className="m-auto">
                          {link.label}
                        </p>
                      </div>
                      <span className="my-auto ">›</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const buttonStyle = {
  outline: "none",
  border: "none",
  height: "3rem",
};

const dropdownStyle = {
  width: "250px",
  zIndex: "5",
  borderLeft: "3px solid white",
};

export default Sidebar;
