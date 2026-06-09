import React, { useState } from "react";
import axios from "axios";
import "../../asset/css/ApplyForm.css";
const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4005`;

function ApplyForm({ jobs = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    resume: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("role", formData.role);
      data.append("resume", formData.resume);

      const res = await axios.post(`${API}/api/apply`, data);

      if (res.data.success) {
        setSuccess(true);
        setMessage("Application Submitted Successfully 🎉");

        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "",
          resume: null,
        });
      }
    } catch (err) {
      setSuccess(false);
      setMessage(err.response?.data?.message || "Application Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="apply-form">
      <div className="section-header">
        <span className="section-tag">📩 Apply Today</span>

        <h2>Join Our Team</h2>

        <p>
          Submit your application and our recruitment team will review your
          profile.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            required
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            required
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            required
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />
        </div>

        <div className="input-group">
          <select
            required
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value,
              })
            }
          >
            <option value="">Select Position</option>

            {jobs.map((job) => (
              <option key={job.id} value={job.role}>
                {job.role}
              </option>
            ))}
          </select>
        </div>

        <div className="upload-box">
          <label>📄 Upload Resume (PDF Only)</label>

          <input
            type="file"
            accept=".pdf"
            required
            onChange={(e) =>
              setFormData({
                ...formData,
                resume: e.target.files[0],
              })
            }
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Apply Now"}
        </button>

        {message && (
          <div className={success ? "success-message" : "error-message"}>
            {message}
          </div>
        )}
      </form>
    </section>
  );
}

export default ApplyForm;
