import React, { useState } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import profile from "../../img/profile.jpg"
const AvatarGroup = ({ images }) => {
console.log(images)
  const maxVisibleAvatars = 4;
  const overlapPercentage = 96.5;
  const { darkMode } = useTheme();
  const [showAll, setShowAll] = useState(false);

  // const handleToggleShowAll = () => {
  //   setShowAll(!showAll);
  // };

  const visibleAvatars = showAll ? images : images.slice(0, maxVisibleAvatars);

  return (
    <div
      className="avatar-group my-3 w-100"
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      {visibleAvatars.map((src, index) => (
        <img
          key={index}
          className="avatar"
          src={src.employee.profile?(src.employee.profile?.image_url ||src.employee.profile):profile}
          style={{
            height: "30px",
            width: "30px",
            borderRadius: "50%",
            position: "absolute",
            left: `${index * (100 - overlapPercentage)}%`,
            zIndex: maxVisibleAvatars - index,
          }}
          alt={`Avatar ${index + 1}`}
        />
      ))}
      {images.length > maxVisibleAvatars && (
        <div
          className="more-avatars px-3 py-1"
          style={{
            marginLeft: `${maxVisibleAvatars * (100 - overlapPercentage + 1)}%`,
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            // border: darkMode ? "1px solid var(--primaryDashColorDark)" : "1px solid var(--secondaryDashMenuColor)",
            cursor: "pointer",
          }}
          // onClick={handleToggleShowAll}
        >
          {showAll ? "View Less" : `+${images.length - maxVisibleAvatars} More`}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
