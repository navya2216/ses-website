import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../asset/css/login.css";
import sesLogo from "../asset/ses_logo.png";

const resetParams = new URLSearchParams(window.location.hash.slice(1));

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 12 || password.length > 128) {
      setError("Choose a password between 12 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/admin/reset-password", {
        email: resetParams.get("email"),
        token: resetParams.get("token"),
        newPassword: password,
      });
      setMessage(response.data.message);
      window.history.replaceState(null, "", window.location.pathname);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to reset the password. Request a new recovery link.",
      );
    } finally {
      setLoading(false);
    }
  };

  const hasResetToken =
    Boolean(resetParams.get("email")) && Boolean(resetParams.get("token"));

  return (
    <div className="admin-login-page">
      <section className="admin-login-card">
        <img
          className="admin-login-logo"
          src={sesLogo}
          alt="Soft Electronic Solutions"
        />
        <h2>Set a New Password</h2>
        {!hasResetToken ? (
          <>
            <p>This reset link is invalid or has expired.</p>
            <Link to="/admin/forgot-password">Request another reset link</Link>
          </>
        ) : (
          <>
            {message && <div className="success-box">{message}</div>}
            {error && <div className="error-box">{error}</div>}
            {!message && (
              <form onSubmit={submit}>
                <div className="form-group">
                  <label htmlFor="new-password">New password</label>
                  <div className="input-box">
                    <input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={12}
                      maxLength={128}
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm new password</label>
                  <div className="input-box">
                    <input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={12}
                      maxLength={128}
                      required
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                    />
                  </div>
                </div>
                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? "Updating…" : "Update Password"}
                </button>
              </form>
            )}
          </>
        )}
        {message && (
          <p className="login-secondary-link">
            <Link to="/admin/login">Continue to Admin Login</Link>
          </p>
        )}
      </section>
    </div>
  );
}

export default ResetPassword;
