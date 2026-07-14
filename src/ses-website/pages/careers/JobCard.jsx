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
        <h3>{job.job_role}</h3>

        <span className="job-badge">{job.job_type}</span>
      </div>

      <div className="job-details">
        <p>📍 {job.location}</p>

        <p>💼 {job.job_type}</p>

        <p>👥 Vacancies: {job.vacancies || 0}</p>
      </div>

      <p>{job.description}</p>

      <button onClick={handleApply}>Apply Now →</button>
    </div>
  );
}

export default JobCard;
