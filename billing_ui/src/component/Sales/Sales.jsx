import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import TotalSales from "./graph/TotalSales.jsx";
import AverageSale from "./graph/AverageSale.jsx";
import "./css/sales.css";
import SaleCard from "./salesCard.jsx"; // Import the new SaleCard component
import { Refresh, Add } from "@material-ui/icons";

function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("authorization");
        if (!token) {
          throw new Error("No authorization token found");
        }

        const response = await fetch(
          `http://localhost:5000/sales/all?page=${currentPage}&search=${encodeURIComponent(
            searchQuery
          )}`,
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
        if (data && Array.isArray(data.sales)) {
          setSales(data.sales);
          setTotalPages(data.totalPages);
        } else {
          throw new Error("Fetched data does not contain sales array");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchSales();
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (saleId) => {
    // Navigate to the edit page for the specific sale
    window.location.href = `/Dashboard/sales/edit-sales/${saleId}`;
  };

  const handleDelete = async (saleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sale?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authorization");
      if (!token) {
        throw new Error("No authorization token found");
      }

      const response = await fetch(`http://localhost:5000/sales/${saleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted sale from the state
      setSales(sales.filter((sale) => sale._id !== saleId));
      alert("Sale deleted successfully.");
    } catch (error) {
      console.error("Error deleting sale:", error);
      alert("Failed to delete the sale. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading sales data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="Sales">
      <h1>Sales Dashboard</h1>
      <div className="sales-dash">
        <TotalSales />
        <AverageSale />
      </div>
      <Outlet />

      <form onSubmit={handleSearch} className="search-form">
        <div className="product-header">
          <div className="newcustomer-box">
            <Link to="/Dashboard/sales/new-sales">
              <Add />
            </Link>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="search-input"
          />
        </div>
        <div className="left-box-search">
          <button type="submit" className="search-button">
            <Refresh />
          </button>
        </div>
      </form>

      <div className="sales-list">
        {sales.length === 0 ? (
          <div>No sales found.</div>
        ) : (
          sales.map((sale) => (
            <SaleCard
              key={sale._id}
              sale={sale}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
        <Link to="/Dashboard/sales/new-sales">
          <div className="sale-add-card">
            <GoPlus className="plus-icon" />
          </div>
        </Link>
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Sales;
