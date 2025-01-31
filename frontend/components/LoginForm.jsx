import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios'

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
const response=await axios.post("https://ondutymanagementproject-mern-2.onrender.com/api/users/login", credentials);

if(response.data.success){

  
  console.log(response.data.token)
      navigate("/");
    
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.user);
}
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
   <><div className="login-container">
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div></div></>
  );
};

export default LoginForm;

