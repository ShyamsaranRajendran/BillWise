// components/ProductCard.js
import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./css/ProductCard.css";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="card-content">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-details">
          <p>
            <span>Category:</span> {product.category}
          </p>
          <p>
            <span>Sub-Category:</span> {product.sub_category}
          </p>
          <p>
            <span>Brand:</span> {product.brand}
          </p>
          <p>
            <span>SKU:</span> {product.SKU}
          </p>
          <p>
            <span>Price:</span> ₹{product.price}
          </p>
          <p>
            <span>Discount:</span> {product.discount}%
          </p>
          <p>
            <span>Quantity Available:</span> {product.quantity_available}
          </p>
          <p>
            <span>Tax Rate:</span> {product.tax_rate}%
          </p>
          <p>
            <span>Supplier:</span> {product.supplier}
          </p>
          <p>
            <span>Supplier Contact:</span> {product.supplier_contact}
          </p>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/Dashboard/product-catalog/edit-product/${product._id}`}>
          <FaEdit className="edit-icon" />
        </Link>
        <Link to={`/Dashboard/product-catalog/delete-product/${product._id}`}>
          <FaTrashAlt className="delete-icon" />
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
