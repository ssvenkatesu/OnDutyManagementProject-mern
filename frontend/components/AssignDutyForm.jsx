
import React, { useState, useEffect } from "react";
import axios from "axios"; 
const AssignDutyForm = () => {
  const [users, setUsers] = useState([]);
  const [duty, setDuty] = useState({ dutyTitle: "", description: "", assignedTo: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON.");
        }

        const data = await response.json();
        setUsers(data.filter((user) => user.role === "user"));
      } catch (err) {
        console.error("Error during fetchUsers:", err.message);
        setError("Failed to fetch users. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setDuty({ ...duty, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous error
    try {
      const response = await fetch("http://localhost:3000/api/duties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(duty),
      });
  
      // Check if response is in JSON format
      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response but got something else.");
      }
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
  
      alert("Duty assigned successfully!");
    } catch (err) {
      console.error("Error during handleSubmit:", err.message);
      setError("Error submitting the form. Please try again.");
    }
  };
  

  return (

    
    <div className="assign-duty-form">
      <h2>Assign Duty</h2>
      {loading && <p>Loading users...</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="dutyTitle"
          placeholder="Duty Title"
          value={duty.dutyTitle}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Duty Description"
          value={duty.description}
          onChange={handleChange}
          required
        />
        <select
          name="assignedTo"
          value={duty.assignedTo}
          onChange={handleChange}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
        <button type="submit">Assign</button>
      </form>
    </div>
  );
};

export default AssignDutyForm;
