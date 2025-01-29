import React from "react";
import { Link } from "react-router-dom";
import UserList from "../components/UserList";

const   AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/duties">Manage Duties</Link>
          </li>
          <li>
            <Link to="/">Back to Home</Link>
          </li>
        </ul>
      </nav>
      <div className="user-list-section user-duties">
        <h2>User List</h2>
        <UserList />
      </div>
    </div>
  );
};

export default AdminDashboard;
