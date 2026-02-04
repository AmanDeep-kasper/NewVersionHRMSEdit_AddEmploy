import React from "react";

const DashContainer = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        minWidth: "100%",
        maxWidth: "100%",
        overflow: "hidden"
      }}
    >
      {children}
    </div>
  );
};

export default DashContainer;
