import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';

const getStatusClass = (status) => {
  const s = (status || 'pending').toLowerCase();
  if (s === 'approved') return 'status-approved';
  if (s === 'disapproved') return 'status-disapproved';
  return 'status-pending';
};

const DutyList = () => {
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDutyId, setModalDutyId] = useState(null);
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

        const response = await api.get('/api/duties');
        setDuties(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Error fetching duties'));
      } finally {
        setLoading(false);
      }
    };

    fetchDuties();
  }, [navigate]);

  const updateDutyStatus = async (status, dutyId) => {
    const inChargeId = localStorage.getItem('id');

    if (!inChargeId) {
      setError('Unauthorized: Please log in again.');
      return;
    }

    try {
      const response = await api.put(`/api/duties/${dutyId}/status`, {
        status,
        inChargeId,
      });

      setDuties((prevDuties) =>
        prevDuties.map((duty) =>
          duty._id === dutyId ? { ...duty, status: response.data.status } : duty
        )
      );
      setModalDutyId(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update duty status'));
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading duties…</p>
      </div>
    );
  }

  if (error && duties.length === 0) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <>
      <h2>All Duty Requests</h2>
      {error && <div className="alert-error">{error}</div>}

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
          <div className="empty-state-icon">📋</div>
          <p>No duty requests found.</p>
        </div>
      )}

      {modalDutyId && (
        <div className="modal-overlay" onClick={() => setModalDutyId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Update Duty Status</h3>
            <p>Select an option to update this duty request:</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-approve"
                onClick={() => updateDutyStatus('Approved', modalDutyId)}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn-disapprove"
                onClick={() => updateDutyStatus('Disapproved', modalDutyId)}
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
    </>
  );
};

export default DutyList;
