
import React, { Suspense, lazy, useEffect, useState } from "react";
import { createBrowserRouter, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userInfo } from "./redux/slices/userSlice.js";
import LoaderRoute from "./LoaderRoute.jsx";


/* ---------------------------------------------
   LAZY LOADING IMPORTS (AUTO OPTIMIZED)
---------------------------------------------- */

const Login = lazy(() => import("./Pages/Login/Login.jsx"));
const NotFound404 = lazy(() => import("./Pages/PageNot/NotFound404.jsx"));

/* HR */
const DashboardHR = lazy(() => import("./Component/HrManager/DashboardHR"));
const Dashboard = lazy(() => import("./Component/HrManager/Dashboard/HRDash"));
const Role = lazy(() => import("./Pages/Department/Role.jsx"));
const Position = lazy(() => import("./Pages/Department/Position.jsx"));
const Department = lazy(() => import("./Pages/Department/Department.jsx"));
const Country = lazy(() => import("./Pages/Location/Country.jsx"));
const State = lazy(() => import("./Pages/Location/State.jsx"));
const City = lazy(() => import("./Pages/Location/City.jsx"));
const Company = lazy(() => import("./Pages/Company/Company.jsx"));
const Employee = lazy(() => import("./Pages/AddEmployee/Employee.jsx"));
const Salary = lazy(() => import("./Pages/Salary/Salary.jsx"));
const LeaveApplicationHR = lazy(() => import("./Component/HrManager/LeaveApplicationHR.jsx"));
const ViewAttendance = lazy(() => import("./Component/HrManager/attendance/ViewAttendance.jsx"));
const Attendance = lazy(() => import("./Component/HrManager/attendance/SelfAttendance.jsx"));
const LeaveCalendar = lazy(() => import("./Pages/LeaveCalendar/LeaveCalendar.jsx"));
const TodaysAttendance = lazy(() => import("./Pages/DailyAttendance/TodaysAttendance.jsx"));
const LeaveApplication = lazy(() => import("./Pages/ApplyLeave/LeaveApplication.jsx"));
const LeaveApplicationHRAccept = lazy(() => import("./Component/HrManager/LeaveStatus/LeaveApplicationHRAccept.jsx"));
const LeaveApplicationHRReject = lazy(() => import("./Component/HrManager/LeaveStatus/LeaveApplicationHRReject.jsx"));
const AttendanceRegister = lazy(() => import("./Component/HrManager/attendance/AttendanceRegister.jsx"));
const Notification = lazy(() => import("./Component/HrManager/Notification/Notification.jsx"));
const ManualAttendance = lazy(() => import("./Component/HrManager/attendance/ManualAttendance.jsx"));
const PersonalInfo = lazy(() => import("./Component/Employee/EmpPresonal/PersonalInfo.jsx"));
const LeaveAssign = lazy(() => import("./Component/HrManager/LeaveStatus/LeaveAssign.jsx"));
const AllEmpLeaves = lazy(() => import("./Component/HrManager/LeaveStatus/AllEmpLeaves.jsx"));
const LeaveBalance = lazy(() => import("./Component/HrManager/LeaveStatus/LeaveBalance.jsx"));
const NoticeManagement = lazy(() => import("./Component/Admin/Notification/NoticeManagement.jsx"));
const AttendanceUpdateForm = lazy(() => import("./Pages/AttendanceUpdateForm.jsx"));
const AttendanceUpdateBreak = lazy(() => import("./Pages/AttendanceUpdateBreakForm.jsx"));
const NoticeBoard = lazy(() => import("./Utils/NoticeBoard/NoticeBoard.jsx"));
const RequestForm = lazy(() => import("./Pages/RequestTicket/RequestForm.jsx"));
const RequestRaised = lazy(() => import("./Pages/RequestTicket/RequestRaised.jsx"));
const RequestRaisedClosed = lazy(() => import("./Pages/RequestTicket/RequestRaisedClosed.jsx"));
const RequestDetailsPending = lazy(() => import("./Pages/RequestTicket/RequestDetailsPending.jsx"));
const RequestDetails = lazy(() => import("./Pages/RequestTicket/RequestDetails.jsx"));

