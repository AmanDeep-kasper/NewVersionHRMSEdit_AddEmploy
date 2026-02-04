import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import api from "../config/api";

export const AuthContext = React.createContext();

const AuthContextProvider = (props) => {
  const [activeUser, setActiveUser] = useState({});

  const [config, setConfig] = useState({
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${Cookies.get("authToken") || ""}`,
    },
  });

  useEffect(() => {
    const controlAuth = async () => {
      try {
        const { data } = await api.get("/auth/private", config);
        setActiveUser(data.user);
      } catch (error) {
        // Remove invalid token and reset user
        Cookies.remove("authToken");
        setActiveUser({});
      }
    };

    controlAuth();
  }, []); // ✅ runs once on mount

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, config, setConfig }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
