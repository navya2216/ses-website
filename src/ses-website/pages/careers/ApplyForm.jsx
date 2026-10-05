import React, { useEffect, useRef, useState } from "react";
import api from "../../api";
import "../../asset/css/ApplyForm.css";

function ApplyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [experienceType, setExperienceType] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");

  const [jobIds, setJobIds] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileRef = useRef();

  /* ================= FETCH ROLES ================= */

  const fetchRoles = async () => {
    try {
      const res = await api.get("/api/roles");

      if (res.data.success) {
        setRoleOptions(res.data.roles);
      }
    } catch (err) {
      console.log(err);
      setApiError("Unable to load roles.");
    }
  };

  useEffect(() => {
    fetchRoles();

    const timer = setInterval(fetchRoles, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (apiError || successMsg) {
      const timer = setTimeout(() => {
        setApiError("");
        setSuccessMsg("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [apiError, successMsg]);

  /* ================= VALIDATE ================= */

  const validate = () => {
    let temp = {};

    if (!name.trim()) {
      temp.name = "Full name is required";
    }

    if (!email.trim()) {
      temp.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      temp.email = "Invalid email";
    }

    if (!phone.trim()) {
      temp.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      temp.phone = "Enter valid mobile number";
    }

    if (jobIds.length === 0) {
      temp.role = "Select at least one role";
    }

    if (!experienceType) {
      temp.experienceType = "Select experience";
    }

    if (experienceType === "Experienced") {
      if (!currentSalary) {
        temp.currentSalary = "Current salary required";
      }
    }

    if (!expectedSalary) {
      temp.expectedSalary = "Expected salary required";
    }

    if (!resume) {
      temp.resume = "Resume required";
    } else if (resume.type !== "application/pdf") {
      temp.resume = "Only PDF allowed";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  /* ================= SUBMIT ================= */

  const submitApplication = async () => {
    if (!validate()) return;

    setLoading(true);
    setApiError("");
    setSuccessMsg("");

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("job_ids", JSON.stringify(jobIds));
      formData.append("experience_type", experienceType);
      formData.append("current_salary", currentSalary);
      formData.append("expected_salary", expectedSalary);
      formData.append("resume", resume);

      const res = await api.post("/api/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message);

        setName("");
        setEmail("");
        setPhone("");

        setExperienceType("");
        setCurrentSalary("");
        setExpectedSalary("");

        setResume(null);
        setJobIds([]);

        if (fileRef.current) {
          fileRef.current.value = "";
        }

        setErrors({});
      } else {
        setApiError(res.data.message);
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 409) {
        setApiError(
          "We couldn't accept this application because an application already exists with this email address or phone number. Contact our hiring team if you need to update your existing application.",
        );
      } else if (status === 404) {
        setApiError(
          serverMessage ||
            "One of the selected roles is no longer available. Please refresh the page and select an open role.",
        );
      } else if (status === 400) {
        setApiError(
          serverMessage ||
            "Please check the application details and PDF resume, then try again.",
        );
      } else if (status >= 500) {
        setApiError(
          "We couldn't submit your application right now. Your details are still here; please try again later or contact our hiring team.",
        );
      } else {
        setApiError(
          "We couldn't reach the application service. Check your connection and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-form container">
      <h2>Apply for a Position</h2>

      {apiError && <div className="error-message">{apiError}</div>}

      {successMsg && <div className="success-message">{successMsg}</div>}

      {/* Name */}

      <div className="input-group">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({ ...errors, name: "" });
          }}
        />

        {errors.name && <small>{errors.name}</small>}
      </div>

      {/* Email */}

      <div className="input-group">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors({ ...errors, email: "" });
          }}
        />

        {errors.email && <small>{errors.email}</small>}
      </div>

      {/* Phone */}

      <div className="input-group">
        <input
          type="text"
          maxLength={10}
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setPhone(value);
            setErrors({ ...errors, phone: "" });
          }}
        />

        {errors.phone && <small>{errors.phone}</small>}
      </div>
      {/* Experience */}

      <div className="input-group">
        <label>Experience</label>

        <select
          value={experienceType}
          onChange={(e) => {
            setExperienceType(e.target.value);
            setErrors({ ...errors, experienceType: "" });
          }}
        >
          <option value="">Select Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="Experienced">Experienced</option>
        </select>

        {errors.experienceType && <small>{errors.experienceType}</small>}
      </div>

      {/* Current Salary */}

      {experienceType === "Experienced" && (
        <div className="input-group">
          <input
            type="number"
            placeholder="Current Salary"
            value={currentSalary}
            onChange={(e) => {
              setCurrentSalary(e.target.value);
              setErrors({ ...errors, currentSalary: "" });
            }}
          />

          {errors.currentSalary && <small>{errors.currentSalary}</small>}
        </div>
      )}

      {/* Expected Salary */}

      <div className="input-group">
        <input
          type="number"
          placeholder="Expected Salary"
          value={expectedSalary}
          onChange={(e) => {
            setExpectedSalary(e.target.value);
            setErrors({ ...errors, expectedSalary: "" });
          }}
        />

        {errors.expectedSalary && <small>{errors.expectedSalary}</small>}
      </div>

      {/* Roles */}

      <div className="input-group">
        <label>Select Roles</label>

        <div className="role-chip-container">
          {jobIds.map((id) => {
            const role = roleOptions.find((r) => String(r.id) === String(id));

            return (
              <span className="role-chip" key={id}>
                {role?.role}

                <span
                  className="remove-role"
                  onClick={() =>
                    setJobIds(jobIds.filter((item) => item !== id))
                  }
                >
                  ✕
                </span>
              </span>
            );
          })}

          <select
            value=""
            onChange={(e) => {
              const value = e.target.value;

              if (value && !jobIds.includes(value)) {
                setJobIds([...jobIds, value]);
              }

              setErrors({
                ...errors,
                role: "",
              });

              e.target.value = "";
            }}
          >
            <option value="">Select Role</option>

            {roleOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.role}
              </option>
            ))}
          </select>
        </div>

        {errors.role && <small>{errors.role}</small>}
      </div>

      {/* Resume */}

      <div className="input-group">
        <label>Resume (PDF)</label>

        <input
          type="file"
          accept=".pdf"
          ref={fileRef}
          onChange={(e) => {
            const file = e.target.files[0];

            if (!file) return;

            if (file.type !== "application/pdf") {
              alert("Only PDF allowed");
              e.target.value = "";
              return;
            }

            setResume(file);

            setErrors({
              ...errors,
              resume: "",
            });
          }}
        />

        {errors.resume && <small>{errors.resume}</small>}
      </div>

      {/* Submit */}

      <button
        className="submit-btn"
        disabled={loading}
        onClick={submitApplication}
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  );
}

export default ApplyForm;
