const express = require("express");
const router = express.Router();
const authenticate = require("../utils/AuthDecode"); // Assuming you have authentication middleware
const Customer = require("../models/customer.js");

// GET customers for the authenticated user
router.get("/customer", authenticate, async function (req, res) {
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


router.get("/customer/search", authenticate, async function (req, res) {
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

router.post("/customer/add", authenticate, async (req, res) => {
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
