import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const DashboardProtectedRoute = ({ children }) => {
  const { getCurrentUser } = useAuth();

  const { role } = getCurrentUser();

  console.log(role);

  return role == "admin" ? children : <Navigate to="/signin" replace />;
};

export default DashboardProtectedRoute;
