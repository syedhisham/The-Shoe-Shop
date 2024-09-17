import React, { createContext, useState, useContext } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [lastPath, setLastPath] = useState("/");

  return (
    <NavigationContext.Provider value={{ lastPath, setLastPath }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
