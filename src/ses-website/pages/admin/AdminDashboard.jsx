import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaFileExcel,
  FaClipboardList,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";

import Sidebar from "../../components/Sidebar";

import "../../asset/css/admin-dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const email = localStorage.getItem("adminEmail");

  useEffect(() => {
    if (!email) {
      navigate("/admin/login", { replace: true });
    }
  }, [email, navigate]);

  const logout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");

    if (!confirm) return;

    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");

    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      <Sidebar />

      <div className="dashboard-container">
        {/* Header */}

        <div className="admin-header">
          <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome to SES Career Portal</p>
          </div>

          <div className="admin-user">
            <span>{email}</span>

            <button onClick={logout}>
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* Welcome */}

        <div className="welcome-card">
          <h3>Welcome Admin 👋</h3>

          <p>
            Upload Jobs, Download Excel Template and Manage Candidate
            Applications.
          </p>
        </div>

        {/* Statistics */}

        <div className="stats-grid">
          <div className="stat-card">
            <FaUpload />

            <h2>0</h2>

            <p>Total Job Uploads</p>
          </div>

          <div className="stat-card">
            <FaClipboardList />

            <h2>0</h2>

            <p>Total Applications</p>
          </div>
        </div>

        {/* Quick Actions */}

        <h3 className="section-title">Quick Actions</h3>

        <div className="action-grid">
          <Link to="/admin/download-template" className="action-card">
            <FaFileExcel />

            <h4>Download Template</h4>

            <p>Download Sample Excel</p>
          </Link>

          <Link to="/admin/upload-jobs" className="action-card">
            <FaUpload />

            <h4>Upload Jobs</h4>

            <p>Upload Excel Sheet</p>
          </Link>

          <Link to="/admin/applications" className="action-card">
            <FaClipboardList />

            <h4>Applications</h4>

            <p>View Candidate Applications</p>
          </Link>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
