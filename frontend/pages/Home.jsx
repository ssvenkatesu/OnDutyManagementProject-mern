import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
  
    <div className="home-page">
      <h1>Online Duty Management System</h1>
      
      <div className="home-actions">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
