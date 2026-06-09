import React, { useState } from "react";
import AdminSection from "./AdminSection";

function AdminPage() {
  const [step, setStep] = useState("jobs");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [file, setFile] = useState(null);

  const sendOtp = () => {
    console.log("Send OTP");
    setStep("otp");
  };

  const verifyOtp = () => {
    console.log("Verify OTP");
    setStep("upload");
  };

  const uploadExcel = () => {
    console.log("Upload Excel", file);
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
      uploadJobs={uploadExcel}
    />
  );
}

export default AdminPage;
