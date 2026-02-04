import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { GoTasklist } from "react-icons/go";
import {
  MdCurrencyRupee,
  MdMenuOpen,
  MdOutlineDashboardCustomize,
} from "react-icons/md";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import { LuKeyRound, LuPartyPopper } from "react-icons/lu";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { RiUser3Line } from "react-icons/ri";
import { HiOutlineSpeakerphone } from "react-icons/hi";

const Sidebar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [extended, setExtended] = useState(false);
  const { darkMode } = useTheme();

  const allLinks = [
    {
      icon: <MdOutlineDashboardCustomize />,
      name: "Dashboard",
      navLinks: [{ to: "/admin/dashboard", label: "Dashboard" }],
    },
    {
      icon: <RiUser3Line />,
      name: "Employee",
      navLinks: [
        // { to: "/admin/user", label: "Employee List" },
        { to: "/admin/employee", label: "Employee List" },
      ],
    },
    {
      icon: <MdCurrencyRupee />,
      name: "Salary",
      navLinks: [{ to: "/admin/salary", label: "Salary" }],
    },
    {
      icon: <IoMdCheckmarkCircleOutline />,
      name: "Attendance",
      navLinks: [
        { to: "/admin/myAttendance", label: "My Attendance" },
        // { to: "/admin/adminAttendance", label: "Create Attendance" },
        { to: "/admin/todaysAttendance", label: "TodaysAttendance" },
        { to: "/admin/viewAttendance", label: "View Attendance" },
        { to: "/admin/updateAttendance", label: "update Attendance" },
        // { to: "/admin/leave", label: "View Leave " }
      ],
    },
    {
      icon: <IoCalendarOutline />,
      name: "Leave",
      navLinks: [
        // { to: "/admin/applyLeave", label: "Apply Leave" },
        { to: "/admin/leaveApplication", label: "Leave Request" },
        { to: "/admin/leaveAccepted", label: "Approved Leaves " },
        { to: "/admin/leaveRejected", label: "Rejected Leaves " },
        { to: "/admin/leaveAssign", label: "Leave Assign" },
        { to: "/admin/allEmpLeave", label: "All Emp Leave Balance" },
      ],
    },
    {
      icon: <GoTasklist />,
      name: "Task",
      navLinks: [
        { to: "/admin/task", label: "Create New Task" },
        { to: "/admin/taskassign", label: "Assigned" },
        { to: "/admin/taskActive", label: "Active Task" },
        { to: "/admin/taskcancle", label: "Cancelled Task" },
        { to: "/admin/taskcomplete", label: "Completed Task" },
        { to: "/admin/taskreject", label: "Revoked Task" },
      ],
    },
    {
      icon: <LuKeyRound />,
      name: "Access",
      navLinks: [
        { to: "/admin/role", label: "Role" },
        { to: "/admin/position", label: "Position" },
        { to: "/admin/department", label: "Department" },
      ],
    },
    {
      icon: <HiOutlineBuildingOffice2 />,
      name: "Company",
      navLinks: [
        { to: "/admin/company", label: "Company List" },
        // { to: "/hr/employee", label: "Create Employee" },
      ],
    },
    {
      icon: <IoLocationOutline />,
      name: "Address",
      navLinks: [
        { to: "/admin/country", label: "Country" },
        { to: "/admin/state", label: "State" },
        { to: "/admin/city", label: "City" },
      ],
    },
    {
      icon: <HiOutlineSpeakerphone />,
      name: "Notice",
      navLinks: [{ to: "/admin/NoticeManagement", label: "Notice" }],
    },
    {
      icon: <LuPartyPopper />,
      name: "Holiday",
      navLinks: [{ to: "/admin/leaveCal", label: "Leave Calendar" }],
    },
    {
      icon: <AiOutlineFundProjectionScreen />,
      name: "Project",
      navLinks: [
        { to: "/admin/project-bid", label: "Project Bidding" },
        { to: "/admin/portal-master", label: "Portal Master" },
      ],
    },
  ];

  const ExtendClick = () => {
    setExtended(extended ? false : true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        overflowY: "auto",
        overflow: "inherit",
        width: "fit-content",
        borderRight: "1px solid rgba(90, 88, 88, 0.1)",
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        padding: ".5rem 1rem .5rem .5rem",
      }}
      className="d-none d-sm-flex flex-column gap-2"
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
          Admin
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
  borderLeft: "5px solid white",
};

export default Sidebar;
