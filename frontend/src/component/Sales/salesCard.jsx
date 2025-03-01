import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import "./css/saleCard.css";

function SaleCard({ sale, onEdit, onDelete }) {
  return (
    <div className="sale-card">
      <p className="product-name">
        <strong>Product:</strong>{" "}
        {sale.product_id == null ? "tom" : sale.product_id.name}
      </p>
      <p className="customer-name">
        <strong>Customer:</strong>{" "}
        {sale.customer_id == null ? "cus" : sale.customer_id.name}
      </p>
      <p>
        <strong>Quantity Sold:</strong> {sale.quantity_sold}
      </p>
      <p className="amount">
        <strong>Unit Price:</strong> ₹{sale.unit_price.toLocaleString()}
      </p>
      <p className="discount">
        <strong>Discount:</strong> {sale.discount_percent}%
      </p>
      <p className="amount">
        <strong>Discount Amount:</strong> ₹
        {sale.discount_amount.toLocaleString()}
      </p>
      <p className="tax">
        <strong>Tax:</strong> {sale.tax_percent}%
      </p>
      <p className="amount">
        <strong>Tax Amount:</strong> ₹{sale.tax_amount.toLocaleString()}
      </p>
      <p className="amount">
        <strong>Total Amount:</strong> ₹{sale.total_amount.toLocaleString()}
      </p>
      <p className="amount">
        <strong>Final Amount:</strong> ₹{sale.final_amount.toLocaleString()}
      </p>
      <p>
        <strong>Sale Date:</strong>{" "}
        {format(new Date(sale.sale_date), "dd MMM yyyy")}
      </p>
      <div className="button-container">
        <button className="edit-button" onClick={() => onEdit(sale._id)}>
          Edit
        </button>
        <button className="delete-button" onClick={() => onDelete(sale._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

SaleCard.propTypes = {
  sale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    product_id: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    customer_id: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    quantity_sold: PropTypes.number.isRequired,
    unit_price: PropTypes.number.isRequired,
    discount_percent: PropTypes.number.isRequired,
    discount_amount: PropTypes.number.isRequired,
    tax_percent: PropTypes.number.isRequired,
    tax_amount: PropTypes.number.isRequired,
    total_amount: PropTypes.number.isRequired,
    final_amount: PropTypes.number.isRequired,
    sale_date: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SaleCard;
