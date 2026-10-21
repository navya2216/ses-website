import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../asset/css/login.css";
import sesLogo from "../asset/ses_logo.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/admin/forgot-password", {
        email: email.trim(),
      });
      setMessage(response.data.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to start password recovery. Try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <section className="admin-login-card">
        <img
          className="admin-login-logo"
          src={sesLogo}
          alt="Soft Electronic Solutions"
        />
        <h2>Forgot Password</h2>
        <p>Enter the registered Careers admin email to request a reset link.</p>
        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="recovery-email">Admin email</label>
            <div className="input-box">
              <input
                id="recovery-email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send recovery instructions"}
          </button>
        </form>
        <p className="login-secondary-link">
          <Link to="/admin/login">Return to Admin Login</Link>
        </p>
      </section>
    </div>
  );
}

export default ForgotPassword;
