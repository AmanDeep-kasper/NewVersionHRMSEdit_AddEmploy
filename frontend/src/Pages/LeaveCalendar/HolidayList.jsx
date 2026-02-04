import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import holidayImage from "../../img/holidayImage.svg";
import { TwoDigitDates } from "../../Utils/GetDayFormatted";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../config/api";
import toast from "react-hot-toast"; // assuming you're using it elsewhere

function HolidayList({ title, newFolderLink, holidayIcons }) {
  const [holidaysData, setHolidaysData] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/holidays");

        if (response.status === 200) {
          const data = response.data || [];
          setHolidaysData(data);
          setFilteredHolidays(data);
        } else {
          toast.error("Failed to load holidays");
        }
      } catch (error) {
        console.error("Error fetching holidays:", error);
        toast.error("Unable to fetch holiday list");
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredHolidays(holidaysData);
      return;
    }

    const filtered = holidaysData.filter((holiday) =>
      holiday.holidayName.toLowerCase().includes(term)
    );
    setFilteredHolidays(filtered);
  }, [searchTerm, holidaysData]);

  const formatDate = (holiday) => {
    return `${TwoDigitDates(holiday.holidayDate)}-${TwoDigitDates(
      holiday.holidayMonth
    )}-${holiday.holidayYear}`;
  };

  return (
    <div className="h-100">
      <div
        className={`card border-0 shadow-sm h-100 ${
          darkMode ? "bg-dark text-light" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`card-header d-flex justify-content-between align-items-center border-0 py-3 px-4 ${
            darkMode ? "bg-dark-subtle" : "bg-light"
          }`}
        >
          <h6 className="mb-0 fw-semibold">{title}</h6>

          {newFolderLink && holidayIcons && (
            <Link
              to={newFolderLink}
              className="text-decoration-none fs-5 hover-opacity-75 transition-all"
              title="Add / Manage Holidays"
            >
              {holidayIcons}
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search holidays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List / Empty / Loading */}
        <div className="card-body p-0 overflow-hidden d-flex flex-column">
          {loading ? (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredHolidays.length > 0 ? (
            <div
              className="overflow-auto flex-grow-1 px-2"
              style={{ maxHeight: "360px" }}
            >
              <ul className="list-group list-group-flush">
                {filteredHolidays.map((holiday, index) => (
                  <li
                    key={index}
                    className={`list-group-item d-flex justify-content-between align-items-center px-4 py-3 border-0 transition-all ${
                      darkMode
                        ? "bg-dark hover-bg-secondary-subtle"
                        : "hover-bg-light"
                    }`}
                  >
                    <div className="fw-medium">{holiday.holidayName}</div>
                    <div className="text-muted small font-monospace">
                      {formatDate(holiday)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-4">
              <img
                src={holidayImage}
                alt="No holidays"
                className="img-fluid mb-4"
                style={{ maxHeight: "180px", opacity: darkMode ? 0.7 : 0.85 }}
              />
              <h6 className="text-muted mb-2">No holidays found</h6>
              <p className="text-muted small mb-0">
                {searchTerm
                  ? "Try a different search term"
                  : "No holidays available at the moment"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HolidayList;
