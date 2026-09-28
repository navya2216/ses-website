import React from "react";
import {
  FaLightbulb,
  FaAward,
  FaHandshake,
  FaBullseye,
  FaCode,
  FaMicrochip,
  FaSlidersH,
  FaUsers,
} from "react-icons/fa";

import "../asset/css/about.css";

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

          <p>
            Our commitment to reliability, quality, and continuous effort
            distinguishes us in the industry. We deliver comprehensive ATE and
            Data Acquisition (DAQ) solutions, carefully tailored to meet the
            unique requirements of our clients. From defense organizations and
            public sector undertakings (PSUs) to automotive manufacturers, we
            provide customized services that deliver exceptional value.
          </p>
        </div>
      </section>

      {/* Our People */}
      <section className="about-team section">
        <div className="container">
          <div className="section-title">
            <span>Our People</span>
            <h2>The People Behind Our Solutions</h2>
          </div>

          <p className="about-team-intro">
            Our multidisciplinary team brings together technical knowledge,
            practical experience, and a commitment to solving each client’s
            engineering challenges.
          </p>

          <div className="team-grid">
            <article className="team-card">
              <FaCode aria-hidden="true" />
              <h3>Software Engineers</h3>
              <p>
                Develop dependable software and applications that support
                complex engineering and business needs.
              </p>
            </article>

            <article className="team-card">
              <FaMicrochip aria-hidden="true" />
              <h3>Embedded Systems Engineers</h3>
              <p>
                Work across embedded applications and electronics to deliver
                solutions built around real-world requirements.
              </p>
            </article>

            <article className="team-card">
              <FaSlidersH aria-hidden="true" />
              <h3>ATE &amp; DAQ Specialists</h3>
              <p>
                Shape automated test and data acquisition systems to meet each
                client’s technical and operational needs.
              </p>
            </article>

            <article className="team-card">
              <FaUsers aria-hidden="true" />
              <h3>Designers &amp; Strategists</h3>
              <p>
                Bring teams and stakeholders together to turn project goals into
                thoughtful, practical solutions.
              </p>
            </article>
          </div>
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
            <h2>Key Strengths</h2>
          </div>

          <div className="why-grid">
            <div>
              ✔ Extensive domain expertise in Aerospace, Automotive, and
              Embedded Applications
            </div>
            <div>✔ Strong emphasis on innovation and R&amp;D</div>
            <div>✔ Tailored solutions designed around client needs</div>
            <div>✔ Proven reliability and uncompromising quality</div>
            <div>✔ Dedicated focus on the defense sector</div>
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
