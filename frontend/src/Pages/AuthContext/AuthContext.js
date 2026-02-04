import { createContext, useEffect, useState } from "react";
import api from "../config/api"; // your axios instance

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setActiveUser(res.data.user);
    } catch (err) {
      setActiveUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
