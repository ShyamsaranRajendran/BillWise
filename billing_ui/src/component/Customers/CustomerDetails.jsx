import React, { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Link } from "react-router-dom"; 
import "./css/Customerstyles.css";
import "./css/customerdetails.css";
import MapComponent from "./MapComponent";
import { FaEdit } from "react-icons/fa";

const CustomerDetails = ({ customer }) => {
  const [activeTab, setActiveTab] = useState("sales");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="CustomerDetails">
      <div className="profile-first-half">
        <div className="profile-pic">
          <div className="profile-img">
            {customer.image ? (
              <img
                // src={require(`../../assets/${customer.image}`)}
                src={require(`../../assets/logo.png`)}
                alt="Profile"
              />
            ) : (
              <AiOutlineUserAdd size={80} />
            )}
          </div>
          <div className="profile-name">{customer.name}</div>
        </div>
        <div className="status">
          <p>{customer.accountStatus} | </p>
          <p>{customer.lastLoginDate}</p>
        </div>
        <div className="cus-type">Customer Type: {customer.customerType}</div>
        <div className="profile-about">
          <p>{customer.contactInfo.email} | </p>
          <p>{customer.contactInfo.phone}</p>
        </div>
      </div>

      {/* Edit Button on the top-right corner */}
      <div className="edit-button-container">
        <Link
          to={`/Dashboard/customers/edit-customer/${customer.userId}`}
          className="edit-button"
        >
          <FaEdit />
        </Link>
      </div>

      <div className="location-box">
        <MapComponent position={customer.location} />
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
          <div className="sales-1">
            <div className="content-frame-g">
              <div className="circle-frame">
                <div>{customer.salesMetrics.totalSalesCount}</div>
              </div>
              <p>
                Total Sales <br /> Count
              </p>
            </div>

            <div className="content-frame-y">
              <div className="circle-frame">
                <div>${customer.salesMetrics.totalAmountPurchased}</div>
              </div>
              <p>
                Total Amount <br /> Purchased
              </p>
            </div>

            <div className="content-frame-r">
              <div className="circle-frame">
                <div>${customer.salesMetrics.averagePurchaseValue}</div>
              </div>
              <p>
                Average Purchase <br /> Value
              </p>
            </div>
          </div>
          <p>Last Purchase Date: {customer.salesMetrics.lastPurchaseDate}</p>
          <p>
            Frequent Products/Services:{" "}
            {customer.salesMetrics.frequentProducts.join(", ")}
          </p>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="sales">
          <h3>Billing Information</h3>
          <p>
            Total Outstanding Amount: $
            {customer.billingInfo.totalOutstandingAmount}
          </p>
          <p>Billing Cycle: {customer.billingInfo.billingCycle}</p>
          <h4>Recent Invoices</h4>
          <ul>
            {customer.billingInfo.recentInvoices.map((invoice) => (
              <li key={invoice.invoiceId}>
                Invoice ID: {invoice.invoiceId}, Date: {invoice.date}, Amount: $
                {invoice.amount}, Status: {invoice.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="sales">
          <h3>Payment Information</h3>
          <p>
            Preferred Payment Method:{" "}
            {customer.paymentInfo.preferredPaymentMethod}
          </p>
          <h4>Recent Payments</h4>
          <ul>
            {customer.paymentInfo.recentPayments.map((payment) => (
              <li key={payment.paymentId}>
                Payment ID: {payment.paymentId}, Date: {payment.date}, Amount: $
                {payment.amount}, Status: {payment.status}
              </li>
            ))}
          </ul>
          <h4>Recent Discounts</h4>
          <ul>
            {customer.discounts.recentDiscounts.map((discount) => (
              <li key={discount.discountId}>
                Discount ID: {discount.discountId}, Type: {discount.type},
                Amount: ${discount.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
