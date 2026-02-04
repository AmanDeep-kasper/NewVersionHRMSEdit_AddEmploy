import React, { createContext, useState, useContext } from "react";

const ShowStickeyContext = createContext();

export const ShowStickeyProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibilityStickey = () => {
    setIsVisible((prevState) => !prevState);
  };

  return (
    <ShowStickeyContext.Provider value={{ isVisible, toggleVisibilityStickey }}>
      {children}
    </ShowStickeyContext.Provider>
  );
};

export const useShowStickey = () => {
  return useContext(ShowStickeyContext);
};
