import React, { Component } from "react";
import "./Position.css";
import axios from "axios";
import PositionTable from "./PositionTable.jsx";
import PositionForm from "./PositionForm.jsx";
import PositionFormEdit from "./PositionFormEdit.jsx";
import BASE_URL from "../config/config.js";
import toast from "react-hot-toast";
import api from "../config/api.js";

class Position extends Component {
  state = {
    table: true,
    editForm: false,
    editData: {},
  };

  handlePositionSubmit = (event) => {
    event.preventDefault();
    const companyID = event.target[0].value;
    const positionName = event.target[1].value;

    const body = {
      CompanyID: companyID,
      PositionName: positionName,
    };

    api
      .post(`/api/position`, body,
        
      )
      .then(() => {
        this.setState({ table: true });
           toast.success("Position added successfully!");
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleAddPosition = () => {
    this.setState({ table: false });
  };

  handleEditPosition = (e) => {
    this.setState({ editForm: true, editData: e });
  };

  handleFormClose = () => {
    this.setState({ table: true });
  };

  handleEditFormClose = () => {
    this.setState({ editForm: false });
  };

  handlePositionEditUpdate = (info, formData1, formData2) => {
    const body = {
      CompanyID: formData1,
      PositionName: formData2,
    };

    api
      .put(`/api/position/${info["_id"]}`, body, {
      })
      .then(() => {
        this.setState({ table: true, editForm: false });
           toast.success("Position updated successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { table, editForm, editData } = this.state;

    return (
      <React.Fragment>
        {table ? (
          editForm ? (
            <PositionFormEdit
              onPositionEditUpdate={this.handlePositionEditUpdate}
              onFormEditClose={this.handleEditFormClose}
              editData={editData}
            />
          ) : (
            <PositionTable
              onAddPosition={this.handleAddPosition}
              onEditPosition={this.handleEditPosition}
            />
          )
        ) : (
          <PositionForm
            onPositionSubmit={this.handlePositionSubmit}
            onFormClose={this.handleFormClose}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Position;
