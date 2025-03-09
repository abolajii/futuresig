// src/components/PublicRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentUser) {
    // If user is already logged in, redirect to dashboard
    return <Navigate to="/dashboard" />;
  }

  // If no user is logged in, render the public route (login page)
  return children;
}

export default PublicRoute;
