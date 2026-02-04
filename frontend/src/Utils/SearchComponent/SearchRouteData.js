export const SearchRouteData = [
  // ===============================
  // Admin Routes (user: "1")
  // ===============================
  
  { control: "admin", name: "Dashboard", path: "/admin/dashboard" },
  { control: "admin", name: "Employee List", path: "/admin/employee" },
  { control: "admin", name: "Salary", path: "/admin/salary" },

  // Attendance
  { control: "admin", name: "My Attendance", path: "/admin/myAttendance" },
  {
    control: "admin",
    name: "TodaysAttendance",
    path: "/admin/todaysAttendance",
  },
  { control: "admin", name: "View Attendance", path: "/admin/viewAttendance" },
  {
    control: "admin",
    name: "Attendance register",
    path: "/admin/AttendanceRegister",
  },
  { control: "admin", name: "Update Attencance", path: "/admin/updateAttendance" },
  { control: "admin", name: "Shift Management", path: "/admin/shift-management" },
  { control: "admin", name: "NCNS & Sandwhich", path: "/admin/Update-Ncns-Or-Sandwhich" },
  
  // Leave
  { control: "admin", name: "Leave Request", path: "/admin/leaveApplication" },
  { control: "admin", name: "Approved Leaves", path: "/admin/leaveAccepted" },
  { control: "admin", name: "Rejected Leaves", path: "/admin/leaveRejected" },
  { control: "admin", name: "Leave Register", path: "/admin/leaveRegister" },
  { control: "admin", name: "Leave Assign", path: "/admin/leaveAssign" },
  { control: "admin", name: "Emp Leave Balance", path: "/admin/AllEmpLeave" },


  // Payroll
  { control: "admin", name: "Payroll Dashboard", path: "/admin/Payroll_Dashboard" },
  { control: "admin", name: "Run payroll", path: "/admin/Run_payroll" },
  { control: "admin", name: "Employee Salary Slips", path: "/admin/salary_Slips_All" },
  { control: "admin", name: "My Salary Slip", path: "/admin/salary_Slips" },


  // Task
  { control: "admin", name: "Create New Task", path: "/admin/task" },
  { control: "admin", name: "Assigned Task", path: "/admin/taskassign" },
  { control: "admin", name: "Active Task", path: "/admin/taskActive" },
  { control: "admin", name: "Cancelled Task", path: "/admin/taskcancle" },
  { control: "admin", name: "Completed Task", path: "/admin/taskcomplete" },
  { control: "admin", name: "Rejected Task", path: "/admin/taskreject" },


  // Report
  { control: "admin", name: "Daily Report", path: "/admin/GetReport" },
  { control: "admin", name: "Marketing Report", path: "/admin/ViewMarketingReport" },

  // Access
  { control: "admin", name: "Role", path: "/admin/role" },
  { control: "admin", name: "Position", path: "/admin/position" },
  { control: "admin", name: "Department", path: "/admin/department" },

  // Company
  { control: "admin", name: "Company List", path: "/admin/company" },

  // Address
  { control: "admin", name: "Country", path: "/admin/country" },
  { control: "admin", name: "State", path: "/admin/state" },
  { control: "admin", name: "City", path: "/admin/city" },

  // Notice
  { control: "admin", name: "Notice", path: "/admin/NoticeManagement" },

  // Request Details
  { control: "admin", name: "Request Open", path: "/admin/requestReceived" },
  { control: "admin", name: "Request Closed", path: "/admin/requestClosed" },

  // Holiday
  { control: "admin", name: "Holiday", path: "/admin/leaveCal" },

  // NoticeBoard
  { control: "admin", name: "Notice Board", path: "/admin/NoticeBoard" },

  // Project
  { control: "admin", name: "Project Bidding", path: "/admin/project-bid" },
  { control: "admin", name: "Portal Master", path: "/admin/portal-master" },

  // ===============================
  // HR Routes (user: "2")
  // ===============================
  { control: "hr", name: "Dashboard", path: "/hr/dashboard" },
  { control: "hr", name: "Employee List", path: "/hr/employee" },
  { control: "hr", name: "Salary", path: "/hr/salary" },

  // Attendance
  { control: "hr", name: "My Attendance", path: "/hr/my-attendance" },
  {
    control: "hr",
    name: "Attendance Register",
    path: "/hr/AttendanceRegister",
  },
  { control: "hr", name: "TodaysAttendance", path: "/hr/todaysAttendance" },
  { control: "hr", name: "View Attendance", path: "/hr/viewAttenDance" },
  { control: "hr", name: "Update Attencance", path: "/hr/updateAttendance" },
  { control: "hr", name: "Shift Management", path: "/hr/shift-management" },
  { control: "hr", name: "NCNS & Sandwhich", path: "/hr/pdate-Ncns-Or-Sandwhich" },   
    
  // Leave
  { control: "hr", name: "Create Leave", path: "/hr/createLeave" },
  { control: "hr", name: "Pending Leave", path: "/hr/leaveApplication" },
  { control: "hr", name: "Accepted Leave", path: "/hr/leaveAccepted" },
  { control: "hr", name: "Rejected Leave", path: "/hr/leaveRejected" },
  { control: "hr", name: "Assign Leave", path: "/hr/assignLeave" },
  { control: "hr", name: "Emp Leave Balance", path: "/hr/All-employee-leave" },
  { control: "hr", name: "Leave Register", path: "/hr/LeaveBalanceRegister" },
  
  // Payroll
  { control: "hr", name: "Payroll Dashboard", path: "/hr/Payroll_Dashboard" },
  { control: "hr", name: "Run payroll", path: "/hr/Run_payroll" },
  { control: "hr", name: "Employee Salary Slips", path: "/hr/salary_Slips_All" },
  { control: "hr", name: "My Salary Slip", path: "/hr/salary_Slips" },  


  // Access 
  { control: "hr", name: "Role", path: "/hr/role" },
  { control: "hr", name: "Position", path: "/hr/position" },
  { control: "hr", name: "Department", path: "/hr/department" },
  
  // Company 
  { control: "hr", name: "Company", path: "/hr/company" },

  // Address
  { control: "hr", name: "Country", path: "/hr/country" },
  { control: "hr", name: "State", path: "/hr/state" },
  { control: "hr", name: "City", path: "/hr/city" },
  
  
  // // Task
  // { control: "hr", name: "New Task", path: "/hr/newTask" },
  // { control: "hr", name: "Active Task", path: "/hr/ActiveTask" },
  // { control: "hr", name: "Task Cancel", path: "/hr/taskcancle" },
  // { control: "hr", name: "Task Complete", path: "/hr/taskcomplete" },
  // { control: "hr", name: "Reject Task", path: "/hr/rejectTask" },
  
  
  // Notice
  { control: "hr", name: "Notice", path: "/hr/NoticeManagement" },

    // NoticeBoard
    { control: "hr", name: "Notice Board", path: "/hr/NoticeBoard" },
  
  // My Request
  { control: "hr", name: "Raise Request", path: "/hr/request" },
  { control: "hr", name: "Open Request", path: "/hr/requestOpen" },
  { control: "hr", name: "Closed Request", path: "/hr/requestClosed" },
  
  // Team Request
  { control: "hr", name: "Open Team Request", path: "/hr/teamRequestOpen" },
  { control: "hr", name: "Closed Team Request", path: "/hr/teamRequestClosed" },
  

  // Holiday
  { control: "hr", name: "Holiday", path: "/hr/holiday" },
  
  // Profile
  { control: "hr", name: "Personal Info", path: "/hr/personal-info" },
 
  // Profile  
  { control: "hr", name: "Weekend Settings", path: "/hr/WeekendSettings" },


  // ===============================
  // Employee Routes (user: "3")
  // ===============================
  { control: "employee", name: "Dashboard", path: "/employee/dashboard" },
  { control: "employee", name: "Education", path: "/employee/:id/education" },
  { control: "employee", name: "Family", path: "/employee/:id/family-info" },
  {
    control: "employee",
    name: "Experience",
    path: "/employee/:id/work-experience",
  },
  { control: "employee", name: "Documents", path: "/employee/document" },
  {
    control: "employee",
    name: "Personal Info",
    path: "/employee/:id/personal-info",
  },
  {
    control: "employee",
    name: "View Attendance",
    path: "/employee/MyAttendance",
  },
  {
    control: "employee",
    name: "Leave Application",
    path: "/employee/leaveApplication",
  },

  {
    control: "employee",
    name: "Salary",
    path: "/employee/salary_Slips",
  },

  { control: "employee", name: "Task", path: "/employee/task" },
  { control: "employee", name: "Notification", path: "/employee/notification" },

    // NoticeBoard
    { control: "employee", name: "Notice Board", path: "/employee/NoticeBoard" },

  // Request
  { control: "employee", name: "Raise Request", path: "/employee/request" },
  { control: "employee", name: "Open Request", path: "/employee/requestOpen" },
  {
    control: "employee",
    name: "Closed Request",
    path: "/employee/requestClosed",
  },

  // ===============================
  // Manager Routes (user: "4")
  // ===============================
  { control: "manager", name: "Dashboard", path: "/manager/dashboard" },

  // Attendance
  { control: "manager", name: "My Attendance", path: "/manager/myAttendance" },
  {
    control: "manager",
    name: "TodaysAttendance",
    path: "/manager/todaysAttendance",
  },
  {
    control: "manager",
    name: "View Attendance",
    path: "/manager/viewAttenDance",
  },

  // Salary
  { control: "manager", name: "Salary Slip", path: "/manager/salary_Slips" },

  // Leave
  { control: "manager", name: "Create Leave", path: "/manager/createLeave" },
  {
    control: "manager",
    name: "Leave Requests",
    path: "/manager/leaveApplication",
  },
  {
    control: "manager",
    name: "Accepted Leave",
    path: "/manager/leaveApplicationAccepted",
  },
  {
    control: "manager",
    name: "Rejected Leave",
    path: "/manager/leaveApplicationRejected",
  },

  // Task
  { control: "manager", name: "Assigned Task", path: "/manager/newTask" },
  { control: "manager", name: "Active Task", path: "/manager/ActiveTask" },
  { control: "manager", name: "Cancelled Task", path: "/manager/taskcancle" },
  { control: "manager", name: "Completed Task", path: "/manager/taskcomplete" },
  { control: "manager", name: "Rejected Task", path: "/manager/rejectTask" },

  // Team Report
  { control: "manager", name: "Daily Report", path: "/manager/GetReport" },
  { control: "manager", name: "SEO Report", path: "/manager/ViewMarketingReport" },


  // Notice
  { control: "manager", name: "Notice", path: "/manager/NoticeManagement" },

  // My Request
  { control: "manager", name: "Raise Request", path: "/manager/request" },
  { control: "manager", name: "Open Request", path: "/manager/requestOpen" },
  {
    control: "manager",
    name: "Closed Request",
    path: "/manager/requestClosed",
  },

      // NoticeBoard
      { control: "manager", name: "Notice Board", path: "/manager/NoticeBoard" },
  

  // Team Request
  {
    control: "manager",
    name: "Open Team Request",
    path: "/manager/teamRequestOpen",
  },
  {
    control: "manager",
    name: "Closed Team Request",
    path: "/manager/teamRequestClosed",
  },

  // Profile
  { control: "manager", name: "Personal Info", path: "/manager/personal-info" },

  // Holiday
  { control: "manager", name: "Holiday Calendar", path: "/manager/holiday" },
];
