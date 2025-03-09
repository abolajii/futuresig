import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup axios interceptor for token handling
  useEffect(() => {
    // In the checkUser function in AuthContext.jsx
    const checkUser = async () => {
      console.log("Checking if user is logged in...");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      console.log("Access token exists:", !!accessToken);
      console.log("Refresh token exists:", !!refreshToken);

      if (accessToken) {
        try {
          console.log("Sending request to /api/v1/auth/verify endpoint");
          const response = await axios.post(
            "http://localhost:4300/api/v1/auth/verify",
            {
              accessToken,
              refreshToken,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log("User data received:", response.data);
          setCurrentUser(response.data.user);
        } catch (error) {
          console.error("Error checking user status", error);
          console.log(
            "Error details:",
            error.response?.data || "No response data"
          );
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      console.log("Setting loading to false");
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:4300/api/v1/login", {
        email: username,
        password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setCurrentUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
    return new Promise((resolve) => setTimeout(resolve, 50)); // Small delay to ensure state update
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
