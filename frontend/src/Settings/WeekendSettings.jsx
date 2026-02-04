import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../Pages/config/config";
import { IoArrowForwardOutline } from "react-icons/io5";
import TittleHeader from "../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../Context/TheamContext/ThemeContext";
import api from "../Pages/config/api";

const WeekendSettings = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [frequencies, setFrequencies] = useState({});
  const { darkMode } = useTheme();

  useEffect(() => {
  // Fetch existing weekend settings
  const fetchWeekendSettings = async () => {
    try {

      const response = await api.get(`/api/weekend-settings`, {
      });

      const settings = response.data;
      if (settings) {
        setSelectedDays(settings.selectedDays || []);
        setFrequencies(settings.frequencies || {});
      }
    } catch (error) {
      console.error("Error fetching weekend settings:", error);
    }
  };

  fetchWeekendSettings();
}, []);

const handleDayChange = (day) => {
  setSelectedDays((prevDays) =>
    prevDays.includes(day)
      ? prevDays.filter((d) => d !== day)
      : [...prevDays, day]
  );
};

const handleFrequencyChange = (day, e) => {
  const value = e.target.value;
  setFrequencies((prevFrequencies) => ({
    ...prevFrequencies,
    [day]: value,
  }));
};

const handleSave = async () => {
  if (selectedDays.length === 0) {
    alert("Please select at least one weekend day.");
    return;
  }

  try {

    const response = await api.post(
      `/api/weekend-settings`,
      { selectedDays, frequencies },
    );

    alert(response.data.message);
  } catch (error) {
    console.error("Error saving weekend settings:", error);
    alert("Failed to save weekend settings.");
  }
};

  return (
    <div className="container-fluid">
      <div className="mb-2">
        <TittleHeader
          title={"Weekend Settings"}
          message={"You can view and set weekoff for the calendar"}
        />
      </div>
      <div className="row">
        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
          <div className="col-6 col-sm-4 col-md-3 col-lg-2 p-2">
            <div
              style={{
                background: darkMode
                  ? "rgb(226, 225, 225)"
                  : "rgba(39, 38, 38, 0.54)",
              }}
              className="d-flex   flex-column gap-2  p-2  rounded-2"
              key={day}
            >
              <div class="form-check form-switch ml-3">
                <input
                  class="form-check-input fs-5"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDayChange(day)}
                />
                <label
                  class={`form-check-label ml-3 ${
                    selectedDays.includes(day)
                      ? !darkMode
                        ? "text-white"
                        : "text-black"
                      : !darkMode
                      ? "text-light"
                      : "text-muted"
                  }`}
                  for="flexSwitchCheckDefault"
                >
                  {
                    [
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ][day]
                  }
                </label>
              </div>

              {selectedDays.includes(day) && (
                <div>
                  <h6
                    style={{ width: "fit-content" }}
                    className={darkMode ? "badge-info" : "badge-info-dark"}
                  >
                    Select Frequency for <IoArrowForwardOutline />{" "}
                    {
                      [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ][day]
                    }
                  </h6>
                  <select
                    style={{ width: "fit-content" }}
                    className={`form-select w-100 rounded-2 ${
                      darkMode
                        ? "bg-light text-dark border dark-placeholder"
                        : "bg-dark text-light border-0 light-placeholder"
                    }`}
                    value={frequencies[day] || ""}
                    onChange={(e) => handleFrequencyChange(day, e)}
                  >
                    <option value="">Select Frequency</option>
                    <option value="odd">Odd Weekends</option>
                    <option value="even">Even Weekends</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="all">All</option>
                  </select>
                </div>
              )}
              {!selectedDays.includes(day) && (
                <div
                  style={{
                    height: "5rem",
                    width: "100%",
                    background: darkMode
                      ? "rgba(185, 181, 181, 0.41)"
                      : "rgba(39, 38, 38, 0.77)",
                    color: !darkMode
                      ? "rgba(185, 181, 181, 0.75)"
                      : "rgba(53, 51, 51, 0.77)",
                  }}
                  className="d-flex align-items-center justify-content-center rounded-2"
                >
                  De-Activated
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className={`p-2 mx-2 py-4 my-4 ${
          darkMode ? "badge-danger" : "badge-danger-dark"
        }`}
      >
        Weekend modification is not allowed in demo mode , contact to
        admninistration
      </div>

      <button
        disabled
        onClick={handleSave}
        className="btn btn-primary mx-2 mt-1"
      >
        Save Settings
      </button>
    </div>
  );
};

export default WeekendSettings;
