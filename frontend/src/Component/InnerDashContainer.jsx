import React from "react";

const InnerDashContainer = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100dvh",
        maxHeight: "100dvh",
        width: "100%",
        overflow: "auto",
      }}
      className="p-0"
    >
      {children}
    </div>
  );
};

export default InnerDashContainer;
