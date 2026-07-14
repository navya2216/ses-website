import React, { useEffect, useState } from "react";
import axios from "axios";

import SuperSidebar from "../../components/superadmin/SuperSidebar";
import SuperHeader from "../../components/superadmin/SuperHeader";

import "../../asset/css/admin-list.css";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4006`;

function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const res = await axios.get(`${API}/api/admins`);
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (admin) => {
    setEditing(admin.id);

    setForm({
      name: admin.name,
      email: admin.email,
      password: admin.password,
      phone: admin.phone || "",
    });
  };

  const updateAdmin = async () => {
    try {
      await axios.put(`${API}/api/admins/${editing}`, form);

      setEditing(null);

      loadAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const deleteAdmin = async () => {
    try {
      await axios.delete(`${API}/api/admins/${deleteId}`);

      setShowDelete(false);
      setDeleteId(null);

      loadAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filteredAdmins = admins.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      (item.phone || "").includes(search)
    );
  });

  return (
    <div className="dashboard-layout">
      <SuperSidebar />

      <div className="dashboard-content">
        <SuperHeader title="Career Admin List" />

        <div className="admin-card">
          <div className="card-header">
            <h2>Career Admins</h2>

            <input
              type="text"
              placeholder="Search Admin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty">
                      No Admins Found
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin, index) => (
                    <tr key={admin.id}>
                      <td>{index + 1}</td>

                      <td>{admin.name}</td>

                      <td>{admin.email}</td>

                      <td>{admin.password}</td>

                      <td>{admin.phone || "-"}</td>

                      <td>
                        <span className="status">{admin.status}</span>
                      </td>

                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(admin)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => confirmDelete(admin.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Popup */}

        {editing && (
          <div className="popup">
            <div className="popup-box">
              <h3>Edit Admin</h3>

              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              <input
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />

              <div className="popup-buttons">
                <button className="save-btn" onClick={updateAdmin}>
                  Update
                </button>

                <button className="cancel-btn" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Popup */}

        {showDelete && (
          <div className="popup">
            <div className="delete-popup">
              <h3>Delete Admin</h3>

              <p>Are you sure you want to delete this admin?</p>

              <div className="popup-buttons">
                <button className="delete-btn" onClick={deleteAdmin}>
                  Yes Delete
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminList;
