import React from "react";
import "./home.css";
import billingImage from "../../assets/billing.svg"; // Make sure you have an image in your project

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Customer Billing System</h1>
          <p>
            Manage all your invoices, track payments, and generate reports
            efficiently with our powerful billing system.
          </p>
        </div>
        <div className="hero-image">
          <img src={billingImage} alt="Customer Billing System" />
        </div>
      </div>
    </div>
  );
}

export default Home;
