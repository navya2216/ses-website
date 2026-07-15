import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";

import "../asset/css/login.css";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4006`;

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showOtp, setShowOtp] = useState(false);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* ================= LOGIN ================= */

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and Password are required.");
      return;
    }

    try {
      setLoading(true);

      setError("");
      setSuccess("");

      const res = await axios.post(`${API}/api/login`, {
        email,
        password,
      });

      // ================= SUPER ADMIN =================

      if (res.data.role === "SUPER_ADMIN") {
        setShowOtp(true);

        setSuccess("OTP sent to your registered email.");

        return;
      }

      // ================= ADMIN =================

      if (res.data.role === "ADMIN") {
        localStorage.setItem("adminEmail", res.data.admin.email);

        localStorage.setItem("adminName", res.data.admin.name);

        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */

  const verifyOTP = async () => {
    if (!otp.trim()) {
      setError("Please enter OTP.");

      return;
    }

    try {
      setLoading(true);

      setError("");
      setSuccess("");

      const res = await axios.post(`${API}/api/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        localStorage.setItem("superAdminEmail", res.data.superAdmin.email);

        localStorage.setItem("superAdminName", res.data.superAdmin.name);

        navigate("/superadmin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="login-icon">
          <FaUserShield />
        </div>

        <h2>Career Portal Login</h2>

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

        {!showOtp ? (
          <button className="login-btn" onClick={login} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        ) : (
          <>
            <div className="form-group">
              <label>OTP</label>

              <div className="input-box">
                <FaLock />

                <input
                  type="text"
                  placeholder="Enter OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>

            <button
              className="login-btn"
              onClick={verifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
