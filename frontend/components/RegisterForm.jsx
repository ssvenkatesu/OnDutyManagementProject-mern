import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import AppNavbar from "./AppNavbar";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await api.post("/api/users/register", {
        username: formData.username,
        password: formData.password,
        role: "user",
      });

      if (response.data.success) {
        setSuccess("Account created! Redirecting to login…");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response.data.message || "Registration failed.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AppNavbar>
        <Link to="/login" className="nav-link">Login</Link>
      </AppNavbar>

      <div className="auth-wrapper">
        <div className="auth-card fade-in">
          <h2>Create account</h2>
          <p className="auth-subtitle">Join the on-duty management system</p>

          {error && <div className="alert-error">{error}</div>}
          {success && (
            <div className="alert-success" role="status">
              {success}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Choose a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
