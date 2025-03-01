import React, { useState, useEffect } from "react";
import "./css/Customerstyles.css";
import CustomerList from "./CustomerList";
import CustomerDetails from "./CustomerDetails";
import CustomerSearchBox from "./CustomerSearchBox";
import NoCus from "./NoCustomerPage"
import { Outlet } from "react-router-dom";
import Filters from "./Filters.jsx";
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("authorization");
        if (!token) {
          throw new Error("No authorization token found");
        }

        const response = await fetch("http://localhost:5000/cus/customer", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();
        setCustomers(data);
        setFilteredCustomers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchFilteredCustomers = async () => {
      if (searchQuery.trim() === "") {
        setFilteredCustomers(customers);
        return;
      }

      try {
        const token = localStorage.getItem("authorization");
        if (!token) {
          throw new Error("No authorization token found");
        }

        const response = await fetch(
          `http://localhost:5000/cus/customer/search?query=${encodeURIComponent(
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
          throw new Error("Failed to fetch filtered customers");
        }

        const data = await response.json();
        setFilteredCustomers(data);
      } catch (error) {
        console.error("Error fetching filtered customers:", error);
      }
    };

    fetchFilteredCustomers();
  }, [searchQuery, customers]);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="Customer-container">
      <div className="Customers">
        <div className="left-customer">
          <div className="mini-header-cus-lst">
            <div>Customers</div>
            <CustomerSearchBox
              searchQuery={searchQuery}
              onSearchChange={handleSearchInputChange}
            />
          </div>
          <CustomerList
            customers={filteredCustomers}
            loading={loading}
            onCustomerClick={handleCustomerClick}
          />
        </div>
        <div className="right-customer">
          {selectedCustomer ? (
            <CustomerDetails customer={selectedCustomer} />
          ) : (
            <NoCus />
          )}
        </div>
        <Outlet />
      </div>
      <Filters/>
    </div>
  );
};

export default Customers;
