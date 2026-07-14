import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaFileExcel,
  FaUpload,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

import "../../asset/css/superadmin-dashboard.css";

function SuperAdminDashboard() {
  const navigate = useNavigate();

  const email = localStorage.getItem("superAdminEmail");

  useEffect(() => {
    if (!email) {
      navigate("/superadmin/login");
    }
  }, [email, navigate]);

  const logout = () => {
    if (!window.confirm("Are you sure you want to Logout?")) return;

    localStorage.removeItem("superAdminEmail");

    navigate("/superadmin/login");
  };

  return (
    <div className="superadmin-page">
      {/* Header */}

      <header className="superadmin-header">
        <div>
          <h2>SES Career Portal</h2>
          <p>Super Admin Dashboard</p>
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
        <Link to="/superadmin/dashboard" className="nav-btn">
          <FaHome />
          Dashboard
        </Link>

        <Link to="/superadmin/create-admin" className="nav-btn">
          <FaUserTie />
          Create Admin
        </Link>

        <Link to="/superadmin/admin-list" className="nav-btn">
          <FaUsers />
          Admin List
        </Link>

        <Link to="/superadmin/download-template" className="nav-btn">
          <FaFileExcel />
          Download Template
        </Link>

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
        <h2>Welcome Super Admin 👋</h2>

        <p>
          Manage Career Admins, Job Uploads, Download Templates and Candidate
          Applications.
        </p>
      </div>

      {/* Statistics */}

      <div className="stats-grid">
        <div className="stat-card">
          <FaUsers className="stat-icon" />

          <h2>0</h2>

          <p>Total Admins</p>
        </div>

        <div className="stat-card">
          <FaUpload className="stat-icon" />

          <h2>0</h2>

          <p>Total Job Uploads</p>
        </div>

        <div className="stat-card">
          <FaClipboardList className="stat-icon" />

          <h2>0</h2>

          <p>Total Applications</p>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
