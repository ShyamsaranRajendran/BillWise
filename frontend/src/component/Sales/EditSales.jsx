// src/components/EditSalesForm.jsx

import React, { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./css/AddSalesForm.css"; // Create a corresponding CSS file
import { format } from "date-fns";

const EditSalesForm = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  // State to hold sales details
  const [sale, setSale] = useState({
    product_id: "",
    customer_id: "",
    quantity_sold: 1,
    unit_price: 0,
    discount_percent: 0,
    tax_percent: 0,
    sale_date: format(new Date(), "yyyy-MM-dd"), // Default to today's date
  });

  // State for computed fields
  const [computed, setComputed] = useState({
    total_amount: 0,
    discount_amount: 0,
    tax_amount: 0,
    final_amount: 0,
  });

  // State for products and customers
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  // State for handling loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch products and customers on component mount

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authorization");
        if (!token) {
          throw new Error("No authorization token found");
        }

        // Fetch products and customers from a single endpoint
        const response = await fetch("http://localhost:5000/sales/data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products and customers");
        }

        const data = await response.json();
        setProducts(data.products || []);
        setCustomers(data.customers || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll to the form when the component loads
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Update computed fields whenever relevant sale details change
  useEffect(() => {
    const { quantity_sold, unit_price, discount_percent, tax_percent } = sale;
    const total_amount = quantity_sold * unit_price;
    const discount_amount = (total_amount * discount_percent) / 100;
    const taxable_amount = total_amount - discount_amount;
    const tax_amount = (taxable_amount * tax_percent) / 100;
    const final_amount = taxable_amount + tax_amount;

    setComputed({
      total_amount,
      discount_amount,
      tax_amount,
      final_amount,
    });
  }, [
    sale.quantity_sold,
    sale.unit_price,
    sale.discount_percent,
    sale.tax_percent,
  ]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If product is selected, update unit_price and tax_percent based on product data
    if (name === "product_id") {
      const selectedProduct = products.find((p) => p._id === value);
      if (selectedProduct) {
        setSale((prevSale) => ({
          ...prevSale,
          [name]: value,
          unit_price: selectedProduct.price,
          tax_percent: selectedProduct.tax_rate,
        }));
      }
    } else {
      setSale((prevSale) => ({
        ...prevSale,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authorization");
      if (!token) {
        throw new Error("No authorization token found");
      }

      const response = await fetch("http://localhost:5000/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          ...sale,
          total_amount: computed.total_amount,
          discount_amount: computed.discount_amount,
          tax_amount: computed.tax_amount,
          final_amount: computed.final_amount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Sale added successfully!");
        setError("");
        // Clear the form
        setSale({
          product_id: "",
          customer_id: "",
          quantity_sold: 1,
          unit_price: 0,
          discount_percent: 0,
          tax_percent: 0,
          sale_date: format(new Date(), "yyyy-MM-dd"),
        });
        setComputed({
          total_amount: 0,
          discount_amount: 0,
          tax_amount: 0,
          final_amount: 0,
        });
        // Optionally, navigate to another page
        // navigate("/some-route");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add sale");
      }
    } catch (err) {
      console.error("Error submitting the form:", err);
      setError(err.message);
      setSuccess("");
    }
  };

  if (loading) {
    return <div className="loading">Loading form data...</div>;
  }

  return (
    <div className="sales-form-container" ref={formRef}>
      <h2>Add Sale</h2>
      <button className="close-button" onClick={() => navigate(-1)}>
        <FaTimes />
      </button>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="add-sales-form">
        <div className="left-half">
          <div>
            <label>Product:</label>
            <select
              name="product_id"
              className="add-sales-input"
              value={sale.product_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Customer:</label>
            <select
              name="customer_id"
              className="add-sales-input"
              value={sale.customer_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Quantity Sold:</label>
            <input
              type="number"
              name="quantity_sold"
              className="add-sales-input"
              value={sale.quantity_sold}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          <div>
            <label>Unit Price (₹):</label>
            <input
              type="number"
              name="unit_price"
              className="add-sales-input"
              value={sale.unit_price}
              onChange={handleInputChange}
              min="0"
              required
              readOnly // This should be read-only, updated by product selection
            />
          </div>
          <div>
            <label>Discount (%):</label>
            <input
              type="number"
              name="discount_percent"
              className="add-sales-input"
              value={sale.discount_percent}
              onChange={handleInputChange}
              min="0"
              max="100"
            />
          </div>
          <div>
            <label>Tax Rate (%):</label>
            <input
              type="number"
              name="tax_percent"
              className="add-sales-input"
              value={sale.tax_percent}
              onChange={handleInputChange}
              min="0"
              max="100"
            />
          </div>
          <div>
            <label>Sale Date:</label>
            <input
              type="date"
              name="sale_date"
              className="add-sales-input"
              value={sale.sale_date}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="right-half">
          <h3>Summary</h3>
          <div>
            <p>Total Amount: ₹{computed.total_amount.toFixed(2)}</p>
            <p>Discount Amount: ₹{computed.discount_amount.toFixed(2)}</p>
            <p>Tax Amount: ₹{computed.tax_amount.toFixed(2)}</p>
            <p>Final Amount: ₹{computed.final_amount.toFixed(2)}</p>
          </div>
        </div>
        <button type="submit" className="submit-button">
          Add Sale
        </button>
      </form>
    </div>
  );
};

export default EditSalesForm;
