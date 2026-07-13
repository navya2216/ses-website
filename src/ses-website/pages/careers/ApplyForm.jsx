import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../../asset/css/ApplyForm.css";

function ApplyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [role, setRole] = useState([]);
  const [resume, setResume] = useState(null);

  const [experienceType, setExperienceType] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");

  const [errors, setErrors] = useState({});
  const [roleOptions, setRoleOptions] = useState([]);

  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();

  /* ================= FETCH ROLES ================= */

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:4006/api/roles");

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
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [apiError, successMsg]);

  // /* ================= TOGGLE ROLE ================= */

  // const toggleRole = (item) => {
  //   if (role.includes(item)) {
  //     setRole(role.filter((r) => r !== item));
  //   } else {
  //     setRole([...role, item]);
  //   }

  //   setErrors((prev) => ({ ...prev, role: "" }));
  //   setApiError("");
  // };

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

    if (!experienceType) temp.experienceType = "Select Experience Type";

    if (experienceType === "Experienced") {
      if (!currentSalary.trim())
        temp.currentSalary = "Current salary is required";
    }

    if (!expectedSalary.trim())
      temp.expectedSalary = "Expected salary is required";

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
    formData.append("experienceType", experienceType);
    formData.append("currentSalary", currentSalary);
    formData.append("expectedSalary", expectedSalary);
    formData.append("role", role.join(", "));

    formData.append("resume", resume);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:4006/api/apply",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        setSuccessMsg("Application submitted ✔ Resume sent to HR email");

        setName("");
        setEmail("");
        setPhone("");
        setRole([]);
        setResume(null);
        setErrors({});
        // ⭐ IMPORTANT FIX
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
    <div className="apply-form container">
      <h2 className="text-center mb-4">Apply for a Position</h2>

      {/* ERROR / SUCCESS */}

      {apiError && <div className="error-message">{apiError}</div>}

      {successMsg && <div className="success-message">{successMsg}</div>}
      {/* NAME */}

      <div className="input-group">
        <input
          type="text"
          placeholder="Full Name"
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
      </div>

      {/* EMAIL */}

      <div className="input-group">
        <input
          type="email"
          placeholder="Email Address"
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
      </div>

      {/* PHONE */}

      <div className="input-group">
        <input
          type="tel"
          placeholder="Phone Number"
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
      </div>

      {/* Experience Section */}
      <div className="input-group">
        <label>Experience</label>

        <select
          className="form-select"
          value={experienceType}
          onChange={(e) => {
            setExperienceType(e.target.value);
            setErrors((prev) => ({
              ...prev,
              experienceType: "",
            }));
          }}
        >
          <option value="">Select</option>
          <option value="Fresher">Fresher</option>
          <option value="Experienced">Experienced</option>
        </select>

        {errors.experienceType && (
          <small className="text-danger">{errors.experienceType}</small>
        )}
      </div>

      {/* Salary Fields */}
      <div className="salary-row">
        {experienceType === "Experienced" && (
          <div className="input-group">
            <label>Current Salary</label>

            <input
              type="number"
              placeholder="Current Salary"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(e.target.value)}
            />

            {errors.currentSalary && (
              <small className="text-danger">{errors.currentSalary}</small>
            )}
          </div>
        )}

        <div className="input-group">
          <label>Expected Salary</label>

          <input
            type="number"
            placeholder="Expected Salary"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
          />

          {errors.expectedSalary && (
            <small className="text-danger">{errors.expectedSalary}</small>
          )}
        </div>
      </div>
      {/* ROLE SECTION */}

      {/* ROLE SECTION */}

      <div className="input-group">
        <label>Select Role</label>

        <div className="role-select-box">
          <div className="role-chip-container">
            {role.map((item, index) => (
              <span key={index} className="role-chip">
                {item}

                <span
                  className="remove-role"
                  onClick={() => {
                    setRole(role.filter((r) => r !== item));
                  }}
                >
                  ❌
                </span>
              </span>
            ))}

            <select
              className="role-dropdown"
              value=""
              onChange={(e) => {
                const value = e.target.value;

                if (value && !role.includes(value)) {
                  setRole([...role, value]);
                }

                setErrors((prev) => ({
                  ...prev,
                  role: "",
                }));

                setApiError("");

                e.target.value = "";
              }}
            >
              <option value="">Select Role</option>

              {roleOptions.map((item) => (
                <option key={item.id} value={item.role}>
                  {item.role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {errors.role && <small className="text-danger">{errors.role}</small>}
      </div>

      {/* RESUME */}

      <div className="upload-box">
        <label>Upload Resume (PDF only)</label>

        <input
          type="file"
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
            setErrors((prev) => ({
              ...prev,
              resume: "",
            }));
            setApiError("");
          }}
        />

        {errors.resume && (
          <small className="text-danger">{errors.resume}</small>
        )}
      </div>

      {/* SUBMIT */}

      <button
        className="submit-btn"
        onClick={submitApplication}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  );
}

export default ApplyForm;
