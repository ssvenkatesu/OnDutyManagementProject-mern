import React, { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api';

const SpecificUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('id');
      if (!userId) {
        setError('No user ID found.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to fetch user data.'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return null;

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  if (!user) return null;

  const initial = (user.username || '?').charAt(0).toUpperCase();

  return (
    <div className="profile-card">
      <div className="profile-avatar">{initial}</div>
      <div className="profile-info">
        <strong>{user.username}</strong>
        <span>Team Member</span>
      </div>
    </div>
  );
};

export default SpecificUser;
