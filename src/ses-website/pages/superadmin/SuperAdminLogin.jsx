import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";

import "../../asset/css/superadmin-login.css";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4006`;

function SuperAdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const sendOTP = async () => {
    if (!email || !password) {
      setError("Please enter Email and Password.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await axios.post(`${API}/api/superadmin/send-otp`, {
        email,
        password,
      });
      if (res.data.success) {
        setShowOtp(true);

        setMessage("OTP sent successfully.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setError("Please enter OTP.");
      return;
    }

    try {
      setLoading(true);

      setError("");

      setMessage("");

      const res = await axios.post(`${API}/api/superadmin/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        localStorage.setItem("superAdminEmail", email.trim().toLowerCase());
        setMessage("Login Successful.");

        navigate("/superadmin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="superadmin-login-page">
      <div className="superadmin-card">
        <div className="login-icon">
          <FaUserShield />
        </div>

        <h2>Super Admin Login</h2>

        <p>Login using your registered Email and Password.</p>
        {message && <div className="success-msg">{message}</div>}

        {error && <div className="error-msg">{error}</div>}

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
                  value={otp}
                  maxLength={6}
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

export default SuperAdminLogin;
