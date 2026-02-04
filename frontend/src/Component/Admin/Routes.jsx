import React, { useContext, useEffect } from "react";

import { Routes, Route } from "react-router-dom";
import AdminDasd from "../Admin/Dashboard/AdminDash.jsx";
import Role from "../../Pages/Department/Role.jsx";
import Position from "../../Pages/Department/Position.jsx";
import Department from "../../Pages/Department/Department.jsx";
import AdminPortal from "../Admin/AdminPortal.jsx";
import AdminProjectBid from "../Admin/AdminProjectBid.jsx";
import Salary from "../../Pages/Salary/Salary.jsx";
import LeaveApplicationHR from "../../Component/Manager/LeaveApplicationHR.jsx";
import AdminEmployee from "./EmployeeList/AdminEmployee.jsx";
import NotFound404 from "../../Pages/PageNot/NotFound404.jsx";
// ********************task management***************//
import AdminAsignTask from "./TaskManagement/AdminAsignTask.jsx";
import AdminTaskStatus from "./TaskManagement/AdminTaskStatus.jsx";
import AdminCancleTask from "./TaskManagement/AdminCancleTask.jsx";
import AdminCompleteTask from "./TaskManagement/AdminCompleteTask.jsx";
import RejectedTask from "./TaskManagement/RejectedTask.jsx";
import AdminAssignedTask from "./TaskManagement/AdminAssignedTask.jsx";
import AdminActive from "./TaskManagement/AdminActive.jsx";
import AdminAttendance from "./attendance/Attendance.jsx";
import AdminViewAttendance from "../HrManager/attendance/ViewAttendance.jsx";
import TodaysAttendance from "../../Pages/DailyAttendance/TodaysAttendance.jsx";

import LeaveCalendar from "../../Pages/LeaveCalendar/LeaveCalendar.jsx";
import Country from "../../Pages/Location/Country.jsx";
import State from "../../Pages/Location/State.jsx";
import City from "../../Pages/Location/City.jsx";
import Company from "../../Pages/Company/Company.jsx";
import LeaveApplication from "../../Pages/ApplyLeave/LeaveApplication.jsx";
import LeaveApplicationHRAccept from "../HrManager/LeaveStatus/LeaveApplicationHRAccept.jsx";
import LeaveApplicationHRReject from "../HrManager/LeaveStatus/LeaveApplicationHRReject.jsx";
import NoticeManagement from "./Notification/NoticeManagement.jsx";
import Notification from "./Notification/Notification.jsx";
import AllEmpLeave from "./leave/AllEmpLeave.jsx";
import LeaveAssign from "./leave/LeaveAssign.jsx";
import UpdateTask from "../../Pages/UpdateTask.jsx";
import SelfAttendance from "../HrManager/attendance/SelfAttendance.jsx";
import AttendanceUpdateForm from "../../Pages/AttendanceUpdateForm.jsx";
import TeamList from "../../Pages/TeamList.jsx";
import Team from "../../Pages/Team.jsx";
import NoticeBoard from "../../Utils/NoticeBoard/NoticeBoard.jsx";
import RequestDetails from "../../Pages/RequestTicket/RequestDetails.jsx";
import RequestDetailsPending from "../../Pages/RequestTicket/RequestDetailsPending.jsx";
import AttendanceRegister from "../HrManager/attendance/AttendanceRegister.jsx";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import MonthlyLeaveRegister from "../../Pages/ApplyLeave/MonthlyLeaveRegister/MonthlyLeaveRegister.jsx";
import LeaveRegister from "../../Utils/LeaveComponentHrDash/LeaveRegister.jsx";

const AdminRoutes = () => {

  return (
   
      <Routes>
        <Route path="/admin/dashboard" exact component={AdminDasd} />
        <Route path="/admin/role" exact component={Role} />
        <Route path="/admin/position" exact component={Position} />
        <Route path="/admin/department" exact component={Department} />
        <Route path="/admin/portal-master" exact component={AdminPortal} />
        <Route path="/admin/project-bid" exact component={AdminProjectBid} />
        <Route path="/admin/salary" exact component={Salary} />

        <Route path="/admin/employee" exact component={AdminEmployee} />
        <Route path="/admin/task" exact component={AdminAsignTask} />
        {/* <Route path="/admin/viewtask/:id" element={<AdminViewTask />} /> */}
        <Route path="/admin/taskassign" exact component={AdminAssignedTask} />
        <Route path="/admin/taskstatus" exact component={AdminTaskStatus} />
        <Route path="/admin/taskcancle" exact component={AdminCancleTask} />
        <Route path="/admin/taskActive" exact component={AdminActive} />

        {/* location route */}
        <Route path="/admin/leaveCal" exact component={LeaveCalendar} />
        <Route path="/admin/country" exact component={Country} />
        <Route path="/admin/state" exact component={State} />
        <Route path="/admin/city" exact component={City} />
        <Route path="/admin/company" exact component={Company} />
        <Route path="/admin/taskcomplete" exact component={AdminCompleteTask} />
        <Route path="/admin/taskreject" exact component={RejectedTask} />
        <Route path="/admin/admin_manager" exact component={UpdateTask} />
        <Route
          path="/admin/adminAttendance"
          exact
          component={AdminAttendance}
        />
        <Route
          path="/admin/viewAttendance"
          exact
          component={AdminViewAttendance}
        />
        <Route
          path="/admin/todaysAttendance"
          exact
          component={TodaysAttendance}
        />
        <Route path="/admin/myAttendance" exact component={SelfAttendance} />
        <Route
          path="/admin/updateAttendance"
          exact
          component={AttendanceUpdateForm}
        />
        {/* END TASK ROUTES */}
        {/* START LEAVE ROUTES */}
        <Route path="/admin/applyLeave" exact component={LeaveApplication} />
        <Route path="/admin/AllEmpLeave" exact component={AllEmpLeave} />
        <Route path="/admin/leaveAssign" exact component={LeaveAssign} />
        <Route path="/admin/leaveRegister" exact component={LeaveRegister} />

        <Route
          path="/admin/leaveAccepted"
          exact
          component={LeaveApplicationHRAccept}
        />
        <Route
          path="/admin/leaveApplication"
          exact
          component={LeaveApplicationHR}
        />
        <Route
          path="/admin/leaveRejected"
          exact
          component={LeaveApplicationHRReject}
        />
        <Route path="/admin/requestClosed" exact component={RequestDetails} />
        <Route
          path="/admin/requestReceived"
          exact
          component={RequestDetailsPending}
        />
        <Route path="/admin/notification" exact component={Notification} />
        <Route
          path="/admin/NoticeManagement"
          exact
          component={NoticeManagement}
        />
        <Route path="/admin/teamList" exact component={TeamList} />
        <Route path="/admin/managerTeam" exact component={Team} />
        <Route path="/admin/NoticeBoard" exact component={NoticeBoard} />
        <Route
          path="/admin/AttendanceRegister"
          exact
          component={AttendanceRegister}
        />
        <Route
          path="/admin/monthlyLeave"
          exact
          component={MonthlyLeaveRegister}
        />

        {/* <Route path="/admin/viewtask" exact component={AdminViewTask} /> */}
        {/* <Route path="/admin/viewtask/:id" exact component={AdminViewTask} /> */}

        {/* <Route
          exact
          path="/admin/:id/viewtask"
          render={(props) => <AdminViewTask/>}
        /> */}

        {/*END LEAVE ROUTES */}
        <Route component={NotFound404} />
        {/* ********task******* */}
      </Routes>

  );
};

export default AdminRoutes;
