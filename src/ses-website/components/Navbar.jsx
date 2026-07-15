import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaLaptopCode,
  FaProjectDiagram,
  FaBriefcase,
  FaEnvelope,
  FaUserShield,
} from "react-icons/fa";

import logo from "../asset/ses_logo.png";
import "../asset/css/navbar.css";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const closeSidebar = () => setSidebar(false);

  return (
    <>
      <nav className="navbar sticky-top">
        <div className="container navbar-container">
          {/* Logo */}
          <NavLink className="logo" to="/">
            <img src={logo} alt="SES Logo" />

            <h3>
              <span>Soft</span> Electronic <span>Solutions</span>
            </h3>
          </NavLink>

          {/* Desktop Menu */}

          <ul className="desktop-menu">
            <li>
              <NavLink to="/">
                <FaHome /> Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/about">
                <FaInfoCircle /> About
              </NavLink>
            </li>

            <li>
              <NavLink to="/services">
                <FaLaptopCode /> Services
              </NavLink>
            </li>

            <li>
              <NavLink to="/projects">
                <FaProjectDiagram /> Projects
              </NavLink>
            </li>

            <li>
              <NavLink to="/careers">
                <FaBriefcase /> Careers
              </NavLink>
            </li>

            <li>
              <NavLink to="/contact">
                <FaEnvelope /> Contact
              </NavLink>
            </li>

            <li>
              <NavLink className="login-btn" to="/login">
                <FaUserShield /> Admin Login
              </NavLink>
            </li>
          </ul>

          {/* Mobile */}

          <button className="menu-btn" onClick={() => setSidebar(true)}>
            <FaBars />
          </button>
        </div>
      </nav>

      {sidebar && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}

      <aside className={`sidebar ${sidebar ? "active" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src={logo} alt="SES Logo" />

            <div>
              <h4>Soft Electronic</h4>

              <p>Solutions</p>
            </div>
          </div>

          <button className="close-btn" onClick={closeSidebar}>
            <FaTimes className="close-icon" />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li>
            <NavLink to="/" onClick={closeSidebar}>
              <FaHome className="icon" />
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/about" onClick={closeSidebar}>
              <FaInfoCircle className="icon" />
              About
            </NavLink>
          </li>

          <li>
            <NavLink to="/services" onClick={closeSidebar}>
              <FaLaptopCode className="icon" />
              Services
            </NavLink>
          </li>

          <li>
            <NavLink to="/projects" onClick={closeSidebar}>
              <FaProjectDiagram className="icon" />
              Projects
            </NavLink>
          </li>

          <li>
            <NavLink to="/careers" onClick={closeSidebar}>
              <FaBriefcase className="icon" />
              Careers
            </NavLink>
          </li>

          <li>
            <NavLink to="/contact" onClick={closeSidebar}>
              <FaEnvelope className="icon" />
              Contact
            </NavLink>
          </li>

          <li className="login-item">
            <NavLink to="/login" onClick={closeSidebar}>
              <FaUserShield className="icon" />
              Admin Login
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Navbar;
