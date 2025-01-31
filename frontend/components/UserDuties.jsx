import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Link} from 'react-router-dom';

const handleReload = () => {
  window.location.reload();
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
        const response = await axios.get(`https://ondutymanagementproject-mern-2.onrender.com/api/duties/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDuties(response.data);
      } catch (err) {
        setError('Error fetching duties');
      } finally {
        setLoading(false);
      }
    };

    fetchDuties();
  }, [navigate]);

  const handleDelete = async (dutyId) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`https://ondutymanagementproject-mern-2.onrender.com/api/duties/${dutyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDuties(duties.filter((duty) => duty._id !== dutyId)); 
    } catch (err) {
      console.error('Error deleting duty:', err);
      setError('Error deleting duty');
    }
  };

  if (loading) return <p>Loading duties...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 align="center">List Of Duties</h2>
      <br />
      {duties.length > 0 ? (
        <ul>
          {duties.map((duty) => (
            <li key={duty._id}>
              <strong>Duty Name :</strong> {duty.dutyTitle} <br />
              <strong>Requested By:</strong> {duty.assignedTo.username}
              <br />
              <strong>Duty Description :</strong> {duty.description} <br />
              <strong>Duty Approval Status :</strong> {duty.status} <br />
              <strong>Date :</strong> {duty.dateAssigned} <br />
              <br />
              <button onClick={() => handleDelete(duty._id)}>Cancel Or Delete Request</button>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No duties assigned.</p>
      )}
      <br />
    
      
      </div>
    
  );
};

export default UserDuties;
