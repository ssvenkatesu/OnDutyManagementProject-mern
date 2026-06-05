import React, { useState, useEffect } from "react";
import api, { getErrorMessage } from "../services/api";
import { useNavigate } from "react-router-dom";

const AssignDutyForm = () => {
  const [user, setUser] = useState(null);
  const [duty, setDuty] = useState({ dutyTitle: "", description: "", assignedTo: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const userResponse = await api.get(`/api/users/${userId}`);
        setUser(userResponse.data);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to fetch user data."));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setDuty({ ...duty, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/api/duties", duty);
      setDuty({ dutyTitle: "", description: "", assignedTo: "" });
      window.location.reload();
    } catch (err) {
      setError(getErrorMessage(err, "Error submitting the form. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  if (error && !user) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <div className="assign-duty-form">
      <h2>Request On-Duty</h2>
      {error && <div className="alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dutyTitle">Duty Title</label>
          <input
            id="dutyTitle"
            type="text"
            name="dutyTitle"
            placeholder="e.g. Weekend shift coverage"
            value={duty.dutyTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the duty request…"
            value={duty.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="assignedTo">Assign To</label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={duty.assignedTo}
            onChange={handleChange}
            required
          >
            <option value="">Select user</option>
            {user && (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            )}
          </select>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default AssignDutyForm;
