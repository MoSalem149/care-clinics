import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUserRole = (role) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  const updateAuthToken = (token) => {
    setToken(token);
    localStorage.setItem("token", token); // Store token without Bearer prefix
  };

  const clearUserData = () => {
    setUserRole(null);
    setToken(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const GetUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/Admin/GetAllUsers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const UserData = await res.json();
        if (UserData.status === "success") {
          setUsers(UserData.data.users);
        } else {
          console.error("Error fetching users:", UserData.message);
          setError(UserData.message); // Capture error message
        }
      } catch (error) {
        console.error("Error Fetching Users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && userRole === "admin") {
      GetUsers();
    }
  }, [token, userRole]);

  return (
    <UserContext.Provider
      value={{
        userRole,
        updateUserRole,
        token,
        updateAuthToken,
        clearUserData,
        users,
        setUsers,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
