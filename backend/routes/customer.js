const express = require("express");
const router = express.Router();
const authenticate = require("../utils/AuthDecode"); // Assuming you have authentication middleware
const Customer = require("../models/customer.js");

// GET customers for the authenticated user
router.get("/customer",  async function (req, res) {
  try {
    console.log("Fetching customers for user ID:", req.userId);

    const customers = await Customer.find({ });

    if (!customers || customers.length === 0) {
      return res.status(404).json({ error: "No customers found" });
    }

    console.log("Fetched customers:", customers);
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit customer details
router.put("/customer/edit/:id", authenticate, async (req, res) => {
  try {
    const customerId = req.params.id; // Customer ID from the route parameter
    const updateData = req.body; // Data to update from the request body

    // Find and update the customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      updateData,
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete customer
router.delete("/customer/delete/:id", authenticate, async (req, res) => {
  try {
    const customerId = req.params.id; // Customer ID from the route parameter

    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/customer/search",  async function (req, res) {
 try {
    const searchQuery = req.query.query.toLowerCase();
    if (searchQuery) {
      query = {
        name: { $regex: searchQuery, $options: 'i' }
      };
    }
    const customers = await Customer.find(query);
    if (!customers || customers.length === 0) {
      return res.status(404).json({ error: "No customers found" });
    }
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/customer/add", async (req, res) => {
   try {
    const customerData = req.body;
    customerData.userId = req.userId;
    const newCustomer = new Customer(customerData);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Error saving customer data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// app.get('/api/customers', async (req, res) => {
//   const { sortBy, customerType, status, list, activity } = req.query;
  
//   let query = {}; // Build query object
  
//   if (customerType) query.customerType = customerType;
//   if (status) query.status = status;
//   // Add other conditions based on query parameters

//   try {
//     const customers = await Customer.find(query)
//       .sort(sortBy === 'asc' ? { name: 1 } : { name: -1 })
//       .exec(); // Execute query based on filters
//     res.json(customers);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching customers' });
//   }
// });


module.exports = router;
