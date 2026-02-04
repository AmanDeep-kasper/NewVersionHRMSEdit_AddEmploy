import React, { useState } from "react";
import axios from "axios";
import PersonalInfoTable from "./PersonalInfoTable.jsx";
import PersonalInfoFormEdit from "./PersonalInfoFormEdit.jsx";
import "./PersonalInfo.css";
import BASE_URL from "../../../Pages/config/config.js";
import api from "../../../Pages/config/api.js";

const PersonalInfo = ({ data, back }) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [editFormGender, setEditFormGender] = useState("");
  const [uploading, setUploading] = useState(false); // Uploading state

  const handleEditPersonalInfo = (e) => {
    setEditForm(true);
    setEditData(e);
    setEditFormGender(e["Gender"]);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handlePersonalInfoEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();
    setUploading(true); // Start uploading effect

    const formData = new FormData();
    formData.append("Gender", editFormGender);
    formData.append("ContactNo", newInfo.target[4].value || "N/A");
    formData.append("EmergencyContactNo", newInfo.target[5].value || "N/A");
    formData.append("presonalEmail", newInfo.target[6].value || "N/A");
    formData.append("PANcardNo", newInfo.target[7].value || "N/A");
    formData.append("DOB", newInfo.target[8].value);
    formData.append("BloodGroup", newInfo.target[9].value || "N/A");
    formData.append("Hobbies", newInfo.target[10].value || "N/A");
    formData.append("PresentAddress", newInfo.target[12].value || "N/A");
    formData.append("PermanetAddress", newInfo.target[13].value || "N/A");
    formData.append("profile", newInfo.target[11].files[0]);

    api
      .put(`/api/personal-info/${info["_id"]}`, formData, {
      })
      .then((res) => {
        setUploading(false); // Stop uploading effect
        setTable(false);
        setTable(true);
        setEditForm(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false); // Stop uploading effect in case of error
      });
  };

  const handleEditFormGenderChange = (e) => {
    setEditFormGender(e.currentTarget.value);
  };

  return (
    <div>

      {table ? (
        editForm ? (
          <PersonalInfoFormEdit
  onPersonalInfoEditUpdate={handlePersonalInfoEditUpdate}
  onFormEditClose={handleEditFormClose}
  editData={editData}
  onGenderChange={handleEditFormGenderChange}
  uploading={uploading}  
/>
        ) : (
          <PersonalInfoTable
            onAddPersonalInfo={handleEditPersonalInfo}
            onEditPersonalInfo={handleEditPersonalInfo}
            data={data}
            back={back}
          />
        )
      ) : (
        <div />
      )}
    </div>
  );
};

export default PersonalInfo;
