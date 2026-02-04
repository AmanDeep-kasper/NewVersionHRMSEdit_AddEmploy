import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie"; // ✅ npm install js-cookie

// Create the context
const ThemeContext = createContext();

// Custom hook for easy access
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }) => {
  // ✅ Initialize darkMode from cookies
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = Cookies.get("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  // ✅ Toggle theme
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // ✅ Save to cookies when theme changes
  useEffect(() => {
    Cookies.set("darkMode", JSON.stringify(darkMode), {
      expires: 365, // valid for 1 year
      sameSite: "Strict",
      secure: true,
    });
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
