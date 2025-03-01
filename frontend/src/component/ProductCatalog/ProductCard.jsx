import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./css/ProductCard.css";
import { Link } from "react-router-dom";

function ProductCard({ product, onProductDeleted }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the product "${product.name}"?`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authorization");
      if (!token) {
        throw new Error("No authorization token found");
      }

      const response = await fetch(
        `http://localhost:5000/products/delete/${product.product_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }

      alert("Product deleted successfully.");
      if (onProductDeleted) {
        onProductDeleted(product.product_id); // Notify parent about deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  };

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
        <button onClick={handleDelete} className="delete-button">
          <FaTrashAlt className="delete-icon" />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
