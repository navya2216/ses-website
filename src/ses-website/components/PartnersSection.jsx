import React from "react";
import "../asset/css/PartnersSection.css";

import nvidia from "../asset/images/partners/nvidia.png";
import sbl from "../asset/images/partners/sbl.png";
import advantech from "../asset/images/partners/advantech.png";
import xilinx from "../asset/images/partners/xilinx.png";
import scientific from "../asset/images/partners/Scientific-logo.png";
import siglent from "../asset/images/partners/siglent.png";

import drdl from "../asset/images/partners/drdl.png";
import bdl from "../asset/images/partners/bdl.png";
import rci from "../asset/images/partners/rci.png";

import magnarus from "../asset/images/partners/magnarus.png";
import vaishnavi from "../asset/images/partners/vaishnavi.png";
import sridatta from "../asset/images/partners/sridatta.png";
import siliconEngineers from "../asset/images/partners/silicon-engineers.png";

import saarc from "../asset/images/partners/saarc.png";
import sridattaDmv from "../asset/images/partners/sridatta-dmv.png";
import unitech from "../asset/images/partners/unitech.png";
import rainbowWorks from "../asset/images/partners/rainbow-works.png";

const partnerCategories = [
  {
    title: "Technology Partners",
    subtitle: "Collaborating with leading tech innovators",
    partners: [
      { name: "NVIDIA", image: nvidia },
      { name: "ADVANTECH", image: advantech },
      { name: "XILINX", image: xilinx },
      { name: "SCIENTIFIC", image: scientific },
      { name: "SIGLENT", image: siglent },
    ],
  },
  {
    title: "Defence Solutions",
    subtitle: "Advanced defence and aerospace collaborations",
    partners: [
      { name: "DRDL", image: drdl },
      { name: "BDL", image: bdl },
      { name: "RCI", image: rci },
    ],
  },
  {
    title: "Industrial Services",
    subtitle: "Specialized industrial service partners",
    partners: [
      { name: "MAGNARUS", image: magnarus },
      { name: "VAISHNAVI", image: vaishnavi },
      { name: "SRIDATTA", image: sridatta },
      { name: "SILICON ENGINEERS", image: siliconEngineers },
      { name: "SBL TECHNOLOGIES", image: sbl },
    ],
  },
  {
    title: "Engineering Partners",
    subtitle: "Trusted engineering and manufacturing partners",
    partners: [
      { name: "SAARC", image: saarc },
      { name: "SRIDATTA DMV", image: sridattaDmv },
      { name: "UNITECH", image: unitech },
      { name: "RAINBOW WORKS", image: rainbowWorks },
      { name: "AKSHAYA ENGINEERING WORKS" },
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
            We collaborate with industry leaders to deliver innovative
            technology solutions across software, electronics, AI, embedded
            systems, defence, and industrial automation.
          </p>
        </div>

        <div className="cards-patnar">
          {partnerCategories.map((category, index) => (
            <div className="partner-category-card" key={index}>
              <div className="category-header">
                <h3>{category.title}</h3>
                <p>{category.subtitle}</p>
              </div>

              <div className="partner-row">
                {category.partners.map((partner, i) => (
                  <div
                    className={`partner-card${partner.image ? "" : " partner-card--text"}`}
                    key={partner.name}
                  >
                    {partner.image ? (
                      <>
                        <img src={partner.image} alt={partner.name} />
                        <div className="partner-overlay">
                          <h4>{partner.name}</h4>
                        </div>
                      </>
                    ) : (
                      <h4>{partner.name}</h4>
                    )}
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
