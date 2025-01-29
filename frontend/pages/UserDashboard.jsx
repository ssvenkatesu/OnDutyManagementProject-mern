import React from "react";


import DutiesUser from "../pages/DutiesUser";

import { Link } from "react-router-dom";


const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      
      
      
      <div className="user-duties">
    
        <DutiesUser />
      </div>
      
    </div>
  );
};

export default UserDashboard;
