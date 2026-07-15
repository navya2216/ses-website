import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import CareerHero from "./careers/CareerHero";
import JobsCarousel from "./careers/JobsCarousel";
import ApplyForm from "./careers/ApplyForm";

import "../asset/css/careers1.css";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4006`;

function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API}/api/career/jobs`);

      console.log("API Response:", res.data);

      if (res.data.success) {
        setJobs(res.data.jobs || []);
      } else {
        setJobs([]);
        setError("Failed to fetch jobs.");
      }
    } catch (err) {
      console.error("Jobs Fetch Error:", err);

      setJobs([]);

      setError("Unable to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  console.log("Jobs State:", jobs);

  return (
    <div className="career-page">
      {/* Admin Button */}

      {/* Hero Section */}
      <CareerHero />

      {/* Jobs Section */}
      <section id="jobs" className="career-jobs">
        <div className="container">
          {loading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <JobsCarousel jobs={jobs} />
          )}
        </div>
      </section>

      {/* Apply Form */}
      <section id="apply" className="career-apply">
        <div className="container">
          <div className="apply-card">
            <h2>Apply Now</h2>

            <ApplyForm />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Careers;
