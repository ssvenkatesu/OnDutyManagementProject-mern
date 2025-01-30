
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(JSON.parse(atob(token.split(".")[1]))); // Decode JWT payload
    }
  }, []);

  const goToDashboard = () => {
    if (user) {
      navigate(user.role === "in-charge" ? "/admin-dashboard" : "/user-dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="landing-page">
      <Navbar user={user} setUser={setUser} />
      <div className="intro-section">
        <h1>Welcome to On Duty Management System</h1>
        <p>Your solution for managing duties efficiently.</p>
        <button onClick={goToDashboard} className="homepage-button">
          {user ? (user.role === "in-charge" ? "Go to Incharge Dashboard" : "Go to User Dashboard") : "Login to Start"}
          
        </button>
      </div>
    </div>
  );
};

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          On Duty Management System
          <br/>
        </Link>
        <div className="navbar-links">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingPage;

