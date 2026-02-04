import React, { useState, useEffect } from "react";
import axios from "axios";
import FamilyInfoTable from "./FamilyInfoTable.jsx";
import FamilyInfoForm from "./FamilyInfoForm.jsx";
import FamilyInfoFormEdit from "./FamilyInfoFormEdit.jsx";
import BASE_URL from "../../../Pages/config/config.js";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api.js";

const FamilyInfo = (props) => {
  const { userData } = useSelector((state) => state.user);

  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [familyInfoData, setFamilyInfoData] = useState([]);

  // Fetch family info data
  const fetchFamilyInfo = (userId) => {
    api
      .get(`/api/family-info/${userId}`, {
      })
      .then((res) => {
        setFamilyInfoData(res.data || []);
      })
      .catch(() => {
        setFamilyInfoData([]);
      });
  };

  // Accept sanitized/validated object from FamilyInfoForm
  const handleFamilyInfoSubmit = (fields) => {
    let body = {
      Name: fields.Name,
      Relationship: fields.Relationship,
      DOB: fields.DOB,
      Occupation: fields.Occupation,
      parentMobile: fields.parentMobile,
      user: fields.user,
      createdBy: fields.createdBy,
    };
    api
      .post(`/api/family-info/${fields.user}`, body, {
      })
      .then((res) => {
        toast.success("Family information added successfully!");
        setTable(true);
        fetchFamilyInfo(fields.user);
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          toast.error(err.response.data.message || "Duplicate entry not allowed.");
        } else {
          toast.error("Failed to add family information.");
        }
      });
  };

  const handleAddFamilyInfo = () => {
    setTable(false);
  };

  const handleEditFamilyInfo = (e) => {
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleFamilyInfoEditUpdate = (info, newInfo, user, updatedBy) => {
    newInfo.preventDefault();
    let body = {
      Name: newInfo.target[0].value,
      Relationship: newInfo.target[1].value,
      DOB: newInfo.target[2].value,
      Occupation: newInfo.target[3].value,
      parentMobile: newInfo.target[4].value,
      user: user,
      createdBy: info?.createdBy,
      updatedBy: updatedBy,
    };
    api
      .put(`/api/family-info/${user}`, body, {
        
      })
      .then((res) => {
        toast.success("Family information updated successfully!");
        setTable(true);
        fetchFamilyInfo(user);
      })
      .catch((err) => {
        toast.error("Failed to update family information.");
      });
    setEditForm(false);
  };
  const handleAddFormGenderChange = () => {};

  // Fetch on mount or when user changes
  useEffect(() => {
    const userId = userData?._id || (props.data && props.data[0]?.user);
    if (userId) {
      fetchFamilyInfo(userId);
    }
    // eslint-disable-next-line
  }, [userData?._id]);

  return (
    <>
      {table ? (
        editForm ? (
          <FamilyInfoFormEdit
            onFamilyInfoEditUpdate={handleFamilyInfoEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <FamilyInfoTable
            onAddFamilyInfo={handleAddFamilyInfo}
            onEditFamilyInfo={handleEditFamilyInfo}
            data={familyInfoData}
            back={props.back}
          />
        )
      ) : (
        <FamilyInfoForm
          onFamilyInfoSubmit={handleFamilyInfoSubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
          data={familyInfoData}
        />
      )}
    </>
  );
};

export default FamilyInfo;
