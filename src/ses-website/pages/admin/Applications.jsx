import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft } from "react-icons/fa";

import "../../asset/css/applications.css";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4006`;

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = localStorage.getItem("adminEmail");
    const superAdmin = localStorage.getItem("superAdminEmail");

    if (!admin && !superAdmin) {
      navigate("/admin/login");
      return;
    }

    loadApplications();
  }, [navigate]);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/applications`);

      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/api/applications/${id}`, {
        status,
      });

      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const deleteApplication = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/api/applications/${id}`);

      alert("Application deleted successfully.");

      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="applications-page">
      <div className="page-header">
        <button
          className="back-btn"
          onClick={() => {
            if (localStorage.getItem("superAdminEmail")) {
              navigate("/superadmin/dashboard");
            } else {
              navigate("/admin/dashboard");
            }
          }}
        >
          <FaArrowLeft />
          Back
        </button>

        <h2>Candidate Applications</h2>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading-box">Loading Applications...</div>
        ) : applications.length === 0 ? (
          <div className="loading-box">No Applications Found</div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Applied Role</th>
                  <th>Experience</th>
                  <th>Current Salary</th>
                  <th>Expected Salary</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th width="140">Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((item) => (
                  <tr key={item.id}>
                    <td>{item.applicant_name}</td>

                    <td>{item.applicant_email}</td>

                    <td>{item.applicant_phone}</td>
                    <td>{item.selected_roles}</td>

                    <td>{item.experience_type}</td>

                    <td>
                      {item.experience_type === "Fresher"
                        ? "N/A"
                        : item.current_salary}
                    </td>

                    <td>{item.expected_salary}</td>

                    <td>{new Date(item.applied_at).toLocaleDateString()}</td>

                    <td>
                      <select
                        className={`status-select ${item.status.toLowerCase()}`}
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteApplication(item.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
