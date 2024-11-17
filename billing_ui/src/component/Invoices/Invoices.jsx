import React, { useState, useEffect } from "react";
import "./Invoices.css";

export function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [invoices, setInvoices] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: "",
    customerName: "",
    total: "",
    status: "draft",
    createdAt: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authorization");
        if (!token) {
          throw new Error("No authorization token found");
        }

        const response = await fetch(
          `http://localhost:5000/invoices?search=${encodeURIComponent(
            searchQuery
          )}&status=${filterStatus}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && Array.isArray(data.invoices)) {
          setInvoices(data.invoices);
        } else {
          throw new Error("Fetched data does not contain invoices array");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [searchQuery, filterStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInvoice = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authorization");
      if (!token) {
        throw new Error("No authorization token found");
      }

      const response = await fetch("http://localhost:5000/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          invoiceNumber: newInvoice.invoiceNumber,
          customerName: newInvoice.customerName,
          total: parseFloat(newInvoice.total),
          status: newInvoice.status,
          createdAt: newInvoice.createdAt,
          dueDate: newInvoice.dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdInvoice = await response.json();
      setInvoices((prev) => [...prev, createdInvoice]);
      setIsFormVisible(false);
      setNewInvoice({
        invoiceNumber: "",
        customerName: "",
        total: "",
        status: "draft",
        createdAt: "",
        dueDate: "",
      });
    } catch (err) {
      console.error("Error adding invoice:", err);
      setError(err.message);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || invoice.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="invoices-container">
      {/* Header */}
      <div className="invoice-header">
        <div>
          <h1>Invoices</h1>
          <p>Manage your invoices and billing</p>
        </div>
        <button
          className="new-invoice-btn"
          onClick={() => setIsFormVisible((prev) => !prev)}
        >
          + New Invoice
        </button>
      </div>

      {/* New Invoice Form */}
      {isFormVisible && (
        <div className="new-invoice-form">
          <h2>Create New Invoice</h2>
          <form onSubmit={handleAddInvoice}>
            <input
              type="text"
              name="invoiceNumber"
              placeholder="Invoice Number"
              value={newInvoice.invoiceNumber}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={newInvoice.customerName}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="total"
              placeholder="Total Amount"
              value={newInvoice.total}
              onChange={handleInputChange}
              required
            />
            <select
              name="status"
              value={newInvoice.status}
              onChange={handleInputChange}
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <input
              type="date"
              name="createdAt"
              placeholder="Creation Date"
              value={newInvoice.createdAt}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="dueDate"
              placeholder="Due Date"
              value={newInvoice.dueDate}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="add-invoice-btn">
              Add Invoice
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading && <p>Loading invoices...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.customer.name}</td>
                  <td>${invoice.total.toFixed(2)}</td>
                  <td>{invoice.status}</td>
                  <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
