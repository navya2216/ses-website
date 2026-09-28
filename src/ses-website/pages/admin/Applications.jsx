import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaArrowLeft,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaFileAlt,
  FaDownload,
} from "react-icons/fa";

import "../../asset/css/applications.css";

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 6;

  // ================= PREVIEW =================
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const admin = localStorage.getItem("adminEmail");
    const superAdmin = localStorage.getItem("superAdminEmail");

    if (!admin && !superAdmin) {
      navigate("/login", { replace: true });
      return;
    }

    loadApplications();
  }, [navigate]);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/applications");

      if (res.data.success) {
        setApplications(res.data.applications);
        setCurrentPage(1);
      }
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE STATUS =================

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/applications/${id}`, {
        status,
      });

      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  // ================= DELETE =================

  const deleteApplication = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/applications/${id}`);

      alert("Application deleted successfully.");

      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  // ================= PAGINATION =================

  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  const indexOfLastApplication = currentPage * applicationsPerPage;

  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;

  const currentApplications = applications.slice(
    indexOfFirstApplication,
    indexOfLastApplication,
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  // ================= PREVIEW =================

  const openPreview = (application) => {
    setSelectedApplication(application);
  };

  const closePreview = () => {
    setSelectedApplication(null);
  };

  // ================= RESUME URL =================

  const getResumeUrl = (resumePath) => {
    if (!resumePath) return null;

    if (resumePath.startsWith("http")) {
      return resumePath;
    }

    const apiBase = api.defaults?.baseURL || window.location.origin;

    return `${apiBase.replace(/\/$/, "")}/${resumePath.replace(/^\/+/, "")}`;
  };

  return (
    <div className="applications-page">
      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
        <button
          className="back-btn"
          onClick={() => {
            const role = localStorage.getItem("userRole");

            if (role === "SUPER_ADMIN") {
              navigate("/superadmin/dashboard");
            } else {
              navigate("/admin/dashboard");
            }
          }}
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="page-title-section">
          <h2>Candidate Applications</h2>

          <span className="application-count">
            {applications.length} Applications
          </span>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}

      <div className="table-card">
        {loading ? (
          <div className="loading-box">
            <div className="loading-spinner"></div>
            Loading Applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="loading-box">No Applications Found</div>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}

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
                    <th width="180">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentApplications.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="candidate-name">
                          {item.applicant_name}
                        </div>
                      </td>

                      <td>
                        <span className="email-text">
                          {item.applicant_email}
                        </span>
                      </td>

                      <td>{item.applicant_phone}</td>

                      <td>
                        <div className="role-text">{item.selected_roles}</div>
                      </td>

                      <td>
                        <span className="experience-badge">
                          {item.experience_type}
                        </span>
                      </td>

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
                          onChange={(e) =>
                            updateStatus(item.id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>

                          <option value="Shortlisted">Shortlisted</option>

                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="preview-btn"
                            onClick={() => openPreview(item)}
                            title="Preview Application"
                          >
                            <FaEye />
                            Preview
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteApplication(item.id)}
                            title="Delete Application"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE APPLICATION CARDS ================= */}

            <div className="mobile-applications">
              {currentApplications.map((item) => (
                <div className="application-mobile-card" key={item.id}>
                  <div className="mobile-card-header">
                    <div>
                      <h3>{item.applicant_name}</h3>

                      <span>{item.experience_type}</span>
                    </div>

                    <span
                      className={`mobile-status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mobile-card-body">
                    <div className="mobile-info">
                      <strong>Email</strong>
                      <span>{item.applicant_email}</span>
                    </div>

                    <div className="mobile-info">
                      <strong>Phone</strong>
                      <span>{item.applicant_phone}</span>
                    </div>

                    <div className="mobile-info">
                      <strong>Applied Role</strong>
                      <span>{item.selected_roles}</span>
                    </div>

                    <div className="mobile-info">
                      <strong>Experience</strong>
                      <span>{item.experience_type}</span>
                    </div>

                    <div className="mobile-info">
                      <strong>Current Salary</strong>
                      <span>
                        {item.experience_type === "Fresher"
                          ? "N/A"
                          : item.current_salary}
                      </span>
                    </div>

                    <div className="mobile-info">
                      <strong>Expected Salary</strong>
                      <span>{item.expected_salary}</span>
                    </div>

                    <div className="mobile-info">
                      <strong>Applied Date</strong>
                      <span>
                        {new Date(item.applied_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mobile-status-control">
                      <select
                        className={`status-select ${item.status.toLowerCase()}`}
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>

                        <option value="Shortlisted">Shortlisted</option>

                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="mobile-card-actions">
                    <button
                      className="preview-btn"
                      onClick={() => openPreview(item)}
                    >
                      <FaEye />
                      Preview
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteApplication(item.id)}
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= PAGINATION ================= */}

            <div className="pagination-section">
              <div className="pagination-info">
                Showing <strong>{indexOfFirstApplication + 1}</strong> -
                <strong>
                  {Math.min(indexOfLastApplication, applications.length)}
                </strong>{" "}
                of <strong>{applications.length}</strong>
              </div>

              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft />
                  Previous
                </button>

                <div className="page-number">
                  {currentPage} / {totalPages}
                </div>

                <button
                  className="pagination-btn"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================= PREVIEW MODAL ================= */}

      {selectedApplication && (
        <div className="preview-overlay" onClick={closePreview}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <div>
                <h2>Application Preview</h2>
                <span>Candidate Application Details</span>
              </div>

              <button className="preview-close-btn" onClick={closePreview}>
                <FaTimes />
              </button>
            </div>

            <div className="preview-body">
              <div className="preview-profile">
                <div className="candidate-avatar">
                  {selectedApplication.applicant_name?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <h3>{selectedApplication.applicant_name}</h3>

                  <p>{selectedApplication.selected_roles}</p>
                </div>
              </div>

              <div className="preview-section">
                <h4>Candidate Information</h4>

                <div className="preview-grid">
                  <div className="preview-field">
                    <label>Name</label>
                    <span>{selectedApplication.applicant_name}</span>
                  </div>

                  <div className="preview-field">
                    <label>Email</label>
                    <span>{selectedApplication.applicant_email}</span>
                  </div>

                  <div className="preview-field">
                    <label>Phone</label>
                    <span>{selectedApplication.applicant_phone}</span>
                  </div>

                  <div className="preview-field">
                    <label>Applied Role</label>
                    <span>{selectedApplication.selected_roles}</span>
                  </div>

                  <div className="preview-field">
                    <label>Experience</label>
                    <span>{selectedApplication.experience_type}</span>
                  </div>

                  <div className="preview-field">
                    <label>Current Salary</label>
                    <span>
                      {selectedApplication.experience_type === "Fresher"
                        ? "N/A"
                        : selectedApplication.current_salary}
                    </span>
                  </div>

                  <div className="preview-field">
                    <label>Expected Salary</label>
                    <span>{selectedApplication.expected_salary}</span>
                  </div>

                  <div className="preview-field">
                    <label>Applied Date</label>
                    <span>
                      {new Date(
                        selectedApplication.applied_at,
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="preview-field">
                    <label>Status</label>

                    <span
                      className={`preview-status ${selectedApplication.status.toLowerCase()}`}
                    >
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="preview-section">
                <h4>Application Status</h4>

                <select
                  className={`preview-status-select ${selectedApplication.status.toLowerCase()}`}
                  value={selectedApplication.status}
                  onChange={(e) => {
                    updateStatus(selectedApplication.id, e.target.value);

                    setSelectedApplication({
                      ...selectedApplication,
                      status: e.target.value,
                    });
                  }}
                >
                  <option value="Pending">Pending</option>

                  <option value="Shortlisted">Shortlisted</option>

                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {selectedApplication.resume_path && (
                <div className="preview-section resume-section">
                  <h4>Resume</h4>

                  <div className="resume-preview-box">
                    <FaFileAlt />

                    <div>
                      <strong>Candidate Resume</strong>

                      <span>Resume document attached</span>
                    </div>

                    <div className="resume-actions">
                      <a
                        href={getResumeUrl(selectedApplication.resume_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resume-preview-btn"
                      >
                        <FaEye />
                        Preview
                      </a>

                      <a
                        href={getResumeUrl(selectedApplication.resume_path)}
                        download
                        className="resume-download-btn"
                      >
                        <FaDownload />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="preview-footer">
              <button className="preview-footer-close" onClick={closePreview}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;
