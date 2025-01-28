import React from "react";
import DutyList from "../components/DutyList";
import AssignDutyForm from "../components/AssignDutyForm";

const Duties = () => {
  return (
    <div className="duties-page">
      <h1 className="user-duties">Manage Duties</h1>
      <div className="duties-container">
        <div className="duty-list-section user-duties">
          <DutyList />
        </div>
      </div>
    </div>
  );
};

export default Duties;
