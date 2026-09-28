import React from "react";
import { Link } from "react-router-dom";
import "../asset/css/hero1.css";

function Hero1() {
  return (
    <section className="hero1">
      <div className="container hero1-container">
        <div className="hero1-content">
          <span className="hero1-badge">
            Engineering Software · Electronics · Test Systems
          </span>

          <h1>
            Engineering solutions for
            <span> complex technical needs</span>
          </h1>

          <p>
            Soft Electronic Solutions delivers tailored ATE and DAQ, embedded,
            electronics, and software engineering services for aerospace,
            automotive, defense, and industrial applications.
          </p>

          <div className="hero1-buttons">
            <Link to="/services" className="hero1-btn primary-btn">
              Our Services
            </Link>

            <Link to="/contact" className="hero1-btn secondary-btn">
              Get Quote
            </Link>
          </div>
        </div>

        <div className="hero1-image">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
            alt="Engineering team collaborating on a technical project"
          />

          <div className="floating-card card1">ATE &amp; DAQ</div>

          <div className="floating-card card2">Embedded Systems</div>

          <div className="floating-card card3">Electronics Engineering</div>
        </div>
      </div>
    </section>
  );
}

export default Hero1;
