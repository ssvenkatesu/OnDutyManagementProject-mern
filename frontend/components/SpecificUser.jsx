import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SpecificUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('id'); 
      if (!userId) {
        setError('No user ID found in localStorage.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://ondutymanagementproject-mern-2.onrender.com/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        setUser(response.data); // Set user data
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-profile">
      
      {user ? (
        <div>
          
          <p className='user-name'><strong>Name:</strong> {user.username}</p>
          
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default SpecificUser;
