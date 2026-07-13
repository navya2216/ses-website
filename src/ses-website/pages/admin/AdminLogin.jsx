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
  const [otp, setOtp] = useState("");

  const [showOTP, setShowOTP] = useState(false);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const sendOTP = async () => {
    if (!email.trim()) {
      setError("Please enter Admin Email.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(`${API}/api/admin/send-otp`, {
        email,
      });

      if (res.data.success) {
        setShowOTP(true);
        setSuccess("OTP sent successfully.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim()) {
      setError("Please enter OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(`${API}/api/admin/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        localStorage.setItem("adminEmail", email);

        setSuccess("Login Successful.");

        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
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

        <p>Login using your registered Admin Email.</p>

        {success && <div className="success-box">{success}</div>}

        {error && <div className="error-box">{error}</div>}

        <div className="form-group">
          <label>Email</label>

          <div className="input-box">
            <FaEnvelope />

            <input
              type="email"
              placeholder="Enter Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {!showOTP ? (
          <button className="login-btn" onClick={sendOTP} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
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

export default AdminLogin;
