import React, { useState } from "react";

const ExportModal = ({ onExport }) => {
  const [selectedFields, setSelectedFields] = useState({
    empID: true,
    Email: true,
    Account: true,
    FirstName: true,
    LastName: true,
    DOB: true,
    ContactNo: true,
    RoleName: true,
    PositionName: true,
    DepartmentName: true,
    DateOfJoining: true,
  });

  const handleFieldChange = (e) => {
    setSelectedFields({
      ...selectedFields,
      [e.target.name]: e.target.checked,
    });
  };

  const handleExport = () => {
    onExport(selectedFields);
  };

  return (
    <div>
      <h4>Select Fields to Export:</h4>
      <label>
        <input
          type="checkbox"
          name="empID"
          checked={selectedFields.empID}
          onChange={handleFieldChange}
        />{" "}
        Emp ID
      </label>
      <label>
        <input
          type="checkbox"
          name="Email"
          checked={selectedFields.Email}
          onChange={handleFieldChange}
        />{" "}
        Email
      </label>
      <label>
        <input
          type="checkbox"
          name="Account"
          checked={selectedFields.Account}
          onChange={handleFieldChange}
        />{" "}
        Account Access
      </label>
      <label>
        <input
          type="checkbox"
          name="FirstName"
          checked={selectedFields.FirstName}
          onChange={handleFieldChange}
        />{" "}
        First Name
      </label>
      <label>
        <input
          type="checkbox"
          name="LastName"
          checked={selectedFields.LastName}
          onChange={handleFieldChange}
        />{" "}
        Last Name
      </label>
      <label>
        <input
          type="checkbox"
          name="DOB"
          checked={selectedFields.DOB}
          onChange={handleFieldChange}
        />{" "}
        DOB
      </label>
      <label>
        <input
          type="checkbox"
          name="ContactNo"
          checked={selectedFields.ContactNo}
          onChange={handleFieldChange}
        />{" "}
        Contact No
      </label>
      <label>
        <input
          type="checkbox"
          name="RoleName"
          checked={selectedFields.RoleName}
          onChange={handleFieldChange}
        />{" "}
        Role
      </label>
      <label>
        <input
          type="checkbox"
          name="PositionName"
          checked={selectedFields.PositionName}
          onChange={handleFieldChange}
        />{" "}
        Position
      </label>
      <label>
        <input
          type="checkbox"
          name="DepartmentName"
          checked={selectedFields.DepartmentName}
          onChange={handleFieldChange}
        />{" "}
        Department
      </label>
      <label>
        <input
          type="checkbox"
          name="DateOfJoining"
          checked={selectedFields.DateOfJoining}
          onChange={handleFieldChange}
        />{" "}
        D.O.J
      </label>

      <button onClick={handleExport}>Export to Excel</button>
      <button onClick={() => onExport()}>Cancel</button>
    </div>
  );
};

export default ExportModal;
