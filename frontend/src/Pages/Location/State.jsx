import React, { useState } from "react";
import axios from "axios";
import StateTable from "./StateTable.jsx";
import StateForm from "./StateForm.jsx";
import StateFormEdit from "./StateFormEdit.jsx";
import BASE_URL from "../config/config.js";
import "./State.css";
import api from "../config/api.js";

const State = () => {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [editData, setEditData] = useState({});

  const handleStateSubmit = (event) => {
    event.preventDefault();
    const body = {
      CountryID: event.target[0].value,
      StateName: event.target[1].value,
    };

    api
      .post(`/api/state`, body, {
       
      })
      .then((res) => {
        setIsTableVisible(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleAddState = () => {
    setIsTableVisible(false);
  };

  const handleEditState = (data) => {
    setIsEditFormVisible(true);
    setEditData(data);
  };

  const handleFormClose = () => {
    setIsTableVisible(true);
  };

  const handleEditFormClose = () => {
    setIsEditFormVisible(false);
  };

  const handleStateEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();
    const body = {
      CountryID: newInfo.target[0].value,
      StateName: newInfo.target[1].value,
    };

    api
      .put(`/api/state/${info["_id"]}`, body, {
       
      })
      .then((res) => {
        setIsTableVisible(true);
        setIsEditFormVisible(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <React.Fragment>
      {isTableVisible ? (
        isEditFormVisible ? (
          <StateFormEdit
            onStateEditUpdate={handleStateEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <StateTable
            onAddState={handleAddState}
            onEditState={handleEditState}
          />
        )
      ) : (
        <StateForm
          onStateSubmit={handleStateSubmit}
          onFormClose={handleFormClose}
        />
      )}
    </React.Fragment>
  );
};

export default State;
