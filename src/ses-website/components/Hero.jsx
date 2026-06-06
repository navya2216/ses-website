import React from "react";
import { Link } from "react-router-dom";
import "../asset/css/hero.css";

function Hero() {
  return (
    <section className="hero-section">
      {/* Floating Shapes */}
      <div className="hero-circle hero-circle-1"></div>
      <div className="hero-circle hero-circle-2"></div>

      <div className="container hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <span className="hero-badge">
            🚀 Trusted Software Development Company
          </span>

          <h1>
            Transforming Businesses Through
            <span> Innovative Software Solutions</span>
          </h1>

          <p>
            We build cutting-edge web applications, enterprise software, cloud
            solutions, and digital products that help businesses scale faster
            and operate smarter.
          </p>

          <div className="hero-buttons">
            <Link to="/services" className="hero-btn primary-btn">
              Our Services
            </Link>

            <Link to="/contact" className="hero-btn secondary-btn">
              Get Quote
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-card">
              <h3>100+</h3>
              <p>Projects</p>
            </div>

            <div className="stat-card">
              <h3>50+</h3>
              <p>Clients</p>
            </div>

            <div className="stat-card">
              <h3>10+</h3>
              <p>Years Experience</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200"
            alt="Software Development"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
