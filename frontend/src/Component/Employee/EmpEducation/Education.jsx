import React, { useState } from "react";
import axios from "axios";
import "./Education.css";
import EducationTable from "./EducationTable.jsx";
import EducationForm from "./EducationForm.jsx";
import EducationFormEdit from "./EducationFormEdit.jsx";
import BASE_URL from "../../../Pages/config/config.js";
import toast from "react-hot-toast";
import api from "../../../Pages/config/api.js";

const Education = (props) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  const handleEducationSubmit = (event, id, createdBy) => {
    event.preventDefault();
    setTable(true);

    const body = {
      SchoolUniversity: event.target[0].value,
      Degree: event.target[1].value,
      Grade: event.target[2].value,
      PassingOfYear: event.target[3].value,
      createdBy: createdBy,
      employeeObjID: id,
    };

    api
      .post(`/api/education/` + id, body, {
      })
      .then(() => {
        toast.success("Education record Added successfully!");
        setTable(false);
        setTable(true);
      })
      .catch((err) => {});
  };

  const handleAddEducation = () => {
    setTable(false);
  };

  const handleEditEducation = (e) => {
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };
  const handleEducationEditUpdate = (info, event, employeeObjID, updatedBy) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const body = {
      SchoolUniversity:
        formData.get("SchoolUniversity") || info.SchoolUniversity,
      createdBy: info.createdBy,
      Degree: formData.get("Degree") || info.Degree,
      Grade: formData.get("Grade") || info.Grade,
      PassingOfYear: formData.get("PassingOfYear") || info.PassingOfYear,
      employeeObjID: employeeObjID,
      updatedBy: updatedBy,
    };

    if (!info._id) {
      console.error("Invalid education record ID.");
      return;
    }

    api
      .put(`/api/education/${info._id}`, body, {
      })
      .then(() => {
        toast.success("Education details updated successfully!");
        setTable(true);
        setEditForm(false);
      })
      .catch((err) => {
        console.error("Error updating education:", err);
        toast.error("Failed to update education details.");
      });
  };

  return (
    <>
      {table ? (
        editForm ? (
          <EducationFormEdit
            onEducationEditUpdate={handleEducationEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <EducationTable
            onAddEducation={handleAddEducation}
            onEditEducation={handleEditEducation}
            data={props.data}
            back={props.back}
          />
        )
      ) : (
        <EducationForm
          onEducationSubmit={handleEducationSubmit}
          onFormClose={handleFormClose}
          data={props.data}
        />
      )}
    </>
  );
};

export default Education;
