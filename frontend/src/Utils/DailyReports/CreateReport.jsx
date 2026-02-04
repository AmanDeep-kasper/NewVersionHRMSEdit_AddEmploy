import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import { useSelector } from "react-redux";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api";

const CreateReport = ({ onclick }) => {
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    user: userData._id,
    title: "",
    description: "",
    complication: "",
    link: "",
    remarks: "",
    reportedDate: new Date().toISOString().split("T")[0],
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(""); // Clear previous messages

  try {

    const response = await api.post(
      `/api/dailyReports/`,
      formData,
    );

    if (response.status === 201 || response.status === 200) {
      setMessage("✅ Report created successfully!");
      // Reset form after success
      setFormData({
        user: userData._id,
        title: "",
        description: "",
        complication: "",
        link: "",
        remarks: "",
        reportedDate: new Date().toISOString().split("T")[0], // Reset to today's date
      });
    } else {
      setMessage("⚠️ Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error creating report:", error);
    setMessage(
      `❌ Error creating report: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};


  return (
    <div className="container-fluid">
      <TittleHeader title={"Create Report"} />
      <form className="row row-gap-3 my-3" onSubmit={handleSubmit}>
        <div className="col-12 col-md-6">
          <label>Reported Date</label>
          <input
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="date"
            name="reportedDate"
            value={formData.reportedDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Title</label>
          <input
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="text"
            name="title"
            placeholder="Please enter the title of your work."
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Description</label>
          <input
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="text"
            name="description"
            placeholder="Please enter the description of your work."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Complication</label>
          <input
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="text"
            name="complication"
            placeholder="If you're facing any trouble, mention it here."
            value={formData.complication}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Link</label>
          <input
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="url"
            name="link"
            placeholder="Paste your work link here."
            value={formData.link}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Remarks</label>
          <input
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="text"
            name="remarks"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>
        <button
          style={{ width: "fit-content" }}
          className="btn mx-3 px-4 btn-primary"
          type="submit"
        >
          Publish
        </button>{" "}
        <button
          style={{ width: "fit-content" }}
          className="btn mx-3 px-4 btn-danger"
          onClick={onclick}
        >
          Cancel ( Esc Key)
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateReport;
