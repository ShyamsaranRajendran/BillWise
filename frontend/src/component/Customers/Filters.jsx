import React, { useState, useEffect } from "react";
import "./css/filter.css";
import image from "../../assets/ghostNoCus.png";

const CustomerFilter = ({ onFilterChange }) => {
  const customers1 = [
    { name: "Shyam", gender : "M",description: "Learn how to play with customers" },
    { name: "John", gender : "M",description: "Expert in customer engagement" },
    { name: "Sarah", gender : "M",description: "Customer satisfaction specialist" },
    { name: "Emma", gender : "F",description: "Dedicated to customer happiness" },
    { name: "David", gender : "M",description: "Solving customer problems" },
    { name: "Lily", gender : "F",description: "Customer service professional" },
  ];

  const initialCustomers = [
    {
      name: "Shyam",
      description: "Learn how to play with customers",
      type: "premium",
      status: "active",
      activity: "high",
    },
    {
      name: "John",
      description: "Expert in customer engagement",
      type: "regular",
      status: "inactive",
      activity: "low",
    },
    {
      name: "Sarah",
      description: "Customer satisfaction specialist",
      type: "premium",
      status: "active",
      activity: "high",
    },
    {
      name: "Emma",
      description: "Dedicated to customer happiness",
      type: "regular",
      status: "inactive",
      activity: "low",
    },
    {
      name: "David",
      description: "Solving customer problems",
      type: "premium",
      status: "active",
      activity: "high",
    },
    {
      name: "Lily",
      description: "Customer service professional",
      type: "regular",
      status: "active",
      activity: "low",
    },
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [filters, setFilters] = useState({
    sortBy: "",
    customerType: "",
    status: "",
    list: "",
    activity: "",
  });

  // Function to apply filters and sorting
  const applyFilters = () => {
    let filteredCustomers = [...initialCustomers];

    // Apply sorting
    if (filters.sortBy === "asc") {
      filteredCustomers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === "desc") {
      filteredCustomers.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Apply customer type filter
    if (filters.customerType) {
      filteredCustomers = filteredCustomers.filter(
        (customer) => customer.type === filters.customerType
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredCustomers = filteredCustomers.filter(
        (customer) => customer.status === filters.status
      );
    }

    // Apply activity filter
    if (filters.activity) {
      filteredCustomers = filteredCustomers.filter(
        (customer) => customer.activity === filters.activity
      );
    }

    // Update customers with filtered and sorted data
    setCustomers(filteredCustomers);
  };

  // Effect to apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="filter-container">
      <h2>Customer Service</h2>
      <div className="plan-cards">
        {customers1.map((customer, index) => (
          <div className="plan-card" key={index}>
            <div className="plan-card-box">
              <img
                src={
                  (customer.gender === "M")
                    ? require(`../../assets/male.png`)
                    : require(`../../assets/female.png`)
                }
                alt="customer-avatar"
              />
            </div>
            <div className="show-info">
              <h3>{customer.name}</h3>
              <p>{customer.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="upper-bar">
        <select
          name="sortBy"
          className="dropdown"
          value={filters.sortBy}
          onChange={handleFilterChange}
        >
          <option value="">Sort by Name</option>
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>

        <select
          name="customerType"
          className="dropdown"
          value={filters.customerType}
          onChange={handleFilterChange}
        >
          <option value="">Customer Type</option>
          <option value="premium">Premium</option>
          <option value="regular">Regular</option>
        </select>

        <select
          name="status"
          className="dropdown"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          name="list"
          className="dropdown"
          value={filters.list}
          onChange={handleFilterChange}
        >
          <option value="">List</option>
          <option value="recent">Recent</option>
          <option value="oldest">Oldest</option>
        </select>

        <select
          name="activity"
          className="dropdown"
          value={filters.activity}
          onChange={handleFilterChange}
        >
          <option value="">Activity</option>
          <option value="high">High</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="filter-result">
        {customers.map((customer, index) => (
          <div className="plan-card" key={index}>
            <div className="plan-card-box">
              <img src={image} alt="customer-avatar" />
            </div>
            <div className="show-info">
              <h3>{customer.name}</h3>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default CustomerFilter;
