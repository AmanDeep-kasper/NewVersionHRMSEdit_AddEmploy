import React from "react";
import "./AdminPortalForm.css";
import { Form } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const AdminPortalForm = ({ onPortalSubmit, onStatusChange, onFormClose }) => {
  const { darkMode } = useTheme();

  return (
    <div className="container-fluid py-3">
      <div className="my-auto">
        <h5
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "600",
          }}
        >
          Add Portal Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
        >
          You can add new portal here.
        </p>
      </div>
      <form
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
        }}
        className="my-4 d-flex flex-column gap-3"
        onSubmit={onPortalSubmit}
      >
        <div>
          <label>Portal</label>
          <div>
            <input
              className={`form-control ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="text"
              placeholder="Please enter portal name"
              name="Portal"
              required
            />
          </div>
        </div>

        <div>
          <label>Status</label>
          <div className="d-flex align-items-center gap-2">
            <Form.Check
              className="d-flex align-items-center gap-2 text-capitalize"
              inline
              type="radio"
              label="enable"
              value="1"
              name="status"
              onChange={onStatusChange}
              required
            />
            <Form.Check
              className="d-flex align-items-center gap-2 text-capitalize"
              inline
              type="radio"
              label="disable"
              value="0"
              name="status"
              onChange={onStatusChange}
              required
            />
          </div>
        </div>

        <div className="d-flex  align-items-center gap-2">
          <button
            className="btn-primary btn d-flex align-items-center justify-content-center gap-2"
            type="submit"
          >
            Submit
          </button>
          <button
            className="btn-danger btn d-flex align-items-center justify-content-center gap-2"
            type="reset"
            onClick={onFormClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPortalForm;
