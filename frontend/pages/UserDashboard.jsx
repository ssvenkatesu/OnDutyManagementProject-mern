import React from "react";
import { Link } from "react-router-dom";
import DutiesUser from "../pages/DutiesUser";

const UserDashboard = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>My Dashboard</h1>
        <p>Submit and track your on-duty requests</p>
      </header>

      <div className="page-content fade-in">
        <nav className="dashboard-nav">
          <Link to="/">Back to Home</Link>
        </nav>
        <DutiesUser />
      </div>
    </div>
  );
};

export default UserDashboard;
