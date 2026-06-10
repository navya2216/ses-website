import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSection from "./AdminSection";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4005`;

function AdminPage() {
  const [step, setStep] = useState("jobs");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ADMIN EMAIL ================= */

  useEffect(() => {
    axios
      .get(`${API}/api/admin-email`)
      .then((res) => {
        if (res.data.success) {
          setEmail(res.data.email);
        }
      })
      .catch((err) => {
        console.log("ADMIN EMAIL ERROR:", err);
      });
  }, []);

  /* ================= SEND OTP ================= */

  const sendOtp = async () => {
    if (!email) {
      return alert("Admin email not loaded");
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
      return alert("Enter OTP");
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
      return alert("Select Excel file");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("email", email);

      console.log("========== FRONTEND ==========");
      console.log("API:", `${API}/api/upload-jobs`);
      console.log("Email:", email);
      console.log("File:", file);
      console.log("File Name:", file?.name);
      console.log("File Type:", file?.type);
      console.log("File Size:", file?.size);

      const res = await axios.post(`${API}/api/upload-jobs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("SUCCESS RESPONSE:", res.data);

      if (res.data.success) {
        alert(`Jobs uploaded successfully: ${res.data.count}`);

        setFile(null);
        setOtp("");
        setStep("jobs");
      }
    } catch (err) {
      console.log("========== UPLOAD ERROR ==========");
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);

      alert(err.response?.data?.message || err.message || "Upload failed");
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
