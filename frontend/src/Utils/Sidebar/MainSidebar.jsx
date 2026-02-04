import { useEffect, useRef, useState } from "react";
import { GoTasklist } from "react-icons/go";
import Logo from "../../img/KasperLogo1.png";
import MuncLogoSmall from "../../img/MUNCSMALL.svg";
import { TbTimeDurationOff } from "react-icons/tb";

import {
  MdCurrencyRupee,
  MdKeyboardArrowRight,
  MdMenuOpen,
  MdOutlineContacts,
  MdOutlineDashboardCustomize,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdOutlineLocationOn,
  MdOutlinePayments,
} from "react-icons/md";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import "./MainSidebar.css";
import { Link, NavLink } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  IoIosHelpCircleOutline,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import {
  IoCalendarOutline,
  IoCashOutline,
  IoSettingsOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { LuKeyRound, LuLayoutDashboard, LuPartyPopper } from "react-icons/lu";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { RiUser3Line } from "react-icons/ri";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { FaRegCircleUser } from "react-icons/fa6";
import { ImCalendar } from "react-icons/im";
import { TbBeach, TbUserCheck } from "react-icons/tb";
import { PiUsersThree } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FiFileText } from "react-icons/fi";
import { RxCornerBottomLeft } from "react-icons/rx";
import { GiTakeMyMoney } from "react-icons/gi";
import { TfiAgenda } from "react-icons/tfi";
import { useBranding } from "../../Context/BrandingContext/BrandingContext";

