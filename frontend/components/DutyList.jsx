import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Link} from 'react-router-dom';

const DutyList = () => {
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch duties on component mount
  useEffect(() => {
    const fetchDuties = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');

        if (!userId || !token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/duties`, {
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

  const handleReload = () => {
    window.location.reload();
  };

  const NavigatetoUpdateUser = (dutyId) => {
    localStorage.setItem('dutyId', dutyId);

    // Open the popup modal
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = '#fff';
    popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.padding = '20px';
    popup.style.borderRadius = '8px';
    popup.style.textAlign = 'center';

    // Add content to the popup
    popup.innerHTML = `
      <h3>Update Duty Status</h3>
      <p>Select an option to update the duty status:</p>
      <button id="approveButton" style="margin-right: 10px; padding: 10px 15px; background-color: green; color: white; border: none; border-radius: 4px; cursor: pointer;">Approve</button>
      <button id="disapproveButton" style="padding: 10px 15px; background-color: red; color: white; border: none; border-radius: 4px; cursor: pointer;">Disapprove</button>
      <br/><br/>
      <button id="cancelButton" style="padding: 8px 12px; background-color: gray; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
    `;

    document.body.appendChild(popup);

    // Handle button clicks
    document.getElementById('approveButton').addEventListener('click', () => {
      updateDutyStatus('Approved', dutyId);
      document.body.removeChild(popup);
    });

    document.getElementById('disapproveButton').addEventListener('click', () => {
      updateDutyStatus('Disapproved', dutyId);
      document.body.removeChild(popup);
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
      document.body.removeChild(popup);
    });
  };

  // Function to Update Duty Status via API
  const updateDutyStatus = async (status, dutyId) => {
    const token = localStorage.getItem('token');
    const inChargeId = localStorage.getItem('id');

    if (!token || !inChargeId) {
      alert('Unauthorized: Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/duties/${dutyId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, inChargeId }),
      });

      if (response.ok) {
        const updatedDuty = await response.json();
        // alert(`Duty status updated to: ${updatedDuty.status}`);
        setDuties((prevDuties) =>
          prevDuties.map((duty) =>
            duty._id === dutyId ? { ...duty, status: updatedDuty.status } : duty
          )
        );
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      alert('An error occurred while updating the duty status.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading duties...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>

      <h2>Duty List</h2>
      
      {duties.length > 0 ? (
        <ul>
          {duties.map((duty) => (
            <li key={duty._id} type="1">
              <strong>Duty Name :</strong> {duty.dutyTitle} <br />
              <strong>Requested By:</strong> {duty.assignedTo ? duty.assignedTo.username : 'N/A'} <br />
              <strong>Duty Description :</strong> {duty.description} <br />
              <strong>Duty Approval Status :</strong> {duty.status} <br />
              <strong>Date :</strong> {duty.dateAssigned} <br />
              <br />
              <button onClick={() => NavigatetoUpdateUser(duty._id)}>
                Update the Status of the Duty
              </button>
              <br />
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No duties assigned.</p>
      )}
      <br />
      <nav>
              <ul>
                
                <li>
                  <Link to="/">Back to Home</Link>
                </li>
              </ul>
            </nav>
      
    </div>
  );
};

export default DutyList;
