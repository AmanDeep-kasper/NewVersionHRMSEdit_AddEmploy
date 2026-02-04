// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Role from "../../Pages/Department/Role.jsx";
// import Position from "../../Pages/Department/Position.jsx";
// import Department from "../../Pages/Department/Department.jsx";
// import Country from "../../Pages/Location/Country.jsx";
// import State from "../../Pages/Location/State.jsx";
// import City from "../../Pages/Location/City.jsx";
// import Company from "../../Pages/Company/Company.jsx";
// import Employee from "../../Pages/AddEmployee/Employee.jsx";
// import Salary from "../../Pages/Salary/Salary.jsx";
// import LeaveApplicationHR from "../HrManager/LeaveApplicationHR.jsx";
// import NotFound404 from "../../Pages/PageNot/NotFound404.jsx";
// import Dashboard from "../HrManager/Dashboard/HRDash.jsx";
// import ViewAttendance from "../HrManager/attendance/ViewAttendance.jsx";
// import Attendance from "../HrManager/attendance/SelfAttendance.jsx";
// import LeaveCalendar from "../../Pages/LeaveCalendar/LeaveCalendar.jsx";
// import TodaysAttendance from "../../Pages/DailyAttendance/TodaysAttendance.jsx";
// import LeaveApplication from "../../Pages/ApplyLeave/LeaveApplication.jsx";
// import LeaveApplicationHRAccept from "./LeaveStatus/LeaveApplicationHRAccept.jsx";
// import LeaveApplicationHRReject from "./LeaveStatus/LeaveApplicationHRReject.jsx";
// import AttendanceRegister from "./attendance/AttendanceRegister.jsx";
// import Notification from "./Notification/Notification.jsx";
// import ManualAttendance from "./attendance/ManualAttendance.jsx";
// import PersonalInfo from "../Employee/EmpPresonal/PersonalInfo.jsx";
// import LeaveAssign from "./LeaveStatus/LeaveAssign.jsx";
// import AllEmpLeaves from "./LeaveStatus/AllEmpLeaves.jsx";
// import LeaveBalance from "./LeaveStatus/LeaveBalance.jsx";
// import NoticeManagement from "../Admin/Notification/NoticeManagement.jsx";
// import AttendanceUpdateForm from "../../Pages/AttendanceUpdateForm.jsx";
// import NoticeBoard from "../../Utils/NoticeBoard/NoticeBoard.jsx";
// import RequestForm from "../../Pages/RequestTicket/RequestForm.jsx";
// import RequestRaised from "../../Pages/RequestTicket/RequestRaised.jsx";
// import RequestRaisedClosed from "../../Pages/RequestTicket/RequestRaisedClosed.jsx";
// import RequestDetailsPending from "../../Pages/RequestTicket/RequestDetailsPending.jsx";
// import RequestDetails from "../../Pages/RequestTicket/RequestDetails.jsx";
// import LeaveRegister from "../../Utils/LeaveComponentHrDash/LeaveRegister.jsx";

// const MainContent = () => {
//   return (
   
//       <Routes>
//         <Route path="/hr/employee" component={Employee} />
//         <Route path="/hr/salary" exact component={Salary} />
//         <Route path="/hr/company" exact component={Company} />
//         <Route path="/hr/role" component={Role} />
//         <Route path="/hr/position" exact component={Position} />
//         <Route path="/hr/department" exact component={Department} />
//         <Route path="/hr/country" exact component={Country} />
//         <Route path="/hr/state" exact component={State} />
//         <Route path="/hr/city" exact component={City} />
//         <Route
//           path="/hr/leaveApplication"
//           exact
//           component={LeaveApplicationHR}
//         />

//         <Route path="/hr/assignLeave" exact component={LeaveAssign} />
//         <Route path="/hr/leaveBalance" exact component={LeaveBalance} />
//         <Route path="/hr/allEmpLeave" exact component={AllEmpLeaves} />

//         <Route path="/hr/city" exact component={City} />
//         <Route path="/hr/dashboard" exact component={Dashboard} />
//         <Route path="/hr/attenDance" exact component={Attendance} />
//         <Route path="/hr/viewAttenDance" exact component={ViewAttendance} />
//         <Route
//           path="/hr/AttendanceRegister"
//           exact
//           component={AttendanceRegister}
//         />
//         <Route path="/hr/NoticeManagement" exact component={NoticeManagement} />
//         <Route path="/hr/holiday" exact component={LeaveCalendar} />
//         <Route path="/hr/todaysAttendance" exact component={TodaysAttendance} />
//         <Route path="/hr/createLeave" exact component={LeaveApplication} />
//         <Route path="/hr/leaveRegister" exact component={LeaveRegister} />
//         <Route
//           path="/hr/leaveAccepted"
//           exact
//           component={LeaveApplicationHRAccept}
//         />

//         <Route
//           path="/hr/leaveRejected"
//           exact
//           component={LeaveApplicationHRReject}
//         />
//         <Route path="/hr/notification" exact component={Notification} />
//         <Route path="/hr/manualAttand" exact component={ManualAttendance} />
//         <Route
//           exact
//           path="/hr/personal-info"
//           render={(props) => <PersonalInfo />}
//         />
//         <Route path="/hr/request" exact component={RequestForm} />
//         <Route path="/hr/requestOpen" exact component={RequestRaised} />
//         <Route path="/hr/requestClosed" exact component={RequestRaisedClosed} />
//         <Route path="/hr/teamRequestClosed" exact component={RequestDetails} />
//         <Route
//           path="/hr/teamRequestOpen"
//           exact
//           component={RequestDetailsPending}
//         />
//         <Route
//           path="/hr/updateAttendance"
//           exact
//           component={AttendanceUpdateForm}
//         />
//         <Route path="/hr/NoticeBoard" exact component={NoticeBoard} />
//         {/* attendance */}
//         <Route render={() => <NotFound404 />} />
//       </Routes>

//   );
// };

// export default MainContent;
