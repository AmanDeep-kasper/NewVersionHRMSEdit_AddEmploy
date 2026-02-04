import React from "react";
import "./CustomModal.css"; // Create this CSS file for styling

const CustomModal = ({ show, onClose, children, title }) => {
  if (!show) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h5 className="custom-modal-title">{title}</h5>
          <button className="custom-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="custom-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
