import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../asset/ses_logo.png";

import "../asset/css/navbar.css";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      <nav className="navbar sticky-top">
        <div className="container navbar-container">
          {/* Logo */}
          <NavLink className="logo" to="/">
            <img src={logo} alt="SES Logo" />
          </NavLink>

          {/* Desktop Menu */}
          <ul className="desktop-menu">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/services">Services</NavLink>
            </li>
            <li>
              <NavLink to="/projects">Projects</NavLink>
            </li>
            <li>
              <NavLink to="/careers">Careers</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li>
              <NavLink className="login-btn" to="/login">
                Login
              </NavLink>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button className="menu-btn" onClick={() => setSidebar(true)}>
            <FaBars />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {sidebar && (
        <div className="overlay" onClick={() => setSidebar(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebar ? "active" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="SES Logo" />

          <button className="close-btn" onClick={() => setSidebar(false)}>
            <FaTimes className="close-icon" />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li>
            <NavLink to="/" onClick={() => setSidebar(false)}>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/about" onClick={() => setSidebar(false)}>
              About
            </NavLink>
          </li>

          <li>
            <NavLink to="/services" onClick={() => setSidebar(false)}>
              Services
            </NavLink>
          </li>

          <li>
            <NavLink to="/projects" onClick={() => setSidebar(false)}>
              Projects
            </NavLink>
          </li>

          <li>
            <NavLink to="/careers" onClick={() => setSidebar(false)}>
              Careers
            </NavLink>
          </li>

          <li>
            <NavLink to="/contact" onClick={() => setSidebar(false)}>
              Contact
            </NavLink>
          </li>

          <li>
            <NavLink
              className="sidebar-login"
              to="/login"
              onClick={() => setSidebar(false)}
            >
              Login
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
