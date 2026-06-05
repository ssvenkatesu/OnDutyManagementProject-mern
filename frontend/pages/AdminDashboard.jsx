import React from "react";
import { Link } from "react-router-dom";
import UserList from "../components/UserList";

const AdminDashboard = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Click a user to view their profile and duty requests</p>
      </header>

      <div className="page-content fade-in">
        <nav className="dashboard-nav">
          <Link to="/">Back to Home</Link>
        </nav>

        <div className="panel">
          <h2>Registered Users</h2>
          <UserList excludeAdmins />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
