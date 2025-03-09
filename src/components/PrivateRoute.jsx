// src/components/PrivateRoute.jsx
import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../layout/MainLayout";

function PrivateRoute({ children }) {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <MainLayout>{children}</MainLayout>;
}

export default PrivateRoute;
