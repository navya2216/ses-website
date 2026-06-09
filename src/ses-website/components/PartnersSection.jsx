import React from "react";
import "../asset/css/PartnersSection.css";

const partnerCategories = [
  {
    title: "Technology Partners",
    subtitle: "Collaborating with leading tech innovators",
    partners: [
      "/images/partners/nvidia.png",
      "/images/partners/sbl.png",
      "/images/partners/advantech.png",
      "/images/partners/xilinx.png",
      "/images/partners/scientific.png",
      "/images/partners/siglent.png",
    ],
  },
  {
    title: "Defensive Solutions",
    subtitle: "Advanced defense and aerospace collaborations",
    partners: [
      "/images/partners/drdl.png",
      "/images/partners/bdl.png",
      "/images/partners/rci.png",
    ],
  },
  {
    title: "Industrial Services",
    subtitle: "Specialized solutions for industrial applications",
    partners: [
      "/images/partners/magnarus.png",
      "/images/partners/vaishnavi.png",
      "/images/partners/sridatta.png",
      "/images/partners/silicon.png",
    ],
  },
  {
    title: "Engineering Partners",
    subtitle: "Collaborating with engineering specialists",
    partners: [
      "/images/partners/saarc.png",
      "/images/partners/sridatta-dmv.png",
      "/images/partners/unitech.png",
      "/images/partners/rainbow.png",
    ],
  },
];

function PartnersSection() {
  return (
    <section className="partners-section">
      <div className="container">
        <div className="section-title">
          <h2>Our Expertise & Partnerships</h2>

          <p>
            We collaborate with industry leaders to deliver cutting-edge
            solutions and innovative technologies across software, electronics,
            AI, and embedded systems.
          </p>
        </div>

        <div className="partner-categories-grid">
          {partnerCategories.map((category, index) => (
            <div className="partner-category-card" key={index}>
              <div className="category-header">
                <h3>{category.title}</h3>
                <p>{category.subtitle}</p>
              </div>

              <div className="partner-grid">
                {category.partners.map((logo, i) => (
                  <div className="partner-card" key={i}>
                    <img src={logo} alt="partner-logo" />

                    <div className="partner-overlay">
                      <h4>{category.title}</h4>
                      <p>{category.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
