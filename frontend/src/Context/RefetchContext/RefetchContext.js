import { createContext, useContext, useState } from "react";

const RefetchContext = createContext();

export const RefetchProvider = ({ children }) => {
    const [refetchTriggers, setRefetchTriggers] = useState({});

    // Function to trigger refetch for a specific key
    const triggerRefetch = (key) => {
        setRefetchTriggers((prev) => ({ ...prev, [key]: Date.now() }));
    };

    return (
        <RefetchContext.Provider value={{ refetchTriggers, triggerRefetch }}>
            {children}
        </RefetchContext.Provider>
    );
};

// Custom Hook to use the refetch context
export const useRefetch = () => useContext(RefetchContext);
