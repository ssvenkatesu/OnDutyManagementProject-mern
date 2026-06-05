import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(JSON.parse(atob(token.split(".")[1])));
    }
  }, []);

  const goToDashboard = () => {
    if (user) {
      navigate(user.role === "in-charge" ? "/admin-dashboard" : "/user-dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="landing-page">
      <AppNavbar>
        {!user ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            <Link to="/" className="nav-link">Home</Link>
            <button type="button" className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </AppNavbar>

      <section className="intro-section fade-in">
        <h1>Manage On-Duty Requests Effortlessly</h1>
        <p>
          A streamlined platform for teams to submit duty requests, track approvals,
          and keep everyone aligned — all in one place.
        </p>
        <button onClick={goToDashboard} className="btn btn-primary homepage-button">
          {user
            ? user.role === "in-charge"
              ? "Go to Admin Dashboard"
              : "Go to My Dashboard"
            : "Get Started — Login"}
        </button>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Submit Requests</h3>
            <p>Users can request on-duty assignments with title and description.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Approve & Track</h3>
            <p>In-charge staff review, approve, or disapprove each request.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Role-Based Access</h3>
            <p>Separate dashboards for users and administrators.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
