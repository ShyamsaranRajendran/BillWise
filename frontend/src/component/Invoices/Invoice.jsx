import React, { useState } from "react";
import { Plus, Search, Filter, Eye, Download, Send, Trash2 } from "lucide-react";
import "./InvoicesTab.css"; // Importing the CSS file
import InvoiceForm from "./InvoiceForm";


const invoices = [
  {
    id: "INV-001",
    customer: "John Doe",
    amount: 1500.0,
    status: "Paid",
    date: "2024-03-15",
    dueDate: "2024-04-15",
  },
  {
    id: "INV-002",
    customer: "Jane Smith",
    amount: 2300.0,
    status: "Pending",
    date: "2024-03-10",
    dueDate: "2024-04-10",
  },
  {
    id: "INV-003",
    customer: "Bob Johnson",
    amount: 3400.0,
    status: "Overdue",
    date: "2024-02-28",
    dueDate: "2024-03-28",
  },
];

export default function InvoicesTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  
    const filteredInvoices = invoices.filter((invoice) => {
      const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) || invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  
    return (
      <div className="invoices-container ">
        {showCreateInvoice && <InvoiceForm />}
        <div className="invoices-header">
          <h1 className="invoices-title">Invoices</h1>
          <button 
  onClick={() => setShowCreateInvoice((prev) => !prev)} 
  className="create-btn"
>
  {showCreateInvoice ? "Close Form" : "Create Invoice"}
</button>

        </div>
  
        <div className="invoices-filters">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div className="status-filter ">
            <Filter size={20} className="filter-icon " />
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="status-dropdown border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
  
        <div className="invoices-table-container">
          <div className="table-wrapper">
            <table className="invoices-table">
              <thead className="table-header">
                <tr>
                  <th className="table-heading">Invoice</th>
                  <th className="table-heading">Customer</th>
                  <th className="table-heading">Amount</th>
                  <th className="table-heading">Status</th>
                  <th className="table-heading">Date</th>
                  <th className="table-heading">Due Date</th>
                  <th className="table-heading">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="invoice-row">
                    <td className="invoice-data">{invoice.id}</td>
                    <td className="invoice-data">{invoice.customer}</td>
                    <td className="invoice-data">${invoice.amount.toLocaleString()}</td>
                    <td className={`invoice-status ${
                      invoice.status === "Paid" ? "" : invoice.status === "Pending" ? "" : ""
                    }`}>{invoice.status}</td>
                    <td className="invoice-date">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="invoice-due-date">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="invoice-actions">
                      <div className="actions-group">
                        <button className="action-btn"><Eye size={18} /></button>
                        <button className="action-btn"><Download size={18} /></button>
                        <button className="action-btn"><Send size={18} /></button>
                        <button className="action-btn"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  
