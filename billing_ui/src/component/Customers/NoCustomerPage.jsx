import React from "react";
import NoCus from "../../assets/ghostNoCus.png";
const NoCustomer = () => {
  return (
    <div className="no-customer-container">
      <div className="no-customer-content">
        <img
          src={NoCus}
          alt="No Customer Selected"
          className="placeholder-image"
        />
        <p className="no-customer-text">No Customer Selected</p>
      </div>
    </div>
  );
};

export default NoCustomer;
