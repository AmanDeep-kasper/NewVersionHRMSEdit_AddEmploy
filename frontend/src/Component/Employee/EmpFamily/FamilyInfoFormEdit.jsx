import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const FamilyInfoFormEdit = (props) => {
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  const location = useLocation().pathname.split("/")[2];
  const user =
    location === "employee"
      ? sessionStorage.getItem("personal_id")
      : userData?._id;
  const updatedBy = userData?._id;

  const [nameData, setNameData] = useState(props.editData["Name"]);
  const [relationshipData, setRelationshipData] = useState(props.editData["Relationship"]);
  const [dobData, setDOBData] = useState(props.editData["DOB"].slice(0, 10));
  const [occupationData, setOccupationData] = useState(props.editData["Occupation"]);
  const [contactData, setContactData] = useState(props.editData["parentMobile"]);

  // Restrict DOB to yesterday or earlier
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const maxDate = yesterday.toISOString().split("T")[0];

  // Event Handlers with Validation
  const onNameDataChange = (e) => {
    setNameData(e.target.value.replace(/[^A-Za-z ]/g, ""));
  };

  const onRelationshipDataChange = (e) => {
    setRelationshipData(e.target.value.replace(/[^A-Za-z ]/g, ""));
  };

  const onOccupationDataChange = (e) => {
    setOccupationData(e.target.value.replace(/[^A-Za-z ]/g, ""));
  };

  const onContactDataChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setContactData(value);
  };

  const onDOBDataChange = (e) => {
    setDOBData(e.target.value);
  };

  return (
    <div className="container-fluid pb-3">
      <h5 className="mb-3">✏️ Edit Family Info Details</h5>
      <div>
        <Form
          id="form"
          className="d-flex flex-column gap-2"
          onSubmit={(e) =>
            props.onFamilyInfoEditUpdate(props.editData, e, user, updatedBy)
          }
        >
          <div className="d-flex flex-column">
            <label>Name</label>
            <input
              className={`form-control text-capitalize rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"}`}
              type="text"
              name="name"
              placeholder="Name"
              required
              value={nameData}
              onChange={onNameDataChange}
            />
          </div>

          <div className="d-flex flex-column">
            <label>Relationship</label>
            <input
              className={`form-control text-capitalize rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"}`}
              type="text"
              name="relationship"
              placeholder="Relationship"
              required
              value={relationshipData}
              onChange={onRelationshipDataChange}
            />
          </div>

          <div className="d-flex flex-column">
            <label>Date of Birth</label>
            <input
              className={`form-control text-uppercase rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"}`}
              type="date"
              name="dob"
              required
              max={maxDate}
              value={dobData}
              onChange={onDOBDataChange}
            />
          </div>

          <div className="d-flex flex-column">
            <label>Occupation</label>
            <input
              className={`form-control text-capitalize rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"}`}
              type="text"
              name="occupation"
              placeholder="Occupation"
              required
              value={occupationData}
              onChange={onOccupationDataChange}
            />
          </div>

          <div className="d-flex flex-column">
            <label>Contact</label>
            <input
              className={`form-control rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"}`}
              type="tel"
              name="contact"
              placeholder="Enter contact number"
              pattern="[0-9]{10}"
              maxLength="10"
              required
              value={contactData}
              onChange={onContactDataChange}
              title="Please enter a valid 10-digit contact number"
            />
          </div>

          <div className="d-flex align-items-center gap-3 my-2">
            <button className="btn btn-primary" type="submit">
              Update
            </button>
            <button
              className="btn btn-danger"
              type="button"
              onClick={props.onFormEditClose}
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FamilyInfoFormEdit;
