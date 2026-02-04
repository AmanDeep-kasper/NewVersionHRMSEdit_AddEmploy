import React, { useState, useEffect } from "react";
import axios from "axios";
import WorkExperienceTable from "./WorkExperienceTable.jsx";
import WorkExperienceForm from "./WorkExperienceForm.jsx";
import WorkExperienceFormEdit from "./WorkExperienceFormEdit.jsx";
import "./WorkExperience.css";
import BASE_URL from "../../../Pages/config/config.js";
import toast from "react-hot-toast";
import api from "../../../Pages/config/api.js";

const WorkExperience = (props) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [workExpData, setWorkExpData] = useState([]);

  // Fetch work experience data
  const fetchWorkExperience = (id) => {
    api
      .get(`/api/work-experience/` + id, {
      })
      .then((res) => {
        setWorkExpData(res.data || []);
      })
      .catch(() => {
        setWorkExpData([]);
      });
  };

  const handleWorkExperienceSubmit = (values, id) => {
    let body = {
      CompanyName: values.companyName,
      Designation: values.designation,
      FromDate: values.fromDate,
      ToDate: values.toDate,
    };
    api
      .post(`/api/work-experience/` + id, body, {
      })
      .then((res) => {
        setTable(true);
        toast.success("Work Experience Successfully");
        fetchWorkExperience(id);
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          toast.error("Duplicate work experience entry not allowed.");
        } else {
          toast.error("Failed to add work experience.");
        }
        console.error(err);
      });
  };

  const handleAddWorkExperience = (loadWorkExperienceData) => {
    loadWorkExperienceData();
    setTable(false);
  };

  const handleEditWorkExperience = (e) => {
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleWorkExperienceEditUpdate = (values, newInfo) => {
    let body = {
      CompanyName: values.companyName,
      Designation: values.designation,
      FromDate: values.fromDate,
      ToDate: values.toDate,
    };
    api
      .put(`/api/work-experience/` + newInfo["_id"], body, {
      })
      .then((res) => {
        setTable(true);
        fetchWorkExperience(newInfo["user"] || newInfo["_id"]);
      })
      .catch((err) => {
        console.error(err);
      });
    setEditForm(false);
  };

  // Fetch on mount if id is available
  useEffect(() => {
    const id = props.data && props.data[0]?.user;
    if (id) {
      fetchWorkExperience(id);
    }
    // eslint-disable-next-line
  }, [props.data && props.data[0]?.user]);

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <WorkExperienceFormEdit
            onWorkExperienceEditUpdate={handleWorkExperienceEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <WorkExperienceTable
            onAddWorkExperience={handleAddWorkExperience}
            onEditWorkExperience={handleEditWorkExperience}
            data={workExpData}
            back={props.back}
          />
        )
      ) : (
        <WorkExperienceForm
          onWorkExperienceSubmit={handleWorkExperienceSubmit}
          onFormClose={handleFormClose}
          data={workExpData}
        />
      )}
    </React.Fragment>
  );
};

export default WorkExperience;
