import React, { createContext, useState } from "react";

const ProfileImageContext = createContext(null);

const ProfileImageProvider = ({ children }) => {
  const [theProfileImage, setTheProfileImage] = useState(""); // Initial state

  const clearProfileImage = () => setTheProfileImage(null);
  const value = { theProfileImage, setTheProfileImage, clearProfileImage };

  return (
    <ProfileImageContext.Provider value={value}>
      {children}
    </ProfileImageContext.Provider>
  );
};

export { ProfileImageContext, ProfileImageProvider };
