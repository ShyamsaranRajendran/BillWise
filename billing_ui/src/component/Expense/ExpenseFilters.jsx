import React from "react";

export default function ExpenseFilters({ onFilterChange }) {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="expense-filters">
      <label>
        Category:
        <input
          type="text"
          name="category"
          placeholder="Search by category"
          onChange={handleFilterChange}
        />
      </label>
      <label>
        Min Amount:
        <input
          type="number"
          name="minAmount"
          placeholder="Minimum amount"
          onChange={handleFilterChange}
        />
      </label>
      <label>
        Max Amount:
        <input
          type="number"
          name="maxAmount"
          placeholder="Maximum amount"
          onChange={handleFilterChange}
        />
      </label>
    </div>
  );
}
