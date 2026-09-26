import React from "react";
import "../../assets/css/Services.css";

function Services() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Our Services</h1>

          <p>
            Delivering innovative software, embedded systems, and hardware
            solutions for modern businesses.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="services-section section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="service-card">
                <div className="service-icon">⚙️</div>

                <h3>Embedded Systems</h3>

                <p>
                  Embedded systems development, IoT integration, firmware
                  programming and automation solutions.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="service-card">
                <div className="service-icon">💻</div>

                <h3>Software Solutions</h3>

                <p>
                  Enterprise applications, ERP systems, web platforms and custom
                  business software.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="service-card">
                <div className="service-icon">🔧</div>

                <h3>Hardware Development</h3>

                <p>
                  PCB design, hardware prototyping, testing and product
                  engineering services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
