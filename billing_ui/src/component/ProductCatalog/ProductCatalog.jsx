import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./css/ProductCatalog.css";
import { Outlet } from "react-router-dom";
import {
  Refresh,
  Add
} from "@material-ui/icons";
import { Link } from "react-router-dom"; 
import { GoPlus } from "react-icons/go";
import Graph from "./graph.jsx";
function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const limit = 12; // Number of products per page

  // Fetch products based on current page, search query, and selected brand
  useEffect(() => {
    const fetchProducts = async () => {
      try {
         const token = localStorage.getItem("authorization");
         if (!token) {
           throw new Error("No authorization token found");
         }

        const response = await fetch(
          `http://localhost:5000/products/all?page=${currentPage}&limit=${limit}&search=${searchQuery}&brand=${selectedBrand}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        const data = await response.json();
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(data.totalPages);
        } else {
          throw new Error("Fetched data does not contain products array");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, searchQuery, selectedBrand]);

  // Fetch available brands for the filter dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      try {
          const token = localStorage.getItem("authorization");
          if (!token) {
            throw new Error("No authorization token found");
          }
        const response = await fetch(
          "http://localhost:5000/products/brandlist",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        const data = await response.json();
        setBrands(data.brands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page on new search
  };

  // Handle brand selection change
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setCurrentPage(1); // Reset to the first page on brand change
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-container">
      <Outlet />

      <Graph />

      <form onSubmit={handleSearch} className="search-form">
        <div className="product-header">
          <div className="newcustomer-box">
            <Link to="/Dashboard/product-catalog/new-product">
              {" "}
              {/* Use Link for navigation */}
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
          <select
            value={selectedBrand}
            onChange={handleBrandChange}
            className="brand-select"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <button type="submit" className="search-button">
            <Refresh />
          </button>
        </div>
      </form>

      <div className="products">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        <Link to="/Dashboard/product-catalog/new-product">
          <div className="product-add-card">
            <GoPlus className="plus-icon" />
          </div>
        </Link>
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductCatalog;
