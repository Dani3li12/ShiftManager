import React, { createContext, useState } from 'react';

// Create a new context
const UserContext = createContext();

// Create a provider component for the context
const UserProvider = ({ children }) => {
    const [value, setValue] = useState({});

    // Custom setter function
    const setValueHandler = (newValue) => {
        setValue(newValue);
    };

    // Provide the context value and the setter function to the children components
    return (
        <UserContext.Provider value={{ value: value, setValue: setValueHandler }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };