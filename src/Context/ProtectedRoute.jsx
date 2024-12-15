import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children, requiredRole, user }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
