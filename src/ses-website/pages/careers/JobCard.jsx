import React from "react";
import "../../asset/css/jobcard.css";

function JobCard({ job }) {
  const handleApply = () => {
    document.getElementById("apply")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="job-card">
      <div className="job-card-top">
        <h3>{job.role}</h3>

        <span className="job-badge">{job.type}</span>
      </div>

      <div className="job-details">
        <p>
          📍 <strong>Location:</strong> {job.location}
        </p>

        <p>
          💼 <strong>Type:</strong> {job.type}
        </p>
      </div>

      <p className="job-desc">{job.description}</p>

      <button className="apply-btn" onClick={handleApply}>
        Apply Now →
      </button>
    </div>
  );
}

export default JobCard;
