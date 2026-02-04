import React from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const TittleHeader = ({ title, message, numbers }) => {
  const { darkMode } = useTheme();
  return (
    <div className="my-auto mt-2">
      <div className="d-flex align-items-center gap-2">
        <h5
          style={{
            fontWeight: "500",
            color: darkMode ? "var(--PrimaryColorDark)" : "var(--PrimaryColor)",
          }}
          className="m-0 p-0 text-capitalize"
          Subtittles
        >
          {title}
        </h5>{" "}
        {numbers && (
          <p
            className="my-0  d-flex align-items-center justify-content-center bg-primary text-white rounded-5 px-2"
            style={{ fontWeight: "400" }}
          >
            {numbers}
          </p>
        )}
      </div>
      {message && (
        <p
          className="m-0"
          style={{
            color: darkMode ? "var(--Subtittles)" : "var(--SubtittlesDark)",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default TittleHeader;
