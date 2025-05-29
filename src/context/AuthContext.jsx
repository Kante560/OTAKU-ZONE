
import React, { createContext, useState, useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [userId, setUserId] = useState(() => localStorage.getItem("user_id"));

  useEffect(() => {
    if (token && !userId) {
      fetch("/auth/user/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserId(data.id);
          localStorage.setItem("user_id", data.id);
        });
    }
  }, [token, userId]);

  const login = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem("auth_token", newToken);
    toast.success("You have been logged in successfully.");

    fetch("/auth/user/", {
      headers: {
        Authorization: `Token ${newToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.id);
        localStorage.setItem("user_id", data.id);
      });
  }; 

  const logout = () => {

    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
      toast.success("You have been logged out.");
  };

  return (<>
  
    <AuthContext.Provider value={{ token, isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
    </>
  );
};




// export const AuthProvider = ({ children }) => {
//   // Store token in memory (state)
//   const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("auth_token"));

//   useEffect(() => {
//     const storedToken = localStorage.getItem("auth_token");
//     setToken(storedToken);
//     setIsAuthenticated(!!storedToken);
//   }, []);

//   const login = (newToken) => {
//     setToken(newToken);
//     setIsAuthenticated(true);
//     localStorage.setItem("auth_token", newToken);
//   };

//   const logout = () => {
//     setToken(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("user_email");
//     localStorage.removeItem("signup_info");
//   };

//   return (
//     <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
