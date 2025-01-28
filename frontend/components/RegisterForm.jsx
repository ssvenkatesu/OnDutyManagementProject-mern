// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     role: "user", // Default role
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response=await axios.post("http://localhost:3000/api/users/register", credentials););
//       if (response.data.success) {
//         alert("Registration successful!");
//         navigate("/login");
//       } else {
//         alert("Registration failed. Please try again.");
//       }
//     } catch (error) {
//       alert("Error during registration.");
//     }
//   };

//   return (
//     <div className="register-form">
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <select name="role" value={formData.role} onChange={handleChange}>
//           <option value="user">User</option>
//           <option value="in-charge">In-Charge</option>
//         </select>
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Ensure axios is imported

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user", // Default role
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use formData here instead of credentials
      const response = await axios.post("http://localhost:3000/api/users/register", formData);

      if (response.data.success) {
        navigate("/login"); // Navigate to login page after successful registration
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      alert("Error during registration.");
    }
  };

  return (
    <>
    <div className="login-container">

    <div className="login-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">user</option>
          <option value="in-charge">in-Charge</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div></div></>
  );
};

export default RegisterForm;
