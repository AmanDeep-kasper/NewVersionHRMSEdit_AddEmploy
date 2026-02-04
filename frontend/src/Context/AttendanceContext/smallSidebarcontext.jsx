import React, { createContext, useContext, useState } from "react";

// Create the context
const SidebarContext = createContext();

// Create the provider component
export const SidebarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};


export const useSidebar = () => useContext(SidebarContext);
