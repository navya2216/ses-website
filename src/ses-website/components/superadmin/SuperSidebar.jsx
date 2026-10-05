import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUserPlus,
  FaUsers,
  FaFileDownload,
  FaUpload,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

import "../../asset/css/super-sidebar.css";

function SuperSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("superAdminName");
    localStorage.removeItem("superAdminEmail");
    localStorage.removeItem("userRole");
    navigate("/", { replace: true });
  };

  return (
    <aside className="super-sidebar">
      <div className="sidebar-logo">
        <h2>SES</h2>
        <span>Career Portal</span>
      </div>

      <ul className="sidebar-menu">
        <li>
          <NavLink to="/superadmin/dashboard">
            <FaTachometerAlt />
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/superadmin/create-admin">
            <FaUserPlus />
            Create Admin
          </NavLink>
        </li>

        <li>
          <NavLink to="/superadmin/admin-list">
            <FaUsers />
            Admin List
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/download-template">
            <FaFileDownload />
            Download Template
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/upload-jobs">
            <FaUpload />
            Upload Jobs
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/applications">
            <FaClipboardList />
            Applications
          </NavLink>
        </li>
      </ul>

      <button className="logout-btn" onClick={logout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default SuperSidebar;
