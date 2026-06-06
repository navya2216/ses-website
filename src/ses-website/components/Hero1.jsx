import React from "react";
import { Link } from "react-router-dom";
import "../asset/css/hero1.css";

function Hero1() {
  return (
    <section className="hero1">
      <div className="container hero1-container">
        <div className="hero1-content">
          <span className="hero1-badge">
            🚀 Trusted Software Development Company
          </span>

          <h1>
            Transforming Businesses Through
            <span> Innovative Software Solutions</span>
          </h1>

          <p>
            We build modern web applications, enterprise software, cloud
            solutions, and digital products that help businesses scale faster
            and operate smarter.
          </p>

          <div className="hero1-buttons">
            <Link to="/services" className="hero1-btn primary-btn">
              Our Services
            </Link>

            <Link to="/contact" className="hero1-btn secondary-btn">
              Get Quote
            </Link>
          </div>

          <div className="hero1-stats">
            <div className="stat-box">
              <h3>100+</h3>
              <p>Projects</p>
            </div>

            <div className="stat-box">
              <h3>50+</h3>
              <p>Clients</p>
            </div>

            <div className="stat-box">
              <h3>10+</h3>
              <p>Years</p>
            </div>
          </div>
        </div>

        <div className="hero1-image">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
            alt="Software Development"
          />

          <div className="floating-card card1">💻 Web Development</div>

          <div className="floating-card card2">📱 Mobile Apps</div>

          <div className="floating-card card3">☁ Cloud Solutions</div>
        </div>
      </div>
    </section>
  );
}

export default Hero1;
