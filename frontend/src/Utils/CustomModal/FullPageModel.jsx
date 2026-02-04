import React from "react";
import "./FullPageModel.css";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const FullPageModel = ({ show, onClose, children, title }) => {
  const { darkMode } = useTheme(); // ✅ Hook must be at the top level

  if (!show) return null;

  return (
    <div
      className="custom-modal-overlay"
      style={{ background: darkMode ? "white" : "black" }}
    >
      <div
        className="custom-modal"
        style={{
          background: darkMode ? "white" : "black",
          color: darkMode ? "black" : "white",
        }}
      >
        <div className="custom-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default FullPageModel;
