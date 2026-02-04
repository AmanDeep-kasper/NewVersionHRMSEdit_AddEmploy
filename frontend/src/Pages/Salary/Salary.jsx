import React, { useState } from "react";
import "./Salary.css";
import axios from "axios";
import SalaryTable from "./SalaryTable.jsx";
import SalaryForm from "./SalaryForm.jsx";
import SalaryFormEdit from "./SalaryFormEdit.jsx";
import BASE_URL from "../config/config.js";
import api from "../../Pages/config/api"; // 👈 import api here

const Salary = () => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleSalarySubmit = (event) => {
    event.preventDefault();
    const {
      BasicSalary,
      HRASalary,
      ConvenyanceAllowance,
      otherAllowance,
      totalSalary,
    } = event.target.elements;

    const body = {
      BasicSalary: BasicSalary.value,
      HRASalary: HRASalary.value,
      ConvenyanceAllowance: ConvenyanceAllowance.value,
      otherAllowance: otherAllowance.value,
      totalSalary: totalSalary.value,
    };

    api
      .post(`/api/salary/${event.target.employeeId.value}`, body, {
        
      })
      .then(() => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          window.alert(err.response.data);
        }
      });
  };

  const handleAddSalary = () => {
    setTable(false);
  };

  const handleEditSalary = (e) => {
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleSalaryEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();

    const basicSalary = newInfo.target[1].value;
    const hraSalary = newInfo.target[2].value;
    const conveyanceAllowance = newInfo.target[3].value;
    const otherAllowance = newInfo.target[4].value;
    const totalSalary = newInfo.target[5].value;

    let body = {
      BasicSalary: basicSalary,
      HRASalary: hraSalary,
      ConvenyanceAllowance: conveyanceAllowance,
      otherAllowance: otherAllowance,
      totalSalary: totalSalary,
    };

    api
      .put(`/api/salary/` + info["salary"][0]["_id"], body, {
       
      })
      .then((res) => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        console.log(err);
      });

    setEditForm(false);
  };

  // Placeholder functions - replace with actual implementations
  const handleEditFormGenderChange = () => {
    // Implement your logic here
  };

  const handleAddFormGenderChange = () => {
    // Implement your logic here
  };

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <SalaryFormEdit
            onSalaryEditUpdate={handleSalaryEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
            onGenderChange={handleEditFormGenderChange}
          />
        ) : (
          <SalaryTable
            onAddSalary={handleAddSalary}
            onEditSalary={handleEditSalary}
          />
        )
      ) : (
        <SalaryForm
          onSalarySubmit={handleSalarySubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
        />
      )}
    </React.Fragment>
  );
};

export default Salary;
