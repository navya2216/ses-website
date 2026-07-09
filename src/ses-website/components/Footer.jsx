import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import logo from "../asset/ses_logo.png";
import "../asset/css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          {/* Company Info */}

          <div className="col-lg-4 col-md-6">
            <div className="footer-about">
              <img src={logo} alt="SES Logo" className="footer-logo-img" />

              <p>
                Soft Electronic Solutions provides innovative software
                development, embedded systems, hardware solutions, and digital
                transformation services for businesses worldwide.
              </p>

              <div className="social-icons">
                <a href="/">
                  <FaFacebookF />
                </a>

                <a href="/">
                  <FaLinkedinIn />
                </a>

                <a href="/">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}

          <div className="col-lg-2 col-md-6">
            <h4>Quick Links</h4>

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
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}

          <div className="col-lg-3 col-md-6">
            <h4>Services</h4>

            <ul className="footer-links">
              <li>Web Development</li>
              <li>Mobile Applications</li>
              <li>ERP Solutions</li>
              <li>Embedded Systems</li>
              <li>Hardware Design</li>
              <li>Cloud Services</li>
            </ul>
          </div>

          {/* Contact */}

          <div className="col-lg-3 col-md-6">
            <h4>Contact Us</h4>

            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>
                13-6/33, Ground floor, Road number 2, Gayathri hills, Badangpet
              </span>
            </div>

            <div className="contact-item">
              <FaPhoneAlt />
              <span>+91 8415796558</span>
            </div>

            <div className="contact-item">
              <FaEnvelope />
              <span>softelectronicsolutions@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Soft Electronic Solutions. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
