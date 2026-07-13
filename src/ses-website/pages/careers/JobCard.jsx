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
        <p>📍 {job.location}</p>
        <p>💼 {job.type}</p>
        <p>👥 Vacancies: {job.vacancies || job.total_vacancies || 0}</p>
      </div>

      <p>{job.description}</p>

      <button onClick={handleApply}>Apply Now →</button>
    </div>
  );
}

export default JobCard;
