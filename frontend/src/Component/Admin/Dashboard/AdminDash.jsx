import React from "react";
import AdminNews from "../../../Utils/AdminNews/AdminNews";
import UpcomingBirthdays from "../../Employee/Dashboard/CountData/UpcomingBirthdays";
import HolidayDash from "../../../Utils/HolidayDash/HolidayDash";
import TaskCompletionCard from "../../../Utils/TaskCompletionCard/TaskCompletionCard";
import LeaveComponentHrDash from "../../../Utils/LeaveComponentHrDash/LeaveComponentHrDash";
import EmployeeStatus from "../../../Utils/EmployeeStatus/EmployeeStatus";
import "./AdminDash.css";
import MyTeamList from "../../../Pages/MyTeams/MyTeamList";
import RequestTicketCard from "../../../Pages/RequestTicket/RequestTicketCard";
import MyTodaysLoginData from "../../Employee/WelcomeBoard/MyTodaysLoginData/MyTodaysLoginData";
import AttendanceCard from "../../../Utils/AttendanceCard/AttendanceCard";

const AdminDash = () => {
  return (
    <div className="d-flex flex-column row-gap-4 py-3 container-fluid">
      <div className="row row-gap-4">
        <div  className="col-12 colm-md-6 col-lg-4">
          <AttendanceCard />
        </div>
        <div  className="col-12 colm-md-6 col-lg-4">
          <MyTodaysLoginData />
        </div>
        <div className="col-12 colm-md-6 col-lg-4">
          <AdminNews />
        </div>
      </div>
      <div className="row row-gap-4">
        <div className="col-12 col-md-8 row mx-auto row-gap-4 mx-auto">
          <div className="col-12 col-md-6 pl-0 pr-0 pr-md-2 ">
            <LeaveComponentHrDash />
          </div>
          <div className="col-12 col-md-6 pr-0 pl-0 pl-md-2">
            <TaskCompletionCard />
          </div>
          <div className="col-12 col-md-6 pl-0 pr-0 pr-md-2 ">
            <HolidayDash />
          </div>
          <div className="col-12 col-md-6 pr-0 pl-0 pl-md-2">
            <RequestTicketCard />
          </div>
        </div>
        <div className="col-12 col-md-4 col-lg-4">
          <div>
            <EmployeeStatus />
          </div>
        </div>
      </div>
      <div className="row  row-gap-4">
        <div className="col-12 colm-md-6 col-lg-4">
          <UpcomingBirthdays />
        </div>
        <div className="col-12 colm-md-6 col-lg-4">
          <MyTeamList />
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
