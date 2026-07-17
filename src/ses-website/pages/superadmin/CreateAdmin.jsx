import React, { useState } from "react";
import api from "../../api";
import SuperSidebar from "../../components/superadmin/SuperSidebar";
import SuperHeader from "../../components/superadmin/SuperHeader";

import "../../asset/css/create-admin.css";

function CreateAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const superAdminEmail = localStorage.getItem("superAdminEmail");

      const res = await api.post("/api/createadmin", {
        superAdminEmail,
        ...form,
      });
      if (res.data.success) {
        setMessage("Admin created successfully.");
        setForm({
          name: "",
          email: "",
          password: "",
          phone: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create admin.");
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-layout">
      <SuperSidebar />

      <div className="dashboard-content">
        <SuperHeader title="Create Admin" />

        <div className="create-admin-card">
          <h2>Create Career Admin</h2>

          {message && <div className="success-box">{message}</div>}

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Admin Name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAdmin;
