import React from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

import "../asset/css/contact.css";

function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Get In Touch</h1>

          <p>
            Ready to start your project? Contact us today for a free
            consultation.
          </p>
        </div>
      </section>

      <section className="contact-section section">
        <div className="container">
          <div className="contact-wrapper">
            {/* Left */}

            <div className="contact-info">
              <h2>Contact Information</h2>

              <div className="info-card">
                <FaEnvelope />
                <div>
                  <h4>Email</h4>
                  <p>softelectronicsolutions@gmail.com</p>
                </div>
              </div>

              <div className="info-card">
                <FaMapMarkerAlt />
                <div>
                  <h4>Address</h4>
                  <p>
                    13-6/33, Gayathri Hills Road Number
                    2,Badangpet,Hyderbad-500058
                  </p>
                </div>
              </div>

              <div className="info-card">
                <FaClock />
                <div>
                  <h4>Business Hours</h4>
                  <p>Mon - Fri : 10 AM - 7 PM</p>
                  <p>Saturday : 10 AM - 4 PM</p>
                  <p>Sunday : Closed</p>
                </div>
              </div>
            </div>

            {/* Right */}

            <div className="contact-form-box">
              <h2>Send Message</h2>

              <form>
                <div className="form-grid">
                  <input type="text" placeholder="Full Name *" />

                  <input type="email" placeholder="Email Address *" />
                </div>

                <div className="form-grid">
                  <input type="text" placeholder="Company" />

                  <input type="text" placeholder="Phone Number" />
                </div>

                <textarea rows="6" placeholder="Message *"></textarea>

                <button type="submit">
                  <FaPaperPlane />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
