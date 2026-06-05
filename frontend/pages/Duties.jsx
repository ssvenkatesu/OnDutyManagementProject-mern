import React from "react";
import { Link } from "react-router-dom";
import DutyList from "../components/DutyList";

const Duties = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Manage Duties</h1>
        <p>Review and update status of all duty requests</p>
      </header>

      <div className="page-content fade-in">
        <nav className="dashboard-nav">
          <Link to="/admin-dashboard">Admin Dashboard</Link>
          <Link to="/">Back to Home</Link>
        </nav>

        <div className="panel">
          <DutyList />
        </div>
      </div>
    </div>
  );
};

export default Duties;
