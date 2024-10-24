// ProtectedRoute.js
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUsers } from "./userContext";
import { Link } from "react-router-dom";
const ProtectedRouteForAdmin = ({ children }) => {
  const { userRole } = useUsers();
  if (userRole !== "admin") {
    return <Navigate to="/signup" />;
  }

  return children;
};

export default ProtectedRouteForAdmin;
