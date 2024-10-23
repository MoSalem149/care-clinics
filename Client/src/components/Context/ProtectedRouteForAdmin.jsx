// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./userContext";

const ProtectedRouteForAdmin = ({ children }) => {
  const { userRole } = useUser();

  if (userRole !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRouteForAdmin;
