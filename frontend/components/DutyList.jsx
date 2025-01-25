import React, { useState, useEffect } from "react";


const handleReload = () => {
  window.location.reload(); 
};


const DutyList = () => {
  const [duties, setDuties] = useState([]);

  useEffect(() => {
    const fetchDuties = async () => {
      const response = await fetch("http://localhost:3000/api/duties", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setDuties(data);
    };

    fetchDuties();
  }, []);

  return (
    <div className="duty-list">
      <h2>Duties</h2>
      <div className="duty-card">
      {duties.length > 0 ? (
        <ul>
          {duties.map((duty) => (
            <li key={duty._id}>
              <strong>{duty.dutyTitle}</strong>: {duty.description} -{" "}
              <em>Status: {duty.status}</em>
            </li>
          ))}
        </ul>
      ) : (
        <p>No duties found.</p>
      )}

    <div>
      <button onClick={handleReload}>Refresh the duties </button>
    </div>
    </div>
    </div>
  );
};

export default DutyList;
