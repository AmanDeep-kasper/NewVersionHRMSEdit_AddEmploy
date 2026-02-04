import React from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const ProfileAvatar = ({
  imageURL,
  firstName = "", // Default to empty string
  lastName = "", // Default to empty string
  additional,
  splitRow = 1,
}) => {
  const { darkMode } = useTheme();

  return (
    <div className="d-flex align-items-center gap-3 mx-2">
      <div
        style={{
          height: "30px",
          width: "30px",
          backgroundColor: "#ccc",
          borderRadius: "50%",
          fontSize: "1rem",
          fontWeight: "bold",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageURL ? (
          <img
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src={imageURL}
            alt={`${firstName} ${lastName}`}
          />
        ) : (
          `${firstName?.[0]?.toUpperCase() || ""}${
            lastName?.[0]?.toUpperCase() || ""
          }`
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: splitRow === 1 ? "column" : "column-reverse",
        }}
      >
        {additional && (
          <span
            className={darkMode ? "badge-primary" : "badge-primary-dark"}
            style={{
              margin: 0,
              width: "fit-content",
              marginLeft: "-.2rem",
              padding: "1px",
            }}
          >
            {additional}
          </span>
        )}
        {firstName && (
          <span
            className="text-capitalize"
            style={{
              fontSize: "1rem",
              margin: 0,
              color: darkMode ? "black" : "white",
            }}
          >
            {firstName} {lastName}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
