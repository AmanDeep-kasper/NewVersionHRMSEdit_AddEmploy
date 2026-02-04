import React, { useState } from "react";
import "./Country.css";
import CountryTable from "./CountryTable.jsx";
import CountryForm from "./CountryForm.jsx";
import CountryFormEdit from "./CountryFormEdit.jsx";
import api from "../config/api.js";

const Country = () => {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [editData, setEditData] = useState({});

  const handleCountrySubmit = async (event) => {
    event.preventDefault();
    const countryName = event.target[0].value;

    try {
      await api.post("/api/country", { CountryName: countryName });
      setIsTableVisible(true);
    } catch (err) {
      console.error("Error creating country:", err.response?.data || err.message);
    }
  };

  const handleAddCountry = () => setIsTableVisible(false);
  const handleEditCountry = (data) => {
    setEditData(data);
    setIsEditFormVisible(true);
  };
  const handleFormClose = () => setIsTableVisible(true);
  const handleEditFormClose = () => setIsEditFormVisible(false);

  const handleCountryEditUpdate = async (info, event) => {
    event.preventDefault();
    const updatedCountryName = event.target[0].value;

    try {
      await api.put(`/api/country/${info._id}`, { CountryName: updatedCountryName });
      setIsTableVisible(true);
      setIsEditFormVisible(false);
    } catch (err) {
      console.error("Error updating country:", err.response?.data || err.message);
    }
  };

  return (
    <>
      {isTableVisible ? (
        isEditFormVisible ? (
          <CountryFormEdit
            onCountryEditUpdate={handleCountryEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <CountryTable
            onAddCountry={handleAddCountry}
            onEditCountry={handleEditCountry}
          />
        )
      ) : (
        <CountryForm
          onCountrySubmit={handleCountrySubmit}
          onFormClose={handleFormClose}
        />
      )}
    </>
  );
};

export default Country;
