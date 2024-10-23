import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const updateUserRole = (role) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  const updateAuthToken = (token) => {
    setToken(token);
    localStorage.setItem("token", `Bearer ${token}`);
  };

  const clearUserData = () => {
    setUserRole(null);
    setToken(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        userRole,
        updateUserRole,
        token,
        updateAuthToken,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
