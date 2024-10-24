import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null
  );
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUserRole = (role) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  const updateAuthToken = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const removeCookie = (cookieName) => {
    document.cookie = `${cookieName}=; Max-Age=-99999999; path=/;`;
    document.cookie = `${cookieName}=; Max-Age=-99999999; path=/api`;
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        clearUserData();
      } else {
        const errorData = await response.json();
        console.error("Logout error:", errorData.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const clearUserData = () => {
    setUserRole(null);
    setToken(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    removeCookie("connect.sid");
    removeCookie("token");
  };

  const contextValue = useMemo(
    () => ({
      users,
      loading,
      error,
      userRole,
      updateUserRole,
      token,
      updateAuthToken,
      clearUserData,
      logout,
    }),
    [users, loading, error, userRole, token]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUsers = () => {
  return useContext(UserContext);
};
