import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("isAuthenticated")
  );


  useEffect(() => {

    setIsAuthenticated(!!localStorage.getItem("isAuthenticated"));
    
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
   
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
