import React, { useState, useEffect } from "react";
import "./CompanyForm.css";
import axios from "axios";
import BASE_URL from "../config/config";
import { Form } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../config/api";

const CompanyForm = (props) => {
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [filteredStateData, setFilteredStateData] = useState([]);
  const [filteredCityData, setFilteredCityData] = useState([]);
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    website: "",
    email: "",
    contactPerson: "",
    contactNo: "",
    faxNo: "",
    panNo: "",
    gstNo: "",
    cinNo: "",
  });

  useEffect(() => {
    loadCountryInfo();
    loadStateInfo();
    loadCityInfo();
  }, []);

  const loadCountryInfo = () => {
    api
      .get(`/api/country`, 
      )
      .then((response) => setCountryData(response.data))
      .catch((error) => console.log(error));
  };

  const loadStateInfo = () => {
    api
      .get(`/api/state`,
      )
      .then((response) => setStateData(response.data))
      .catch((error) => console.log(error));
  };

  const loadCityInfo = () => {
    api
      .get(`/api/city`, 
    )
      .then((response) => setCityData(response.data))
      .catch((error) => console.log(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value.replace(/<[^>]*>?/gm, "").trim();

    // Sanitize numbers
    if (["contactNo", "faxNo", "postalCode"].includes(name)) {
      sanitizedValue = sanitizedValue.replace(/[^\d]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const onCountryChange = (e) => {
    handleInputChange(e);
    const countryId = e.target.value;
    const filteredState = stateData.filter(
      (data) => data.country?.[0]?._id === countryId
    );
    setFilteredStateData(filteredState);
    setFilteredCityData([]);
  };

  const onStateChange = (e) => {
    handleInputChange(e);
    const stateId = e.target.value;
    const filteredCity = cityData.filter(
      (data) => data.state?.[0]?._id === stateId
    );
    setFilteredCityData(filteredCity);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onCompanySubmit(formData);
  };

  const renderFormInput = (label, name, type = "text", placeholder = "") => (
    <div className="col-12 col-md-6">
      <label>{label}</label>
      <input
        className={`form-control rounded-2 ${
          darkMode
            ? "bg-light text-dark border dark-placeholder"
            : "bg-dark text-light border-0 light-placeholder"
        }`}
        type={type}
        name={name}
        placeholder={placeholder || label}
        value={formData[name]}
        onChange={handleInputChange}
      />
    </div>
  );

  const renderFormTextarea = (label, name) => (
    <div className="col-12 col-md-6">
      <label>{label}</label>
      <textarea
        className={`form-control rounded-2 ${
          darkMode
            ? "bg-light text-dark border dark-placeholder"
            : "bg-dark text-light border-0 light-placeholder"
        }`}
        rows="3"
        name={name}
        placeholder={label}
        value={formData[name]}
        onChange={handleInputChange}
      />
    </div>
  );

  const renderFormSelect = (label, name, data, onChange) => (
    <div className="col-12 col-md-6">
      <label>{label}</label>
      <select
        className={`form-select rounded-2 ${
          darkMode
            ? "bg-light text-dark border dark-placeholder"
            : "bg-dark text-light border-0 light-placeholder"
        }`}
        name={name}
        value={formData[name]}
        onChange={onChange}
      >
        <option value="">Select your option</option>
        {data.map((item, index) => (
          <option key={index} value={item._id}>
            {item[label + "Name"]}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
    >
      <div className="container-fluid p-3 py-4">
        <h5 className="my-3">Add Company Details</h5>
        <Form className="row row-gap-3" onSubmit={handleSubmit}>
          {renderFormInput("Company Name", "companyName")}
          {renderFormTextarea("Address", "address")}
          {renderFormSelect("Country", "country", countryData, onCountryChange)}
          {renderFormSelect("State", "state", filteredStateData, onStateChange)}
          {renderFormSelect("City", "city", filteredCityData, handleInputChange)}
          {renderFormInput("Postal Code", "postalCode", "number")}
          {renderFormInput("Website", "website", "text")}
          {renderFormInput("Email", "email", "email")}
          {renderFormInput("Contact Person", "contactPerson")}
          {renderFormInput("Contact No", "contactNo", "text")}
          {renderFormInput("Fax No", "faxNo", "text")}
          {renderFormInput("Pan Card No", "panNo", "text")}
          {renderFormInput("GST No", "gstNo", "text")}
          {renderFormInput("CIN No", "cinNo", "text")}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={props.onFormClose}
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CompanyForm;
