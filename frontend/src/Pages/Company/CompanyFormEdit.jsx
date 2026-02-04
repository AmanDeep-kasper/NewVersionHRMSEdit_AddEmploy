import React, { useState, useEffect } from "react";
import "./CompanyFormEdit.css";
import axios from "axios";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../config/api";

const CompanyFormEdit = ({ editData, onCompanyEditUpdate, onFormEditClose }) => {
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [filteredStateData, setFilteredStateData] = useState([]);
  const [filteredCityData, setFilteredCityData] = useState([]);
  const [companyNameData, setCompanyNameData] = useState(editData["CompanyName"]);
  const [addressData, setAddressData] = useState(editData["Address"]);
  const [postalCodeData, setPostalCodeData] = useState(editData["PostalCode"]);
  const [websiteData, setWebsiteData] = useState(editData["Website"]);
  const [emailData, setEmailData] = useState(editData["Email"]);
  const [contactPersonData, setContactPersonData] = useState(editData["ContactPerson"]);
  const [contactNoData, setContactNoData] = useState(editData["ContactNo"]);
  const [faxNoData, setFaxNoData] = useState(editData["FaxNo"]);
  const [panNoData, setPanNoData] = useState(editData["PanNo"]);
  const [gstNoData, setGstNoData] = useState(editData["GSTNo"]);
  const [cinNoData, setCinNoData] = useState(editData["CINNo"]);
  const { darkMode } = useTheme();

  useEffect(() => {
    const loadCountryInfo = async () => {
      try {
        const response = await api.get(`/api/country`, {
        });
        setCountryData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const loadStateInfo = async () => {
      try {
        const response = await api.get(`/api/state`, {
        });
        setStateData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const loadCityInfo = async () => {
      try {
        const response = await api.get(`${BASE_URL}/api/city`, {
        });
        setCityData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadCountryInfo();
    loadStateInfo();
    loadCityInfo();
  }, []);

  const onCountryChange = (e) => {
    const currentCountry = e.target.value;
    const filteredState = stateData.filter(
      (data) => data["country"][0]["_id"] === currentCountry
    );
    setFilteredStateData(filteredState);
  };

  const onStateChange = (e) => {
    const currentState = e.target.value;
    const filteredCity = cityData.filter(
      (data) => data["state"][0]["_id"] === currentState
    );
    setFilteredCityData(filteredCity);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCompanyEditUpdate(
      {
        CompanyName: companyNameData,
        Address: addressData,
        PostalCode: postalCodeData,
        Website: websiteData,
        Email: emailData,
        ContactPerson: contactPersonData,
        ContactNo: contactNoData,
        FaxNo: faxNoData,
        PanNo: panNoData,
        GSTNo: gstNoData,
        CINNo: cinNoData,
      },
      e
    );
  };

  return (
    <div style={{
      color: darkMode
        ? "var(--primaryDashColorDark)"
        : "var(--secondaryDashMenuColor)",
    }}
    className="container-fluid py-3">
      <h5>Edit Company Details</h5>
      <form className="d-flex flex-column gap-3 mt-3" onSubmit={handleSubmit}>
          <div>
            <label>
              Company Name
            </label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Company Name"
                name="CompanyName"
                value={companyNameData}
                onChange={(e) => setCompanyNameData(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label>
              Address
            </label>
            <div>
              <textarea
                className="form-control rounded-0"
                rows="3"
                placeholder="Address"
                required
                value={addressData}
                onChange={(e) => setAddressData(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>
              Country
            </label>
            <div>
              <select
                className="form-select rounded-0"
                name="country"
                onChange={onCountryChange}
              >
                <option value="" disabled>
                  Select your option
                </option>
                {countryData.map((data, index) => (
                  <option key={index} value={data["_id"]}>
                    {data["CountryName"]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>
              State
            </label>
            <div>
              <select
                className="form-select rounded-0"
                name="state"
                
                onChange={onStateChange}
              >
                <option value="" disabled>
                  Select your option
                </option>
                {stateData.map((data, index) => (
                  <option key={index} value={data["_id"]}>
                    {data["StateName"]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>
              City
            </label>
            <div>
              <select
                className="form-select rounded-0"
                name="city"
                required
              >
                <option value="" disabled>
                  Select your option
                </option>
                {cityData.map((data, index) => (
                  <option key={index} value={data["_id"]}>
                    {data["CityName"]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>
              PostalCode
            </label>
            <div>
              <input
                className="form-control rounded-0"
                type="number"
                placeholder="PostalCode"
                required
                value={postalCodeData}
                onChange={(e) => setPostalCodeData(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>
              Website
            </label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Website"
                required
                value={websiteData}
                onChange={(e) => setWebsiteData(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>
              Email
            </label>
            <div>
              <input
                className="form-control rounded-0"
                type="email"
                placeholder="Email"
                required
                value={emailData}
                onChange={(e) => setEmailData(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>
              Contact Person
            </label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Contact Person"
                required
                value={contactPersonData}
                onChange={(e) => setContactPersonData(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>
              Contact No
            </label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Contact No"
                required
                value={contactNoData}
                onChange={(e) => setContactNoData(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>
              FaxNo
            </label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="FaxNo"
                required
                value={faxNoData}
                onChange={(e) => setFaxNoData(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>
              PanCard No
            </label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="PanCard No"
                required
                value={panNoData}
                onChange={(e) => setPanNoData(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>
              GSTNo
            </label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="GSTNo"
                required
                value={gstNoData}
                onChange={(e) => setGstNoData(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>
              CINNo
            </label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="CINNo"
                required
                value={cinNoData}
                onChange={(e) => setCinNoData(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex gap-3">
            <button className="btn btn-primary" type="submit">Submit</button>
            <button className="btn btn-danger" type="reset" onClick={onFormEditClose}>Cancel</button>
          </div>
        </form>
    </div>
  );
};

export default CompanyFormEdit;
