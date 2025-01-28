import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Assuming AuthContext is used to manage user state


const LandingPage = () => {
  const { user } = useContext(AuthContext); // Get the user object from context
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (user) {
      if (user.role === "in-charge") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="landing-page">
      <Navbar />
      <div className="intro-section">
        <h1>Welcome to Duty Manager</h1>
        <p>Your solution for managing duties efficiently.</p>
        <button onClick={goToDashboard}>
          {user ? "Go to Dashboard" : "Login to Start"}
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("logout")
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Online Duty Management System
        </Link>
        <div className="navbar-links">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingPage;

