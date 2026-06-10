import React from "react";
import JobCard from "./JobCard";
import "../../asset/css/jobscarousel.css";

function JobsCarousel({ jobs = [] }) {
  const loopJobs = jobs.length > 0 ? [...jobs, ...jobs] : [];

  return (
    <section className="jobs-section">
      <div className="section-header">
        <span className="section-tag">🚀 Careers</span>

        <h2>Open Positions</h2>

        <p>
          Explore our latest opportunities and find the role that matches your
          skills and career goals.
        </p>
      </div>

      {jobs.length > 0 ? (
        <div className="carousel-wrapper">
          <div className="carousel-track">
            {loopJobs.map((job, index) => (
              <JobCard key={`${job.id}-${index}`} job={job} />
            ))}
          </div>
        </div>
      ) : (
        <div className="no-jobs">
          <h3>No Open Positions Available</h3>
          <p>We are not hiring at the moment. Please check again later.</p>
        </div>
      )}
    </section>
  );
}

export default JobsCarousel;
