import React, { useState } from "react";

const Avatar = ({ employeeData, profile, userData }) => {
  const [imgError, setImgError] = useState(false);

  const imageUrl = employeeData?.profile?.image_url;
  const initials = `${userData?.FirstName?.[0] || ""}${userData?.LastName?.[0] || ""}`.toUpperCase();

  const styles = {
    wrapper: {
      height: "80px",
      width: "80px",
      borderRadius: "50%",
      overflow: "hidden",
      border: "2px solid #ddd",
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
      fontWeight: "600",
      color: "#555",
    },
    image: {
      height: "100%",
      width: "100%",
      objectFit: "cover",
    },
  };

  return (
    <div style={styles.wrapper}>
      {!imgError && imageUrl ? (
        <img
          src={imageUrl}
          alt={userData?.FirstName}
          style={styles.image}
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initials || "?"}</span>
      )}
    </div>
  );
};

export default Avatar;
