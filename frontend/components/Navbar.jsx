import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
          On Duty Management System
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
              

              
              {user.role === "user" && (
                <Link to="/user-dashboard" className="nav-link">
                  My Dashboard
                </Link>
              )}
              <div className="nav-link">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button></div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


