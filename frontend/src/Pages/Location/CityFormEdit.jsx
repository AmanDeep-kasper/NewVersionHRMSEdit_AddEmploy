import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api";

const CityForm = ({ editData, onCityEditUpdate, onFormEditClose }) => {
  const [cityData, setCityData] = useState(editData["CityName"]);
  const [stateData, setStateData] = useState([]);
  const [filteredStateData, setFilteredStateData] = useState([]);
  const [countryData, setCountryData] = useState([]);
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

    loadCountryInfo();
    loadStateInfo();
  }, []);

  const onCountryChange = (e) => {
    const currentCountry = e.target.value;
    const filteredState = stateData.filter(
      (data) => data["country"][0]["_id"] === currentCountry
    );
    setFilteredStateData(filteredState);
  };

  const onChange = (e) => {
    setCityData(e.target.value);
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <h5>Edit City Details</h5>

      <form
        className="d-flex flex-column gap-3 mt-3"
        onSubmit={(e) => onCityEditUpdate(editData, e)}
      >
        <div>
          <label>Country</label>
          <div>
            <select
              className={`form-select ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              name="country"
              onChange={onCountryChange}
              defaultValue=""
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
          <label>State</label>
          <div>
            <select
              className={`form-select ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              name="state"
              required
            >
              <option value="" disabled>
                Select your option
              </option>
              {filteredStateData.map((data, index) => (
                <option
                  key={index}
                  value={data["_id"]}
                  selected={editData["state"][0]["_id"] === data["_id"]}
                >
                  {data["StateName"]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label>City</label>
          <div>
            <input
              className={`form-control ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="text"
              placeholder="City"
              name="City"
              required
              onChange={onChange}
              value={cityData}
            />
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary " type="submit">
            Update
          </button>
          <button
            className="btn btn-danger "
            type="reset"
            onClick={onFormEditClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CityForm;
