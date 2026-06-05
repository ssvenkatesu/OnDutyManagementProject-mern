import React, { useState, useEffect } from "react";
import api, { getErrorMessage } from "../services/api";

const ADMIN_ROLES = ["in-charge", "admin"];

const getStatusClass = (status) => {
  const s = (status || "pending").toLowerCase();
  if (s === "approved") return "status-approved";
  if (s === "disapproved") return "status-disapproved";
  return "status-pending";
};

const UserList = ({ excludeAdmins = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [duties, setDuties] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [modalDutyId, setModalDutyId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users");
        const allUsers = response.data;
        const filtered = excludeAdmins
          ? allUsers.filter((u) => !ADMIN_ROLES.includes(u.role))
          : allUsers;
        setUsers(filtered);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load users"));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [excludeAdmins]);

  const handleUserClick = async (user) => {
    if (!excludeAdmins) return;

    if (selectedUser?._id === user._id) {
      setSelectedUser(null);
      setUserDetails(null);
      setDuties([]);
      setDetailError("");
      return;
    }

    setSelectedUser(user);
    setUserDetails(null);
    setDuties([]);
    setDetailError("");
    setDetailLoading(true);

    try {
      const [userRes, dutiesRes] = await Promise.all([
        api.get(`/api/users/${user._id}`),
        api.get(`/api/duties/${user._id}`),
      ]);
      setUserDetails(userRes.data);
      setDuties(dutiesRes.data);
    } catch (err) {
      setDetailError(getErrorMessage(err, "Failed to load user details"));
    } finally {
      setDetailLoading(false);
    }
  };

  const updateDutyStatus = async (status, dutyId) => {
    const inChargeId = localStorage.getItem("id");

    if (!inChargeId) {
      setDetailError("Unauthorized: Please log in again.");
      return;
    }

    try {
      const response = await api.put(`/api/duties/${dutyId}/status`, {
        status,
        inChargeId,
      });

      setDuties((prev) =>
        prev.map((duty) =>
          duty._id === dutyId ? { ...duty, status: response.data.status } : duty
        )
      );
      setModalDutyId(null);
      setDetailError("");
    } catch (err) {
      setDetailError(getErrorMessage(err, "Failed to update duty status"));
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading users…</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  const displayUser = userDetails || selectedUser;

  return (
    <div className="user-list">
      {excludeAdmins && users.length > 0 && (
        <p className="user-list-hint">Click a user to view their details and duty requests</p>
      )}

      {users.length > 0 ? (
        <ul className="user-grid">
          {users.map((user) => {
            const cardContent = (
              <>
                <p className="user-card-name">{user.username}</p>
                <span className={`role-badge ${user.role === "in-charge" ? "in-charge" : ""}`}>
                  {user.role}
                </span>
              </>
            );

            return (
              <li key={user._id}>
                {excludeAdmins ? (
                  <button
                    type="button"
                    className={`user-card user-card--clickable ${
                      selectedUser?._id === user._id ? "user-card--active" : ""
                    }`}
                    onClick={() => handleUserClick(user)}
                  >
                    {cardContent}
                  </button>
                ) : (
                  <div className="user-card">{cardContent}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No users found.</p>
        </div>
      )}

      {excludeAdmins && selectedUser && (
        <div className="user-detail-panel">
          <div className="user-detail-panel-header">
            <h3>User Details</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleUserClick(selectedUser)}
            >
              Close
            </button>
          </div>

          {detailLoading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading details…</p>
            </div>
          ) : detailError ? (
            <div className="alert-error">{detailError}</div>
          ) : (
            <>
              {displayUser && (
                <div className="profile-card user-detail-profile">
                  <div className="profile-avatar">
                    {(displayUser.username || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <strong>{displayUser.username}</strong>
                    <span>Role: {displayUser.role || "user"}</span>
                    <span className="user-detail-id">ID: {selectedUser._id}</span>
                  </div>
                </div>
              )}

              <h4 className="user-duties-heading">Duty Requests ({duties.length})</h4>

              {duties.length > 0 ? (
                <div className="duty-grid">
                  {duties.map((duty) => (
                    <article key={duty._id} className="duty-card">
                      <div className="duty-card-header">
                        <h3 className="duty-card-title">{duty.dutyTitle}</h3>
                        <span className={`status-badge ${getStatusClass(duty.status)}`}>
                          {duty.status || "pending"}
                        </span>
                      </div>
                      <div className="duty-meta">
                        <p>
                          <strong>Description:</strong> {duty.description}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(duty.dateAssigned).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="duty-card-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setModalDutyId(duty._id)}
                        >
                          Update Status
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No duty requests from this user.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {excludeAdmins && modalDutyId && (
        <div className="modal-overlay" onClick={() => setModalDutyId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Update Duty Status</h3>
            <p>Select an option to update this duty request:</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-approve"
                onClick={() => updateDutyStatus("Approved", modalDutyId)}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn-disapprove"
                onClick={() => updateDutyStatus("Disapproved", modalDutyId)}
              >
                Disapprove
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setModalDutyId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
