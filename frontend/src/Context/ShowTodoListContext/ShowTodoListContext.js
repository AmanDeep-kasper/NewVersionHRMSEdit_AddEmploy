import React, { createContext, useState, useContext } from "react";

const ShowTodoListContext = createContext();

export const ShowTodoProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibilityTodo = () => {
    setIsVisible((prevState) => !prevState);
  };

  return (
    <ShowTodoListContext.Provider value={{ isVisible, toggleVisibilityTodo }}>
      {children}
    </ShowTodoListContext.Provider>
  );
};

export const useShowTodo = () => {
  return useContext(ShowTodoListContext);
};
