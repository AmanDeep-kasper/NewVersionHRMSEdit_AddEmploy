import React, { useEffect, useState } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import "bootstrap/dist/css/bootstrap.min.css";
import holidayImage from "../../img/holidayImage.svg";
import TittleHeader from "../TittleHeader/TittleHeader"; // assuming still used
import "./leave.css";
import { useSelector } from "react-redux";
import api from "../config/api";
import toast from "react-hot-toast";

// ── React Icons ───────────────────────────────────────────────
import { FiPlus, FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { BsCalendarEvent } from "react-icons/bs"; // optional accent icon

const LeaveCalendar = () => {
  const today = new Date(); // January 13, 2026 in your context
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const [date, setDate] = useState(new Date());
  const [holidayName, setHolidayName] = useState("");
  const [holidayType, setHolidayType] = useState("National Holiday");
  const [holidaysData, setHolidaysData] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);

  const isAdmin = userData?.Account === 1 || userData?.Account === 2;

  const pad = (n) => String(n).padStart(2, "0");

const handleDeleteHoliday = async () => {
  if (!deleteTarget) return;

  try {
    setDeleting(true);

    await api.delete(`/api/holiday/${deleteTarget._id}`);

    setHolidaysData((prev) => prev.filter((h) => h._id !== deleteTarget._id));

    window.dispatchEvent(new Event("holiday-updated"));

    toast.success(`${deleteTarget.holidayName} deleted`);

    setDeleteTarget(null);
  } catch (error) {
    toast.error("Failed to delete holiday");
    console.error(error);
  } finally {
    setDeleting(false);
  }
};


  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMonthName = (m) => months[m - 1];

  // Restrict future dates beyond today
  const maxDate = today.toISOString().split("T")[0];

  const handleAddHoliday = async () => {
    if (!date || !holidayName.trim()) {
      toast.error("Date and holiday name are required");
      return;
    }

    setSaving(true);
    try {
      const d = new Date(date);
      const payload = {
        holidayDate: d.getDate(),
        holidayMonth: d.getMonth() + 1,
        holidayYear: d.getFullYear(),
        holidayDay: d.getDay(),
        holidayName: holidayName.trim(),
        holidayType,
      };

      const res = await api.post("/api/Create-holiday", payload);
      if (res.status === 201) {
        const saved = res.data.newHoliday;
        setHolidaysData((prev) => [...prev, saved]);
        filterHolidays([...holidaysData, saved]);

        window.dispatchEvent(new Event("holiday-updated"));

        toast.success(
          <div className="d-flex flex-column">
            <strong>{saved.holidayName}</strong>
            <small>
              {pad(saved.holidayDate)}/{pad(saved.holidayMonth)}/
              {saved.holidayYear} • {saved.holidayType}
            </small>
          </div>,
          { duration: 5000 }
        );

        setHolidayName("");
        setHolidayType("National Holiday");
        setShowModal(false);
      }
    } catch (err) {
      toast.error("Failed to add holiday");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    api.get("/api/holidays").then((res) => {
      const data = res.data || [];
      setHolidaysData(data);
      filterHolidays(data);
    });
  }, []);

  useEffect(() => {
    filterHolidays(holidaysData);
  }, [searchTerm, filterYear, filterMonth]);

  const filterHolidays = (data) => {
    let result = data.filter(
      (h) =>
        h.holidayYear === Number(filterYear) &&
        h.holidayMonth === Number(filterMonth)
    );

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((h) => h.holidayName.toLowerCase().includes(term));
    }

    setFilteredHolidays(result);
  };

  const changeMonth = (delta) => {
    let newMonth = filterMonth + delta;
    let newYear = filterYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    // Restrict future
    if (newYear > currentYear) return;
    if (newYear === currentYear && newMonth > currentMonth) return;

    setFilterMonth(newMonth);
    setFilterYear(newYear);
  };

  const holidayTypeColors = {
    "National Holiday": "bg-danger text-white", // 🔴 important
    "Gazetted Holiday": "bg-primary text-white", // 🔵 official
    "Restricted Holiday": "bg-warning text-dark", // 🟡 limited
    "Optional Holiday": "bg-success text-white", // 🟢 optional
  };

  // Years dropdown: from -5 to current year only
  const availableYears = Array.from(
    { length: currentYear - (currentYear - 5) + 1 },
    (_, i) => currentYear - 5 + i
  );

  return (
    <div
      className={`container-fluid py-4 ${
        !darkMode ? "bg-dark text-light" : "bg-light"
      }`}
    >
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div
          className={`card-header d-flex justify-content-between align-items-center py-3 px-4 border-0 ${
            !darkMode ? "bg-dark-subtle" : "bg-white"
          }`}
        >
          <div>
            <h4 className="mb-1 fw-bold d-flex align-items-center gap-2">
              <BsCalendarEvent size={22} /> Holiday Calendar
            </h4>
            <small className="text-muted">
              {isAdmin ? "Manage" : "View"} holidays • {filteredHolidays.length}{" "}
              entries
            </small>
          </div>

          {isAdmin && (
            <button
              className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm"
              onClick={() => setShowModal(true)}
            >
              <FiPlus size={18} /> Add Holiday
            </button>
          )}
        </div>

        <div className="card-body p-4">
          {/* Filters */}
          <div className="row g-3 mb-4 align-items-end">
            <div className="col-md-5">
              <label className="form-label fw-medium small mb-1">
                Select Period
              </label>
              <div className="input-group input-group-sm">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => changeMonth(-1)}
                  disabled={filterYear === currentYear - 5 && filterMonth === 1}
                >
                  <FiChevronLeft size={18} />
                </button>

                <select
                  className="form-select"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(Number(e.target.value))}
                >
                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select"
                  value={filterYear}
                  onChange={(e) => setFilterYear(Number(e.target.value))}
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-outline-secondary"
                  onClick={() => changeMonth(1)}
                  disabled={
                    filterYear === currentYear && filterMonth === currentMonth
                  }
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="col-md-7">
              <label className="form-label fw-medium small mb-1">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search holiday name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredHolidays.length > 0 ? (
            <div className="table-responsive rounded-3 shadow-sm">
              <table className="table table-hover table-borderless mb-0">
                <thead className={!darkMode ? "table-dark" : "table-light"}>
                  <tr>
                    <th scope="col" style={{ width: "160px" }}>
                      Date
                    </th>
                    <th scope="col">Holiday</th>
                    <th scope="col" style={{ width: "200px" }}>
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHolidays.map((h, i) => (
                    <tr key={i} className="align-middle">
                      <td className="fw-medium text-nowrap">
                        {pad(h.holidayDate)}-{pad(h.holidayMonth)}-
                        {h.holidayYear}
                      </td>
                      <td>
                        {h.holidayName.charAt(0).toUpperCase() +
                          h.holidayName.slice(1)}
                      </td>
                      <td className="d-flex align-items-center gap-3">
                        <span
                          className={`badge rounded-pill px-3 py-2 fw-semibold ${
                            holidayTypeColors[h.holidayType] || "bg-secondary"
                          }`}
                          style={{
                            fontSize: "0.85rem",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {h.holidayType}
                        </span>

                        {isAdmin && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete holiday"
                            onClick={() => setDeleteTarget(h)}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                        {deleteTarget && (
                          <div
                            className="modal fade show"
                            style={{
                              display: "block",
                              backgroundColor: "rgba(0,0,0,0.10)",
                            }}
                          >
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content border-0 rounded-4 shadow-sm">
                                <div className="modal-header border-0 pb-1">
                                  <h5 className="modal-title fw-semibold text-danger d-flex align-items-center gap-2">
                                    <i className="bi bi-exclamation-triangle-fill"></i>
                                    Delete Holiday
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setDeleteTarget(null)}
                                    disabled={deleting}
                                    aria-label="Close"
                                  />
                                </div>

                                <div className="modal-body pt-2 pb-4">
                                  <p className="mb-3 text-body">
                                    You are about to{" "}
                                    <strong>permanently delete</strong> the
                                    following holiday:
                                  </p>

                                  <div className="bg-light p-3 rounded-3 border mb-4">
                                    <div className="fw-bold fs-5 mb-1">
                                      {deleteTarget.holidayName}
                                    </div>
                                    <div className="text-muted small">
                                      Date: {pad(deleteTarget.holidayDate)}/
                                      {pad(deleteTarget.holidayMonth)}/
                                      {deleteTarget.holidayYear}
                                    </div>
                                  </div>

                                  <p className="mb-0 small text-muted fst-italic">
                                    This action cannot be undone.
                                  </p>
                                </div>

                                <div className="modal-footer border-0 pt-1 gap-2">
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary px-4"
                                    onClick={() => setDeleteTarget(null)}
                                    disabled={deleting}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-danger px-4 d-flex align-items-center gap-2"
                                    onClick={handleDeleteHoliday}
                                    disabled={deleting}
                                  >
                                    {deleting ? (
                                      <>
                                        <span
                                          className="spinner-border spinner-border-sm"
                                          role="status"
                                          aria-hidden="true"
                                        />
                                        <span>Deleting…</span>
                                      </>
                                    ) : (
                                      <>Delete Holiday</>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 my-5">
              <img
                src={holidayImage}
                alt="No holidays this period"
                className="img-fluid mb-4"
                style={{ maxHeight: "220px", opacity: darkMode ? 0.7 : 0.85 }}
              />
              <h5 className="text-muted mb-2">No holidays found</h5>
              <p className="text-muted mb-4">
                {searchTerm
                  ? "Try a different keyword"
                  : `No holidays in ${getMonthName(filterMonth)} ${filterYear}`}
              </p>
              {isAdmin && (
                <button
                  className="btn btn-outline-primary px-4"
                  onClick={() => setShowModal(true)}
                >
                  Add Holiday
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Improved Modal ─────────────────────────────────────── */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.65)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className={`modal-content ${
                darkMode ? "bg-dark text-light border-0" : "border-0 shadow-xl"
              } rounded-4`}
            >
              <div className="modal-header border-0 pb-1">
                <h5 className="modal-title fw-bold">Add New Holiday</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                />
              </div>

              <div className="modal-body px-4 pb-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date.toISOString().split("T")[0]}
                      onChange={(e) => setDate(new Date(e.target.value))}
                      max={maxDate} // ← prevents future dates
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Type</label>
                    <select
                      className="form-select"
                      value={holidayType}
                      onChange={(e) => setHolidayType(e.target.value)}
                    >
                      <option>National Holiday</option>
                      <option>Gazetted Holiday</option>
                      <option>Restricted Holiday</option>
                      <option>Optional Holiday</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">Holiday Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Republic Day, Diwali, etc."
                      value={holidayName}
                      onChange={(e) => setHolidayName(e.target.value)}
                      maxLength={80}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 px-4 pb-4 pt-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-5 d-flex align-items-center gap-2"
                  onClick={handleAddHoliday}
                  disabled={saving}
                >
                  {saving && (
                    <span className="spinner-border spinner-border-sm" />
                  )}
                  {saving ? "Saving..." : "Add Holiday"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCalendar;
