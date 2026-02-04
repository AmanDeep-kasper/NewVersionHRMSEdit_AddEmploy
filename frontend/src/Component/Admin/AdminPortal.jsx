import React, { useState } from "react";
import "./AdminPortal.css";
import axios from "axios";
import AdminPortalTable from "./AdminPortalTable.jsx";
import AdminPortalForm from "./AdminPortalForm.jsx";
import AdminPortalFormEdit from "./AdminPortalFormEdit.jsx";
import BASE_URL from "../../Pages/config/config.js";
import api from "../../Pages/config/api.js";

const AdminPortal = () => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [addFormStatus, setAddFormStatus] = useState("");
  const [editFormStatus, setEditFormStatus] = useState("");

  const handlePortalSubmit = (event) => {
    event.preventDefault();
    const body = {
      PortalName: event.target[0].value,
      Status: addFormStatus,
    };

    api
      .post(`/api/admin/portal`, body, {
      })
      .then(() => {
        setTable(true);
      })
      .catch((err) => {});
  };

  const handleAddPortal = () => {
    setTable(false);
  };

  const handleEditPortal = (e) => {
    setEditForm(true);
    setEditData(e);
    setEditFormStatus(e.Status);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleAddFormStatusChange = (e) => {
    setAddFormStatus(e.currentTarget.value);
  };

  // const handleEditFormStatusChange = (e) => {
  //   setEditFormStatus(e.currentTarget.value);
  // };
  const handleEditFormStatusChange = (e) => {
  // Convert value to number
  setEditFormStatus(Number(e));
};


  // const handlePortalEditUpdate = (info, formData1) => {
  //   const body = {
  //     _id: info._id,
  //     PortalName: formData1,
  //     Status: editFormStatus,
  //     ID: info.ID,
  //   };

  //   axios
  //     .put(`${BASE_URL}/api/admin/portal/${info.ID}`, body, {
  //       headers: {
  //         authorization: localStorage.getItem("token") || "",
  //       },
  //     })
  //     .then(() => {
  //       setTable(true);
  //     })
  //     .catch((err) => {});

  //   setEditForm(false);
  // };
const handlePortalEditUpdate = (info, formData1, status) => {
  const body = {
    _id: info._id,
    PortalName: formData1,
    Status: Number(status), // Ensure Status is a number
    ID: info.ID,
  };

  api
    .put(`/api/admin/portal/${info.ID}`, body, {
    })
    .then(() => {
      setTable(true);
    })
    .catch((err) => {});

  setEditForm(false);
};
  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <AdminPortalFormEdit
            onPortalEditUpdate={handlePortalEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
            onStatusChange={handleEditFormStatusChange}
          />
        ) : (
          <AdminPortalTable
            onAddPortal={handleAddPortal}
            onEditPortal={handleEditPortal}
          />
        )
      ) : (
        <AdminPortalForm
          onPortalSubmit={handlePortalSubmit}
          onFormClose={handleFormClose}
          onStatusChange={handleAddFormStatusChange}
        />
      )}
    </React.Fragment>
  );
};

export default AdminPortal;