/* EMPLOYEE */
const DashboardEmployee = lazy(() => import("./Component/Employee/DashboardEmployee.jsx"));
const Education = lazy(() => import("./Component/Employee/EmpEducation/Education.jsx"));
const FamilyInfo = lazy(() => import("./Component/Employee/EmpFamily/FamilyInfo.jsx"));
const WorkExperience = lazy(() => import("./Component/Employee/EmpWorkExp/WorkExperience.jsx"));
const LeaveApplicationEmp = lazy(() => import("./Component/Employee/EmpLeave/LeaveApplicationEmp.jsx"));
const EmployeeNewTask = lazy(() => import("./Component/Employee/EmployeeTaskManagement/EmployeeNewTask.jsx"));
const EmployeeActiveTask = lazy(() => import("./Component/Employee/EmployeeTaskManagement/EmployeeActiveTask.jsx"));
const EmployeeCompleteTask = lazy(() => import("./Component/Employee/EmployeeTaskManagement/EmployeeCompleteTask.jsx"));
const EmployeeRejectTask = lazy(() => import("./Component/Employee/EmployeeTaskManagement/EmployeeRejectTask.jsx"));
const EmpAttendance = lazy(() => import("./Component/Employee/attendance/Attendance.jsx"));
const AttendanceList = lazy(() => import("./Component/Employee/attendance/AttendanceList.jsx"));
const EmpDash = lazy(() => import("./Component/Employee/Dashboard/EmpDash.jsx"));
const DepartmentChart = lazy(() => import("./Component/Employee/Dashboard/EmpChart.jsx/DepartmentChart.jsx"));
const UpcomingBirthdays = lazy(() => import("./Component/Employee/Dashboard/CountData/UpcomingBirthdays.jsx"));
const EmpNotification = lazy(() => import("./Component/Employee/Notification/Notification.jsx"));
const Document = lazy(() => import("./Component/Employee/Document/Document.jsx"));
const AttendanceDetails = lazy(() => import("./Component/Employee/attendance/AttendanceDetails.jsx"));
const UpdateTaskEmpManager = lazy(() => import("./Pages/UpdateTaskEmpManager.jsx"));
const TaskContainer = lazy(() => import("./Component/Employee/EmployeeTaskManagement/TaskContainer/TaskContainer.jsx"));
const EmpTaskChart = lazy(() => import("./Component/Employee/Dashboard/EmpChart.jsx/EmpTaskChart.jsx"));
const EmpTaskCount = lazy(() => import("./Component/Employee/Dashboard/CountData/EmpTaskCount.jsx"));

/* ADMIN */
const DashboardAdmin = lazy(() => import("./Component/Admin/DashboardAdmin.jsx"));
const AdminDasd = lazy(() => import("./Component/Admin/Dashboard/AdminDash.jsx"));
const AdminPortal = lazy(() => import("./Component/Admin/AdminPortal.jsx"));
const AdminProjectBid = lazy(() => import("./Component/Admin/AdminProjectBid.jsx"));
const AdminLeaveApplicationHR = lazy(() => import("./Component/Manager/LeaveApplicationHR.jsx"));
const AdminEmployee = lazy(() => import("./Component/Admin/EmployeeList/AdminEmployee.jsx"));
const TaskHead = lazy(() => import("./Component/Admin/TaskManagement/taskHead/TaskHead.jsx"));
const AdminAsignTask = lazy(() => import("./Component/Admin/TaskManagement/AdminAsignTask.jsx"));
const AdminTaskStatus = lazy(() => import("./Component/Admin/TaskManagement/AdminTaskStatus.jsx"));
const AdminCancleTask = lazy(() => import("./Component/Admin/TaskManagement/AdminCancleTask.jsx"));
const AdminAssignedTask = lazy(() => import("./Component/Admin/TaskManagement/AdminAssignedTask.jsx"));
const AdminActive = lazy(() => import("./Component/Admin/TaskManagement/AdminActive.jsx"));
const AdminCompleteTask = lazy(() => import("./Component/Admin/TaskManagement/AdminCompleteTask.jsx"));
const RejectedTask = lazy(() => import("./Component/Admin/TaskManagement/RejectedTask.jsx"));
const AdminAttendance = lazy(() => import("./Component/Admin/attendance/Attendance.jsx"));
const AdminNotification = lazy(() => import("./Component/Admin/Notification/Notification.jsx"));
const AllEmpLeave = lazy(() => import("./Component/Admin/leave/AllEmpLeave.jsx"));
const AdminLeaveAssign = lazy(() => import("./Component/Admin/leave/LeaveAssign.jsx"));

