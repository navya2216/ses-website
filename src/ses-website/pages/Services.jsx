import React from "react";
import "../asset/css/Services.css";

const services = [
  {
    icon: "⚙️",
    title: "Embedded Systems & Firmware",
    description:
      "Engineering support for embedded products, from firmware development through system integration, with solutions shaped around application and product requirements.",
    scope: [
      "Firmware development",
      "Embedded application integration",
      "IoT and automation support",
    ],
  },
  {
    icon: "💻",
    title: "Custom Software Solutions",
    description:
      "Purpose-built software that helps organizations manage workflows, connect systems, and support their operational and engineering processes.",
    scope: [
      "Web and business applications",
      "Enterprise software",
      "System integration",
    ],
  },
  {
    icon: "🔧",
    title: "Hardware & Electronics",
    description:
      "Electronics engineering and prototyping services to help clients develop, evaluate, and refine hardware for their intended applications.",
    scope: [
      "PCB design support",
      "Hardware prototyping",
      "Product engineering and testing",
    ],
  },
  {
    icon: "📊",
    title: "ATE & Data Acquisition",
    description:
      "Automated Test Equipment (ATE) and Data Acquisition (DAQ) solutions tailored to specific measurement, test, and operational requirements.",
    scope: [
      "Test-system development",
      "DAQ system integration",
      "Client-specific test solutions",
    ],
  },
  {
    icon: "🚘",
    title: "Automotive & Aerospace Applications",
    description:
      "Engineering services for automotive and aerospace applications, informed by domain requirements and focused on dependable system behavior.",
    scope: [
      "Application-specific engineering",
      "Embedded and electronics support",
      "Integration and validation",
    ],
  },
  {
    icon: "🧭",
    title: "Engineering Consulting & Integration",
    description:
      "Technical consulting to define practical approaches, align components and systems, and guide engineering work toward client objectives.",
    scope: [
      "Technical consultation",
      "Solution planning",
      "Cross-system integration support",
    ],
  },
];

function Services() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Our Services</h1>

          <p>
            Soft Electronic Solutions provides tailored software, electronics,
            embedded, and test engineering services. We work with clients to
            understand their requirements and develop practical solutions for
            their products, systems, and operations.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="services-section section">
        <div className="container">
          <div className="services-intro">
            <span>What We Do</span>
            <h2>Engineering Services Built Around Your Requirements</h2>
            <p>
              From early technical planning to implementation and integration,
              our team brings software and engineering capabilities together to
              address project-specific needs.
            </p>
          </div>

          <div className="row g-4">
            {services.map((service) => (
              <div className="col-lg-4 col-md-6" key={service.title}>
                <article className="service-card">
                  <div className="service-icon" aria-hidden="true">
                    {service.icon}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul>
                    {service.scope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
