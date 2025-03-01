import React from "react";
import "./Services.css";

const Services = () => {
  return (
    <div className="services-container">
      {/* Header Section */}
      <header className="services-header">
        <h1>Our Services</h1>
        <p>Explore the services we offer to help you achieve your goals</p>
      </header>

      {/* Services List Section */}
      <section className="services-list">
        <div className="service-card">
          <div className="service-icon">📱</div>
          <h3>Mobile App Development</h3>
          <p>
            We build cross-platform mobile apps with a focus on performance and
            user experience.
          </p>
        </div>

        <div className="service-card">
          <div className="service-icon">🌐</div>
          <h3>Web Development</h3>
          <p>
            Responsive and dynamic websites built to scale your business with
            ease.
          </p>
        </div>

        <div className="service-card">
          <div className="service-icon">⚙️</div>
          <h3>Software Solutions</h3>
          <p>
            Custom software to streamline your operations and solve your
            business challenges.
          </p>
        </div>

        <div className="service-card">
          <div className="service-icon">💻</div>
          <h3>IT Consulting</h3>
          <p>
            Expert guidance to help you navigate your technology needs and scale
            with success.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="services-footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Services;
