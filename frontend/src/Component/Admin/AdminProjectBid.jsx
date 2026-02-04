import React, { useState } from "react";
import "./AdminProjectBid.css";
import axios from "axios";
import AdminProjectBidTable from "./AdminProjectBidTable.jsx";
import AdminProjectBidForm from "./AdminProjectBidForm.jsx";
import AdminProjectBidFormEdit from "./AdminProjectBidFormEdit.jsx";
import BASE_URL from "../../Pages/config/config.js";
import toast from "react-hot-toast";
import api from "../../Pages/config/api.js";

const AdminProjectBid = () => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  const handleProjectBidSubmit = (event) => {
    event.preventDefault();   
    setTable(true);
    let body = {
      ProjectTitle: event.target[0].value,
      ProjectURL: event.target[1].value,
      ProjectDesc: event.target[2].value,
      Portal_ID: event.target[3].value,
      EstimatedTime: event.target[4].value,
      TimePeriod: event.target[5].value,
      Currency: event.target[6].value,
      EstimatedCost: event.target[7].value,
      Status: event.target[8].value,
      Remark: event.target[9].value,
    };
    api
      .post(`/api/admin/project-bid`, body, {
      })
      .then((res) => {
        toast.success("Project Bid created successfully!"); // Show success toast
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        toast.error(err.response.data); // Show error toast
      });
  };

  const handleAddProjectBid = () => {
      
    setTable(false);
  };

  const handleEditProjectBid = (e) => {
      
      
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
      
    setTable(true);
  };

  const handleEditFormClose = () => {
      
    setEditForm(false);
  };

  const handleProjectBidEditUpdate = (info, editInfo) => {
    let body = {
      ProjectTitle: editInfo.target[0].value,
      ProjectURL: editInfo.target[1].value,
      ProjectDesc: editInfo.target[2].value,
      Portal_ID: editInfo.target[3].value,
      EstimatedTime: editInfo.target[4].value,
      TimePeriod: editInfo.target[5].value,
      Currency: editInfo.target[6].value,
      EstimatedCost: editInfo.target[7].value,
      Status: editInfo.target[8].value,
      Remark: editInfo.target[9].value,
    };
      
    api
      .put(`/api/admin/project-bid/` + info["_id"], body, {
      })
      .then((res) => {
        toast.success("Project Bid Updated successfully!"); // Show success toast
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        toast.error(err.response.data); // Show error toast

      });

    setEditForm(false);
  };

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <AdminProjectBidFormEdit
            onProjectBidEditUpdate={handleProjectBidEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <AdminProjectBidTable
            onAddProjectBid={handleAddProjectBid}
            onEditProjectBid={handleEditProjectBid}
          />
        )
      ) : (
        <AdminProjectBidForm
          onProjectBidSubmit={handleProjectBidSubmit}
          onFormClose={handleFormClose}
        />
      )}
    </React.Fragment>
  );
};

export default AdminProjectBid;
