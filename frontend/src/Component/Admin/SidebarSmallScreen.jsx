import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdCurrencyRupee, MdOutlineDashboardCustomize } from "react-icons/md";
import { RiUser3Line } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoCalendarOutline, IoLocationOutline } from "react-icons/io5";
import { GoTasklist } from "react-icons/go";
import { LuKeyRound, LuPartyPopper } from "react-icons/lu";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { HiOutlineSpeakerphone } from "react-icons/hi";

const SidebarSmallScreen = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { toggleSidebar } = useSidebar();
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
      navLinks: [{ to: "/admin/company", label: "Company List" }],
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

  return (
    <div
      style={{
        minHeight: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        overflow: "inherit",
        width: "fit-content",
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        boxShadow: "1px 0 1px white",
      }}
      className="d-flex d-sm-none  flex-column gap-2 p-3 px-2"
    >
      <h3>
        <span
          className="text-white fw-normal fs-6 rounded-5 my-auto mx-auto border-1 border d-flex  justify-content-center align-items-center"
          style={{ height: "20px", width: "20px", cursor: "pointer" }}
          onClick={toggleSidebar}
        >
          X
        </span>
      </h3>
      <div
        style={{ height: "2px", width: "100%", background: "#DE4E26" }}
      ></div>
      {allLinks.map(({ icon, name, navLinks }) => (
        <div
          key={name}
          onMouseEnter={() => setActiveCategory(name)}
          onMouseLeave={() => setActiveCategory(null)}
          className="position-relative"
        >
          <span
            style={{
              color: darkMode
                ? "var(--primaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
              height: "3rem",
              outline: "none",
              border: "none",
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
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                }}
                className="m-auto d-flex rounded-5  justify-content-center fs-3"
              >
                {icon}
              </p>
            </div>
          </span>

          <div
            style={{
              ...dropdownStyle,
              display: activeCategory === name ? "flex" : "none",
              backgroundColor: darkMode
                ? "var(--primaryDashMenuColor)"
                : "var(--primaryDashColorDark)",
              width: "fit-content",
            }}
            className="flex-column position-absolute bottom-0 start-100 py-2 px-1 gap-2 mt-2  "
          >
            <p className="m-0 py-0 pl-1 text-warning">{name}</p>
            {navLinks.map((link) => (
              <Link className="text-decoration-none" key={link.to} to={link.to}>
                <div
                  style={{
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                  }}
                  className="text-decoration-none flex-nowrap text-start gap-3  d-flex justify-content-between "
                >
                  <div
                    // style={{ borderBottom: "1px solid white" }}
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
  height: "3rem",
};

const dropdownStyle = {
  width: "250px",
  zIndex: "5000",
  borderLeft: "5px solid white",
};

export default SidebarSmallScreen;
