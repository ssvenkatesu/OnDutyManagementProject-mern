import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom"; // Add this import
import Navbar from "../components/Navbar"; // Correct import path

const HomePage = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="home-page">
      <Navbar />
      <div className="home-content">
        <h1>Welcome to Online Duty Management</h1>
        {user ? (
          <div>
            <h2>Hello, {user.username}</h2>
            <p>Welcome back to your dashboard.</p>
            {user.role === "in-charge" && (
              <Link to="/admin-dashboard">
                <button>Go to Incharge Dashboard</button>
              </Link>
            )}
            {user.role === "user" && (
              <Link to="/user-dashboard">
                <button>Go to User Dashboard</button>
              </Link>
            )}
          </div>
        ) : (
          <div>
            <p>Please login to access your dashboard.</p>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
