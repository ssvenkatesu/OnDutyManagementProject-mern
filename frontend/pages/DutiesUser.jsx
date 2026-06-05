import React from "react";
import UserDuties from "../components/UserDuties";
import AssignDutyForm from "../components/AssignDutyForm";
import UserProfile from "../components/SpecificUser";

const DutiesUser = () => {
  return (
    <div className="duties-layout two-col">
      <div>
        <UserProfile />
        <AssignDutyForm />
      </div>
      <div>
        <UserDuties />
      </div>
    </div>
  );
};

export default DutiesUser;
