import React, { useState } from "react";
import { BsBuildingsFill } from "react-icons/bs";
import { FaAddressBook } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaCalendarCheck, FaRegCircleUser } from "react-icons/fa6";
import {
  MdDashboard,
  MdOutlineContacts,
  MdOutlineLocationOn,
  MdTaskAlt,
} from "react-icons/md";
import { TbBeach, TbDeviceIpadMinus, TbUserCheck } from "react-icons/tb";
import { MdHolidayVillage } from "react-icons/md";
import { FcLeave } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import { IoCashOutline } from "react-icons/io5";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { ImCalendar } from "react-icons/im";
import { HiOutlineSpeakerphone } from "react-icons/hi";

const SidebarSmallScreen = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { toggleSidebar } = useSidebar();
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