/* MANAGER */
const ManagerDashboard = lazy(() => import("./Component/Manager/ManagerDashboard.jsx"));
const ManagerLeaveApplicationHRAccepted = lazy(() => import("./Component/Manager/LeaveApplicationHRAccepted.jsx"));
const ManagerLeaveApplicationHRRejected = lazy(() => import("./Component/Manager/LeaveApplicationHRRejected.jsx"));
const ManagDashboard = lazy(() => import("./Component/Manager/Dashboard/ManagerDash.jsx"));
const ManagerTask = lazy(() => import("./Component/Manager/ManagerTaskManagement/taskContainer/ManagerTask.jsx"));
const ManagerNewTask = lazy(() => import("./Component/Manager/ManagerTaskManagement/ManagerNewTask.jsx"));
const ManagerCencelledTask = lazy(() => import("./Component/Manager/ManagerTaskManagement/ManagerCencelledTask.jsx"));
const ManagerCompletedTask = lazy(() => import("./Component/Manager/ManagerTaskManagement/ManagerCompletedTask.jsx"));
const ManagerRejectedTask = lazy(() => import("./Component/Manager/ManagerTaskManagement/ManagerRejectedTask.jsx"));
const ManagerActiveTask = lazy(() => import("./Component/Manager/ManagerTaskManagement/ManagerActiveTask.jsx"));
const ManagerNotification = lazy(() => import("./Component/Manager/Notification/Notification.jsx"));

/* OTHERS */
const ForgetPass = lazy(() => import("./Pages/ForgotPass/ForgetPass.jsx"));
const AddMarketingReport = lazy(() => import("./Utils/MarketingReport/AddMarketingReport.jsx"));
const ViewMarketingReport = lazy(() => import("./Utils/MarketingReport/ViewMarketingReport.jsx"));
const CreateReport = lazy(() => import("./Utils/DailyReports/CreateReport.jsx"));
const GetReport = lazy(() => import("./Utils/DailyReports/GetReport.jsx"));
const AddMarketingReportMany = lazy(() => import("./Utils/MarketingReport/AddMarketingReportMany.jsx"));
const ReminderApp = lazy(() => import("./Utils/Tools/TodoList/ReminderApp.jsx"));
const MyTodo = lazy(() => import("./Utils/Tools/MyTodo/MyTodo.jsx"));
const ShiftComponent = lazy(() => import("./Pages/Attendance/ShiftComponent/ShiftComponent.jsx"));
const LeaveBalanceRegister = lazy(() => import("./Pages/LeaveBalanceRegister/LeaveBalanceRegister.jsx"));
const WeekendSettings = lazy(() => import("./Settings/WeekendSettings.jsx"));
const UpdateNcnsOrSandwhich = lazy(() => import("./Pages/Attendance/UpdateNcnsOrSandwhich/UpdateNcnsOrSandwhich.jsx"));
const RunPayroll = lazy(() => import("./Pages/PayrollManagement/RunPayroll.jsx"));
const PayrollDashboard = lazy(() => import("./Pages/PayrollManagement/PayrollDashboard.jsx"));
const PayrollProcessing = lazy(() => import("./Pages/PayrollManagement/PayrollProcessing.jsx"));
const EmployeeReimbursment = lazy(() => import("./Pages/Reimbursment/EmployeeReimbursment.jsx"));
const AdminHRReimbursmentView = lazy(() => import("./Pages/Reimbursment/AdminHRReimbursmentView.jsx"));
const SalarySlip = lazy(() => import("./Pages/PayrollManagement/SalarySlip.jsx"));
const SalarySlipAll = lazy(() => import("./Pages/PayrollManagement/SalarySlipAll.jsx"));
const EmployeeSalarySlips = lazy(() => import("./Pages/EmployeeSalarySlips.jsx/EmployeeSalarySlips.jsx"));
const AllEmployeeSalarySlips = lazy(() => import("./Pages/EmployeeSalarySlips.jsx/AllEmployeeSalarySlips.jsx"));
const AgendaCalendarAdmin = lazy(() => import("./Applications/AgendaCalendar/AgendaCalendarAdmin.jsx"));
const UpdateEmployeeShift = lazy(() => import("./Utils/Shifts/UpdateEmployeeShift.jsx"));
const UpcomingScheduledShifts = lazy(() => import("./Utils/Shifts/UpcomingScheduledShifts.jsx"));
const EmployeeShiftHistory = lazy(() => import("./Utils/Shifts/EmployeeShiftHistory.jsx"));
const AgendaMeetings = lazy(() => import("./Applications/AgendaCalendar/AgendaMeetings.jsx"));
const AgendaReminders = lazy(() => import("./Applications/AgendaCalendar/AgendaReminders.jsx"));
const UpdateLeaveForm = lazy(() => import("./Component/HrManager/LeaveStatus/UpdateLeaveForm.jsx"));
const BrandingSettings = lazy(() => import("./Settings/Brandlogo/BrandLogo.jsx"));

