import React, { createContext, useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode"; // Corrected import

const GetUsersProfileContext = createContext();

export const useUsersProfileContext = () => useContext(GetUsersProfileContext);

const GetUsersProfileProvider = ({ children }) => {
  const [usersProfile, setUsersProfile] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState({
    profileImage: "",
  });
  const refreshProfile = (newProfileData) => {
    setCurrentUserProfile((prevProfile) => ({
      ...prevProfile,
      ...newProfileData,
    }));
  };
  const [currentUser, setCurrentUser] = useState(null); // Current user state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5000/users/get-all-users-profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      const usersData = Array.isArray(data) ? data : data?.data?.users;
      if (usersData) {
        setUsersProfile(usersData);
      } else {
        throw new Error(data.message || "Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Could not load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentUserProfile = () => {
    const token = localStorage.getItem("token");
    if (token && usersProfile.length > 0) {
      try {
        const { id: userId } = jwtDecode(token);
        const currentUser = usersProfile.find((user) => user.user === userId);
        setCurrentUserProfile(currentUser || null);
        setCurrentUser(currentUser || { id: userId }); // Expand as needed
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    updateCurrentUserProfile();
  }, [usersProfile]);

  return (
    <GetUsersProfileContext.Provider
      value={{
        usersProfile,
        currentUserProfile,
        refreshProfile,
        currentUser,
        loading,
        error,
        setCurrentUserProfile, // Expose the function to set current user profile
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </GetUsersProfileContext.Provider>
  );
};

export { GetUsersProfileProvider, GetUsersProfileContext };
