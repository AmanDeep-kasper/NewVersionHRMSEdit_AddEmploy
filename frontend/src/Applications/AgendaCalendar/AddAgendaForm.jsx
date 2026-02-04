import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api"; // ✅ use your axios instance (withCredentials:true)

const AddAgendaForm = ({ onAgendaAdded, onClose }) => {
  const { userData } = useSelector((state) => state.user);
  const createdBy = userData?._id;
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ basic validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required!";
    if (!formData.description.trim()) newErrors.description = "Description is required!";
    if (!formData.startDate) newErrors.startDate = "Start Date is required!";
    if (!formData.endDate) newErrors.endDate = "End Date is required!";
    if (new Date(formData.endDate) < new Date(formData.startDate))
      newErrors.endDate = "End Date must be after Start Date!";
    if (!formData.type) newErrors.type = "Type is required!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 🚀 use cookie-based authenticated request
      await api.post("/api/custom-agenda", { ...formData, createdBy });

      setMessage("Agenda added successfully!");
      setFormData({ title: "", description: "", startDate: "", endDate: "", type: "" });

      if (typeof onAgendaAdded === "function") onAgendaAdded();
      if (typeof onClose === "function") onClose();
    } catch (error) {
      console.error("Error adding agenda:", error);
      setMessage("Failed to add agenda. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "95vh",
        background: darkMode
          ? "var(--secondaryDashMenuColor)"
          : "var(--secondaryDashColorDark)",
        color: !darkMode
          ? "var(--secondaryDashMenuColor)"
          : "var(--secondaryDashColorDark)",
      }}
      className="p-4 shadow rounded"
    >
      <h4 className="text-primary">Add Custom Agenda</h4>
      {message && (
        <p className={message.includes("successfully") ? "text-success" : "text-danger"}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <small className="text-danger">{errors.title}</small>}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <small className="text-danger">{errors.description}</small>
          )}
        </div>

        {/* Start Date */}
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="datetime-local"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <small className="text-danger">{errors.startDate}</small>}
        </div>

        {/* End Date */}
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="datetime-local"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
        </div>

        {/* Type */}
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            className={`form-select rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="Reminder">Reminder</option>
            <option value="Meeting">Meeting</option>
          </select>
          {errors.type && <small className="text-danger">{errors.type}</small>}
        </div>

        {/* Buttons */}
        <div className="d-flex align-items-center gap-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Agenda"}
          </button>
          <button type="button" className="btn btn-danger" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAgendaForm;
