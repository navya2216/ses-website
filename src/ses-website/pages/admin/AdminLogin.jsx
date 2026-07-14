import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserTie } from "react-icons/fa";

import "../../asset/css/admin-login.css";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4006`;

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and Password are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(`${API}/api/admin/login`, {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("adminEmail", res.data.admin.email);
        localStorage.setItem("adminName", res.data.admin.name);

        setSuccess("Login Successful.");

        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="login-icon">
          <FaUserTie />
        </div>

        <h2>Admin Login</h2>

        <p>Login using your registered Email and Password.</p>

        {success && <div className="success-box">{success}</div>}
        {error && <div className="error-box">{error}</div>}

        <div className="form-group">
          <label>Email</label>

          <div className="input-box">
            <FaEnvelope />

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="input-box">
            <FaLock />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button className="login-btn" onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
