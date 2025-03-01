import React, { useState } from "react";
import { Search, Filter, Eye, Download, CreditCard, CheckCircle, XCircle } from "lucide-react";
import "./css/payment.css"; // Import the CSS file

const payments = [
  { id: "PAY-001", date: "2024-03-15", customer: "John Doe", amount: 1500.0, method: "Credit Card", status: "Completed", invoice: "INV-001" },
  { id: "PAY-002", date: "2024-03-14", customer: "Jane Smith", amount: 2300.0, method: "PayPal", status: "Pending", invoice: "INV-002" },
  { id: "PAY-003", date: "2024-03-13", customer: "Bob Johnson", amount: 3400.0, method: "Bank Transfer", status: "Failed", invoice: "INV-003" }
];

export default function PaymentsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.invoice.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = selectedMethod === "all" || payment.method === selectedMethod;
    const matchesStatus = selectedStatus === "all" || payment.status === selectedStatus;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getStatusIcon = status => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={18} className="icon icon-green" />;
      case "Pending":
        return <CreditCard size={18} className="icon icon-yellow" />;
      case "Failed":
        return <XCircle size={18} className="icon icon-red" />;
      default:
        return null;
    }
  };

  return (
    <div className="payments-container">
      {/* Header */}
      <div className="header">
        <h1 className="title">Payments</h1>
        <button className="export-button">
          <Download size={20} />
          Export Payments
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-options">
          <Filter size={20} className="filter-icon" />
          <select value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)} className="filter-dropdown">
            <option value="all">All Methods</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="filter-dropdown">
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Invoice</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{new Date(payment.date).toLocaleDateString()}</td>
                <td>{payment.customer}</td>
                <td>${payment.amount.toLocaleString()}</td>
                <td>{payment.method}</td>
                <td>
                  <div className="status">
                    {getStatusIcon(payment.status)}
                    <span className={`status-text ${payment.status.toLowerCase()}`}>{payment.status}</span>
                  </div>
                </td>
                <td>{payment.invoice}</td>
                <td>
                  <button className="view-button">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
