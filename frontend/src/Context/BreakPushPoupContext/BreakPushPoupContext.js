import React, { createContext, useState, useContext } from "react";

const BreakPushPoupContext = createContext();

export const ShowBreakPushPoupProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibilityBreakPushPoup = () => {
    setIsVisible((prevState) => !prevState);
  };

  return (
    <BreakPushPoupContext.Provider
      value={{ isVisible, toggleVisibilityBreakPushPoup }}
    >
      {children}
    </BreakPushPoupContext.Provider>
  );
};

export const useShowBreakPushPoup = () => {
  return useContext(BreakPushPoupContext);
};
