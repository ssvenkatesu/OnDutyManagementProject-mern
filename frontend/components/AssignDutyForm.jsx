// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AssignDutyForm = () => {
//   const [user, setUser] = useState(null);
//   const [duty, setDuty] = useState({ dutyTitle: "", description: "", assignedTo: "" });
//   const [duties, setDuties] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch user and duties when the component mounts
//   useEffect(() => {
//     const fetchUserAndDuties = async () => {
//       const userId = localStorage.getItem("id"); // Get ID from localStorage
//       const token = localStorage.getItem("token");

//       if (!userId || !token) {
//         navigate("/login");
//         return;
//       }

//       try {
//         setLoading(true);
        
//         // Fetch user data
//         const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(userResponse.data); // Store the fetched user

//         // Fetch duties data
//         const dutiesResponse = await axios.get(`http://localhost:3000/api/duties/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setDuties(dutiesResponse.data); // Store fetched duties
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserAndDuties();
//   }, [navigate]);

//   const handleChange = (e) => {
//     setDuty({ ...duty, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post("http://localhost:3000/api/duties", duty, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setDuties((prevDuties) => [...prevDuties, response.data]); // Update duties dynamically
//       setDuty({ dutyTitle: "", description: "", assignedTo: "" }); // Reset form
//     } catch (err) {
//       setError("Error submitting the form. Please try again.");
//     }
//   };

//   const deleteDuty = async (dutyId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:3000/api/duties/${dutyId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setDuties((prevDuties) => prevDuties.filter((duty) => duty._id !== dutyId));
//     } catch (err) {
//       setError("Error deleting duty");
//     }
//   };

//   if (loading) return <p>Loading duties...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="assign-duty-form">
//       <h2>Request For OnDuty</h2>
//       {error && <p className="error-message">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="dutyTitle"
//           placeholder="Duty Title"
//           value={duty.dutyTitle}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Duty Description"
//           value={duty.description}
//           onChange={handleChange}
//           required
//         />
//         <select
//           name="assignedTo"
//           value={duty.assignedTo}
//           onChange={handleChange}
//           required
//         >
//           <option value="">Select User</option>
//           {user && (
//             <option key={user._id} value={user._id}>
//               {user.username}
//             </option>
//           )}
//         </select>

//         <button type="submit">Request</button>
//       </form>

      
//       <div>
//         {duties.length > 0 && (
//           <ul>
//             {duties.map((dutyItem) => (
//               <li key={dutyItem._id}>
//                 <p>{dutyItem.dutyTitle}</p>
//                 <button onClick={() => deleteDuty(dutyItem._id)}>Delete</button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssignDutyForm;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AssignDutyForm = () => {
  const [user, setUser] = useState(null);
  const [duty, setDuty] = useState({ dutyTitle: "", description: "", assignedTo: "" });
  const [duties, setDuties] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserAndDuties = async () => {
      const userId = localStorage.getItem("id"); 
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        
       
        const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data); 

        
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndDuties();
  }, [navigate]);

  const handleChange = (e) => {
    setDuty({ ...duty, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/api/duties", duty, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDuties((prevDuties) => [...prevDuties, response.data]); 
      setDuty({ dutyTitle: "", description: "", assignedTo: "" });
    } catch (err) {
      setError("Error submitting the form. Please try again.");
    }
  };

  const deleteDuty = async (dutyId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/duties/${dutyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDuties((prevDuties) => prevDuties.filter((duty) => duty._id !== dutyId));
    } catch (err) {
      setError("Error deleting duty");
    }
  };

  if (loading) return <p>Loading duties...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="assign-duty-form">
      <h2>Request For OnDuty</h2>
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
          {user && (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          )}
        </select>

        <button type="submit">Request</button>
        
      </form>

      
    </div>
  );
};

export default AssignDutyForm;
