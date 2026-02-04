import React, { useState } from "react";
import axios from "axios";
import CompanyTable from "./CompanyTable.jsx";
import CompanyForm from "./CompanyForm.jsx";
import CompanyFormEdit from "./CompanyFormEdit.jsx";
import BASE_URL from "../config/config.js";
import toast from "react-hot-toast";
import api from "../config/api.js";

const Company = () => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  // const handleCompanySubmit = (event) => {
  //   event.preventDefault();

  //   const body = {
  //     CompanyName: event.target[0].value,
  //     Address: event.target[1].value,
  //     CityID: event.target[4].value,
  //     PostalCode: event.target[5].value,
  //     Website: event.target[6].value,
  //     Email: event.target[7].value,
  //     ContactPerson: event.target[8].value,
  //     ContactNo: event.target[9].value,
  //     FaxNo: event.target[10].value,
  //     PanNo: event.target[11].value,
  //     GSTNo: event.target[12].value,
  //     CINNo: event.target[13].value,
  //   };

  //   axios
  //     .post(`${BASE_URL}/api/company`, body, {
  //       headers: {
  //         authorization: localStorage.getItem("token") || "",
  //       },
  //     })
  //     .then((res) => {
  //       setTable(true); // Show the table after form submission
  //       toast.success("Company added successfully!");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toast.error("Failed to add company. Please try again.");
  //     });
  // };
const handleCompanySubmit = (formData) => {
  api
    .post(`/api/company`, {
      CompanyName: formData.companyName,
      Address: formData.address,
      CityID: formData.city,
      PostalCode: formData.postalCode,
      Website: formData.website,
      Email: formData.email,
      ContactPerson: formData.contactPerson,
      ContactNo: formData.contactNo,
      FaxNo: formData.faxNo,
      PanNo: formData.panNo,
      GSTNo: formData.gstNo,
      CINNo: formData.cinNo,
    },)
    .then((res) => {
      setTable(true);
      toast.success("Company added successfully!");
    })
    .catch((err) => {
      console.log(err);
      toast.error("Failed to add company. Please try again.");
    });
};
  const handleAddCompany = () => {
    setTable(false); // Show the form for adding a new company
  };

  const handleEditCompany = (e) => {
    setEditForm(true);
    setEditData(e); // Populate the form with the selected company's data
  };

  const handleFormClose = () => {
    setTable(true); // Go back to the table view
  };

  const handleEditFormClose = () => {
    setEditForm(false); // Close the edit form
  };

  const handleCompanyEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();

    const body = {
      CompanyName: newInfo.target[0].value,
      Address: newInfo.target[1].value,
      CityID: newInfo.target[4].value,
      PostalCode: newInfo.target[5].value,
      Website: newInfo.target[6].value,
      Email: newInfo.target[7].value,
      ContactPerson: newInfo.target[8].value,
      ContactNo: newInfo.target[9].value,
      FaxNo: newInfo.target[10].value,
      PanNo: newInfo.target[11].value,
      GSTNo: newInfo.target[12].value,
      CINNo: newInfo.target[13].value,
    };

    api
      .put(`/api/company/${info["_id"]}`, body, {
      })
      .then((res) => {
        setTable(true); // Return to the table view after editing
        toast.success("Company updated successfully!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update company. Please try again.");
      });

    setEditForm(false);
  };

  return (
    <>
      {table ? (
        editForm ? (
          <CompanyFormEdit
            onCompanyEditUpdate={handleCompanyEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <CompanyTable
            onAddCompany={handleAddCompany}
            onEditCompany={handleEditCompany}
          />
        )
      ) : (
        <CompanyForm
          onCompanySubmit={handleCompanySubmit}
          onFormClose={handleFormClose}
        />
      )}
    </>
  );
};

export default Company;
