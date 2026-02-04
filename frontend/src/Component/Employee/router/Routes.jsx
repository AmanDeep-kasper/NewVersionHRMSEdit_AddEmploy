import React, { useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import PersonalInfo from "../EmpPresonal/PersonalInfo.jsx";
import Education from "../EmpEducation/Education.jsx";
import FamilyInfo from "../EmpFamily/FamilyInfo.jsx";
import WorkExperience from "../EmpWorkExp/WorkExperience.jsx";
import LeaveApplicationEmp from "../EmpLeave/LeaveApplicationEmp.jsx";
import EmployeeNewTask from "../EmployeeTaskManagement/EmployeeNewTask.jsx";
import EmployeeActiveTask from "../EmployeeTaskManagement/EmployeeActiveTask.jsx";
import EmployeeCompleteTask from "../EmployeeTaskManagement/EmployeeCompleteTask.jsx";
import EmployeeRejectTask from "../EmployeeTaskManagement/EmployeeRejectTask.jsx";
import Attendance from "../attendance/Attendance.jsx";
import AttendanceList from "../attendance/AttendanceList.jsx";
import EmpDash from "../Dashboard/EmpDash.jsx";
import LeaveApplicationEmpTable from "../../../Pages/ApplyLeave/LeaveApplication.jsx";
import DepartmentChart from "../Dashboard/EmpChart.jsx/DepartmentChart.jsx";
import UpcomingBirthdays from "../Dashboard/CountData/UpcomingBirthdays.jsx";
import Notification from "../Notification/Notification.jsx";
import Document from "../Document/Document.jsx";
import InnerDashContainer from "../../InnerDashContainer.jsx";
import LeaveBalance from "../../HrManager/LeaveStatus/LeaveBalance.jsx";
import AttendanceDetails from "../attendance/AttendanceDetails.jsx";
import EmpViewAttendance from "../../HrManager/attendance/SelfAttendance.jsx";
import UpdateTaskEmpManager from "../../../Pages/UpdateTaskEmpManager.jsx";
import NoticeBoard from "../../../Utils/NoticeBoard/NoticeBoard.jsx";
import TaskContainer from "../EmployeeTaskManagement/TaskContainer/TaskContainer.jsx";
import RequestForm from "../../../Pages/RequestTicket/RequestForm.jsx";
import RequestRaised from "../../../Pages/RequestTicket/RequestRaised.jsx";
import RequestRaisedClosed from "../../../Pages/RequestTicket/RequestRaisedClosed.jsx";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";


const RouterContent = ({ data }) => {

  return (
    <InnerDashContainer>    
      <div
        style={{ height: "84vh", width: "100%", overflow: "auto" }}
        className="empSidebar d-flex flex-column pb-4"
      >
        <Route path="/employee/dashboard" exact component={EmpDash} />
        <Route
          exact
          path="/employee/:id/personal-info"
          render={(props) => <PersonalInfo data={data} back={false} />}
        />
        <Route
          exact
          path="/employee/:id/education"
          render={(props) => <Education data={data} back={false} />}
        />
        <Route
          exact
          path="/employee/:id/family-info"
          render={(props) => <FamilyInfo data={data} back={false} />}
        />
        <Route
          exact
          path="/employee/:id/work-experience"
          render={(props) => <WorkExperience data={data} back={false} />}
        />
        <Route
          exact
          path="/employee/:id/leave-application-emp"
          render={(props) => <LeaveApplicationEmp data={data} />}
        />
        <Route
          exact
          path="/employee/leaveApplication"
          render={(props) => <LeaveApplicationEmpTable data={data} />}
        />
        <Route
          exact
          path="/employee/:id/leave-application-emp"
          render={(props) => <LeaveApplicationEmp data={data} />}
        />
        <Route
          exact
          path="/employee/leaveBalance"
          render={(props) => <LeaveBalance data={data} />}
        />
        <Route
          exact
          path="/employee/:id/attenDance"
          render={(props) => <Attendance data={data} />}
        />
        <Route
          exact
          path="/employee/:id/attendanceList"
          render={(props) => <AttendanceList data={data} />}
        />
        <Route
          exact
          path="/employee/MyAttendance"
          render={(props) => <EmpViewAttendance />}
        />
        <Route
          exact
          path="/employee/:id/departmentchart"
          render={(props) => <DepartmentChart data={data} />}
        />
        <Route path="/employee/newTask" exact component={EmployeeNewTask} />
        <Route
          path="/employee/activeTask"
          exact
          component={EmployeeActiveTask}
        />
        <Route
          path="/employee/taskcomplete"
          exact
          component={EmployeeCompleteTask}
        />
        <Route
          path="/employee/taskreject"
          exact
          component={EmployeeRejectTask}
        />
        <Route
          path="/employee/:id/selfAtteend"
          exact
          component={AttendanceDetails}
        />
        <Route
          path="/employee/:id/birthDay"
          exact
          component={UpcomingBirthdays}
        />
        <Route path="/employee/notification" exact component={Notification} />
        <Route path="/employee/document" exact component={Document} />
        <Route
          path="/employee/emp_manager"
          exact
          component={UpdateTaskEmpManager}
        />
                <Route path="/employee/request" exact component={RequestForm} />
        <Route path="/employee/requestOpen" exact component={RequestRaised} />
        <Route path="/employee/requestClosed" exact component={RequestRaisedClosed} />
        <Route path="/employee/NoticeBoard" exact component={NoticeBoard} />
        <Route exact path="/employee/task/" component={TaskContainer} />



      </div>
    </InnerDashContainer>
  );
};

export default RouterContent;
