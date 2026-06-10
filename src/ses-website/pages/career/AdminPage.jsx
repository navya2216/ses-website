import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4005`;
function AdminPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [file, setFile] = useState(null);

  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/careers", { replace: true, state: { refresh: true } });
  };

  /* ================= FETCH ADMIN EMAIL ================= */

  useEffect(() => {
    axios
      .get(`${API}/api/admin-email`)
      .then((res) => {
        if (res.data.success) {
          setEmail(res.data.email);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  /* ================= SEND OTP ================= */

  const sendOtp = async () => {
    if (!email) {
      alert("Email not loaded yet");
      return;
    }

    try {
      await axios.post(`${API}/api/send-otp`, {
        email,
      });

      setStep(2);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  /* ================= VERIFY OTP ================= */

  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        setVerified(true);
        setOtp("");
        setStep(3);
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      console.log(err);
      alert("OTP verification failed");
    }
  };

  /* ================= FILE SELECT ================= */

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only Excel files (.xlsx or .xls) allowed");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  /* ================= FILE UPLOAD ================= */

  const uploadExcel = async () => {
    if (!file) {
      alert("Please select Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/upload-jobs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);

      if (res.data.success) {
        setFile(null);
        setStep(4);

        setTimeout(() => {
          navigate("/careers", { replace: true });
        }, 1200);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Upload failed");
    }
  };

  /* ================= BACKGROUND STYLE ================= */

  const backgroundStyle = {
    backgroundImage: "url('/admin-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "80px",
  };

  return (
    <div style={backgroundStyle}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              className="card shadow p-4"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(4px)",
                borderRadius: "12px",
              }}
            >
              {/* HEADER */}

              <div className="d-flex justify-content-between mb-3">
                <h4 className="fw-bold">Admin Panel</h4>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={goHome}
                >
                  Home
                </button>
              </div>

              {/* STEP 1 */}

              {step === 1 && (
                <>
                  <input
                    className="form-control mb-3"
                    value={email || "Loading admin email..."}
                    readOnly
                  />

                  <button
                    className="btn btn-primary w-100"
                    onClick={sendOtp}
                    disabled={!email}
                  >
                    Send OTP
                  </button>
                </>
              )}

              {/* STEP 2 */}

              {step === 2 && (
                <>
                  <input
                    className="form-control mb-3"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <button
                    className="btn btn-success w-100"
                    onClick={verifyOtp}
                    disabled={!otp}
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {/* STEP 3 */}

              {step === 3 && (
                <>
                  <input
                    type="file"
                    className="form-control mb-3"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />

                  <button
                    className="btn btn-dark w-100"
                    onClick={uploadExcel}
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Excel"}
                  </button>
                </>
              )}

              {/* STEP 4 */}

              {step === 4 && (
                <div className="text-center">
                  <div className="alert alert-success">Upload Completed 🚀</div>

                  <button className="btn btn-primary" onClick={goHome}>
                    Go to Career Page
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
