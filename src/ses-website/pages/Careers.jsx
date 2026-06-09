import React from "react";
import { Link } from "react-router-dom";
// import "../asset/css/career1.css";
import "../asset/css/careers.css";
import CareerHero from "./careers/CareerHero";
import JobsCarousel from "./careers/JobsCarousel";
import ApplyForm from "./careers/ApplyForm";
import { FaUserShield } from "react-icons/fa";

function Careers() {
  return (
    <div className="career-page">
      <CareerHero />

      <section id="jobs" className="jobs-section">
        <JobsCarousel />
      </section>

      <section id="apply" className="apply-section">
        <ApplyForm />
      </section>

      <div className="admin-float">
        <Link to="/careers/admin">
          <FaUserShield />
          Admin Access
        </Link>
      </div>
    </div>
  );
}

export default Careers;
