import React, { useState } from "react";
import axios from "axios";
import "./css/newcustomer.css";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CustomerForm = () => {
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  gender: "",
  address: "",
  coordinates: "",
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/cus/customer/add",
        formData
      );
      console.log("Customer data saved:", response.data);
      navigate("/dashboard/customers");
    } catch (error) {
      console.error("Error saving customer data:", error);
    }
  };

  return (
    <div className="customer-form-container">
      <button className="close-button" onClick={() => navigate(-1)}>
        <FaTimes />
      </button>

      <h2 className="form-title">Add New Customer</h2>
      <form onSubmit={handleSubmit} className="user-information-form">
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input name-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input email-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input phone-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <div className="gender-input-container">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                className="gender-input"
                onChange={handleChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                className="gender-input"
                onChange={handleChange}
              />
              Female
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            className="form-input address-input"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="coordinates">Coordinates:</label>
          <input
            type="text"
            id="coordinates"
            name="coordinates"
            className="form-input coordinates-input"
            value={formData.coordinates}
            onChange={handleChange}
            placeholder="e.g. 34.0522, -118.2437"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
