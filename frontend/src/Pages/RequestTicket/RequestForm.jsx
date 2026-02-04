import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import TittleHeader from "../TittleHeader/TittleHeader";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../config/api";

const RequestForm = (props) => {
  const location = useLocation().pathname.split("/")[1];
  const { userData } = useSelector((state) => state.user);
  const id = userData?._id;
  const email = userData?.Email;
  const [empData, setEmpData] = useState([]);
  const [formData, setFormData] = useState({
    requestedBy: email,
    to: "",
    cc: [],
    subject: "",
    remark: "",
    priority: "Medium",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const { darkMode } = useTheme();

  useEffect(() => {
    api
      .post(
        `/api/managersMailsList`,
        { status: location, email },
      )
      .then((response) => {
        const managers = response.data.managers.map((manager) => ({
          value: manager.Email,
          label: manager.Email,
        }));
        setEmpData([{ value: "select_all", label: "Select All" }, ...managers]);

        setFormData((prev) => ({
          ...prev,
          to: response.data.reportManager,
        }));
      })
      .catch((error) => {
        console.error("Error loading employee data", error);
      });
  }, [id]);

  const handleSelectChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "select_all")) {
      const allExceptSelectAll = empData.filter(
        (option) => option.value !== "select_all"
      );
      setFormData({
        ...formData,
        cc: allExceptSelectAll,
      });
      setEmpData(allExceptSelectAll);
    } else {
      setFormData({
        ...formData,
        cc: selectedOptions,
      });
      const allSelected = selectedOptions.length === empData.length - 1;
      if (!allSelected) {
        setEmpData((prevEmpData) => [
          { value: "select_all", label: "Select All" },
          ...prevEmpData.filter((option) => option.value !== "select_all"),
        ]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      priority: selectedOption.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post(`/api/request`, formData, {
      })
      .then((response) => {
        setSuccessMessage("Ticket successfully raised");
        toast.success("Ticket successfully raised");

        setFormData((prev) => ({
          ...prev,
          cc: [],
          subject: "",
          remark: "",
          priority: "Medium", // Reset priority to default
        }));
      })

      .catch((error) => {
        console.error("Error submitting request", error);
        toast.error("Error submitting request");
      });
  };

  const priorityOptions = [
    { value: "Urgent", label: "Urgent" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: "400px",
      overflowY: "auto",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
        maxHeight: "85vh",
        overflow: "auto",
      }}
      className="container-fluid py-2"
    >
      <TittleHeader
        title={"Create Request"}
        message={"You can create a new request here."}
      />
      <form className="py-4 rounded row" onSubmit={handleSubmit}>
        <div className="mb-3 col-12">
          <label htmlFor="to" className="form-label">
            To
          </label>
          <input
            type="text"
            className={`form-control  text-capitalize rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            id="to"
            name="to"
            value={formData.to}
            required
            disabled
          />
        </div>

        <div className="mb-3 col-12">
          <label htmlFor="cc" className="form-label">
            CC
          </label>
          <Select
            classNamePrefix={`rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            id="cc"
            name="cc"
            value={formData.cc}
            onChange={handleSelectChange}
            options={empData}
            isMulti
            closeMenuOnSelect={false}
            isClearable
            styles={customStyles}
            menuPlacement="bottom"
            menuPortalTarget={document.body}
            placeholder="Select User"
          />
        </div>

        <div className="mb-3 col-12">
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <input
            type="text"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3 col-12">
          <label htmlFor="remark" className="form-label">
            Remark
          </label>
          <textarea
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            id="remark"
            name="remark"
            value={formData.remark}
            onChange={handleInputChange}
            required
            placeholder="Please provide remarks"
          />
        </div>

        <div className="mb-3 col-12">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className={`form-select text-capitalize rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            <option value="" disabled>
              Select Priority
            </option>
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button type="submit" className="btn btn-primary">
            Raise Ticket
          </button>
        </div>
      </form>

      {/* {successMessage && (
        <div className="mt-4 alert alert-success">{successMessage}</div>
      )} */}
    </div>
  );
};

export default RequestForm;
