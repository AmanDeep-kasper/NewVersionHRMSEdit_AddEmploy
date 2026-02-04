import React, { createContext, useContext, useState } from "react";

const ApiRefreshContext = createContext();

export const ApiRefreshProvider = ({ children }) => {
    const [refresh, setRefresh] = useState(false);

    return (
        <ApiRefreshContext.Provider value={{ refresh, setRefresh }}>
            {children}
        </ApiRefreshContext.Provider>
    );
};

export const useApiRefresh = () => useContext(ApiRefreshContext);
