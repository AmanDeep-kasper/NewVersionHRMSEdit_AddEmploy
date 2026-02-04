import React from "react";

const AdminDashContainer = ({ children }) => {
  return (
    <div
      className="p-2"
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        width: "100%",
        overflow: "hidden"
      }}
    >
      {children}
    </div>
  );
};

export default AdminDashContainer;
