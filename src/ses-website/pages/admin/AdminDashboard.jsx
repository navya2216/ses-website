import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

import {
  FaHome,
  FaFileExcel,
  FaUpload,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

import "../../asset/css/admin-dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const email = localStorage.getItem("adminEmail");
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
      return;
    }

    api
      .get("/api/dashboard/stats")
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.stats);
        }
      })
      .catch(console.error);
  }, [email, navigate]);

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    localStorage.removeItem("userRole");

    navigate("/login", { replace: true });
  };

  const downloadTemplate = () => {
    const confirmDownload = window.confirm(
      "Do you want to download the Career Excel Template?",
    );

    if (!confirmDownload) return;

    const link = document.createElement("a");

    link.href = "/templates/Career_Template.xlsx";
    link.download = "Career_Template.xlsx";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    alert("Career Excel Template downloaded successfully.");
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div>
          <h2>SES Career Portal</h2>
          <p>Admin Dashboard</p>
        </div>

        <div className="header-right">
          <span>{email}</span>

          <button className="logout-btn" onClick={logout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className="top-navigation">
        <Link to="/admin/dashboard" className="nav-btn">
          <FaHome />
          Dashboard
        </Link>

        <button className="nav-btn" onClick={downloadTemplate}>
          <FaFileExcel />
          Download Template
        </button>

        <Link to="/admin/upload-jobs" className="nav-btn">
          <FaUpload />
          Upload Jobs
        </Link>

        <Link to="/admin/applications" className="nav-btn">
          <FaClipboardList />
          Applications
        </Link>
      </div>

      {/* Welcome */}
      <div className="welcome-card">
        <h2>Welcome Admin 👋</h2>

        <p>
          Manage Job Uploads, Download Excel Template and Candidate
          Applications.
        </p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaUpload className="stat-icon" />

          <h2>{stats.totalJobs}</h2>

          <p>Total Job Uploads</p>
        </div>

        <div className="stat-card">
          <FaClipboardList className="stat-icon" />

          <h2>{stats.totalApplications}</h2>

          <p>Total Applications</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
