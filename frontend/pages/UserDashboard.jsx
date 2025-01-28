import React from "react";
import DutyList from "../components/DutyList";
import AssignDutyForm from "../components/AssignDutyForm";
import Duties from "../pages/Duties";
import DutiesUser from "../pages/DutiesUser";
import UserProfile from "../components/SpecificUser";


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
