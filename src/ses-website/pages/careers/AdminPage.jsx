import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSection from "./AdminSection";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4006`;

function AdminPage({ onJobsUploaded }) {
  const [step, setStep] = useState("jobs");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ADMIN EMAIL ================= */

  useEffect(() => {
    const fetchAdminEmail = async () => {
      try {
        const res = await axios.get(`${API}/api/admin-email`);

        if (res.data.success) {
          setEmail(res.data.email);
        }
      } catch (err) {
        console.log("ADMIN EMAIL ERROR:", err);
      }
    };

    fetchAdminEmail();
  }, []);

  /* ================= SEND OTP ================= */

  const sendOtp = async () => {
    if (!email) {
      alert("Admin email not loaded");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/send-otp`, {
        email,
      });

      if (res.data.success) {
        alert("OTP sent successfully");
        setStep("otp");
      }
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "OTP send failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */

  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        alert("OTP verified successfully");
        setStep("upload");
      }
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPLOAD EXCEL ================= */

  const uploadJobs = async () => {
    if (!file) {
      alert("Select Excel file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("email", email);

      const res = await axios.post(`${API}/api/upload-jobs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert(`Jobs uploaded successfully (${res.data.count} Jobs)`);

        // Refresh Career Page jobs
        if (onJobsUploaded) {
          onJobsUploaded();
        }

        // Reset form
        setFile(null);
        setOtp("");
        setStep("jobs");
      }
    } catch (err) {
      console.log("UPLOAD ERROR:", err);

      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSection
      step={step}
      email={email}
      setEmail={setEmail}
      otp={otp}
      setOtp={setOtp}
      setExcelFile={setFile}
      sendOtp={sendOtp}
      verifyOtp={verifyOtp}
      uploadJobs={uploadJobs}
      loading={loading}
    />
  );
}

export default AdminPage;
