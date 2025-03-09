import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {currentUser?.username || "User"}!</p>
      <Link to={"/weekly"}>Weekly</Link>
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
}

export default Dashboard;
