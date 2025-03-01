import React from "react";
import CustomerItem from "./CustomerItem";

const CustomerList = ({ customers, loading, onCustomerClick }) => {
  return (
    <div className="customer-list">
      {loading ? (
        <p>Loading...</p>
      ) : customers.length > 0 ? (
        customers.map((customer) => (
          <CustomerItem
            key={customer._id}
            customer={customer}
            onClick={() => onCustomerClick(customer)}
          />
        ))
      ) : (
        <p>No customers found.</p>
      )}
    </div>
  );
};

export default CustomerList;
