import React from "react";
import "../../asset/css/jobscarousel.css";
function JobsCarousel({ jobs = [] }) {
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

      <div className="carousel">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="job-card">
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

              <button
                className="apply-btn"
                onClick={() =>
                  document
                    .getElementById("apply")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Apply Now →
              </button>
            </div>
          ))
        ) : (
          <div className="no-jobs">
            <h3>No Open Positions Available</h3>

            <p>We are not hiring at the moment. Please check again later.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default JobsCarousel;
