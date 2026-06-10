import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4005`;
function ApplyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [role, setRole] = useState([]);
  const [resume, setResume] = useState(null);

  const [errors, setErrors] = useState({});
  const [roleOptions, setRoleOptions] = useState([]);

  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();

  /* ================= FETCH ROLES ================= */

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API}/api/roles`);

      if (res.data.success) {
        setRoleOptions(res.data.roles);
      }
    } catch (err) {
      console.log(err);
      setApiError("Failed to load roles");
    }
  };

  /* ================= LOAD + AUTO REFRESH ROLES ================= */

  useEffect(() => {
    fetchRoles();

    // Auto refresh roles every 10 seconds
    const interval = setInterval(() => {
      fetchRoles();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ================= AUTO HIDE MESSAGES ================= */

  useEffect(() => {
    if (apiError || successMsg) {
      const timer = setTimeout(() => {
        setApiError("");
        setSuccessMsg("");
      }, 4005);

      return () => clearTimeout(timer);
    }
  }, [apiError, successMsg]);

  /* ================= TOGGLE ROLE ================= */

  const toggleRole = (item) => {
    if (role.includes(item)) {
      setRole(role.filter((r) => r !== item));
    } else {
      setRole([...role, item]);
    }

    setErrors((prev) => ({ ...prev, role: "" }));
    setApiError("");
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    let temp = {};

    if (!name.trim()) temp.name = "Name is required";

    if (!email.trim()) {
      temp.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      temp.email = "Invalid email format";
    }

    if (!phone.trim()) {
      temp.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(phone)) {
      temp.phone = "Phone must be 10 digits";
    }

    if (role.length === 0) temp.role = "Select at least one role";

    if (!resume) {
      temp.resume = "Resume is required";
    } else if (resume.type !== "application/pdf") {
      temp.resume = "Only PDF file allowed";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  /* ================= SUBMIT ================= */

  const submitApplication = async () => {
    setApiError("");
    setSuccessMsg("");

    if (!validate()) return;

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);

    formData.append("role", role.join(", "));

    formData.append("resume", resume);

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setSuccessMsg("Application submitted ✔ Resume sent to HR email");

        setName("");
        setEmail("");
        setPhone("");
        setRole([]);
        setResume(null);
        setErrors({});
        if (fileRef.current) {
          fileRef.current.value = "";
        }
      } else {
        setApiError(res.data.message);
      }
    } catch (err) {
      console.log(err);

      setApiError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-center">SES APPLICATION FORM</h4>

      {/* ERROR / SUCCESS */}

      {apiError && <div className="alert alert-danger">{apiError}</div>}

      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* NAME */}

      <input
        className="form-control my-2"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);

          setErrors((prev) => ({
            ...prev,
            name: "",
          }));

          setApiError("");
        }}
      />

      {errors.name && <small className="text-danger">{errors.name}</small>}

      {/* EMAIL */}

      <input
        className="form-control my-2"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);

          setErrors((prev) => ({
            ...prev,
            email: "",
          }));

          setApiError("");
        }}
      />

      {errors.email && <small className="text-danger">{errors.email}</small>}

      {/* PHONE */}

      <input
        className="form-control my-2"
        placeholder="Phone"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);

          setErrors((prev) => ({
            ...prev,
            phone: "",
          }));

          setApiError("");
        }}
      />

      {errors.phone && <small className="text-danger">{errors.phone}</small>}

      {/* ROLE SECTION */}

      <div className="mt-3">
        <label className="form-label fw-bold">Select Roles</label>

        {/* Dropdown */}

        <select
          className="form-select"
          onChange={(e) => {
            const value = e.target.value;

            if (value && !role.includes(value)) {
              setRole([...role, value]);
            }
          }}
        >
          <option value="">-- Select Role --</option>

          {roleOptions.map((item) => (
            <option key={item.id} value={item.role}>
              {item.role}
            </option>
          ))}
        </select>

        {/* Selected Roles */}

        <div className="mt-2 p-2 border rounded bg-light d-flex flex-wrap gap-2">
          {role.length === 0 && (
            <small className="text-muted">No roles selected</small>
          )}

          {role.map((item, index) => (
            <span
              key={index}
              className="badge bg-primary d-flex align-items-center gap-2"
              style={{
                fontSize: "14px",
              }}
            >
              {item}

              <span
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  setRole(role.filter((r) => r !== item));
                }}
              >
                ❌
              </span>
            </span>
          ))}
        </div>

        {errors.role && <small className="text-danger">{errors.role}</small>}
      </div>

      {/* RESUME */}

      <div className="mt-3">
        <label className="form-label fw-bold">Upload Resume (PDF only)</label>

        <input
          type="file"
          className="form-control"
          accept=".pdf,application/pdf"
          ref={fileRef}
          onChange={(e) => {
            const file = e.target.files[0];

            if (!file) return;

            if (file.type !== "application/pdf") {
              alert("Only PDF files are allowed");
              e.target.value = "";
              setResume(null);
              return;
            }

            setResume(file);
            setErrors((prev) => ({ ...prev, resume: "" }));
            setApiError("");
          }}
        />

        {errors.resume && (
          <small className="text-danger">{errors.resume}</small>
        )}
      </div>

      {/* SUBMIT */}

      <button
        className="btn btn-success w-100 mt-4"
        onClick={submitApplication}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  );
}

export default ApplyForm;
