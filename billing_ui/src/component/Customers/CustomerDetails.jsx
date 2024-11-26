import React, { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./css/Customerstyles.css";
import "./css/customerdetails.css";
import MapComponent from "./MapComponent";
import { FaEdit, FaTrash } from "react-icons/fa";

const CustomerDetails = ({ customer = {}, onCustomerDeleted }) => {
  const [activeTab, setActiveTab] = useState("sales");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the customer "${
        customer.name || "N/A"
      }"?`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authorization");
      if (!token) {
        throw new Error("No authorization token found");
      }

      const response = await fetch(
        `http://localhost:5000/cus/customer/delete/${customer._id || ""}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete customer: ${response.status}`);
      }

      alert("Customer deleted successfully.");
      if (onCustomerDeleted) {
        onCustomerDeleted(customer._id); // Inform parent component of deletion
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete the customer. Please try again.");
    }
  };

  return (
    <div className="CustomerDetails">
      <div className="profile-first-half">
        <div className="profile-pic">
          <div className="profile-img">
            {customer.image ? (
              <img src={require(`../../assets/logo.png`)} alt="Profile" />
            ) : (
              <AiOutlineUserAdd size={80} />
            )}
          </div>
          <div className="profile-name">{customer.name || "Unknown Name"}</div>
        </div>
        <div className="status">
          <p>{customer.accountStatus || "Status Unknown"} | </p>
          <p>{customer.lastLoginDate || "N/A"}</p>
        </div>
        <div className="cus-type">
          Customer Type: {customer.customerType || "Not Specified"}
        </div>
        <div className="profile-about">
          <p>{customer.contactInfo?.email || "No Email"} | </p>
          <p>{customer.contactInfo?.phone || "No Phone Number"}</p>
        </div>
      </div>

      {/* Edit and Delete Buttons */}
      <div className="edit-button-container">
        <Link
          to={`/Dashboard/customers/edit-customer/${customer.userId || ""}`}
          className="edit-button"
        >
          <FaEdit />
        </Link>
        <button onClick={handleDelete} className="delete-button">
          <FaTrash />
        </button>
      </div>

      <div className="location-box">
        <MapComponent position={customer.location || { lat: 0, lng: 0 }} />
      </div>
      <div className="profile-desc-buttons">
        <button
          className={`btn-profile ${activeTab === "sales" ? "active" : ""}`}
          onClick={() => handleTabClick("sales")}
        >
          Sales and Purchase Metrics
        </button>
        <button
          className={`btn-profile ${activeTab === "billing" ? "active" : ""}`}
          onClick={() => handleTabClick("billing")}
        >
          Billing Information
        </button>
        <button
          className={`btn-profile ${activeTab === "payment" ? "active" : ""}`}
          onClick={() => handleTabClick("payment")}
        >
          Payment Information
        </button>
      </div>

      <div className="line"></div>

      {activeTab === "sales" && (
        <div className="sales">
          {/* Sales Metrics */}
          <div className="sales-1">
            <div className="content-frame-g">
              <div className="circle-frame">
                <div>{customer.salesMetrics?.totalSalesCount || 0}</div>
              </div>
              <p>Total Sales Count</p>
            </div>
            <div className="content-frame-y">
              <div className="circle-frame">
                <div>${customer.salesMetrics?.totalAmountPurchased || 0}</div>
              </div>
              <p>Total Amount Purchased</p>
            </div>
            <div className="content-frame-r">
              <div className="circle-frame">
                <div>
                  ${customer.salesMetrics?.averagePurchaseValue || "0.00"}
                </div>
              </div>
              <p>Average Purchase Value</p>
            </div>
          </div>
          <p>
            Last Purchase Date:{" "}
            {customer.salesMetrics?.lastPurchaseDate || "N/A"}
          </p>
          <p>
            Frequent Products/Services:{" "}
            {customer.salesMetrics?.frequentProducts?.join(", ") || "None"}
          </p>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="sales">
          {/* Billing Information */}
          <h3>Billing Information</h3>
          <p>
            Total Outstanding Amount: $
            {customer.billingInfo?.totalOutstandingAmount || 0}
          </p>
          <p>
            Billing Cycle: {customer.billingInfo?.billingCycle || "Unknown"}
          </p>
          <h4>Recent Invoices</h4>
          <ul>
            {customer.billingInfo?.recentInvoices?.length > 0
              ? customer.billingInfo.recentInvoices.map((invoice) => (
                  <li key={invoice.invoiceId}>
                    Invoice ID: {invoice.invoiceId || "N/A"}, Date:{" "}
                    {invoice.date || "N/A"}, Amount: ${invoice.amount || 0},
                    Status: {invoice.status || "Unknown"}
                  </li>
                ))
              : "No Invoices Available"}
          </ul>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="sales">
          {/* Payment Information */}
          <h3>Payment Information</h3>
          <p>
            Preferred Payment Method:{" "}
            {customer.paymentInfo?.preferredPaymentMethod || "Not Specified"}
          </p>
          <h4>Recent Payments</h4>
          <ul>
            {customer.paymentInfo?.recentPayments?.length > 0
              ? customer.paymentInfo.recentPayments.map((payment) => (
                  <li key={payment.paymentId}>
                    Payment ID: {payment.paymentId || "N/A"}, Date:{" "}
                    {payment.date || "N/A"}, Amount: ${payment.amount || 0},
                    Status: {payment.status || "Unknown"}
                  </li>
                ))
              : "No Payments Available"}
          </ul>
          <h4>Recent Discounts</h4>
          <ul>
            {customer.discounts?.recentDiscounts?.length > 0
              ? customer.discounts.recentDiscounts.map((discount) => (
                  <li key={discount.discountId}>
                    Discount ID: {discount.discountId || "N/A"}, Type:{" "}
                    {discount.type || "Unknown"}, Amount: $
                    {discount.amount || 0}
                  </li>
                ))
              : "No Discounts Available"}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
