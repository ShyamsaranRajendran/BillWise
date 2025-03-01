import React from "react";

const CustomerSearchBox = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="cus-search-box">
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search by name"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default CustomerSearchBox;
