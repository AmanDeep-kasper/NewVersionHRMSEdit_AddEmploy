import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const DottedBadge = ({ status = "Active" }) => {
  const { darkMode } = useTheme();

  const [badgStatus] = useState(status);

  return (
    <div
      style={{
        display: "flex",
        padding: "4px 8px 4px 6px",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "1rem",
        height: "1.6rem",
        width: "fit-content",
        gap: "6px",
        background:
          badgStatus === "Active"
            ? darkMode
              ? "rgba(236, 253, 243, 1)"
              : "rgba(71,212,127,.2)"
            : badgStatus === "Inactive"
            ? darkMode
              ? "rgba(254, 243, 242, 1)"
              : "rgba(224, 59, 51, 0.2)"
            : badgStatus === "Warning"
            ? darkMode
              ? "rgba(255, 250, 235, 1)"
              : "rgba(156, 144, 61, 0.2)"
            : darkMode
            ? "rgba(226, 221, 221, 0.26)"
            : "rgba(82, 84, 83, 0.2)",
        overflow: "hidden",
      }}
    >
      <GoDotFill
        style={{
          color:
            badgStatus === "Active"
              ? darkMode
                ? "rgba(18, 183, 106, 1)"
                : "rgba(9, 248, 136, 0.82)"
              : badgStatus === "Inactive"
              ? darkMode
                ? "rgba(240, 68, 56, 1)"
                : "#E03B33"
              : badgStatus === "Warning"
              ? darkMode
                ? "rgba(247, 144, 9, 1)"
                : "#E0AC33"
              : darkMode
              ? "rgba(113, 118, 128, 1)"
              : "#525453",
          fontSize: "1rem",
        }}
      />
      <p
        style={{
          color:
            badgStatus === "Active"
              ? darkMode
                ? "rgba(2, 122, 72, 1)"
                : "rgba(71, 212, 127, 1)"
              : badgStatus === "Inactive"
              ? darkMode
                ? "rgba(180, 35, 24, 1)"
                : "rgba(255, 131, 125, 1)"
              : badgStatus === "Warning"
              ? darkMode
                ? "rgba(181, 71, 8, 1)"
                : "rgba(255, 215, 122, 1)"
              : darkMode
              ? "rgba(65, 70, 81, 1)"
              : "rgba(163, 163, 163, 1)",
          textAlign: "center",
          fontSize: ".85rem",
          fontWeight: "500",
        }}
        className="my-0"
      >
        {status}
      </p>
    </div>
  );
};

export default DottedBadge;
