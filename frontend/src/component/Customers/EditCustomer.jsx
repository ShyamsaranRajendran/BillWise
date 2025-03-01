import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "./css/newcustomer.css";

const EditCustomer = () => {
  const { id } = useParams(); // Extract the dynamic ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contactInfo: {
      email: "",
      phone: "",
      facebook: "",
      instagram: "",
      location: "",
    },
    accountStatus: "",
  });

  useEffect(() => {
    // Fetch existing customer data using the ID
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`/api/customers/${id}`);
        setFormData(response.data); // Populate form with fetched data
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomerData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use PUT to update existing customer data
      const response = await axios.put(
        `http://localhost:5000/api/customers/${id}`,
        formData
      );
      console.log("Customer data updated:", response.data);
      navigate("/customers"); // Redirect to the customers list after update
    } catch (error) {
      console.error("Error updating customer data:", error);
    }
  };

  return (
    <div className="customer-form-container">
      <button className="close-button" onClick={() => navigate(-1)}>
        <FaTimes />
      </button>

      <h2 className="form-title">Edit Customer</h2>
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

export default EditCustomer;
