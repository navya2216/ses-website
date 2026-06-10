import React from "react";
import JobCard from "./JobCard";

function JobCarousel({ jobs }) {
  const loopJobs = jobs.length > 0 ? [...jobs, ...jobs] : [];

  return (
    <div className="carousel-wrapper w-100 py-4">
      <h3 className="text-center mb-4 fw-bold">🚀 Latest Job Openings</h3>

      <div className="carousel-track d-flex align-items-stretch">
        {loopJobs.length === 0 ? (
          <div className="w-100 text-center text-muted">No jobs available</div>
        ) : (
          loopJobs.map((job, i) => <JobCard key={i} job={job} />)
        )}
      </div>
    </div>
  );
}

export default JobCarousel;
