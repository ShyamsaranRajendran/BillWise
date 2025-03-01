import React, { useState } from "react";
import "./WebTabs.css";

function WebTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: "Home", content: "Welcome to the Home tab!" },
    { name: "About", content: "This is the About tab." },
    { name: "Services", content: "Explore our Services tab." },
    { name: "Contact", content: "Feel free to reach out on the Contact tab." },
  ];

  return (
    <div className="web-tabs-container">
      <div className="tabs">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab-item ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div className="tab-content">
        <p>{tabs[activeTab].content}</p>
      </div>
    </div>
  );
}

export default WebTabs;
