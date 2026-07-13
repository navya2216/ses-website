import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserTie,
  FaFileExcel,
  FaClipboardList,
} from "react-icons/fa";

import SuperSidebar from "../../components/superadmin/SuperSidebar";
import SuperHeader from "../../components/superadmin/SuperHeader";

import "../../asset/css/superadmin-dashboard.css";

function SuperAdminDashboard() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <SuperSidebar />

      {/* Main Content */}
      <main className="dashboard-content">
        <SuperHeader title="Super Admin Dashboard" />

        {/* Welcome */}
        <section className="welcome-card">
          <h2>Welcome Super Admin 👋</h2>

          <p>
            Manage Admins, Upload Jobs, View Applications and control the Career
            Portal.
          </p>
        </section>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <FaUsers className="stat-icon" />

            <h2>0</h2>

            <p>Total Admins</p>
          </div>

          <div className="stat-card">
            <FaFileExcel className="stat-icon" />

            <h2>0</h2>

            <p>Total Job Uploads</p>
          </div>

          <div className="stat-card">
            <FaClipboardList className="stat-icon" />

            <h2>0</h2>

            <p>Total Applications</p>
          </div>
        </section>

        {/* Quick Actions */}

        <h2 className="section-title">Quick Actions</h2>

        {/* <section className="action-grid">
          <Link className="action-card" to="/superadmin/create-admin">
            <FaUserTie className="action-icon" />

            <h3>Create Admin</h3>

            <p>Create New Career Admin</p>
          </Link>

          <Link className="action-card" to="/superadmin/admin-list">
            <FaUsers className="action-icon" />

            <h3>Admin List</h3>

            <p>View All Admins</p>
          </Link>

          <Link className="action-card" to="/admin/download-template">
            <FaFileExcel className="action-icon" />

            <h3>Download Excel Template</h3>

            <p>Download Sample Excel Sheet</p>
          </Link>

          <Link className="action-card" to="/admin/upload-jobs">
            <FaFileExcel className="action-icon" />

            <h3>Upload Jobs</h3>

            <p>Upload Job Excel File</p>
          </Link>

          <Link className="action-card" to="/admin/applications">
            <FaClipboardList className="action-icon" />

            <h3>Applications</h3>

            <p>View Candidate Applications</p>
          </Link>
        </section> */}
      </main>
    </div>
  );
}

export default SuperAdminDashboard;
