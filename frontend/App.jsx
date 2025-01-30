import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Duties from "./pages/Duties";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";

import "./index.css";
import UserList from "./components/UserList.jsx";
import UserDuties from "./pages/DutiesUser";
import SpecificUser from "./components/SpecificUser.jsx";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/duties" element={<Duties/>} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/uduties" element={<UserDuties/>} />
          <Route path="/specific-user" element={<SpecificUser />} />
          
        </Routes>
      </Router>
  );
}

export default App;





