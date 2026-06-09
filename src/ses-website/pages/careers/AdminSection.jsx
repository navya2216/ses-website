import React from "react";
import { FaEnvelope, FaShieldAlt, FaFileExcel } from "react-icons/fa";
import "../../asset/css/AdminSection.css";
function AdminSection({
  step,
  email,
  setEmail,
  otp,
  setOtp,
  setExcelFile,
  sendOtp,
  verifyOtp,
  uploadJobs,
}) {
  return (
    <section className="admin-section">
      <div className="admin-card">
        <div className="admin-header">
          <h2>Admin Job Upload Portal</h2>
          <p>
            Verify your email, authenticate with OTP, and upload job openings
            securely.
          </p>
        </div>

        {/* STEP 1 */}

        {step === "jobs" && (
          <div className="admin-step">
            <div className="icon-box">
              <FaEnvelope />
            </div>

            <h3>Email Verification</h3>

            <input
              type="email"
              placeholder="Enter Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="admin-btn" onClick={sendOtp}>
              Send OTP
            </button>
          </div>
        )}

        {/* STEP 2 */}

        {step === "otp" && (
          <div className="admin-step">
            <div className="icon-box">
              <FaShieldAlt />
            </div>

            <h3>OTP Verification</h3>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="admin-btn" onClick={verifyOtp}>
              Verify OTP
            </button>
          </div>
        )}

        {/* STEP 3 */}

        {step === "upload" && (
          <div className="admin-step">
            <div className="icon-box">
              <FaFileExcel />
            </div>

            <h3>Upload Excel Jobs</h3>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setExcelFile(e.target.files[0])}
            />

            <button className="admin-btn" onClick={uploadJobs}>
              Upload Excel
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminSection;
