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
  loading, // ✅ FIXED
}) {
  return (
    <section className="admin-section">
      <div className="admin-card">
        <div className="admin-header">
          <h2>Admin Job Upload Portal</h2>
          <p>Verify email → OTP → Upload Jobs Excel securely</p>
        </div>

        {/* STEP 1 */}
        {step === "jobs" && (
          <div className="admin-step">
            <FaEnvelope className="icon-box" />

            <h3>Email Verification</h3>

            {/* <input
              type="email"
              placeholder="Enter Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> */}

            <input
              type="email"
              value={email || "Loading admin email..."}
              readOnly
            />

            <button onClick={sendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === "otp" && (
          <div className="admin-step">
            <FaShieldAlt className="icon-box" />

            <h3>OTP Verification</h3>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === "upload" && (
          <div className="admin-step">
            <FaFileExcel className="icon-box" />

            <h3>Upload Excel Jobs</h3>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                const selectedFile = e.target.files[0];

                if (!selectedFile) return;

                const allowedTypes = [
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "application/vnd.ms-excel",
                ];

                if (!allowedTypes.includes(selectedFile.type)) {
                  alert("Only Excel files (.xlsx or .xls) allowed");
                  e.target.value = "";
                  return;
                }

                console.log("SELECTED FILE:", selectedFile);

                setExcelFile(selectedFile);
              }}
            />

            <button onClick={uploadJobs} disabled={loading}>
              {loading ? "Uploading..." : "Upload Excel"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminSection;
