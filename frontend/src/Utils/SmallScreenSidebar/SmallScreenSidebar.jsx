import {useState } from "react";
import {FaRegUserCircle } from "react-icons/fa";
import {
  MdCurrencyRupee,
  MdOutlineContacts,
  MdOutlineDashboardCustomize,
  MdOutlineLocationOn,
  MdOutlinePayments,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import {
  IoCalendarOutline,
  IoCashOutline,
  IoLocationOutline,
  IoSettingsOutline,
  IoTicketOutline,
} from "react-icons/io5";
import {
  IoIosHelpCircleOutline,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { GoTasklist } from "react-icons/go";
import { LuKeyRound, LuLayoutDashboard, LuPartyPopper } from "react-icons/lu";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaRegCircleUser } from "react-icons/fa6";
import { ImCalendar } from "react-icons/im";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbBeach, TbTimeDurationOff, TbUserCheck } from "react-icons/tb";
import { PiUsersThree } from "react-icons/pi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { RiUser3Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import Logo from "../../img/KasperLogo1.png";
import { FiFileText } from "react-icons/fi";
import { GiTakeMyMoney } from "react-icons/gi";
import { TfiAgenda } from "react-icons/tfi";

const SmallScreenSidebar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { toggleSidebar } = useSidebar();
  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);
  const LoginUser = userData?.Account;

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
      navLinks: [{ to: "/admin/NoticeManagement", label: "Notice" }],
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
      navLinks: [{ to: "/hr/NoticeManagement", label: "Notice" }],
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
      navLinks: [{ to: "/manager/NoticeManagement", label: "Notice" }],
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
          { to: "/employee/viewReport", label: "Seo Report" },
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
          className="fw-normal fs-6 rounded-5 my-auto mx-auto border-1 border d-flex  justify-content-center align-items-center"
          style={{
            height: "20px",
            width: "20px",
            cursor: "pointer",
            color: !darkMode ? "white" : "black",
          }}
          onClick={toggleSidebar}
        >
          X
        </span>
      </h3>
      <img
        style={{ width: "2.5rem", height: "2.5rem", objectFit: "cover" }}
        src={Logo}
        alt=""
      />
      <div
        style={{ height: "2px", width: "100%", background: "#DE4E26" }}
      ></div>

      <div style={{ height: "60vh" }}>
        {allLinks
          .filter((links) => links.user === LoginUser)
          .map(({ icon, name, navLinks }) => (
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
                  <Link
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
    </div>
  );
};

const dropdownStyle = {
  width: "250px",
  zIndex: "5000",
  borderLeft: "5px solid white",
};

export default SmallScreenSidebar;