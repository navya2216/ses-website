import React from "react";
import { FaLightbulb, FaAward, FaHandshake, FaBullseye } from "react-icons/fa";

import "../../assets/css/about.css";

function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container">
          <h1>About Soft Electronic Solutions</h1>

          <p>
            Leading the digital transformation with innovative software,
            embedded systems, and engineering solutions.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-story section">
        <div className="container">
          <div className="section-title">
            <span>Who We Are</span>
            <h2>Our Story</h2>
          </div>

          <p>
            Founded in 2020, Soft Electronic Solutions has been at the forefront
            of software innovation, helping businesses leverage technology to
            achieve their goals.
          </p>

          <p>
            Our team of experienced developers, designers, embedded engineers,
            and strategists work together to create solutions that not only meet
            technical requirements but also deliver real business value.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mission-section section">
        <div className="container">
          <div className="mission-box">
            <FaBullseye className="mission-icon" />

            <h2>Our Mission</h2>

            <p>
              "To deliver bespoke, high-performance electronic solutions and
              expert consulting services aligned with client-specific needs
              across embedded systems, automotive electronics, and test &
              measurement domains."
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section section">
        <div className="container">
          <div className="section-title">
            <span>Our Culture</span>
            <h2>Our Values</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <FaLightbulb />

              <h3>Innovation</h3>

              <p>
                Constantly pushing boundaries with cutting-edge technologies and
                creative solutions.
              </p>
            </div>

            <div className="value-card">
              <FaAward />

              <h3>Quality</h3>

              <p>
                Delivering exceptional quality in every project with attention
                to detail and reliability.
              </p>
            </div>

            <div className="value-card">
              <FaHandshake />

              <h3>Partnership</h3>

              <p>
                Partner with us for effective software and embedded solutions
                that create lasting business value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us section">
        <div className="container">
          <div className="section-title">
            <span>Why SES</span>
            <h2>Why Choose Us?</h2>
          </div>

          <div className="why-grid">
            <div>✔ Experienced Software Team</div>
            <div>✔ Embedded Systems Expertise</div>
            <div>✔ Automotive Domain Knowledge</div>
            <div>✔ Client-Focused Solutions</div>
            <div>✔ Innovative R&D Culture</div>
            <div>✔ Reliable Project Delivery</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <h2>Let's Build Something Amazing Together</h2>

          <p>
            We transform ideas into innovative software and embedded solutions.
          </p>

          <button>Contact Us</button>
        </div>
      </section>
    </>
  );
}

export default About;
