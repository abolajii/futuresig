// App.js
import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Login from "./pages/Login";
import Weekly from "./pages/weekly";
import Deposit from "./pages/deposit";
import Monthly from "./pages/monthly";
import Profile from "./pages/profile";
import Trade from "./pages/trade";
import Dashboard from "./pages/dashboard";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/weekly"
        element={
          <PrivateRoute>
            <Weekly />
          </PrivateRoute>
        }
      />

      <Route
        path="/deposit"
        element={
          <PrivateRoute>
            <Deposit />
          </PrivateRoute>
        }
      />

      <Route
        path="/withdraw"
        element={
          <PrivateRoute>
            <Monthly />
          </PrivateRoute>
        }
      />

      <Route
        path="/trade"
        element={
          <PrivateRoute>
            <Trade />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={
          currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
};

export default App;