const MainSidebar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { userData } = useSelector((state) => state.user);
  const [extended, setExtended] = useState(false);
  const { darkMode } = useTheme();
 const { brandings } = useBranding();
    const logoSrc = (brandings && brandings.length > 0 && (brandings[0]?.logoUrl || brandings[0]?.company?.logoUrl)) ? (brandings[0]?.logoUrl || brandings[0]?.company?.logoUrl) : Logo;
  const miniLogoSrc = (brandings && brandings.length > 0 && (brandings[0]?.miniIconUrl || brandings[0]?.company?.miniIconUrl)) ? (brandings[0]?.miniIconUrl || brandings[0]?.company?.miniIconUrl) : MuncLogoSmall;
  
  // Footer-specific branding (new fields)
  const footerLogoSrc = (brandings && brandings.length > 0 && brandings[0]?.footerLogoUrl) ? brandings[0].footerLogoUrl : logoSrc;
  const footerMiniLogoSrc = (brandings && brandings.length > 0 && brandings[0]?.footerMiniLogoUrl) ? brandings[0].footerMiniLogoUrl : miniLogoSrc;
  
    
  const allLinks = [
    {
      user: 1,
      icon: <MdOutlineDashboardCustomize />,
      name: "Dashboard",
      navLinks: [{ to: "/admin/dashboard", label: "Dashboard" }],
    },
    {
      user: 1,
      icon: <RiUser3Line />,
      name: "Employee",
      navLinks: [{ to: "/admin/employee", label: "Employee List" }],
    },
    {
      user: 1,
      icon: <MdCurrencyRupee />,
      name: "Salary",
      navLinks: [{ to: "/admin/salary", label: "Salary" }],
    },
    {
      user: 1,
      icon: <IoMdCheckmarkCircleOutline />,
      name: "Attendance",
      navLinks: [
        { to: "/admin/myAttendance", label: "My Attendance" },
        { to: "/admin/todaysAttendance", label: "Todays Attendance" },
        { to: "/admin/viewAttendance", label: "View Attendance" },
        { to: "/admin/AttendanceRegister", label: "Attendance Register" },
        { to: "/admin/updateAttendance", label: "Update Attendance" },
        { to: "/admin/updateBreak", label: "Update Break" },

        {
          to: "/admin/Update-Ncns-Or-Sandwhich",
          label: "NCNS & Sandwhich",
        },
      ],
    },
    {
      user: 1,
      icon: <TbTimeDurationOff />,
      name: "Shift",
      navLinks: [
        { to: "/admin/shift-management", label: "Shift Management" },
        { to: "/admin/UpdateEmployeeShift", label: "Schedule Shift" },
        { to: "/admin/EmployeeShiftHistory", label: "Employee Shift History" },
        { to: "/admin/UpdateEmployeeShiftList", label: "Schedule Shift List" },
      ],
    },
    {
      user: 1,
      icon: <IoCalendarOutline />,
      name: "Leave",
      navLinks: [
        { to: "/admin/leaveApplication", label: "Leave Request" },
        { to: "/admin/leaveAccepted", label: "Approved Leaves " },
        { to: "/admin/leaveRejected", label: "Rejected Leaves " },
        { to: "/admin/leaveRegister", label: "Leave Register" },
        { to: "/admin/update-leave", label: "Update Leave" },
        { to: "/admin/leaveAssign", label: "Leave Assign" },
      ],
    },
    {
      user: 1,
      icon: <MdOutlinePayments />,
      name: "Payroll",
      navLinks: [
        { to: "/admin/Payroll_Dashboard", label: "Payroll Dashboard" },
        { to: "/admin/Run_payroll", label: "Run payroll " },
        { to: "/admin/salary_Slips_All", label: "Employee Salary Slips" },
        {
          to: "/admin/salary_Slips",
          label: "My Salary Slip",
        },
      ],
    },
    {
      user: 1,
      icon: <GoTasklist />,
      name: "Task",
      navLinks: [{ to: "/admin/taskhead", label: "Task" }],
      // navLinks: [
      //   { to: "/admin/task", label: "Create New Task" },
      //   { to: "/admin/taskassign", label: "Assigned Task" },
      //   { to: "/admin/taskActive", label: "Active Task" },
      //   { to: "/admin/taskcancle", label: "Cancelled Task" },
      //   { to: "/admin/taskcomplete", label: "Completed Task" },
      //   { to: "/admin/taskreject", label: "Rejected Task" },
      // ],
    },
         {
      user: 1,
      icon: <IoSettingsOutline />,
      name: "Brand Logo",
      navLinks: [{ to: "/admin/BrandingSettings", label: "icon Settings" }],
    },
    {
      user: 1,
      icon: <TfiAgenda />,
      name: "Agenda",
      navLinks: [
        { to: "/admin/Agenda", label: "Agenda Calendar" },
        { to: "/admin/AgendaMeetings", label: "Agenda Meetings" },
        { to: "/admin/AgendaReminders", label: "Agenda Reminders" },
      ],
    },
    {
      user: 1,
      icon: <FiFileText />,
      name: "Reports",
      navLinks: [
        { to: "/admin/GetReport", label: "Daily Report" },
        { to: "/admin/ViewMarketingReport", label: "Marketing Report" },
      ],
    },
    {
      user: 1,
      icon: <LuKeyRound />,
      name: "Management Unit",
      navLinks: [
        { to: "/admin/role", label: "Role" },
        { to: "/admin/position", label: "Position" },
        { to: "/admin/department", label: "Department" },
      ],
    },

    {
      user: 1,
      icon: <HiOutlineBuildingOffice2 />,
      name: "Company",
      navLinks: [{ to: "/admin/company", label: "Company List" }],
    },
    {
      user: 1,
      icon: <IoLocationOutline />,
      name: "Address",
      navLinks: [
        { to: "/admin/country", label: "Country" },
        { to: "/admin/state", label: "State" },
        { to: "/admin/city", label: "City" },
      ],
    },
    {
      user: 1,
      icon: <HiOutlineSpeakerphone />,
      name: "Notice",
      navLinks: [
        { to: "/admin/NoticeManagement", label: "Create Notice" },
        { to: "/admin/NoticeBoard", label: "Notice List" }
      ],
    },
    {
      user: 1,
      icon: <IoIosHelpCircleOutline />,
      name: "Request Details",
      navLinks: [
        { to: "/admin/requestReceived", label: "Request Open" },
        { to: "/admin/requestClosed", label: "Request Closed" },
      ],
    },
    {
      user: 1,
      icon: <LuPartyPopper />,
      name: "Holiday",
      navLinks: [{ to: "/admin/leaveCal", label: "Leave Calendar" }],
    },
    {
      user: 1,
      icon: <AiOutlineFundProjectionScreen />,
      name: "Project",
      navLinks: [
        { to: "/admin/project-bid", label: "Project Bidding" },
        { to: "/admin/portal-master", label: "Portal Master" },
      ],
    },
    {
      user: 2,
      icon: <LuLayoutDashboard />,
      name: "Dashboard",
      navLinks: [{ to: "/hr/dashboard", label: "Dashboard" }],
    },
    {
      user: 2,
      icon: <PiUsersThree />,
      name: "Employee",
      navLinks: [{ to: "/hr/employee", label: "Employee List" }],
    },
    {
      user: 2,
      icon: <IoCashOutline />,
      name: "Salary",
      navLinks: [{ to: "/hr/salary", label: "Salary" }],
    },
    {
      user: 2,
      icon: <TbUserCheck />,
      name: "Attendance",
      navLinks: [
        { to: "/hr/my-attendance", label: "My Attendance" },
        { to: "/hr/AttendanceRegister", label: "Attendance Register" },
        { to: "/hr/todaysAttendance", label: "Todays Attendance" },
        { to: "/hr/viewAttenDance", label: "View Attendance" },
        // { to: "/hr/manualAttand", label: "Manual Attendance" },
        { to: "/hr/updateAttendance", label: "Update Attencance" },
        { to: "/hr/updateBreak", label: "Update Break" },
        { to: "/hr/shift-management", label: "Shift Management" },
        {
          to: "/hr/Update-Ncns-Or-Sandwhich",
          label: "NCNS & Sandwhich",
        },
      ],
    },
    {
      user: 2,
      icon: <TbBeach />,
      name: "Leave Management",
      navLinks: [
        { to: "/hr/createLeave", label: "Apply Leave" },
        { to: "/hr/leaveApplication", label: "Pending " },
        { to: "/hr/leaveAccepted", label: "Accepted " },
        { to: "/hr/leaveRejected", label: "Rejected " },
        { to: "/hr/update-leave", label: "Update Leave" },
        { to: "/hr/assignLeave", label: "Assign Leave" },
        { to: "/hr/All-employee-leave", label: "Emp Leave Balance" },
        { to: "/hr/LeaveBalanceRegister", label: "Leave Register" },
      ],
    },
    {
      user: 2,
      icon: <MdOutlinePayments />,
      name: "Payroll",
      navLinks: [
        { to: "/hr/Payroll_Dashboard", label: "Payroll Dashboard" },
        { to: "/hr/Run_payroll", label: "Run payroll " },
        { to: "/hr/salary_Slips_All", label: "Employee Salary Slips" },
        {
          to: "/hr/salary_Slips",
          label: "My Salary Slip",
        },
      ],
    },
    // {
    //   user: 2,
    //   icon: <GiPayMoney />,
    //   name: "Reimbursment",
    //   navLinks: [
    //     { to: "/hr/EmployeeReimbursment", label: "My Rembursment" },
    //     { to: "/hr/Reimbursment_View", label: "Reimbursment View" },
    //   ],
    // },

    {
      user: 2,
      icon: <MdOutlineContacts />,
      name: "Management Unit",
      navLinks: [
        { to: "/hr/role", label: "Role" },
        { to: "/hr/position", label: "Position" },
        { to: "/hr/department", label: "Department" },
      ],
    },
    {
      user: 2,
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
      user: 2,
      icon: <HiOutlineSpeakerphone />,
      name: "Notice",
      navLinks: [
        { to: "/hr/NoticeManagement", label: "Create Notice" },
        { to: "/hr/NoticeBoard", label: "Notice List" }

      ],
    },
    {
      user: 2,
      icon: <IoTicketOutline />,
      name: "My Request",
      navLinks: [
        { to: "/hr/request", label: "Raise Request" },
        { to: "/hr/requestOpen", label: "Open Request" },
        { to: "/hr/requestClosed", label: "Closed Request" },
      ],
    },
    {
      user: 2,
      icon: <IoIosHelpCircleOutline />,
      name: "Team Request",
      navLinks: [
        { to: "/hr/teamRequestOpen", label: "Open Request" },
        { to: "/hr/teamRequestClosed", label: "Closed Request" },
      ],
    },
    {
      user: 2,
      icon: <ImCalendar />,
      name: "Holiday",
      navLinks: [{ to: "/hr/holiday", label: "Holiday Calendar" }],
    },

     {
      user: 2,
      icon: <IoSettingsOutline />,
      name: "Brand Logo",
      navLinks: [{ to: "/hr/BrandingSettings", label: "icon Settings" }],
    },
    {
      user: 2,
      icon: <FaRegCircleUser />,
      name: "Profile",
      navLinks: [{ to: "/hr/personal-info", label: "Profile" }],
    },
    
    {
      user: 2,
      icon: <IoSettingsOutline />,
      name: "Weekend Settings",
      navLinks: [{ to: "/hr/WeekendSettings", label: "Weekend Settings" }],
    },
    {
      user: 4,
      icon: <MdOutlineDashboardCustomize />,
      name: "Dashboard",
      navLinks: [{ to: "/manager/dashboard", label: "Dashboard" }],
    },
    {
      user: 4,
      icon: <RiUser3Line />,
      name: "Employee",
      navLinks: [{ to: "/manager/employee", label: "Employee List" }],
    },
    {
      user: 4,
      icon: <IoMdCheckmarkCircleOutline />,
      name: "Attendance",
      navLinks: [
        { to: "/manager/myAttendance", label: "My Attencance" },
        { to: "/manager/todaysAttendance", label: "Today`s Attendance" },
        { to: "/manager/viewAttenDance", label: "View Attendance" },
      ],
    },
    {
      user: 4,
      icon: <GiTakeMyMoney />,
      name: "Salary",
      navLinks: [
        {
          to: "/manager/salary_Slips",
          label: "Salary Slip",
        },
      ],
    },
    {
      user: 4,
      icon: <IoCalendarOutline />,
      name: "Leave",
      navLinks: [
        { to: "/manager/createLeave", label: "My Leave" },
        { to: "/manager/leaveApplication", label: "Leave Requests" },
        { to: "/manager/leaveApplicationAccepted", label: "Accepted Leave " },
        { to: "/manager/leaveApplicationRejected", label: "Rejected Leave " },
      ],
    },
    {
      user: 4,
      icon: <GoTasklist />,
      name: "Task",
      navLinks: [{ to: "/manager/managerTask", label: "Task" }],
      // navLinks: [
      //   { to: "/manager/newTask", label: "Assigned Task" },
      //   { to: "/manager/ActiveTask", label: "Active Task" },
      //   { to: "/manager/taskcancle", label: "Cancelled Task" },
      //   { to: "/manager/taskcomplete", label: "Completed Task" },
      //   { to: "/manager/rejectTask", label: "Rejected Task" },
      // ],
    },
    // {
    //   user: 4,
    //   icon: <GiPayMoney />,
    //   name: "Reimbursment",
    //   navLinks: [
    //     { to: "/manager/EmployeeReimbursment", label: "My Rembursment" },
    //   ],
    // },
    {
      user: 4,
      icon: <FiFileText />,
      name: "Team Report",
      navLinks: [
        { to: "/manager/GetReport", label: "Daily Report" },
        { to: "/manager/ViewMarketingReport", label: "SEO Report" },
      ],
    },

    {
      user: 4,
      icon: <HiOutlineSpeakerphone />,
      name: "Notice",
      navLinks: [{ to: "/manager/NoticeManagement", label: "Create Notice" },
        { to: "/manager/NoticeBoard", label: "Notice List" }
      ],
    },
    {
      user: 4,
      icon: <IoTicketOutline />,
      name: "My Request",
      navLinks: [
        { to: "/manager/request", label: "Raise Request" },
        { to: "/manager/requestOpen", label: "Open Request" },
        { to: "/manager/requestClosed", label: "Closed Request" },
      ],
    },
    {
      user: 4,
      icon: <IoIosHelpCircleOutline />,
      name: "Team Request",
      navLinks: [
        { to: "/manager/teamRequestOpen", label: "Open Request" },
        { to: "/manager/teamRequestClosed", label: "Closed Request" },
      ],
    },

    {
      user: 4,
      icon: <FaRegUserCircle />,
      name: "Profile",
      navLinks: [{ to: "/manager/personal-info", label: "Profile" }],
    },
    {
      user: 3,
      icon: <MdOutlineDashboardCustomize />,
      name: "Dashboard",
      navLinks: [{ to: "/employee/dashboard", label: "Dashboard" }],
    },
    {
      user: 3,
      icon: <FaRegCircleUser />,
      name: "Profile",
      navLinks: [
        {
          to: "/employee/" + userData?._id + "/personal-info",
          label: "Profile",
        },
      ],
    },
    {
      user: 3,
      icon: <IoMdCheckmarkCircleOutline className="fs-4" />,
      name: "Attendance",
      navLinks: [
        {
          to: "/employee/MyAttendance",
          label: "View Attendance",
        },
      ],
    },
    {
      user: 3,
      icon: <IoCalendarOutline />,
      name: "Leave",
      navLinks: [
        {
          to: "/employee/leaveApplication",
          label: "Apply Leave",
        },
      ],
    },
    {
      user: 3,
      icon: <GiTakeMyMoney />,
      name: "Salary",
      navLinks: [
        {
          to: "/employee/salary_Slips",
          label: "Salary Slip",
        },
      ],
    },
    {
      user: 3,
      icon: <GoTasklist />,
      name: "Task",
      navLinks: [{ to: "/employee/task", label: "Task" }],
    },
{
  user: 3,
  icon: <FiFileText />,
  name: "Reports",
  navLinks:
    userData?.department?.[0]?.DepartmentName === "Digital Marketing"
      ? [
          { to: "/employee/GetReport", label: "Daily Report" },
          { to: "/employee/viewReport", label: "SEO Report" },
        ]
      : [{ to: "/employee/GetReport", label: "Daily" }],
},



    // {
    //   user: 3,
    //   icon: <GiPayMoney />,
    //   name: "Reimbursment",
    //   navLinks: [
    //     { to: "/employee/EmployeeReimbursment", label: "My Rembursment" },
    //   ],
    // },
    {
      user: 3,
      icon: <IoTicketOutline />,
      name: "Ticket",
      navLinks: [
        { to: "/employee/request", label: "Generate Ticket" },
        { to: "/employee/requestOpen", label: "Open Ticket" },
        { to: "/employee/requestClosed", label: "Closed Ticket" },
      ],
    },
  ];

  const toggleDropdown = (name) => {
    if (activeCategory === name) {
      setActiveCategory(null);
    } else {
      setActiveCategory(name);
    }
  };

  const ExtendClick = () => {
    setExtended((prev) => !prev);
  };

  const scrollContainerRef = useRef(null);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowScrollUp(container.scrollTop > 0);
      setShowScrollDown(
        container.scrollTop + container.clientHeight < container.scrollHeight
      );
    }
  };

  const scrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: -50, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: 50, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    checkScrollButtons(); // Initial check
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
      };
    }
  }, [scrollContainerRef]);

