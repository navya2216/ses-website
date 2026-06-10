import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";

import CareerHero from "./careers/CareerHero";
import JobsCarousel from "./careers/JobsCarousel";
import ApplyForm from "./careers/ApplyForm";

import "../asset/css/careers1.css";

const API =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4005`;

function Careers() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs`);

      if (res.data.success) {
        setJobs(res.data.jobs || []);
      }
    } catch (error) {
      console.log("Jobs Fetch Error:", error);
    }
  };

  return (
    <div className="career-page">
      {/* Admin Button */}

      <div className="admin-float">
        <Link to="/careers/admin">
          <FaUserShield />
          <span>Admin Access</span>
        </Link>
      </div>

      {/* Hero Section */}

      <CareerHero />

      {/* Jobs Section */}

      <section id="jobs" className="career-jobs">
        <div className="container">
          <JobsCarousel jobs={jobs} />
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
