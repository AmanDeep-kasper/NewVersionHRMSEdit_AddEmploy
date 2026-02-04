import React, { useState, useEffect } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { Form } from "react-bootstrap";

const AdminPortalFormEdit = ({
  editData,
  onPortalEditUpdate,
  onStatusChange,
  onFormEditClose,
}) => {
  const [portalData, setPortalData] = useState(editData.PortalName || "");
  const [status, setStatus] = useState(
    typeof editData.Status === "number"
      ? editData.Status
      : Number(editData.Status) || 0
  );
  const { darkMode } = useTheme();

  useEffect(() => {
    setPortalData(editData.PortalName || "");
    setStatus(
      typeof editData.Status === "number"
        ? editData.Status
        : Number(editData.Status) || 0
    );
  }, [editData]);

  const handlePortalDataChange = (e) => {
    setPortalData(e.target.value);
  };

  const handleStatusChange = (e) => {
    const newStatus = Number(e.target.value); // Always number
    setStatus(newStatus);
    onStatusChange(newStatus); // Pass number status
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPortalEditUpdate(editData, portalData, status);
  };

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
          Edit Portal Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
        >
          You can edit portal here.
        </p>
      </div>

      <form
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
        }}
        className="my-4 d-flex flex-column gap-3"
        onSubmit={handleSubmit}
      >
        <div>
          <label>Portal</label>
          <div className="form-input">
            <input
              className={`form-control ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="text"
              placeholder="Portal"
              name="PortalName"
              value={portalData}
              onChange={handlePortalDataChange}
            />
          </div>
        </div>

        <div>
          <label>Status</label>
          <div className="d-flex align-items-center gap-3">
            <Form.Check
              className="d-flex align-items-center gap-2 text-capitalize"
              inline
              type="radio"
              label="Enable"
              value={1}
              name="status"
              onChange={handleStatusChange}
              checked={status === 1}
            />
            <Form.Check
              className="d-flex align-items-center gap-2 text-capitalize"
              inline
              type="radio"
              label="Disable"
              value={0}
              name="status"
              onChange={handleStatusChange}
              checked={status === 0}
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn-primary btn d-flex align-items-center justify-content-center gap-2"
            type="submit"
          >
            Update
          </button>
          <button
            className="btn-danger btn d-flex align-items-center justify-content-center gap-2"
            type="button"
            onClick={onFormEditClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPortalFormEdit;


// import React, { useState, useEffect } from "react";
// import { useTheme } from "../../Context/TheamContext/ThemeContext";
// import { Form } from "react-bootstrap";

// const AdminPortalForm = ({
//   editData,
//   onPortalEditUpdate,
//   onStatusChange,
//   onFormEditClose,
// }) => {
//   const [portalData, setPortalData] = useState(editData.PortalName || "");
//   const [status, setStatus] = useState(editData.Status?.toString() || ""); // Ensure string
//   const { darkMode } = useTheme();

//   useEffect(() => {
//     setPortalData(editData.PortalName || "");
//     setStatus(editData.Status?.toString() || ""); // Convert to string
//   }, [editData]);

//   const handlePortalDataChange = (e) => {
//     setPortalData(e.target.value);
//   };

//   const handleStatusChange = (e) => {
//     const newStatus = e.target.value; // Always string
//     setStatus(newStatus);
//     onStatusChange(newStatus); // Pass string status
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onPortalEditUpdate(editData, portalData, status);
//   };

//   return (
//     <div className="container-fluid py-3">
//       <div className="my-auto">
//         <h5
//           style={{
//             color: darkMode
//               ? "var(--primaryDashColorDark)"
//               : "var(--secondaryDashMenuColor)",
//             fontWeight: "600",
//           }}
//         >
//           Edit Portal Details
//         </h5>
//         <p
//           style={{
//             color: darkMode
//               ? "var(--primaryDashColorDark)"
//               : "var(--secondaryDashMenuColor)",
//           }}
//         >
//           You can edit portal here.
//         </p>
//       </div>

//       <form
//         style={{
//           color: darkMode
//             ? "var(--primaryDashColorDark)"
//             : "var(--secondaryDashMenuColor)",
//         }}
//         className="my-4 d-flex flex-column gap-3"
//         onSubmit={handleSubmit}
//       >
//         <div>
//           <label>Portal</label>
//           <div className="form-input">
//             <input
//               className={`form-control ms-0 ms-md-auto rounded-2 ${
//                 darkMode
//                   ? "bg-light text-dark border dark-placeholder"
//                   : "bg-dark text-light border-0 light-placeholder"
//               }`}
//               type="text"
//               placeholder="Portal"
//               name="PortalName"
//               value={portalData}
//               onChange={handlePortalDataChange}
//             />
//           </div>
//         </div>

//         <div>
//           <label>Status</label>
//           <div className="d-flex align-items-center gap-3">
//             <Form.Check
//               className="d-flex align-items-center gap-2 text-capitalize"
//               inline
//               type="radio"
//               label="Enable"
//               value="1"
//               name="status"
//               onChange={handleStatusChange}
//               checked={status === "1"} // Compare as string
//             />
//             <Form.Check
//               className="d-flex align-items-center gap-2 text-capitalize"
//               inline
//               type="radio"
//               label="Disable"
//               value="0"
//               name="status"
//               onChange={handleStatusChange}
//               checked={status === "0"} // Compare as string
//             />
//           </div>
//         </div>

//         <div className="d-flex align-items-center gap-2">
//           <button
//             className="btn-primary btn d-flex align-items-center justify-content-center gap-2"
//             type="submit"
//           >
//             Update
//           </button>
//           <button
//             className="btn-danger btn d-flex align-items-center justify-content-center gap-2"
//             type="button"
//             onClick={onFormEditClose}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AdminPortalForm;
