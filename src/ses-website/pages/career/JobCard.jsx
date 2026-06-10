import React from "react";

function JobCard({ job }) {
  return (
    <div className="job-card">
      <h5 className="text-primary fw-bold mb-3">
        💼 {job.role || "Not Available"}
      </h5>

      <p className="mb-2">
        📍 <strong>Location:</strong> {job.location || "Not Provided"}
      </p>

      <p className="mb-2">
        🧾 <strong>Job Type:</strong> {job.type || "Not Provided"}
      </p>

      <p className="mb-0 text-muted">
        📝 <strong>Description:</strong> {job.description || "No description"}
      </p>
    </div>
  );
}

export default JobCard;
