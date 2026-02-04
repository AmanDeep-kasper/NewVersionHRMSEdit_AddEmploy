import React from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { Link } from "react-router-dom";

const NotFound404 = () => {
  const { darkMode } = useTheme();
  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
        height: "92vh",
        width: "100%",
      }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <h2 style={{ fontSize: "3rem" }} className="fw-bolder">
        OOPS
      </h2>
      <h1 style={{ fontSize: "15rem" }} className="fw-bolder m-0 p-0">
        404
      </h1>
      <p>
        Page Not Found! , <Link to="/manager/dashboard">Click</Link> to ho to
        Home
      </p>
    </div>
  );
};

export default NotFound404;
