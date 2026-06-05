import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AppNavbar from "./AppNavbar";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/api/users/login", credentials);

      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.user);
        const payload = JSON.parse(atob(response.data.token.split(".")[1]));
        setUser(payload);
        navigate("/");
      } else {
        setError(response.data.message || "Login failed.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Login failed. Please check your credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AppNavbar>
        <Link to="/register" className="nav-link">Register</Link>
      </AppNavbar>

      <div className="auth-wrapper">
        <div className="auth-card fade-in">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to manage your duty requests</p>

          {error && <div className="alert-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={credentials.username}
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
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