const userType = userData?.Account

const DashbboardLink = (userType) => {
  if (userType === 1) {
    return "/admin/dashboard";
  } else if (userType === 2) {
    return "/hr/dashboard";
  } else if (userType === 3) {
    return "/employee/dashboard";
  } else if (userType === 4) {
    return "/manager/dashboard";
  } else {
    return "/";
  }
};


  return (
    <div
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        overflow: "inherit",
        width: activeCategory || extended ? "250px" : "80px",
        borderRight: "1px solid rgba(90, 88, 88, 0.1)",
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        padding: ".5rem 1rem .5rem .5rem",
        transition: "width 0.3s ease",
      }}
      className="d-none d-sm-flex flex-column gap-2 "
    >
      {/* logo section */}
      <h3
        style={{ position: "relative" }}
        className={`text-success headerLogoBorder justify-content-between align-items-center d-flex gap-2 ${
          activeCategory || extended ? "flex-row" : "flex-column"
        }`}
      >
        <Link
          to={DashbboardLink(userType)}
          style={{
            cursor: "pointer",
            width: "fit-content",
          }}
          className=" btn p-0 text-white rounded-0 py-0"
        >
          {activeCategory || extended ? (
            <div className="d-flex align-items-center">
              <img
                style={{ width: "10rem", height: "3rem", objectFit: "cover" }}
                src={logoSrc}
                alt=""
              />{" "}
            </div>
          ) : (
            <img
              style={{ width: "2rem", height: "2rem", objectFit: "cover" }}
              src={miniLogoSrc}
              alt=""
            />
          )}
        </Link>
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
          className={`${
            activeCategory || extended
              ? "my-auto ml-2 fs-4"
              : "my-auto mx-auto fs-4"
          }`}
        >
          <MdMenuOpen />
        </span>
      </h3>

      <div>
        <div
          className="m-0 py-2 px-1 d-flex flex-column gap-1 custom-scrollbar"
          style={{
            height: "calc(100vh - 18vh)",
            overflow: "auto",
          }}
        >
          {showScrollUp && (
            <span
              style={{
                cursor: "pointer",
                color: darkMode
                  ? "rgb(158, 154, 154)"
                  : "rgba(214, 211, 211, 0.82)",
              }}
              className={`mx-auto `}
              onClick={scrollUp}
            >
              <MdOutlineKeyboardArrowUp size={28} />
            </span>
          )}

          <div
            className={`m-0 p-2 rounded-2 d-flex flex-column gap-1 custom-scrollbar ${
              darkMode ? "navigationPannel-light" : "navigationPannel-dark"
            }`}
            ref={scrollContainerRef}
            style={{
              height: "auto",
              overflow: "auto",
              background: darkMode ? "#fbfbfb" : "rgba(49, 49, 49, 0.56)",
            }}
          >
            {allLinks
              .filter((links) => links.user === userData?.Account)
              .map(({ icon, name, navLinks }) =>
                navLinks.length > 1 ? (
                  <div
                    key={name}
                    onClick={() => toggleDropdown(name)}
                    className={`position-relative  rounded-3 hovered-nav-btns ${
                      darkMode
                        ? "hovered-nav-btns-secondary-light"
                        : "hovered-nav-btns-secondary-dark"
                    }`}
                  >
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
                      <span
                        style={{
                          color: darkMode
                            ? "var(--primaryDashColorDark)"
                            : "var(--primaryDashMenuColor)",
                          height: "3rem",
                          outline: "none",
                          border: "none",
                        }}
                        className="p-0 px-1 rounded-2 text-start gap-2 justify-between w-100 d-flex justify-content-between"
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
                            }}
                            className="m-auto activeIcon mx-auto d-flex rounded-5 justify-content-center fs-5"
                          >
                            {icon}
                          </p>
                          <p
                            style={{
                              display:
                                activeCategory || extended ? "block" : "none",
                            }}
                            className="my-auto activeFont"
                          >
                            {name}
                          </p>
                        </div>
                        <span
                          style={{
                            transform: `rotate(${
                              activeCategory === name ? "90deg" : "0deg"
                            })`,
                            transition: "1s ease",
                            display:
                              activeCategory || extended ? "block" : "none",
                          }}
                          className="my-auto fs-4"
                        >
                          <MdKeyboardArrowRight />
                        </span>
                      </span>
                    </OverlayTrigger>

                    <div
                      style={{
                        ...dropdownStyle,
                        display: activeCategory === name ? "flex" : "none",
                        width: "fit-content",
                        paddingLeft: "0rem",
                        marginLeft: "1.5rem",
                      }}
                      className={`flex-column start-100 py-0 px-1 gap-2 mt-0 pb-2 ${
                        darkMode
                          ? "navigationPannel-light"
                          : "navigationPannel-dark"
                      }`}
                    >
                      {navLinks.map((link) => (
                        <NavLink
                          className={`text-decoration-none   py-0 px-0 rounded-3 ${
                            darkMode
                              ? "hovered-nav-btns-light"
                              : "hovered-nav-btns-dark"
                          }`}
                          key={link.to}
                          to={link.to}
                        >
                          <div
                            style={{
                              color: darkMode
                                ? "var(--primaryDashColorDark)"
                                : "var(--primaryDashMenuColor)",
                              position: "relative",
                            }}
                            className={`text-decoration-none w-100 p-2  rounded-2 flex-nowrap text-start gap-3 d-flex justify-content-between `}
                          >
                            {" "}
                            <RxCornerBottomLeft
                              style={{
                                position: "absolute",
                                height: "1.5rem",
                                width: "1.5rem",
                                left: "-1rem",
                                top: "-.0rem",
                              }}
                            />
                            <div className="d-flex gap-1 flex-nowrap ">
                              <p className="m-0 activeIcon">{link.icon}</p>
                              <p
                                style={{ whiteSpace: "pre" }}
                                className="m-auto activeFont"
                              >
                                {link.label}
                              </p>
                            </div>
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <OverlayTrigger
                    key={name}
                    placement="right"
                    overlay={
                      !extended ? (
                        <Tooltip id={`tooltip-${name}`}>{name}</Tooltip>
                      ) : (
                        <span></span>
                      )
                    }
                  >
                    <NavLink
                      to={navLinks[0].to}
                      className={`text-decoration-none hovered-nav-btns rounded-3 ${
                        darkMode
                          ? "hovered-nav-btns-secondary-light"
                          : "hovered-nav-btns-secondary-dark"
                      }`}
                    >
                      <span
                        style={{
                          height: "3rem",
                          outline: "none",
                          border: "none",
                        }}
                        className="p-0  px-1 rounded-2 text-start gap-2 justify-between w-100 d-flex justify-content-between"
                      >
                        <div
                          style={{
                            width: "fit-content",
                          }}
                          className="d-flex activeIcon gap-2 my-auto"
                        >
                          <p
                            style={{
                              height: "30px",
                              width: "30px",
                              alignItems: "center",
                            }}
                            className="m-auto d-flex activeIcon rounded-3 justify-content-center fs-5"
                          >
                            {icon}
                          </p>
                          <p
                            style={{
                              display:
                                activeCategory || extended ? "block" : "none",
                            }}
                            className="my-auto activeFont"
                          >
                            {name}
                          </p>
                        </div>
                      </span>
                    </NavLink>
                  </OverlayTrigger>
                ),
              )}
          </div>
          {showScrollDown && (
            <span
              style={{
                cursor: "pointer",
                color: darkMode
                  ? "rgb(158, 154, 154)"
                  : "rgba(214, 211, 211, 0.82)",
              }}
              className={`mx-auto fs-6 `}
              onClick={scrollDown}
            >
              <MdOutlineKeyboardArrowDown size={28} />
            </span>
          )}
        </div>
      </div>
      <div
        style={{ height: "8vh", cursor: "pointer" }}
        className="d-flex align-items-end justify-content-center gap-2"
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://mymunc.com/"
          style={{
            cursor: "none",
          }}
          className="p-0 text-white rounded-0 py-0"
        >
          {activeCategory || extended ? (
            <div className="d-flex align-items-center ">
              <img
                style={{
                  width: "100%",
                  height: "3.8rem",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                src={footerLogoSrc}
                alt=""
              />{" "}
            </div>
          ) : (
            <img
              style={{
                width: "2rem",
                height: "2rem",
                objectFit: "cover",
                cursor: "pointer",
                filter: "drop-shadow(1px 1px 1px rgba(158, 154, 154, 0.53))",
              }}
              src={footerMiniLogoSrc}
              alt=""
            />
          )}
        </a>
      </div>
    </div>
  );
};

const dropdownStyle = {
  width: "250px",
  zIndex: "5",
};

export default MainSidebar;