import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../asset/css/sidebar.css";

function Sidebar() {
  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <button className="menu-btn" onClick={() => setSidebar(true)}>
            <FaBars />
          </button>
        </div>
      </nav>

      <div className={`sidebar ${sidebar ? "active" : ""}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={() => setSidebar(false)}>
            <FaTimes />
          </button>
        </div>

        <ul>
          <li>
            <a href="/">Home</a>
          </li>

          <li>
            <a href="/about">About</a>
          </li>

          <li>
            <a href="/services">Services</a>
          </li>

          <li>
            <a href="/projects">Projects</a>
          </li>

          <li>
            <a href="/careers">Careers</a>
          </li>

          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>

      {sidebar && (
        <div className="overlay" onClick={() => setSidebar(false)}></div>
      )}
    </>
  );
}

export default Sidebar;
