import React, { useState, useContext, useEffect } from "react";
import "./LeaveApplicationHR.css";
import axios from "axios";
import LeaveApplicationHRFormEdit from "./LeaveApplicationHRFormEdit.jsx";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext.js";
import BASE_URL from "../../Pages/config/config.js";
import { v4 as uuid } from "uuid";
import LeaveApplicationHRTableRejected from "./LeaveApplicationHRTableRejected.jsx";
import { useSelector } from "react-redux";
import api from "../../Pages/config/api.js";
const LeaveApplicationHR = (props) => {
  const [table, setTable] = useState(true);
  const { socket } = useContext(AttendanceContext);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [empData, setEmpData] = useState(null);
  const { userData } = useSelector((state) => state.user);

  const id = userData?._id;
  const email = userData?.Email;
  const name = `${userData?.FirstName} ${userData?.LastName}`;

  const loadEmployeeData = () => {
    api
      .get(`/api/particularEmployee/${id}`,
    )
      .then((response) => {
        setEmpData(response.data);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    loadEmployeeData();
  }, []);

  const handleLeaveApplicationHRSubmit = (event) => {
    event.preventDefault();

    setTable(true);

    let body = {
      Leavetype: event.target[0].value,
      FromDate: event.target[1].value,
      ToDate: event.target[2].value,
      Status: event.target[3].value,
      Reasonforleave: event.target[4].value,
    };
    api
      .post(`/api/leave-application-hr/` + props.data["_id"], body, {
       
      })
      .then((res) => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {});
  };

  const handleAddLeaveApplicationHR = () => {
    setTable(false);
  };

  const handleEditLeaveApplicationHR = (e) => {
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    setTable(true);
  };
  const restoringLeave = (id, email, leaveType, totalLeaveRequired) => {
    api
      .post(
        `/api/rejectedLeave`,
        { id, email, leaveType, totalLeaveRequired },
      )
      .then((res) => {})
      .catch((err) => {});
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };
  function dateDifference(date1, date2) {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    const differenceInTime = secondDate.getTime() - firstDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.abs(differenceInDays);
  }
  const handleLeaveApplicationHREditUpdate = (info, newInfo) => {
    newInfo.preventDefault();

    let body = {
      Status: newInfo.target[3].value,
      updatedBy: `${empData["FirstName"]} ${empData["LastName"]}`,
    };

    const taskId = uuid();
    let leaveStatus = "";

    if (body.Status === "2") {
      leaveStatus = "Approved";
      api
        .put(`/api/leave-application-hr/` + info["_id"], body, {
        })
        .then((res) => {
          setTable(false);
          setTable(true);

          if (empData.profile) {
            const data = {
              taskId,
              employeeEmail: info.Email,
              hrEmail: info.reportHr,
              reportManager:
                email === info.aditionalManager
                  ? info.reportManager
                  : info.aditionalManager,
              message: `Leave ${leaveStatus}`,
              messageBy: name,
              profile: empData.profile.image_url,
              status: "unseen",
              path: empData.Account === 1 ? "createLeave" : "leaveApplication",
            };

            socket.emit("leaveManagerStatusNotification", data);
          } else {
            const data = {
              taskId,
              employeeEmail: info.Email,
              hrEmail: info.reportHr,
              reportManager:
                email === info.aditionalManager
                  ? info.reportManager
                  : info.aditionalManager,
              message: `Leave ${leaveStatus}`,
              messageBy: name,
              profile: null,
              status: "unseen",
              path: empData.Account === 1 ? "createLeave" : "leaveApplication",
            };

            socket.emit("leaveManagerStatusNotification", data);
          }
        })
        .catch((err) => {});
    } else if (body.Status === "3") {
      leaveStatus = "Rejected";

      let reason = prompt("Please provide reason of rejection");
      body["reasonOfRejection"] = reason;

      api
        .put(`/api/leave-application-hr/` + info["_id"], body, {
        })
        .then((res) => {
          setTable(false);
          setTable(true);

          let totalLeaveRequired =
            dateDifference(info.FromDate, info.ToDate) + 1;
          restoringLeave(
            info.empObjID,
            info.Email,
            info.Leavetype,
            totalLeaveRequired
          );
          if (empData.profile) {
            const data = {
              taskId,
              employeeEmail: info.Email,
              hrEmail: info.reportHr,
              reportManager:
                email === info.aditionalManager
                  ? info.reportManager
                  : info.aditionalManager,
              message: `Leave ${leaveStatus}`,

              messageBy: name,
              profile: empData.profile.image_url,
              status: "unseen",
              path: empData.Account === 1 ? "createLeave" : "leaveApplication",
            };

            socket.emit("leaveManagerStatusNotification", data);
          } else {
            const data = {
              taskId,
              employeeEmail: info.Email,
              hrEmail: info.reportHr,
              reportManager:
                email === info.aditionalManager
                  ? info.reportManager
                  : info.aditionalManager,
              message: `Leave ${leaveStatus}`,

              messageBy: name,
              profile: null,
              status: "unseen",
              path: empData.Account === 1 ? "createLeave" : "leaveApplication",
            };

            socket.emit("leaveManagerStatusNotification", data);
          }
        })
        .catch((err) => {});
    }

    setEditForm(false);
  };

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <LeaveApplicationHRFormEdit
            onLeaveApplicationHREditUpdate={handleLeaveApplicationHREditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
            // onFormClose={handleFormClose}
          />
        ) : (
          <LeaveApplicationHRTableRejected
            onAddLeaveApplicationHR={handleAddLeaveApplicationHR}
            onEditLeaveApplicationHR={handleEditLeaveApplicationHR}
            data={props.data}
          />
        )
      ) : (
        <div></div>
      )}
    </React.Fragment>
  );
};

export default LeaveApplicationHR;
