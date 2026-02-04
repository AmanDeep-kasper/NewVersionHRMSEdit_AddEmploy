import React, { createContext, useState, useContext } from "react";

const ShowHideContext = createContext();

export const ShowHideProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  return (
    <ShowHideContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </ShowHideContext.Provider>
  );
};

export const useShowHide = () => {
  return useContext(ShowHideContext);
};
