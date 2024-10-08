import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import SpLoader from "./utils/SpLoader"; // Adjust the path as per your project structure

const Landing = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  const navigate = useNavigate();

  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = () => {
    setShowLoader(true); 
    setButtonVisible(false); 
    setTimeout(() => {
      setShowLoader(false);
      navigate("/user"); 
    }, 3000);
  };

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  return (
    <div className={`landing-container ${showLoader ? "blur" : ""}`}>
      <div className="header-land">
        <p>NEIL</p>
        <button className="btn-analyze">Ventures</button>
      </div>
      <div className="body-land">
        <div className="land-bar">
          <div className="land-bar-1">
            <div className="logo">NEIL</div>
            <hr />
            <div>en</div>
          </div>
          <ul className="land-bar-2">
            {["About", "Blog", "Tools", "Services", "Contact"].map(
              (item, index) => (
                <li
                  key={index}
                  className={activeItem === index ? "active" : ""}
                  onClick={() => handleItemClick(index)}
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
        <div className="dash">
          <div className="higher-text">Do you want more sales?</div>
          <div className="secondary-text">
            ZEIL Invoice offers a hassle-free billing solution for your <br />
            business. From managing invoices to sending payment reminders and{" "}
            <br />
            getting paid online, ZEIL Invoice supports all the features required
            <br />
            to manage your billing processes.
          </div>
          <div className="start">
            {buttonVisible && (
              <button onClick={handleButtonClick}>Start</button>
            )}
            {showLoader && <SpLoader onComplete={handleLoadingComplete} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
