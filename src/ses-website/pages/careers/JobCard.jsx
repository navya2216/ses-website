import React from "react";
import "../../asset/css/jobcard.css";
function JobCard({ job }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{job.role}</h3>

        <span className="job-badge">{job.type}</span>
      </div>

      <div className="job-info">
        <p>
          📍 <span>{job.location}</span>
        </p>

        <p>
          💼 <span>{job.type}</span>
        </p>
      </div>

      <p className="job-desc">{job.description}</p>

      <button className="apply-btn">Apply Now</button>
    </div>
  );
}

export default JobCard;
