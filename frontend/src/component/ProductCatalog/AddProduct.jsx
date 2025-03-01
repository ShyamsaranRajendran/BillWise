import React, { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./css/AddProductForm.css";
const AddProductForm = () => {

  const navigate = useNavigate();
   const formRef = useRef(null);

useEffect(() => {
  // Scroll to the form when the component loads
  formRef.current?.scrollIntoView({ behavior: "smooth" });
}, []);

  const [product, setProduct] = useState({
    product_id: "",
    name: "",
    category: "",
    sub_category: "",
    brand: "",
    SKU: "",
    price: 0,
    discount: 0,
    quantity_available: 0,
    tax_rate: 0,
    supplier: "",
    supplier_contact: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Product added successfully!");
        // Clear the form
        setProduct({
          product_id: "",
          name: "",
          category: "",
          sub_category: "",
          brand: "",
          SKU: "",
          price: 0,
          discount: 0,
          quantity_available: 0,
          tax_rate: 0,
          supplier: "",
          supplier_contact: "",
        });
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div className="product-form-container" ref={formRef}>
      <h2>Add Product</h2>{" "}
      <button className="close-button" onClick={() => navigate(-1)}>
        <FaTimes />
      </button>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="left-half">
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              className="add-product-input"
              value={product.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              className="add-product-input"
              type="text"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Sub Category:</label>
            <input
              className="add-product-input"
              type="text"
              name="sub_category"
              value={product.sub_category}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Brand:</label>
            <input
              type="text"
              name="brand"
              className="add-product-input"
              value={product.brand}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>SKU:</label>
            <input
              className="add-product-input"
              type="text"
              name="SKU"
              value={product.SKU}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              className="add-product-input"
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="right-half">
          <div>
            <label>Discount (%):</label>
            <input
              className="add-product-input"
              type="number"
              name="discount"
              value={product.discount}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Quantity Available:</label>
            <input
              className="add-product-input"
              type="number"
              name="quantity_available"
              value={product.quantity_available}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Tax Rate (%):</label>
            <input
              className="add-product-input"
              type="number"
              name="tax_rate"
              value={product.tax_rate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Supplier:</label>
            <input
              className="add-product-input"
              type="text"
              name="supplier"
              value={product.supplier}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Supplier Contact:</label>
            <input
              className="add-product-input"
              type="text"
              name="supplier_contact"
              value={product.supplier_contact}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Add Product</button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