/* TEAM */
const TeamList = lazy(() => import("./Pages/TeamList.jsx"));
const Team = lazy(() => import("./Pages/Team.jsx"));

/* UPDATE TASK */
const UpdateTask = lazy(() => import("./Pages/UpdateTask.jsx"));

/* MONTHLY LEAVE */
const MonthlyLeaveRegister = lazy(() => import("./Pages/ApplyLeave/MonthlyLeaveRegister/MonthlyLeaveRegister.jsx"));

/* ---------------------------------------------
   PROTECTED ROUTE
---------------------------------------------- */

const ProtectedRoute = ({ allowedRoles, children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        await dispatch(userInfo()).unwrap();
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    if (!userData) fetchUser();
    else setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && userData) {
      if (location.pathname === "/") {
        const redirectPaths = {
          1: "/admin/dashboard",
          2: "/hr/dashboard",
          3: "/employee/dashboard",
          4: "/manager/dashboard",
        };
        navigate(redirectPaths[userData.Account] || "/");
      }

      if (allowedRoles && !allowedRoles.includes(userData.Account)) {
        navigate("/");
      }
    }
  }, [loading, userData]);

  if (loading) return <LoaderRoute />;

  return children;
};

/* ---------------------------------------------
   ROUTES
---------------------------------------------- */

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoaderRoute />}>
        <Login />
      </Suspense>
    ),
  },

  /* HR ROUTES */
  {
    path: "/hr",
    element: (
      <ProtectedRoute allowedRoles={[2]}>
        <Suspense fallback={<LoaderRoute />}>
          <DashboardHR />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "employee/*", element: <Employee /> },
      { path: "salary", element: <Salary /> },
      { path: "company", element: <Company /> },
      { path: "role", element: <Role /> },
      { path: "position", element: <Position /> },
      { path: "department", element: <Department /> },
      { path: "country", element: <Country /> },
      { path: "state", element: <State /> },
      { path: "city", element: <City /> },
      { path: "leaveApplication", element: <LeaveApplicationHR /> },
      { path: "assignLeave", element: <LeaveAssign /> },
      { path: "leaveBalance", element: <LeaveBalance /> },
      { path: "All-employee-leave", element: <AllEmpLeaves /> },
      { path: "my-attendance", element: <Attendance /> },
      { path: "viewAttenDance", element: <ViewAttendance /> },
      { path: "AttendanceRegister", element: <AttendanceRegister /> },
      { path: "NoticeManagement", element: <NoticeManagement /> },
      { path: "holiday", element: <LeaveCalendar /> },
      { path: "todaysAttendance", element: <TodaysAttendance /> },
      { path: "createLeave", element: <LeaveApplication /> },
      { path: "leaveAccepted", element: <LeaveApplicationHRAccept /> },
      { path: "leaveRejected", element: <LeaveApplicationHRReject /> },
      { path: "update-leave", element: <UpdateLeaveForm /> },
      { path: "notification", element: <Notification /> },
      { path: "manualAttand", element: <ManualAttendance /> },
      { path: "personal-info", element: <PersonalInfo /> },
      { path: "request", element: <RequestForm /> },
      { path: "requestOpen", element: <RequestRaised /> },
      { path: "requestClosed", element: <RequestRaisedClosed /> },
      { path: "teamRequestClosed", element: <RequestDetails /> },
      { path: "teamRequestOpen", element: <RequestDetailsPending /> },
      { path: "updateAttendance", element: <AttendanceUpdateForm /> },
      { path: "updateBreak", element: <AttendanceUpdateBreak /> },
      { path: "NoticeBoard", element: <NoticeBoard /> },
      { path: ":id/attenDance", element: <EmpAttendance /> },
      { path: "LeaveBalanceRegister", element: <LeaveBalanceRegister /> },
      { path: "WeekendSettings", element: <WeekendSettings /> },
      { path: "BrandingSettings", element: <BrandingSettings /> },
      { path: "shift-management", element: <ShiftComponent /> },
      { path: "Update-Ncns-Or-Sandwhich", element: <UpdateNcnsOrSandwhich /> },
      { path: "EmployeeReimbursment", element: <EmployeeReimbursment /> },
      { path: "Reimbursment_View", element: <AdminHRReimbursmentView /> },
      { path: "Payroll_Dashboard", element: <PayrollDashboard /> },
      { path: "Run_payroll", element: <RunPayroll /> },
      { path: "Payroll_Processing", element: <PayrollProcessing /> },
      { path: "salary_Slips", element: <EmployeeSalarySlips /> },
      { path: "salary_Slips_All", element: <AllEmployeeSalarySlips /> },
      { path: "View_Salary_Slip/:year/:month", element: <SalarySlip /> },
      {
        path: "View_Salary_Slip/All/:employeeId/:year/:month",
        element: <SalarySlipAll />,
      },
      { path: "*", element: <NotFound404 /> },
    ],
  },

  /* EMPLOYEE ROUTES */
  {
    path: "/employee",
    element: (
      <ProtectedRoute allowedRoles={[3]}>
        <Suspense fallback={<LoaderRoute />}>
          <DashboardEmployee />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <EmpDash /> },
      { path: ":id/education", element: <Education /> },
      { path: ":id/family-info", element: <FamilyInfo /> },
      { path: ":id/personal-info", element: <PersonalInfo /> },
      { path: ":id/work-experience", element: <WorkExperience /> },
      { path: ":id/leave-application-emp", element: <LeaveApplicationEmp /> },
      { path: "leaveApplication", element: <LeaveApplication /> },
      { path: ":id/attenDance", element: <EmpAttendance /> },
      { path: ":id/attendanceList", element: <AttendanceList /> },
      { path: "MyAttendance", element: <Attendance /> },
      { path: ":id/departmentchart", element: <DepartmentChart /> },
      { path: "newTask", element: <EmployeeNewTask /> },
      { path: "activeTask", element: <EmployeeActiveTask /> },
      { path: "taskcomplete", element: <EmployeeCompleteTask /> },
      { path: "taskreject", element: <EmployeeRejectTask /> },
      { path: ":id/selfAtteend", element: <AttendanceDetails /> },
      { path: ":id/birthDay", element: <UpcomingBirthdays /> },
      { path: "notification", element: <EmpNotification /> },
      { path: "document", element: <Document /> },
      { path: "emp_manager", element: <UpdateTaskEmpManager /> },
      { path: "request", element: <RequestForm /> },
      { path: "requestOpen", element: <RequestRaised /> },
      { path: "requestClosed", element: <RequestRaisedClosed /> },
      { path: "NoticeBoard", element: <NoticeBoard /> },
      { path: "task", element: <TaskContainer /> },
      { path: "chart", element: <EmpTaskChart /> },
      { path: "count", element: <EmpTaskCount /> },
      { path: "addReport", element: <AddMarketingReport /> },
      { path: "viewReport", element: <ViewMarketingReport /> },
      { path: "CreateReport", element: <CreateReport /> },
      { path: "GetReport", element: <GetReport /> },
      { path: "AddMarketingReportMany", element: <AddMarketingReportMany /> },
      { path: "ReminderApp", element: <ReminderApp /> },
      { path: "MyTodo", element: <MyTodo /> },
      { path: "EmployeeReimbursment", element: <EmployeeReimbursment /> },
      { path: "salary_Slips", element: <EmployeeSalarySlips /> },
      { path: "View_Salary_Slip/:year/:month", element: <SalarySlip /> },
      { path: "*", element: <NotFound404 /> },
    ],
  },

  /* ADMIN ROUTES */
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[1]}>
        <Suspense fallback={<LoaderRoute />}>
          <DashboardAdmin />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDasd /> },
      { path: "role", element: <Role /> },
      { path: "position", element: <Position /> },
      { path: "department", element: <Department /> },
      { path: "portal-master", element: <AdminPortal /> },
      { path: "project-bid", element: <AdminProjectBid /> },
      { path: "salary", element: <Salary /> },
      { path: "employee/*", element: <AdminEmployee /> },
      { path: "UpdateEmployeeShift", element: <UpdateEmployeeShift /> },
      { path: "UpdateEmployeeShiftList", element: <UpcomingScheduledShifts /> },
      { path: "EmployeeShiftHistory", element: <EmployeeShiftHistory /> },
      { path: "taskhead", element: <TaskHead /> },
      { path: "task", element: <AdminAsignTask /> },
      { path: "taskassign", element: <AdminAssignedTask /> },
      { path: "taskstatus", element: <AdminTaskStatus /> },
      { path: "taskcancle", element: <AdminCancleTask /> },
      { path: "taskActive", element: <AdminActive /> },
      { path: "leaveCal", element: <LeaveCalendar /> },
      { path: "country", element: <Country /> },
      { path: "state", element: <State /> },
      { path: "city", element: <City /> },
      { path: "company", element: <Company /> },
      { path: "taskcomplete", element: <AdminCompleteTask /> },
      { path: "taskreject", element: <RejectedTask /> },
      { path: "admin_manager", element: <UpdateTask /> },
      { path: "adminAttendance", element: <AdminAttendance /> },
      { path: "viewAttendance", element: <ViewAttendance /> },
      { path: "todaysAttendance", element: <TodaysAttendance /> },
      { path: "myAttendance", element: <Attendance /> },
      { path: "updateAttendance", element: <AttendanceUpdateForm /> },
      { path: "updateBreak", element: <AttendanceUpdateBreak /> },
      { path: "applyLeave", element: <LeaveApplication /> },
      { path: "AllEmpLeave", element: <AllEmpLeave /> },
      { path: "leaveAssign", element: <AdminLeaveAssign /> },
      { path: "leaveAccepted", element: <LeaveApplicationHRAccept /> },
      { path: "leaveApplication", element: <AdminLeaveApplicationHR /> },
      { path: "leaveRejected", element: <LeaveApplicationHRReject /> },
      { path: "update-leave", element: <UpdateLeaveForm /> },
      { path: "requestClosed", element: <RequestDetails /> },
      { path: "requestReceived", element: <RequestDetailsPending /> },
      { path: "notification", element: <AdminNotification /> },
      { path: "NoticeManagement", element: <NoticeManagement /> },
      { path: "teamList", element: <TeamList /> },
      { path: "managerTeam", element: <Team /> },
      { path: "NoticeBoard", element: <NoticeBoard /> },
      { path: "AttendanceRegister", element: <AttendanceRegister /> },
      { path: "monthlyLeave", element: <MonthlyLeaveRegister /> },
      { path: "WeekendSettings", element: <WeekendSettings /> },
      { path: "BrandingSettings", element: <BrandingSettings /> },
      { path: "leaveRegister", element: <LeaveBalanceRegister /> },
      { path: "shift-management", element: <ShiftComponent /> },
      { path: "Update-Ncns-Or-Sandwhich", element: <UpdateNcnsOrSandwhich /> },
      { path: "ViewMarketingReport", element: <ViewMarketingReport /> },
      { path: "Payroll_Dashboard", element: <PayrollDashboard /> },
      { path: "Run_payroll", element: <RunPayroll /> },
      { path: "Payroll_Processing", element: <PayrollProcessing /> },
      { path: "salary_Slips", element: <EmployeeSalarySlips /> },
      { path: "salary_Slips_All", element: <AllEmployeeSalarySlips /> },
      { path: "View_Salary_Slip/:year/:month", element: <SalarySlip /> },
      {
        path: "View_Salary_Slip/All/:employeeId/:year/:month",
        element: <SalarySlipAll />,
      },
      { path: "GetReport", element: <GetReport /> },
      { path: "Agenda", element: <AgendaCalendarAdmin /> },
      { path: "AgendaReminders", element: <AgendaReminders /> },
      { path: "AgendaMeetings", element: <AgendaMeetings /> },
      { path: "*", element: <NotFound404 /> },
    ],
  },

  /* MANAGER ROUTES */
  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={[4]}>
        <Suspense fallback={<LoaderRoute />}>
          <ManagerDashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { path: "employee/*", element: <Employee /> },
      { path: "salary", element: <Salary /> },
      { path: "company", element: <Company /> },
      { path: "role", element: <Role /> },
      { path: "position", element: <Position /> },
      { path: "department", element: <Department /> },
      { path: "country", element: <Country /> },
      { path: "state", element: <State /> },
      { path: "city", element: <City /> },
      { path: "leaveApplication", element: <AdminLeaveApplicationHR /> },
      {
        path: "leaveApplicationAccepted",
        element: <ManagerLeaveApplicationHRAccepted />,
      },
      {
        path: "leaveApplicationRejected",
        element: <ManagerLeaveApplicationHRRejected />,
      },
      { path: "dashboard", element: <ManagDashboard /> },
      { path: "newTask", element: <ManagerNewTask /> },
      { path: "ActiveTask", element: <ManagerActiveTask /> },
      { path: "admin_manager", element: <UpdateTask /> },
      { path: "emp_manager", element: <UpdateTaskEmpManager /> },
      { path: "taskcancle", element: <ManagerCencelledTask /> },
      { path: "taskcomplete", element: <ManagerCompletedTask /> },
      { path: "rejectTask", element: <ManagerRejectedTask /> },
      { path: "viewAttenDance", element: <ViewAttendance /> },
      { path: "NoticeManagement", element: <NoticeManagement /> },
      { path: "holiday", element: <LeaveCalendar /> },
      { path: "todaysAttendance", element: <TodaysAttendance /> },
      { path: "managerTask", element: <ManagerTask /> },
      { path: "myAttendance", element: <Attendance /> },
      { path: "notification", element: <ManagerNotification /> },
      { path: "createLeave", element: <LeaveApplication /> },
      { path: "LeaveBalance", element: <LeaveBalance /> },
      { path: "team", element: <Team /> },
      { path: "request", element: <RequestForm /> },
      { path: "requestOpen", element: <RequestRaised /> },
      { path: "requestClosed", element: <RequestRaisedClosed /> },
      { path: "teamRequestClosed", element: <RequestDetails /> },
      { path: "teamRequestOpen", element: <RequestDetailsPending /> },
      { path: "NoticeBoard", element: <NoticeBoard /> },
      { path: "personal-info", element: <PersonalInfo /> },
      { path: "ViewMarketingReport", element: <ViewMarketingReport /> },
      { path: "EmployeeReimbursment", element: <EmployeeReimbursment /> },
      { path: "GetReport", element: <GetReport /> },
      { path: "salary_Slips", element: <EmployeeSalarySlips /> },
      { path: "View_Salary_Slip/:year/:month", element: <SalarySlip /> },
      { path: "*", element: <NotFound404 /> },
    ],
  },

  /* FORGET PASSWORD */
  {
    path: "/forgetPassword",
    element: (
      <Suspense fallback={<LoaderRoute />}>
        <ForgetPass />
      </Suspense>
    ),
  },

  { path: "/404", element: <NotFound404 /> },
  { path: "*", element: <NotFound404 /> },
]);




