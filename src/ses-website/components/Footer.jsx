import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "../asset/css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row gy-4">
          {/* Company */}
          <div className="col-lg-4 col-md-6">
            <h3 className="footer-logo">Soft Electronic Solutions</h3>

            <p>
              Delivering innovative software solutions, web applications,
              enterprise systems, and digital transformation services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5>Quick Links</h5>

            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6">
            <h5>Services</h5>

            <ul className="footer-links">
              <li>Web Development</li>
              <li>Mobile Apps</li>
              <li>ERP Solutions</li>
              <li>UI/UX Design</li>
              <li>Cloud Solutions</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h5>Contact</h5>

            <p>
              <FaMapMarkerAlt /> Anantapur, Andhra Pradesh
            </p>

            <p>
              <FaPhone /> +91 XXXXX XXXXX
            </p>

            <p>
              <FaEnvelope /> info@ses.com
            </p>

            <div className="social-icons">
              <a href="/">
                <FaFacebook />
              </a>

              <a href="/">
                <FaLinkedin />
              </a>

              <a href="/">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <hr />

        <div className="footer-bottom">
          © {new Date().getFullYear()} Soft Electronic Solutions. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
