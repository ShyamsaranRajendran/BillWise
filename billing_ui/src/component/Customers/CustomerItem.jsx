import React from "react";
import { FaPhone, FaFacebookF, FaInstagram } from "react-icons/fa";

const CustomerItem = ({ customer, onClick }) => {
  const {
    image,
    name,
    accountStatus,
    lastLoginDate
  } = customer;
 const { phone, facebook, instagram } = [
   9842313467,
   "http:localhost:5000",
   "http:localhost:5000",
 ];

  return (
    <div className="customer-item" onClick={onClick}>
      <div className="top">
        <div className="profile-box">
          {/* <img src={require(`../../assets/${image}`)} alt="Profile" /> */}
          <img src={require(`../../assets/logo.png`)} alt="Profile" />
        </div>
        <div className="show-info">
          <div className="left-side">
            <h3>{name}</h3>
            <p>
              {accountStatus} | {new Date(lastLoginDate).toLocaleDateString()}
            </p>
          </div>
          <div className="right-side">
            <div className="social-links">
              <a
                href={`tel:${phone}`}
                className="social-link"
                aria-label="Call"
              >
                <FaPhone />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerItem;
