import React from "react";
import "../../asset/css/CareerHero.css";
function CareerHero() {
  return (
    <section className="page-hero">
      <div className="container">
        <h1>Join Our Team</h1>

        <p>
          Explore exciting opportunities and build your future with Soft
          Electronic Solutions. Work with modern technologies, innovative
          projects, and a talented team.
        </p>

        <div className="hero-buttons">
          <a href="#jobs" className="hero-btn">
            Explore Jobs
          </a>

          <a href="#apply" className="hero-btn hero-btn-outline">
            Apply Now
          </a>
        </div>
      </div>
    </section>
  );
}

export default CareerHero;
