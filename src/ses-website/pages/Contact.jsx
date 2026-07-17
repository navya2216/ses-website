import React, { useState } from "react";
import api from "../api";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

import "../asset/css/contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!form.name || !form.email || !form.message) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/contact", form);

      if (res.data.success) {
        setSuccess(res.data.message);

        setForm({
          name: "",
          email: "",
          company: "",
          phone: "",
          message: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };
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

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-grid">
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <textarea
                  name="message"
                  rows="6"
                  placeholder="Message *"
                  value={form.message}
                  onChange={handleChange}
                ></textarea>

                {success && <div className="success-message">{success}</div>}
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={loading}>
                  <FaPaperPlane />
                  {loading ? "Sending..." : "Send Message"}
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
