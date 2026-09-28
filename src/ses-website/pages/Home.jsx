import React from "react";
import { Link } from "react-router-dom";
import { FaMicrochip, FaSlidersH, FaCode } from "react-icons/fa";
import Hero1 from "../components/Hero1";
import PartnersSection from "../components/PartnersSection";
import "../asset/css/home.css";

const capabilities = [
  {
    icon: <FaSlidersH aria-hidden="true" />,
    title: "ATE & Data Acquisition",
    description:
      "Test and measurement systems designed around application-specific requirements, from automated testing to data acquisition.",
  },
  {
    icon: <FaMicrochip aria-hidden="true" />,
    title: "Embedded & Electronics",
    description:
      "Embedded software, firmware, and electronics engineering for products and systems across demanding application areas.",
  },
  {
    icon: <FaCode aria-hidden="true" />,
    title: "Software & Integration",
    description:
      "Custom software and integration work that connects engineering systems with the tools and workflows around them.",
  },
];

function Home() {
  return (
    <>
      <Hero1 />

      <section className="home-intro section">
        <div className="container">
          <div className="home-intro-copy">
            <span className="home-eyebrow">Soft Electronic Solutions</span>
            <h2>Engineering expertise, shaped around your requirements.</h2>
            <p>
              We bring together software, embedded systems, electronics, and
              test engineering to help organizations address complex technical
              needs. Our work is tailored to each project, with a focus on
              practical implementation, dependable quality, and lasting value.
            </p>
            <Link to="/about" className="home-text-link">
              Learn about SES <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-capabilities section">
        <div className="container">
          <div className="home-section-heading">
            <span className="home-eyebrow">Our Capabilities</span>
            <h2>From engineering challenge to working solution</h2>
            <p>
              A connected set of technical services helps us support projects
              across aerospace, automotive, defense, and embedded applications.
            </p>
          </div>

          <div className="home-capability-grid">
            {capabilities.map((capability) => (
              <article className="home-capability" key={capability.title}>
                <div className="home-capability-icon">{capability.icon}</div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
            ))}
          </div>

          <div className="home-services-link-wrap">
            <Link to="/services" className="home-services-link">
              Explore all services <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <PartnersSection />

      <section className="home-contact">
        <div className="container home-contact-inner">
          <div>
            <span className="home-eyebrow">Let’s work together</span>
            <h2>Have an engineering challenge to solve?</h2>
            <p>
              Tell us what you are building and what your project needs. Our
              team is ready to discuss a solution tailored to your requirements.
            </p>
          </div>
          <Link to="/contact" className="home-contact-link">
            Contact our team <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
