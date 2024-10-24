import React, { createContext, useState, useEffect, useContext } from "react";

const GetUsersContext = createContext();

export const useUserContext = () => {
  return useContext(GetUsersContext);
};

export const GetUsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const fetchUsers = async () => {
      if (!token || userRole !== "admin") {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:5000/Admin/GetAllUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        if (data.status === "success") {
          setUsers(data.data.users);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Could not load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <GetUsersContext.Provider value={{ users, loading, error }}>
      {children}
    </GetUsersContext.Provider>
  );
};

export default GetUsersContext;
