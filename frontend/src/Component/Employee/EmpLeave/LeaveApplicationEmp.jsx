import React, { useState, useContext, useEffect } from "react";
import "./LeaveApplicationEmp.css";
import axios from "axios";
import LeaveApplicationEmpTable from "./LeaveApplicationEmpTable.jsx";
import LeaveApplicationEmpForm from "./LeaveApplicationEmpForm.jsx";
import LeaveApplicationEmpFormEdit from "./LeaveApplicationEmpFormEdit.jsx";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import { v4 as uuid } from "uuid";
import BASE_URL from "../../../Pages/config/config";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api.js";

const LeaveApplicationEmp = (props) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [leaveRequestDone, setLeaveRequestDone] = useState(false);
  const [empData, setEmpData] = useState(null);
  const { userData } = useSelector((state) => state.user);

  const email = userData?.Email;
  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const id = userData?._id;
  const { socket } = useContext(AttendanceContext);
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
  const handleLeaveApplicationEmpSubmit = (event) => {
    event.preventDefault();

    // setTable(true);
    let body = {
      Leavetype: event.target[0].value,
      FromDate: event.target[2].value,
      ToDate: event.target[3].value,
      Status: 1,
      managerEmail: event.target[4].value,
      hrEmail: event.target[5].value,
      aditionalManager: event.target[6].value,
      Reasonforleave: event.target[7].value,
      email,
    };

    api
      .post(
        `/api/leave-application-emp/` + props.data["_id"],
        body,
        
      )
      .then((res) => {
        setTable(false);
        setTable(true);
        setLeaveRequestDone(!leaveRequestDone);
        const taskId = uuid();
        if (empData.profile) {
          const data = {
            taskId,
            managerEmail: body.managerEmail,
            hrEmail: body.hrEmail,
            message: `Leave request`,
            messageBy: name,
            aditionalManager: body.aditionalManager,
            profile: empData.profile.image_url,
            status: "unseen",
            path: "leaveApplication",
          };
          socket.emit("leaveNotification", data);
        } else {
          const data = {
            taskId,

            message: `Leave request`,
            messageBy: name,
            aditionalManager: body.aditionalManager,
            managerEmail: body.managerEmail,
            hrEmail: body.hrEmail,

            profile: null,
            status: "unseen",
            path: "leaveApplication",
          };
          socket.emit("leaveNotification", data);
        }
      })
      .catch((err) => {});
  };

  const handleAddLeaveApplicationEmp = () => {
    setTable(false);
  };

  const handleEditLeaveApplicationEmp = (e) => {
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleLeaveApplicationEmpEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();

    let body = {
      Leavetype: newInfo.target[0].value,
      FromDate: newInfo.target[1].value,
      ToDate: newInfo.target[2].value,
      Status: newInfo.target[3].value,
      managerEmail: newInfo.target[4].value,
      hrEmail: newInfo.target[5].value,
      Reasonforleave: newInfo.target[6].value,
    };

    api
      .put(`/api/leave-application-emp/` + info["_id"], body, {
      })
      .then((res) => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {});

    setEditForm(false);
  };
  const handleAddFormGenderChange = () => {};

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <LeaveApplicationEmpFormEdit
            onLeaveApplicationEmpEditUpdate={
              handleLeaveApplicationEmpEditUpdate
            }
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <LeaveApplicationEmpTable
            onAddLeaveApplicationEmp={handleAddLeaveApplicationEmp}
            onEditLeaveApplicationEmp={handleEditLeaveApplicationEmp}
            data={props.data}
            leaveRequestDone={leaveRequestDone}
          />
        )
      ) : (
        <LeaveApplicationEmpForm
          onLeaveApplicationEmpSubmit={handleLeaveApplicationEmpSubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
        />
      )}
    </React.Fragment>
  );
};

export default LeaveApplicationEmp;
