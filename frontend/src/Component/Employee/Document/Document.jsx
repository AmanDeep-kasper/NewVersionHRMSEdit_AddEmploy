import React, { useState } from "react";
import axios from "axios";
import DocumentTable from "./DocumentTable.jsx";
import DocumentForm from "./DocumentForm.jsx";
import DocumentFormEdit from "./DocumentFormEdit.jsx";
import BASE_URL from "../../../Pages/config/config.js";
import api from "../../../Pages/config/api.js";

const Document = (props) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [files, setFiles] = useState([]);

const handleDocumentSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("title", title);
  formData.append("number", number);
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  try {
    await api.post(`/upload`, formData, {

    });

    setTitle("");
    setNumber("");
    setTable(true);
    setFiles([]);
  } catch (error) {
    console.error("Error uploading document:", error);
  }
};


  const handleAddDocument = () => {
    setTable(false);
  };

  const handleEditDocument = (e) => {
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleDocumentEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();

    let body = {
      CompanyName: newInfo.target[0].value,
      Designation: newInfo.target[1].value,
      FromDate: newInfo.target[2].value,
      ToDate: newInfo.target[3].value,
    };

    api
      .put(`/api/work-experience/` + info["_id"], body, {
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
    <div className="mb-4">
      {table ? (
        editForm ? (
          <DocumentFormEdit
            onDocumentEditUpdate={handleDocumentEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <DocumentTable
            onAddDocument={handleAddDocument}
            onEditDocument={handleEditDocument}
            data={props.data}
            back={props.back}
            table={table}
          />
        )
      ) : (
        <DocumentForm
          onDocumentSubmit={handleDocumentSubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
          data={props.data}
        />
      )}
    </div>
  );
};

export default Document;
