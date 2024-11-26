import React, { useState, useEffect } from "react";
import { format } from "date-fns"; // To format dates
import { FileText, Download, BarChart2 } from "lucide-react"; // Icons
import './styles.css'
// Sample data for reports (could be fetched from an API)
const sampleReports = [
  {
    id: "1",
    date: new Date(),
    totalSales: 1200,
    totalOrders: 50,
    category: "Electronics",
  },
  {
    id: "2",
    date: new Date(),
    totalSales: 800,
    totalOrders: 30,
    category: "Clothing",
  },
  {
    id: "3",
    date: new Date(),
    totalSales: 1500,
    totalOrders: 70,
    category: "Home Appliances",
  },
  {
    id: "4",
    date: new Date(),
    totalSales: 600,
    totalOrders: 20,
    category: "Books",
  },
  {
    id: "5",
    date: new Date(),
    totalSales: 950,
    totalOrders: 40,
    category: "Toys",
  },
];

function Reports() {
  const [reports, setReports] = useState(sampleReports);
  const [filteredReports, setFilteredReports] = useState(sampleReports);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDateRange, setFilterDateRange] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    // Filter reports based on selected category and date range
    let filtered = reports;

    if (filterCategory) {
      filtered = filtered.filter(
        (report) => report.category === filterCategory
      );
    }

    if (filterDateRange.start && filterDateRange.end) {
      filtered = filtered.filter(
        (report) =>
          new Date(report.date) >= new Date(filterDateRange.start) &&
          new Date(report.date) <= new Date(filterDateRange.end)
      );
    }

    setFilteredReports(filtered);
  }, [filterCategory, filterDateRange, reports]);

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    setFilterDateRange({ ...filterDateRange, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilterCategory("");
    setFilterDateRange({ start: "", end: "" });
  };

  const downloadReport = () => {
    // Placeholder for report export logic (CSV/PDF download)
    alert("Report downloaded!");
  };

  return (
    <div className="reports-page">
      <div className="header">
        <h1>Reports</h1>
        <p>View detailed reports on sales, orders, and more.</p>
      </div>

      <div className="filter-bar">
        <div className="filter-options">
          <select
            value={filterCategory}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="">Filter by Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Books">Books</option>
            <option value="Toys">Toys</option>
          </select>
          <input
            type="date"
            name="start"
            value={filterDateRange.start}
            onChange={handleDateRangeChange}
            className="filter-input"
            placeholder="Start Date"
          />
          <input
            type="date"
            name="end"
            value={filterDateRange.end}
            onChange={handleDateRangeChange}
            className="filter-input"
            placeholder="End Date"
          />
        </div>
        <button className="btn-clear" onClick={resetFilters}>
          <FileText /> Clear Filters
        </button>
      </div>

      <div className="report-summary">
        <h2>Summary</h2>
        <p>Total Sales: $5000</p>
        <p>Total Orders: 200</p>
      </div>

      <div className="report-chart">
        <BarChart2 size={30} />
        <span>Sales Trends (Last 30 days)</span>
        {/* Placeholder for a chart component (e.g., using Chart.js or Recharts) */}
      </div>

      <div className="report-table">
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Total Sales</th>
              <th>Total Orders</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{format(new Date(report.date), "MMM dd, yyyy")}</td>
                  <td>{report.category}</td>
                  <td>${report.totalSales}</td>
                  <td>{report.totalOrders}</td>
                  <td>
                    <button className="btn-download" onClick={downloadReport}>
                      <Download /> Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-reports">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
