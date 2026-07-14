import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Projects from "../pages/Projects";
import Careers from "../pages/Careers";
import Contact from "../pages/Contact";

/* ================= Super Admin ================= */

import SuperAdminLogin from "../pages/superadmin/SuperAdminLogin";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import CreateAdmin from "../pages/superadmin/CreateAdmin";
import AdminList from "../pages/superadmin/AdminList";

/* ================= Admin ================= */

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UploadJobs from "../pages/admin/UploadJobs";
import Applications from "../pages/admin/Applications";
import DownloadTemplate from "../pages/admin/DownloadTemplate";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= Website ================= */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />

        <Route path="/projects" element={<Projects />} />

        <Route path="/careers" element={<Careers />} />

        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ================= Super Admin ================= */}

      <Route path="/superadmin/login" element={<SuperAdminLogin />} />

      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />

      <Route path="/superadmin/create-admin" element={<CreateAdmin />} />

      <Route path="/superadmin/admin-list" element={<AdminList />} />
      <Route
        path="/superadmin/download-template"
        element={<DownloadTemplate />}
      />
      <Route path="/superadmin/upload-jobs" element={<UploadJobs />} />

      <Route path="/superadmin/applications" element={<Applications />} />

      {/* ================= Admin ================= */}

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/admin/download-template" element={<DownloadTemplate />} />
      <Route path="/admin/upload-jobs" element={<UploadJobs />} />

      <Route path="/admin/applications" element={<Applications />} />
    </Routes>
  );
}

export default AppRoutes;
