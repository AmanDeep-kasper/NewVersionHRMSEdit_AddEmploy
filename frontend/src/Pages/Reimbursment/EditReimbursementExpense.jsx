import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/config"; // Correct import path
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import TittleHeader from "../TittleHeader/TittleHeader";
import api from "../config/api";

const EditReimbursementExpense = ({
  date,
  type,
  appliedAmount,
  status,
  attachment,
  details,
  cardID,
  isOpen,
}) => {
  const formatDate = (inputDate) => {
    if (!inputDate) return "";
    const d = new Date(inputDate);
    return d.toISOString().split("T")[0];
  };

  const [isFormOpen, setISformOpen] = useState(isOpen);

  const [expenseData, setExpenseData] = useState({
    date: formatDate(date),
    type: type,
    appliedAmount: appliedAmount,
    approvedAmount: 0,
    status: status,
    attachment: attachment,
    details: details,
    finalRemarks: "Still Pending",
  });
  const { darkMode } = useTheme();

  useEffect(() => {
    setISformOpen(isOpen || false);
    setExpenseData({
      date: formatDate(date) || "",
      type: type || "",
      appliedAmount: appliedAmount || 0,
      approvedAmount: 0,
      status: status || "",
      attachment: attachment || "",
      details: details || "",
      finalRemarks: "Still Pending",
    });
  }, [date, type, appliedAmount, status, attachment, details, cardID, isOpen]);

  const id = cardID;
  const navigate = useNavigate();

 useEffect(() => {
  const fetchExpense = async () => {
    try {

      const response = await api.get(
        `/api/reimbursement-expenses/${id}`,
      );

      if (response.status === 200) {
        setExpenseData(response.data); // Ensure response.data matches expected structure
      } else {
        console.error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error(
        "Error fetching the expense data:",
        error.response?.data?.message || error.message
      );
    }
  };

  fetchExpense();
}, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const response = await api.put(
      `/api/reimbursement-expenses/${id}`,
      expenseData,
    );

    alert(response.data.message || "Expense updated successfully!");
    navigate("/hr/Reimbursment_View");
  } catch (error) {
    console.error("Error updating the expense:", error);
    alert("Error updating the expense");
  }
};

  return (
    <div
      style={{
        display: isFormOpen ? "block" : "none",
        position: "absolute",
        zIndex: "100",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
        background: !darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="p-2"
    >
      <div className="px-2 d-flex align-items-center justify-content-between">
        <TittleHeader
          title={"Edit Reimbursement Expense"}
          message={"You can update reimbursment from here"}
        />
        <button
          className="btn btn-danger ml-3"
          style={{ width: "fit-content" }}
          onClick={() => setISformOpen(false)}
        >
          Close
        </button>
      </div>
      <form className="row mx-auto row-gap-3 mt-3" onSubmit={handleSubmit}>
        <div className="col-12 col-md-6 d-flex flex-column">
          <label>Date:</label>
          <input
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="date"
            name="date"
            value={expenseData.date}
            onChange={handleChange}
            required
            disabled
          />
        </div>
        <div className="col-12 col-md-6 d-flex flex-column">
          <label>Type:</label>
          <select
            className={`form-select ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="type"
            value={type}
            onChange={handleChange}
            required
            disabled
          >
            <option value="Travel Expenses">Travel Expenses</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Telephone Expenses">Telephone Expenses</option>
            <option value="Office supplies">Office supplies</option>
            <option value="Office Expenses">Office Expenses</option>
            <option value="Medical Expenses">Medical Expenses</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>
        <div className="col-12 col-md-6 d-flex flex-column">
          <label>Applied Amount:</label>
          <input
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="number"
            name="appliedAmount"
            value={expenseData.appliedAmount}
            onChange={handleChange}
            required
            min="0"
            disabled
          />
        </div>
        <div className="col-12 col-md-6 d-flex flex-column">
          <label>Status:</label>
          <select
            className={`form-select ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="status"
            value={expenseData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="col-12 col-md-6 d-flex flex-column">
          <label>Approved Amount:</label>
          <input
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="number"
            name="approvedAmount"
            value={expenseData.approvedAmount}
            onChange={handleChange}
            required
            min="0"
            disabled={
              expenseData.status === "Rejected" ||
              expenseData.status === "Pending"
            }
          />
        </div>

        <div className="col-12 col-md-6 d-flex flex-column">
          <label>Attachment URL:</label>
          <input
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="url"
            name="attachment"
            value={expenseData.attachment}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6 d-flex flex-column">
          <label>Details:</label>
          <textarea
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="details"
            value={expenseData.details}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="col-12 col-md-6 d-flex flex-column">
          <label>Final Remarks:</label>
          <textarea
            className={`form-control ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            type="text"
            name="finalRemarks"
            value={expenseData.finalRemarks}
            onChange={handleChange}
          />
        </div>
        <button
          className="btn btn-primary ml-3"
          style={{ width: "fit-content" }}
          type="submit"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditReimbursementExpense;
