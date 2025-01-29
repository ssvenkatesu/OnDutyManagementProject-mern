import React from "react";
import DutyList from "../components/DutyList";
import UserDuties from "../components/UserDuties";
import AssignDutyForm from "../components/AssignDutyForm";
import UserProfile from "../components/SpecificUser";
import { Link } from "react-router-dom";

const DutiesUser = () => {
  return (
    <div className="duties-page">
      <div className="user-duties">
      <UserProfile/></div>
      <h1>My Duty Requests</h1>
      <div className="duties-container">
      <div className="assign-duty-section">
          <AssignDutyForm />
        </div>
        <div className="duty-list-section">
          < UserDuties />
        </div>
        <nav>
        <ul>
  
          <li>
            <Link to="/">Back to Home</Link>
          </li>
        </ul>
      </nav>
        
      </div>
    </div>
  );
};

export default DutiesUser;
