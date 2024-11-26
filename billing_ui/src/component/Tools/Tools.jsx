import React from "react";
import "./Tools.css"; // Import the CSS file

const Tools = () => {
  return (
    <div className="tools-container">
      <header className="tools-header">
        <h1>Our Tools</h1>
        <p>Explore the tools we offer to boost your productivity!</p>
      </header>
      <div className="tools-content">
        <div className="tool-item">
          <h2 className="tool-title">Invoice Generator</h2>
          <p className="tool-description">
            Generate professional invoices for your business in just a few
            clicks. Customize, download, and send invoices effortlessly.
          </p>
          <button className="tool-button">Try Now</button>
        </div>

        <div className="tool-item">
          <h2 className="tool-title">Payment Reminder</h2>
          <p className="tool-description">
            Never forget a payment again! Automate your payment reminders to
            ensure timely payments from your clients.
          </p>
          <button className="tool-button">Try Now</button>
        </div>

        <div className="tool-item">
          <h2 className="tool-title">Expense Tracker</h2>
          <p className="tool-description">
            Keep track of your business expenses with our easy-to-use tool.
            Analyze your spending and optimize your budget.
          </p>
          <button className="tool-button">Try Now</button>
        </div>
      </div>
    </div>
  );
};

export default Tools;
