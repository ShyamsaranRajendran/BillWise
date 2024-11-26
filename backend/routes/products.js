const express = require("express");
const router = express.Router();
const authenticate = require("../utils/AuthDecode"); // Assuming you have authentication middleware
const Products = require('../models/products');
const Charts = require('../models/charts');
const Stock =require('../models/stock.js')
const Invoice = require('../models/Invoice.js');
// Route to get all products with pagination, search, and brand filtering
router.get('/all',authenticate, async function (req, res) {
  try {
    const { page = 1, limit = 12, search = "", brand = "" } = req.query;

    // Build search query
    const searchQuery = {
      $and: [
        search ? { $or: [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }] } : {},
        brand ? { brand: { $regex: brand, $options: "i" } } : {}
      ]
    };

    const products = await Products.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Products.countDocuments(searchQuery);
    console.log(products);
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/home", async (req, res) => {
  try {
    // Dummy stats data
    const stats = [
      {
        name: "Revenue",
        value: 12000, // Use numerical value for calculations
        change: "+12%",
        changeType: "positive",
      },
      {
        name: "Customers",
        value: 1234, // Numerical value for customers
        change: "+5%",
        changeType: "positive",
      },
    ];

    // Dummy revenue data
    const revenueData = [
      { date: "2024-01", revenue: 4000, expenses: 2400 },
      { date: "2024-02", revenue: 3000, expenses: 1398 },
    ];

    // Dummy customer type data
    const customerTypeData = [
      { name: "New Customers", value: 400, color: "#FF6B6B" },
      { name: "Returning Customers", value: 300, color: "#4ECDC4" },
    ];

    // Fetch recent invoices from the database
    const recentInvoices = await Invoice.find({})
      .sort({ dateOfIssue: -1 }) // Sort by `dateOfIssue` in descending order
      .limit(5) // Limit to the 5 most recent invoices
      .select("invoiceNumber billTo total status -_id"); // Select necessary fields

    // Fetch top products from the database
    const topProducts = await Products.find({})
      .sort({ sales: -1 }) // Sort by sales in descending order
      .limit(5) // Limit to top 5 products
      .select("name sales -_id"); // Select only the name and sales fields, exclude _id

    // Prepare and send the response
    const response = {
      stats,
      revenueData,
      customerTypeData,
      recentInvoices,
      topProducts,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching home page data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.get('/products-repo', authenticate,async function (req, res) {
  try {
    // Extract minStock and maxStock from query parameters
    const { minStock, maxStock } = req.query;

    // Create a filter object based on form input
    const stockFilter = {};
    
    if (minStock) {
      stockFilter.quantity_available = { $gte: parseInt(minStock) }; // Minimum stock condition
    }
    
    if (maxStock) {
      // Combine with the existing minStock condition or create a new one
      stockFilter.quantity_available = {
        ...stockFilter.quantity_available,
        $lte: parseInt(maxStock), // Maximum stock condition
      };
    }

    // Use MongoDB aggregation with $lookup to join products and stock collections
    const stockHighToLow = await Stock.aggregate([
      { $match: stockFilter },
      { $sort: { quantity_available: -1 } }, // Sort in descending order
      {
        $lookup: {
          from: "products", // The product collection name
          localField: "product_id", // Field from stock collection
          foreignField: "_id", // Field from product collection
          as: "productDetails", // Output array with product details
        },
      },
      {
        $unwind: "$productDetails", // Unwind to flatten the array
      },
      {
        $project: {
          product_id: 1,
          quantity_available: 1,
          "productDetails.name": 1, // Include the product name
          "productDetails.category": 1, // Include other fields if needed
        },
      },
    ]).exec();

    const stockLowToHigh = await Stock.aggregate([
      { $match: stockFilter },
      { $sort: { quantity_available: 1 } }, // Sort in ascending order
      {
        $lookup: {
          from: "products", // The product collection name
          localField: "product_id", // Field from stock collection
          foreignField: "_id", // Field from product collection
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails", // Flatten the product details array
      },
      {
        $project: {
          product_id: 1,
          quantity_available: 1,
          "productDetails.name": 1, // Include the product name
        },
      },
    ]).exec();

    // Log for debugging
    console.log("Stock (High to Low):", stockHighToLow);
    console.log("Stock (Low to High):", stockLowToHigh);

    // Send the stock data with product names as JSON
    res.json({ stockHighToLow, stockLowToHigh });
  } catch (err) {
    // Log the error and send an internal server error response
    console.error("Error fetching product stock:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get the list of unique brands
router.get('/brandlist', async function (req, res) {
  try {
    const brands = await Products.distinct("brand");
    res.json({ brands });
  } catch (err) {
    console.error("Error fetching brand list:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/add", async (req, res) => {
  const {
    product_id,
    name,
    category,
    sub_category,
    brand,
    SKU,
    price,
    discount,
    quantity_available,
    tax_rate,
    supplier,
    supplier_contact,
  } = req.body;

  try {
    // Validate required fields
    if (
      !product_id ||
      !name ||
      !category ||
      !sub_category ||
      !brand ||
      !SKU ||
      price === undefined || // Allow price=0
      quantity_available === undefined // Allow quantity_available=0
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check for duplicate product_id or SKU
    const existingProduct = await Products.findOne({
      $or: [{ product_id }, { SKU }],
    });

    if (existingProduct) {
      return res.status(409).json({ message: "Product ID or SKU already exists." });
    }

    // Create a new product instance
    const newProduct = new Products({
      product_id,
      name,
      category,
      sub_category,
      brand,
      SKU,
      price,
      discount,
      quantity_available,
      tax_rate,
      supplier,
      supplier_contact,
    });

    // Save the product to the database
    await newProduct.save();

    // Respond with success message
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
});

router.delete("/delete/:product_id", async (req, res) => {
  const { product_id } = req.params;

  try {
    // Check if the product exists
    const product = await Products.findOne({ product_id });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Delete the product
    await Products.deleteOne({ product_id });

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
});


router.get('/charts', async function (req, res) {
  try {
    const charts = await Charts.find({});
    const chartsWithUrls = charts.map(chart => ({
      chart_name: chart.chart_name,
      image: `data:image/png;base64,${chart.image.toString('base64')}`
    }));
    res.json(chartsWithUrls);
  } catch (err) {
    console.error("Error fetching charts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
