import React, { useState, useContext, useEffect } from "react";
import "./LeaveApplicationHR.css";
import axios from "axios";
import LeaveApplicationHRTable from "./LeaveApplicationHRTable.jsx";
import LeaveApplicationHRFormEdit from "./LeaveApplicationHRFormEdit.jsx";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext.js";
import BASE_URL from "../../Pages/config/config.js";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../Pages/config/api.js";

const LeaveApplicationHR = (props) => {
  const [table, setTable] = useState(true);
  const { socket } = useContext(AttendanceContext);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [empData, setEmpData] = useState(null);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const id = userData?._id;
  const email = userData?.Email;
  const name = `${userData?.FirstName} ${userData?.LastName}`;

  const loadEmployeeData = () => {
    api
      .get(`/api/particularEmployee/${id}`, {
      })
      .then((response) => {
        setEmpData(response.data);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    loadEmployeeData();
  }, []);

  const handleAddLeaveApplicationHR = () => {
    setTable(false);
  };

  const handleEditLeaveApplicationHR = (e, days) => {
    e["Days"] = days;
    setEditForm(true);
    setEditData(e);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };
  // const handleLeaveApplicationHREditUpdate = (info, newInfo) => {
  //   newInfo.preventDefault();

  //   let body = {
  //     Status: newInfo.target[3].value,
  //     updatedBy: `${empData["FirstName"]} ${empData["LastName"]}`,
  //     totalLeaveRequired: info.Days,
  //     id: info.empObjID,
  //     leaveType: info.Leavetype,
  //   };

  //   const taskId = uuid();
  //   let leaveStatus = "";

  //   if (body.Status === "2") {
  //     leaveStatus = "Approved";
  //     axios
  //       .put(`${BASE_URL}/api/leave-application-hr/` + info["_id"], body, {
  //         headers: {
  //           authorization: localStorage.getItem("token") || "",
  //         },
  //       })
  //       .then((res) => {

  //         setTable(false);
  //         setTable(true);
  //         if (leaveStatus === "1") {
  //         navigate("/manager/leaveApplicationAccepted");
  //       } else if (leaveStatus === "2") {
  //         navigate("/manager/leaveApplicationRejected");
  //       }

  //         if (empData.profile) {
  //           const data = {
  //             taskId,
  //             employeeEmail: info.Email,
  //             hrEmail: info.reportHr,
  //             reportManager:
  //               email === info.aditionalManager
  //                 ? info.reportManager
  //                 : info.aditionalManager,
  //             message: `Leave ${leaveStatus}`,
  //             messageBy: name,
  //             profile: empData.profile.image_url,
  //             status: "unseen",
  //             path: empData.Account === 1 ? "createLeave" : "leaveApplication",
  //           };

  //           socket.emit("leaveManagerStatusNotification", data);
  //         } else {
  //           const data = {
  //             taskId,
  //             employeeEmail: info.Email,
  //             hrEmail: info.reportHr,
  //             reportManager:
  //               email === info.aditionalManager
  //                 ? info.reportManager
  //                 : info.aditionalManager,
  //             message: `Leave ${leaveStatus}`,
  //             messageBy: name,
  //             profile: null,
  //             status: "unseen",
  //             path: empData.Account === 1 ? "createLeave" : "leaveApplication",
  //           };
  //           socket.emit("leaveManagerStatusNotification", data);
  //         }
  //       })
  //       .catch((err) => {});
  //   } else if (body.Status === "3") {
  //     leaveStatus = "Rejected";

  //     let reason = prompt("Please provide reason of rejection");
  //     body["reasonOfRejection"] = reason;

  //     axios
  //       .put(`${BASE_URL}/api/leave-application-hr/` + info["_id"], body, {
  //         headers: {
  //           authorization: localStorage.getItem("token") || "",
  //         },
  //       })
  //       .then((res) => {
  //         setTable(false);
  //         setTable(true);

  //         if (empData.profile) {
  //           const data = {
  //             taskId,
  //             employeeEmail: info.Email,
  //             hrEmail: info.reportHr,
  //             reportManager:
  //               email === info.aditionalManager
  //                 ? info.reportManager
  //                 : info.aditionalManager,
  //             message: `Leave ${leaveStatus}`,

  //             messageBy: name,
  //             profile: empData.profile.image_url,
  //             status: "unseen",
  //             path: empData.Account === 1 ? "createLeave" : "leaveApplication",
  //           };

  //           socket.emit("leaveManagerStatusNotification", data);
  //         } else {
  //           const data = {
  //             taskId,
  //             employeeEmail: info.Email,
  //             hrEmail: info.reportHr,
  //             reportManager:
  //               email === info.aditionalManager
  //                 ? info.reportManager
  //                 : info.aditionalManager,
  //             message: `Leave ${leaveStatus}`,

  //             messageBy: name,
  //             profile: null,
  //             status: "unseen",
  //             path: empData.Account === 1 ? "createLeave" : "leaveApplication",
  //           };

  //           socket.emit("leaveManagerStatusNotification", data);
  //         }
  //       })
  //       .catch((err) => {});
  //   }

  //   setEditForm(false);
  // };
const handleLeaveApplicationHREditUpdate = (info, newInfo) => {
  newInfo.preventDefault();

  let body = {
    Status: newInfo.target[3].value, // better: newInfo.target.elements.status.value
    updatedBy: `${empData.FirstName} ${empData.LastName}`,
    totalLeaveRequired: info.Days,
    id: info.empObjID,
    leaveType: info.Leavetype,
  };

  const taskId = uuid();
  let leaveStatus = "";

  if (body.Status === "2") {
    leaveStatus = "Approved";
    api
      .put(`/api/leave-application-hr/${info._id}`, body, {
      })
      .then(() => {
        setTable(false);
        setTable(true);

        // ✅ Navigate based on status
        navigate("/manager/leaveApplicationAccepted");

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
          profile: empData.profile ? empData.profile.image_url : null,
          status: "unseen",
          path: empData.Account === 1 ? "createLeave" : "leaveApplication",
        };

        socket.emit("leaveManagerStatusNotification", data);
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (body.Status === "3") {
    leaveStatus = "Rejected";
    let reason = prompt("Please provide reason of rejection");
    body.reasonOfRejection = reason;

    api
      .put(`/api/leave-application-hr/${info._id}`, body, 
      )
      .then(() => {
        setTable(false);
        setTable(true);

        // ✅ Navigate based on status
        navigate("/manager/leaveApplicationRejected");

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
          profile: empData.profile ? empData.profile.image_url : null,
          status: "unseen",
          path: empData.Account === 1 ? "createLeave" : "leaveApplication",
        };

        socket.emit("leaveManagerStatusNotification", data);
      })
      .catch((err) => {
        console.error(err);
      });
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
          <LeaveApplicationHRTable
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
