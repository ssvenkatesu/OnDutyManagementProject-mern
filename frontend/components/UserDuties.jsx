import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';

const getStatusClass = (status) => {
  const s = (status || 'pending').toLowerCase();
  if (s === 'approved') return 'status-approved';
  if (s === 'disapproved') return 'status-disapproved';
  return 'status-pending';
};

const UserDuties = () => {
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDuties = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');

        if (!userId || !token) {
          navigate('/login');
          return;
        }
        const response = await api.get(`/api/duties/${userId}`);
        setDuties(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Error fetching duties'));
      } finally {
        setLoading(false);
      }
    };

    fetchDuties();
  }, [navigate]);

  const handleDelete = async (dutyId) => {
    try {
      await api.delete(`/api/duties/${dutyId}`);
      setDuties(duties.filter((duty) => duty._id !== dutyId));
    } catch (err) {
      setError(getErrorMessage(err, 'Error deleting duty'));
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading your duties…</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <div className="panel">
      <h2>My Duty Requests</h2>

      {duties.length > 0 ? (
        <div className="duty-grid">
          {duties.map((duty) => (
            <article key={duty._id} className="duty-card">
              <div className="duty-card-header">
                <h3 className="duty-card-title">{duty.dutyTitle}</h3>
                <span className={`status-badge ${getStatusClass(duty.status)}`}>
                  {duty.status || 'pending'}
                </span>
              </div>
              <div className="duty-meta">
                <p><strong>Requested by:</strong> {duty.assignedTo?.username || 'N/A'}</p>
                <p><strong>Description:</strong> {duty.description}</p>
                <p><strong>Date:</strong> {new Date(duty.dateAssigned).toLocaleDateString()}</p>
              </div>
              <div className="duty-card-actions">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(duty._id)}
                >
                  Cancel Request
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No duty requests yet. Submit one using the form.</p>
        </div>
      )}
    </div>
  );
};

export default UserDuties;
