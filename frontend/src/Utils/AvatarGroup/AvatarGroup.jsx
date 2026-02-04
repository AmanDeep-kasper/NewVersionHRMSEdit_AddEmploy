import React, { useState } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const AvatarGroup = ({ images }) => {
  const maxVisibleAvatars = 4;
  const overlapPercentage = 96.5;
  const { darkMode } = useTheme();
  const [showAll, setShowAll] = useState(false);
  const visibleAvatars = showAll ? images : images.slice(0, maxVisibleAvatars);

  return (
    <div
      className="avatar-group my-0 w-100"
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      {visibleAvatars.map((src, index) => (
        <img
          key={index}
          className="avatar"
          src={src}
          style={{
            height: "1.8rem",
            width: "1.8rem",
            borderRadius: "50%",
          }}
          alt={`Avatar ${index + 1}`}
        />
      ))}
      {images.length > maxVisibleAvatars && (
        <div
          className="more-avatars  px-3 py-1"
          style={{
            width: "fit-content",
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            cursor: "pointer",
          }}
        >
          {showAll ? "View Less" : `+${images.length - maxVisibleAvatars} More`}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
