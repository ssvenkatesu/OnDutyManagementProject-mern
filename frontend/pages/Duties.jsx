import React from "react";
import DutyList from "../components/DutyList";
import AssignDutyForm from "../components/AssignDutyForm";

const Duties = () => {
  return (
    <div className="duties-page">
      <h1>Manage Duties</h1>
      <div className="duties-container">
        <div className="duty-list-section">
          <DutyList />
        </div>
        <div className="assign-duty-section">
          <AssignDutyForm />
        </div>
      </div>
    </div>
  );
};

export default Duties;
