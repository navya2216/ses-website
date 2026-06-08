import React from "react";
import { FaLaptopCode, FaMicrochip, FaTools } from "react-icons/fa";

import "../asset/css/projects.css";

function Projects() {
  const projects = [
    {
      icon: <FaMicrochip />,
      category: "Embedded",
      title: "Embedded System",
      description: "Advanced embedded solution for automotive industry.",
      technologies: ["Python", "C++", "PyQt"],
      status: "Completed",
      date: "15 Jun 2021",
    },
    {
      icon: <FaLaptopCode />,
      category: "Software",
      title: "Software Platform",
      description: "Enterprise software platform for data management.",
      technologies: ["React", "Node.js", "MongoDB"],
      status: "Ongoing",
      date: "20 Mar 2022",
    },
    {
      icon: <FaTools />,
      category: "Hardware",
      title: "Hardware Integration",
      description: "Hardware integration project for industrial automation.",
      technologies: ["Python", "Arduino", "IoT"],
      status: "Completed",
      date: "10 Jan 2023",
    },
  ];

  return (
    <>
      {/* Hero */}

      <section className="page-hero">
        <div className="container">
          <h1>Our Projects</h1>

          <p>
            Showcasing our innovative work in software development and
            technology solutions.
          </p>
        </div>
      </section>

      {/* Filter */}

      <section className="project-filter">
        <div className="container">
          <div className="filter-buttons">
            <button className="active">All</button>
            <button>Embedded</button>
            <button>Software</button>
            <button>Hardware</button>
          </div>
        </div>
      </section>

      {/* Projects */}

      <section className="projects-section section">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div className="project-card" key={index}>
                <div className="project-icon">{project.icon}</div>

                <span className="project-category">{project.category}</span>

                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <div className="tech-stack">
                  {project.technologies.map((tech, i) => (
                    <span key={i}>{tech}</span>
                  ))}
                </div>

                <div className="project-footer">
                  <span
                    className={`status ${
                      project.status === "Completed" ? "completed" : "ongoing"
                    }`}
                  >
                    {project.status}
                  </span>

                  <small>{project.date}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Projects;
