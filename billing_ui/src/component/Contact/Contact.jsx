import React, { useState } from "react";
import "./Contact.css"; // Importing unique CSS for Contact Page

const ContactPage = () => {
  const [contactFormData, setContactFormData] = useState({
    userName: "",
    userEmail: "",
    userMessage: "",
  });

  const handleInputChange = (e) => {
    setContactFormData({ ...contactFormData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send data to the backend)
    alert("Your message has been sent!");
  };

  return (
    <div className="contact-page-container">
      <div className="contact-page-header">
        <p>Get in Touch with Us</p>
      </div>

      <div className="contact-form-container">
        <form onSubmit={handleFormSubmit}>
          <div className="contact-form-group">
            <label htmlFor="userName">Full Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={contactFormData.userName}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="contact-form-group">
            <label htmlFor="userEmail">Email Address</label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={contactFormData.userEmail}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="contact-form-group">
            <label htmlFor="userMessage">Message</label>
            <textarea
              id="userMessage"
              name="userMessage"
              value={contactFormData.userMessage}
              onChange={handleInputChange}
              required
              placeholder="Write your message"
            ></textarea>
          </div>

          <div className="contact-form-group">
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
