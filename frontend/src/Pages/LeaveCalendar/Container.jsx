import React from "react";

const Container = ({ children }) => {
  return (
    <div
      style={{ height: "100%", width: "100%", overflow: "auto", }}
      className=" d-flex flex-column justify-content-top  py-4 bg-white px-5"

    >
      {children}
    </div>
  );
};

export default Container;
